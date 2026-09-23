export type SearchStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error'

export type ApiResult<T> =
  | { kind: 'success'; data: T }
  | { kind: 'empty'; reason: string }
  | { kind: 'error'; reason: string }

export type CityLocation = {
  name: string
  latitude: number
  longitude: number
  country_code: string
  timezone: string
}

export type CurrentWeather = {
  time: string
  temperature: number | null
  relativeHumidity: number | null
  apparentTemperature: number | null
  isDay: boolean | null
  windSpeed: number | null
  weatherCode: number | null
  description: string
}

export type HourlyForecastEntry = {
  time: string
  temperature: number | null
  precipitationProbability: number | null
  weatherCode: number | null
  description: string
}

export type DailyForecastEntry = {
  time: string
  temperatureMax: number | null
  temperatureMin: number | null
  precipitationSum: number | null
  precipitationProbabilityMax: number | null
  weatherCode: number | null
  description: string
}

export type ForecastData = {
  timezone: string
  current: CurrentWeather
  hourly: HourlyForecastEntry[]
  daily: DailyForecastEntry[]
}

export type AppState = {
  status: SearchStatus
  city: CityLocation | null
  weather: ForecastData | null
  message: string
}
