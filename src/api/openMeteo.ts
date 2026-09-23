import type { ApiResult, CityLocation, CurrentWeather, DailyForecastEntry, ForecastData, HourlyForecastEntry } from '../types'

export type CityLookupResult = ApiResult<CityLocation>
export type WeatherLookupResult = ApiResult<ForecastData>

const geocodingBaseUrl = 'https://geocoding-api.open-meteo.com/v1/search'
const forecastBaseUrl = 'https://api.open-meteo.com/v1/forecast'

const weatherCodeMap: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Rime fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Dense drizzle',
  56: 'Freezing drizzle',
  57: 'Heavy freezing drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  66: 'Freezing rain',
  67: 'Heavy freezing rain',
  71: 'Light snow',
  73: 'Snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Rain showers',
  81: 'Heavy showers',
  82: 'Violent showers',
  85: 'Snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Heavy thunderstorm with hail',
}

const describeWeatherCode = (code: number | null): string =>
  code === null ? 'Weather update unavailable' : weatherCodeMap[code] ?? 'Weather update unavailable'

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

  if (!isRecord(current) || !isRecord(hourly) || !isRecord(daily)) {
    return false
  }

  const hasCurrentFields =
    typeof current.time === 'string' &&
    (typeof current.temperature_2m === 'number' || current.temperature_2m === null) &&
    (typeof current.relative_humidity_2m === 'number' || current.relative_humidity_2m === null) &&
    (typeof current.apparent_temperature === 'number' || current.apparent_temperature === null) &&
    (typeof current.is_day === 'number' || current.is_day === null) &&
    (typeof current.wind_speed_10m === 'number' || current.wind_speed_10m === null) &&
    (typeof current.weather_code === 'number' || current.weather_code === null)

  const hasHourlyFields =
    Array.isArray(hourly.time) &&
    Array.isArray(hourly.temperature_2m) &&
    Array.isArray(hourly.precipitation_probability) &&
    Array.isArray(hourly.weather_code)

  const hasDailyFields =
    Array.isArray(daily.time) &&
    Array.isArray(daily.temperature_2m_max) &&
    Array.isArray(daily.temperature_2m_min) &&
    Array.isArray(daily.precipitation_sum) &&
    Array.isArray(daily.precipitation_probability_max) &&
    Array.isArray(daily.weather_code)

  return hasCurrentFields && hasHourlyFields && hasDailyFields
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
      'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,wind_speed_10m,weather_code',
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
      temperature: typeof currentRecord.temperature_2m === 'number' ? currentRecord.temperature_2m : null,
      relativeHumidity: typeof currentRecord.relative_humidity_2m === 'number' ? currentRecord.relative_humidity_2m : null,
      apparentTemperature: typeof currentRecord.apparent_temperature === 'number' ? currentRecord.apparent_temperature : null,
      isDay: typeof currentRecord.is_day === 'number' ? currentRecord.is_day === 1 : null,
      windSpeed: typeof currentRecord.wind_speed_10m === 'number' ? currentRecord.wind_speed_10m : null,
      weatherCode: typeof currentRecord.weather_code === 'number' ? currentRecord.weather_code : null,
      description: describeWeatherCode(typeof currentRecord.weather_code === 'number' ? currentRecord.weather_code : null),
    }

    const hourlyTimes = readStringList(hourlyRecord.time)
    const tempHourly = readNumberList(hourlyRecord.temperature_2m)
    const precipitationProbability = readNumberList(hourlyRecord.precipitation_probability)
    const hourlyWeatherCodes = readNumberList(hourlyRecord.weather_code)
    const hourly: HourlyForecastEntry[] = hourlyTimes.map((time, index) => ({
      time,
      temperature: tempHourly[index] ?? null,
      precipitationProbability: precipitationProbability[index] ?? null,
      weatherCode: hourlyWeatherCodes[index] ?? null,
      description: describeWeatherCode(hourlyWeatherCodes[index] ?? null),
    }))

    const dailyTimes = readStringList(dailyRecord.time)
    const dailyMax = readNumberList(dailyRecord.temperature_2m_max)
    const dailyMin = readNumberList(dailyRecord.temperature_2m_min)
    const dailyRain = readNumberList(dailyRecord.precipitation_sum)
    const dailyRainChance = readNumberList(dailyRecord.precipitation_probability_max)
    const dailyWeatherCodes = readNumberList(dailyRecord.weather_code)
    const daily: DailyForecastEntry[] = dailyTimes.map((time, index) => ({
      time,
      temperatureMax: dailyMax[index] ?? null,
      temperatureMin: dailyMin[index] ?? null,
      precipitationSum: dailyRain[index] ?? null,
      precipitationProbabilityMax: dailyRainChance[index] ?? null,
      weatherCode: dailyWeatherCodes[index] ?? null,
      description: describeWeatherCode(dailyWeatherCodes[index] ?? null),
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
