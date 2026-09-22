import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
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
        <div class="empty-forecast" role="status">
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
        <div class="daily-empty" role="status">
          <span class="calendar-mark" aria-hidden="true">▦</span>
          <p>Search for a location to see the outlook</p>
        </div>
      </section>
    </div>
  </section>
</main>
`
