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
  temperature_2m: number | null
  relative_humidity_2m: number | null
  apparent_temperature: number | null
  is_day: number | null
  wind_speed_10m: number | null
  wind_direction_10m: number | null
  precipitation: number | null
  weather_code: number | null
}

export type HourlyForecastEntry = {
  time: string
  temperature_2m: number | null
  precipitation_probability: number | null
  weather_code: number | null
}

export type DailyForecastEntry = {
  time: string
  temperature_2m_max: number | null
  temperature_2m_min: number | null
  precipitation_sum: number | null
  precipitation_probability_max: number | null
  weather_code: number | null
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
