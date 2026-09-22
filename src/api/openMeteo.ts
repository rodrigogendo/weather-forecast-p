import type { ApiResult, CityLocation, CurrentWeather, DailyForecastEntry, ForecastData, HourlyForecastEntry } from '../types'

export type CityLookupResult = ApiResult<CityLocation>
export type WeatherLookupResult = ApiResult<ForecastData>

const geocodingBaseUrl = 'https://geocoding-api.open-meteo.com/v1/search'
const forecastBaseUrl = 'https://api.open-meteo.com/v1/forecast'

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null

const isValidCityLocation = (value: unknown): value is CityLocation => {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.name === 'string' &&
    typeof value.latitude === 'number' &&
    typeof value.longitude === 'number' &&
    typeof value.country_code === 'string' &&
    typeof value.timezone === 'string'
  )
}

const readNumberList = (value: unknown): Array<number | null> => {
  if (!Array.isArray(value)) {
    return []
  }

  return value.map((item) => (typeof item === 'number' ? item : null))
}

const readStringList = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((item): item is string => typeof item === 'string')
}

const isValidWeatherPayload = (value: unknown): value is Record<string, unknown> => {
  if (!isRecord(value)) {
    return false
  }

  const current = value.current
  const hourly = value.hourly
  const daily = value.daily

  return (
    isRecord(current) &&
    isRecord(hourly) &&
    isRecord(daily) &&
    Array.isArray(hourly.time) &&
    Array.isArray(daily.time) &&
    Array.isArray(daily.temperature_2m_max) &&
    Array.isArray(daily.temperature_2m_min) &&
    Array.isArray(daily.precipitation_sum) &&
    Array.isArray(daily.precipitation_probability_max)
  )
}

export async function getCityCoordinates(cityName: string): Promise<CityLookupResult> {
  const trimmedName = cityName.trim()

  if (!trimmedName) {
    return { kind: 'empty', reason: 'Please enter a city name.' }
  }

  try {
    const url = new URL(geocodingBaseUrl)
    url.searchParams.set('name', trimmedName)
    url.searchParams.set('count', '1')
    url.searchParams.set('language', 'en')
    url.searchParams.set('format', 'json')

    const response = await fetch(url)
    if (!response.ok) {
      return { kind: 'error', reason: 'City lookup request failed.' }
    }

    const payload = (await response.json()) as Record<string, unknown>
    const results = Array.isArray(payload.results) ? payload.results : []
    const city = results.find(isValidCityLocation)

    if (!city) {
      return { kind: 'empty', reason: 'No city found for that search.' }
    }

    return { kind: 'success', data: city }
  } catch {
    return { kind: 'error', reason: 'City lookup could not be completed.' }
  }
}

export async function getWeatherForecast(
  latitude: number,
  longitude: number,
  timezone: string,
): Promise<WeatherLookupResult> {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || !timezone.trim()) {
    return { kind: 'empty', reason: 'Weather data is unavailable for this location.' }
  }

  try {
    const url = new URL(forecastBaseUrl)
    url.searchParams.set('latitude', String(latitude))
    url.searchParams.set('longitude', String(longitude))
    url.searchParams.set(
      'hourly',
      'temperature_2m,precipitation,precipitation_probability,weather_code',
    )
    url.searchParams.set(
      'current',
      'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,wind_direction_10m,wind_speed_10m,precipitation,weather_code',
    )
    url.searchParams.set(
      'daily',
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max',
    )
    url.searchParams.set('timezone', timezone)

    const response = await fetch(url)
    if (!response.ok) {
      return { kind: 'error', reason: 'Weather forecast request failed.' }
    }

    const payload = (await response.json()) as Record<string, unknown>

    if (!isValidWeatherPayload(payload)) {
      return { kind: 'empty', reason: 'The forecast response did not contain usable data.' }
    }

    const currentRecord = payload.current as Record<string, unknown>
    const hourlyRecord = payload.hourly as Record<string, unknown>
    const dailyRecord = payload.daily as Record<string, unknown>

    const current: CurrentWeather = {
      time: typeof currentRecord.time === 'string' ? currentRecord.time : '',
      temperature_2m: typeof currentRecord.temperature_2m === 'number' ? currentRecord.temperature_2m : null,
      relative_humidity_2m: typeof currentRecord.relative_humidity_2m === 'number' ? currentRecord.relative_humidity_2m : null,
      apparent_temperature: typeof currentRecord.apparent_temperature === 'number' ? currentRecord.apparent_temperature : null,
      is_day: typeof currentRecord.is_day === 'number' ? currentRecord.is_day : null,
      wind_speed_10m: typeof currentRecord.wind_speed_10m === 'number' ? currentRecord.wind_speed_10m : null,
      wind_direction_10m: typeof currentRecord.wind_direction_10m === 'number' ? currentRecord.wind_direction_10m : null,
      precipitation: typeof currentRecord.precipitation === 'number' ? currentRecord.precipitation : null,
      weather_code: typeof currentRecord.weather_code === 'number' ? currentRecord.weather_code : null,
    }

    const hourlyTimes = readStringList(hourlyRecord.time)
    const tempHourly = readNumberList(hourlyRecord.temperature_2m)
    const precipitationProbability = readNumberList(hourlyRecord.precipitation_probability)
    const hourly: HourlyForecastEntry[] = hourlyTimes.map((time, index) => ({
      time,
      temperature_2m: tempHourly[index] ?? null,
      precipitation_probability: precipitationProbability[index] ?? null,
      weather_code: typeof hourlyRecord.weather_code === 'number' ? hourlyRecord.weather_code : null,
    }))

    const dailyTimes = readStringList(dailyRecord.time)
    const dailyMax = readNumberList(dailyRecord.temperature_2m_max)
    const dailyMin = readNumberList(dailyRecord.temperature_2m_min)
    const dailyRain = readNumberList(dailyRecord.precipitation_sum)
    const dailyRainChance = readNumberList(dailyRecord.precipitation_probability_max)
    const daily: DailyForecastEntry[] = dailyTimes.map((time, index) => ({
      time,
      temperature_2m_max: dailyMax[index] ?? null,
      temperature_2m_min: dailyMin[index] ?? null,
      precipitation_sum: dailyRain[index] ?? null,
      precipitation_probability_max: dailyRainChance[index] ?? null,
      weather_code: typeof dailyRecord.weather_code === 'number' ? dailyRecord.weather_code : null,
    }))

    const forecast: ForecastData = {
      timezone,
      current,
      hourly,
      daily,
    }

    return { kind: 'success', data: forecast }
  } catch {
    return { kind: 'error', reason: 'Weather forecast could not be retrieved.' }
  }
}
