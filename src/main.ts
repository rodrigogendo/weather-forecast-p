import './style.css'
import { getCityCoordinates, getWeatherForecast } from './api/openMeteo'
import type { AppState, CityLocation, ForecastData } from './types'

const appRoot = document.querySelector<HTMLDivElement>('#app')

if (!appRoot) {
  throw new Error('App root element not found.')
}

appRoot.innerHTML = `
<main class="app-shell">
  <header class="topbar">
    <a class="brand" href="/" aria-label="Skyline weather home">
      <span class="brand-mark" aria-hidden="true">+</span>
      <span>Skyline</span>
    </a>
    <span class="status-label">Local forecast</span>
  </header>

  <section class="search-area" aria-labelledby="search-heading">
    <p class="eyebrow">Weather at a glance</p>
    <h1 id="search-heading">Find your forecast</h1>
    <form class="search-form">
      <label class="sr-only" for="city-search">Search for a city</label>
      <span class="search-icon" aria-hidden="true">⌕</span>
      <input id="city-search" name="city" type="search" placeholder="Search for a city" autocomplete="address-level2" />
      <button type="submit">Search</button>
    </form>
  </section>

  <section class="dashboard" aria-label="Weather dashboard">
    <aside class="summary-panel panel">
      <div class="panel-heading">
        <span class="section-label">Current conditions</span>
        <span class="location-dot" aria-hidden="true"></span>
      </div>
      <div class="summary-empty">
        <span class="weather-symbol" aria-hidden="true">☼</span>
        <p class="temperature-placeholder">--°</p>
        <p class="empty-title">No location selected</p>
        <p class="current-day">--</p>
        <p class="empty-copy">Search for a city to see current conditions.</p>
      </div>
      <div class="summary-footer">
        <span>Temperature</span>
        <strong>--</strong>
      </div>
    </aside>

    <div class="forecast-area">
      <section class="forecast-panel panel" aria-labelledby="hourly-heading">
        <div class="panel-heading">
          <div>
            <span class="section-label">Next 24 hours</span>
            <h2 id="hourly-heading">Hourly forecast</h2>
          </div>
          <span class="panel-note">Local time</span>
        </div>
        <div id="hourly-content" class="empty-forecast" role="status">
          <span class="empty-line" aria-hidden="true"></span>
          <p>Hourly details will appear here</p>
        </div>
      </section>

      <section class="forecast-panel panel" aria-labelledby="daily-heading">
        <div class="panel-heading">
          <div>
            <span class="section-label">The week ahead</span>
            <h2 id="daily-heading">Daily forecast</h2>
          </div>
          <span class="panel-note">7 days</span>
        </div>
        <div id="daily-content" class="daily-empty" role="status">
          <span class="calendar-mark" aria-hidden="true">▦</span>
          <p>Search for a location to see the outlook</p>
        </div>
      </section>
    </div>
  </section>
</main>
`

const form = document.querySelector<HTMLFormElement>('.search-form')
const searchInput = document.querySelector<HTMLInputElement>('#city-search')
const submitButton = document.querySelector<HTMLButtonElement>('.search-form button')
const weatherSymbol = document.querySelector<HTMLElement>('.weather-symbol')
const temperaturePlaceholder = document.querySelector<HTMLElement>('.temperature-placeholder')
const emptyTitle = document.querySelector<HTMLElement>('.empty-title')
const emptyCopy = document.querySelector<HTMLElement>('.empty-copy')
const summaryFooterValue = document.querySelector<HTMLElement>('.summary-footer strong')
const hourlyContent = document.querySelector<HTMLElement>('#hourly-content')
const dailyContent = document.querySelector<HTMLElement>('#daily-content')

const currentDay = document.querySelector<HTMLElement>('.current-day')
if (!form || !searchInput || !submitButton || !weatherSymbol || !temperaturePlaceholder || !emptyTitle || !currentDay || !emptyCopy || !summaryFooterValue || !hourlyContent || !dailyContent) {
  throw new Error('Required dashboard elements were not found.')
}

const defaultState: AppState = {
  status: 'idle',
  city: null,
  weather: null,
  message: 'Search for a city to see current conditions.',
}

let appState: AppState = { ...defaultState }

const formatTemperature = (value: number | null): string => {
  if (value === null || Number.isNaN(value)) {
    return '--°'
  }

  return `${Math.round(value)}°`
}

const formatTime = (value: string): string => {
  if (!value) {
    return '—'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleTimeString([], { hour: 'numeric' })
}

const formatDay = (value: string): string => {
  if (!value) {
    return '—'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString('en-US', { weekday: 'short' })
}

const getWeatherIcon = (code: number | null): string => {
  if (code === null) {
    return '？'
  }

  if (code === 0 || code === 1) {
    return '☀'
  }

  if (code === 2) {
    return '⛅'
  }

  if (code === 3) {
    return '☁'
  }

  if (code === 45 || code === 48) {
    return '〰'
  }

  if (code >= 51 && code <= 67 || code >= 80 && code <= 82) {
    return '☂'
  }

  if (code >= 71 && code <= 77 || code === 85 || code === 86) {
    return '❄'
  }

  if (code >= 95) {
    return '⚡'
  }

  return '☁'
}

const renderIdleState = (): void => {
  weatherSymbol.textContent = '☼'
  temperaturePlaceholder.textContent = '--°'
  emptyTitle.textContent = 'No location selected'
  currentDay.textContent = '--'
  emptyCopy.textContent = 'Search for a city to see current conditions.'
  summaryFooterValue.textContent = '--'
  hourlyContent.className = 'empty-forecast'
  dailyContent.className = 'daily-empty'
  hourlyContent.innerHTML = `
    <span class="empty-line" aria-hidden="true"></span>
    <p>Hourly details will appear here</p>
  `
  dailyContent.innerHTML = `
    <span class="calendar-mark" aria-hidden="true">▦</span>
    <p>Search for a location to see the outlook</p>
  `
}

const renderLoadingState = (cityLabel: string): void => {
  weatherSymbol.textContent = '⏳'
  temperaturePlaceholder.textContent = '--°'
  emptyTitle.textContent = cityLabel
  currentDay.textContent = '--'
  emptyCopy.textContent = 'Checking city data and weather forecast…'
  summaryFooterValue.textContent = '--'
  hourlyContent.className = 'empty-forecast'
  dailyContent.className = 'daily-empty'
  hourlyContent.innerHTML = `
    <span class="empty-line" aria-hidden="true"></span>
    <p>Loading hourly forecast…</p>
  `
  dailyContent.innerHTML = `
    <span class="calendar-mark" aria-hidden="true">▦</span>
    <p>Loading daily forecast…</p>
  `
}

const renderResultState = (city: CityLocation, weather: ForecastData): void => {
  const current = weather.current
  const cityName = city.name
  const dayState = current.isDay === null ? 'Unknown light' : current.isDay ? 'Day' : 'Night'

  weatherSymbol.textContent = current.isDay ? '☀' : '☾'
  temperaturePlaceholder.textContent = formatTemperature(current.temperature)
  emptyTitle.textContent = `${cityName}, ${city.country_code}`
  currentDay.textContent = `${formatDay(current.time)} · ${dayState}`
  emptyCopy.textContent = current.description
  summaryFooterValue.textContent = formatTemperature(current.temperature)
  hourlyContent.className = 'hourly-content'
  dailyContent.className = 'daily-content'
  hourlyContent.innerHTML = weather.hourly
    .slice(0, 24)
    .map(
      (item) => `
        <div class="hourly-item">
          <span class="forecast-time">${formatTime(item.time)}</span>
          <span class="forecast-condition"><span class="forecast-icon" aria-hidden="true">${getWeatherIcon(item.weatherCode)}</span>${item.description}</span>
          <strong class="forecast-temperature">${formatTemperature(item.temperature)}</strong>
          <span class="forecast-precipitation">${item.precipitationProbability === null ? '--%' : `${Math.round(item.precipitationProbability)}%`} rain</span>
        </div>
      `,
    )
    .join('')

  dailyContent.innerHTML = weather.daily
    .slice(0, 7)
    .map(
      (item) => `
        <div class="daily-item">
          <strong class="daily-day">${formatDay(item.time)}</strong>
          <span class="daily-condition"><span class="forecast-icon" aria-hidden="true">${getWeatherIcon(item.weatherCode)}</span>${item.description}</span>
          <span><small>High</small>${formatTemperature(item.temperatureMax)}</span>
          <span><small>Low</small>${formatTemperature(item.temperatureMin)}</span>
          <span><small>Rain</small>${item.precipitationSum === null ? '--' : `${item.precipitationSum.toFixed(1)} mm`}</span>
          <span><small>Chance</small>${item.precipitationProbabilityMax === null ? '--%' : `${Math.round(item.precipitationProbabilityMax)}%`}</span>
        </div>
      `,
    )
    .join('')
}

const renderEmptyState = (message: string): void => {
  weatherSymbol.textContent = '–'
  temperaturePlaceholder.textContent = '--°'
  emptyTitle.textContent = 'No results'
    currentDay.textContent = '--'
  emptyCopy.textContent = message
  summaryFooterValue.textContent = '--'
  hourlyContent.className = 'empty-forecast'
  dailyContent.className = 'daily-empty'
  hourlyContent.innerHTML = `
    <span class="empty-line" aria-hidden="true"></span>
    <p>${message}</p>
  `
  dailyContent.innerHTML = `
    <span class="calendar-mark" aria-hidden="true">▦</span>
    <p>${message}</p>
  `
}

const renderState = (): void => {
  if (appState.status === 'loading') {
    renderLoadingState(searchInput.value.trim() || 'Searching')
    return
  }

  if (appState.status === 'success' && appState.city && appState.weather) {
    renderResultState(appState.city, appState.weather)
    return
  }

  if (appState.status === 'empty' || appState.status === 'error') {
    renderEmptyState(appState.message)
    return
  }

  renderIdleState()
}

const setSearchState = (status: AppState['status'], message: string, city: CityLocation | null = null, weather: ForecastData | null = null): void => {
  appState = { status, city, weather, message }
  renderState()
}

const enableSearchControls = (): void => {
  submitButton.disabled = false
  submitButton.textContent = 'Search'
  searchInput.disabled = false
}

const disableSearchControls = (): void => {
  submitButton.disabled = true
  submitButton.textContent = 'Searching…'
  searchInput.disabled = true
}

form.addEventListener('submit', async (event) => {
  event.preventDefault()

  const cityName = searchInput.value.trim()
  if (!cityName) {
    setSearchState('empty', 'Please enter a city name before searching.')
    return
  }

  disableSearchControls()
  setSearchState('loading', 'Searching for your city…')

  const cityResult = await getCityCoordinates(cityName)
  if (cityResult.kind !== 'success') {
    enableSearchControls()
    setSearchState(cityResult.kind === 'empty' ? 'empty' : 'error', cityResult.reason)
    return
  }

  const forecastResult = await getWeatherForecast(cityResult.data.latitude, cityResult.data.longitude, cityResult.data.timezone)
  if (forecastResult.kind !== 'success') {
    enableSearchControls()
    setSearchState(forecastResult.kind === 'empty' ? 'empty' : 'error', forecastResult.reason)
    return
  }

  enableSearchControls()
  setSearchState('success', 'Forecast loaded successfully.', cityResult.data, forecastResult.data)
})

searchInput.addEventListener('input', () => {
  if (appState.status === 'idle' || appState.status === 'empty' || appState.status === 'error') {
    renderIdleState()
  }
})

renderState()

