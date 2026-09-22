# Product Requirements Document (PRD)

## 1. Product Overview

### Objective
The project is a weather forecast web application that allows a user to search for a city and view current weather conditions plus short-term and multi-day forecasts. The experience should feel like a single search action from the user's perspective, even though it relies on two Open-Meteo API requests internally.

### Product Type
Single-page weather dashboard built with Vite + Vanilla + TypeScript.

### Core Goal
Provide a clean, fast, and readable weather experience for a city search, with:
- current conditions,
- hourly forecast,
- daily forecast,
- empty states for failed or missing results,
- loading feedback during the search process.

---

## 2. Functional Aspects

### 2.1 Search Flow
The app must allow the user to type a city name and trigger a search.

Required flow:
1. User types the city name in the search field.
2. Application searches for the city using the geocoding endpoint.
3. If the city is found, it receives the latitude, longitude, and timezone.
4. The app then requests the weather forecast using those values.
5. If either request fails or returns no data, the app shows an empty state or no-result message.
6. The user sees a loading state while both requests are in progress.

### 2.2 Search Validation
The app should treat the city search as a single user interaction, but internally it must validate both API calls separately:
- If no city is found, show “no result” for the city.
- If city exists but weather data is missing, show “no result” for weather info.
- If parameters are missing or invalid, the Open-Meteo functions should behave as if no data was found.

### 2.3 Main Weather Data Display
Once valid data is returned, the app must display:

Current weather information:
- time
- temperature
- relative humidity
- apparent temperature
- day/night status
- wind speed
- wind direction
- precipitation

Hourly forecast information:
- time
- temperature
- precipitation probability
- weather code

Daily forecast information:
- maximum temperature
- minimum temperature
- precipitation sum
- precipitation probability maximum
- weather code

### 2.4 Sidebar Information
The sidebar must show the most important summary information:
- temperature
- city name
- country code
- current day
- whether it is day or night
- weather code

### 2.5 Forecast Sections
The main content area should be divided into two sections:

A. Hourly forecast
- At the top of the main area
- Shows weather code, time, temperature, and precipitation probability
- Designed as a horizontal/scrollable forecast list or card row

B. Daily forecast
- At the bottom of the main area
- Shows weather code, maximum and minimum temperature, precipitation sum, and probability
- Clearly structured in a list/table-like layout

### 2.6 Empty State
The app must have an empty state in the main content area when no results are available.

The empty state should communicate one of the following:
- no city found,
- no weather results for the location,
- no search yet if the user has not performed a search.

### 2.7 Loading State
While the app is fetching the city and the weather forecast, a loading visual should be shown to the user.

The loading state should mask the fact that there are two backend calls and appear as a single search action.

---

## 3. System Requirements

### 3.1 Functional Requirements
- The app must accept a city name input from the user.
- The app must request the geographic data for the city.
- The app must use latitude, longitude, and timezone to request weather forecast data.
- The app must validate data before rendering it.
- The app must correctly handle both failed and empty responses.
- The app must show a loading state during a search.
- The app must show an empty state for invalid/no-result searches.
- The app must render current, hourly, and daily weather data clearly.
- The app must display weather codes with human-readable descriptions.

### 3.2 Non-Functional Requirements
- The interface must be responsive and usable on standard desktop and smaller screens.
- The app should feel lightweight and fast.
- The UI should be visually clean and easy to scan.
- Error handling must be clear and user-friendly.
- The project should avoid direct API calls from the UI layer; instead, use a dedicated file with API functions.

### 3.3 Data Validation Rules
The Open-Meteo API helper functions must check whether required parameters exist before using them.

If parameters are missing:
- return a clear empty/failure state,
- avoid making invalid requests,
- avoid crashing or rendering broken data.

---

## 4. Technical Details

### 4.1 Tech Stack
- Vite
- Vanilla JavaScript / TypeScript
- HTML
- CSS
- OpenMeteo API

### 4.2 API Integration Strategy
The project must not make direct API requests from the UI logic. Mandatory to make it decoupled in case API must be changed.

Instead, the app should use a dedicated file (or module) containing OpenMeteo functions, such as:
- getCityCoordinates(cityName)
- getWeatherForecast(latitude, longitude, timezone)

This file should encapsulate:
- request logic,
- parameter validation,
- response parsing,
- no-data handling,
- error handling.

### 4.3 API Endpoint 1: City Search
Endpoint:
https://geocoding-api.open-meteo.com/v1/search?name={CITY-NAME}&count=1&language=en&format=json

Required result fields:
- name
- latitude
- longitude
- country_code
- timezone

Expected behavior:
- If the city is not found, return no result.
- If the response is malformed or missing required fields, treat it as a failed search.

### 4.4 API Endpoint 2: Weather Forecast
Endpoint:
https://api.open-meteo.com/v1/forecast?latitude={LATITUDE}&longitude={LONGITUDE}&hourly=temperature_2m,precipitation,precipitation_probability&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,wind_direction_10m,wind_speed_10m,precipitation,weather_code,rain,showers,snowfall&timezone={TIMEZONE}

This response contains:
- current_units
- hourly_units
- daily_units
- current
- hourly
- daily

The app must use only the required fields from those groups.

Mandatory fields:

Current:
- time
- temperature_2m
- relative_humidity_2m
- apparent_temperature
- is_day
- wind_speed_10m
- wind_direction_10m
- precipitation

Hourly:
- time
- temperature_2m
- precipitation_probability

Daily:
- temperature_2m_max
- temperature_2m_min
- precipitation_sum
- precipitation_probability_max

### 4.5 Weather Code Handling
The app should map WMO weather codes to readable descriptions.

Required weather code information:
- 0: Clear sky
- 1, 2, 3: Mainly clear, partly cloudy, and overcast
- 45, 48: Fog and depositing rime fog
- 51, 53, 55: Drizzle
- 56, 57: Freezing drizzle
- 61, 63, 65: Rain
- 66, 67: Freezing rain
- 71, 73, 75: Snow fall
- 77: Snow grains
- 80, 81, 82: Rain showers
- 85, 86: Snow showers
- 95: Thunderstorm
- 96, 99: Thunderstorm with hail

The UI can render the code as a label or icon-like summary, but the description should be available as readable text.

### 4.6 Data Flow
The app flow should follow this logic:

City input -> geocoding request -> get coordinates + timezone -> weather request -> normalize data -> render UI -> handle loading/error state

### 4.7 State Handling
The application should manage at least these UI states:
- idle / initial state
- search in progress
- success with results
- no result
- error failure

### 4.8 Suggested File Structure
A reasonable structure for the project may include:
- src/main.ts
- src/style.css
- src/api/openMeteo.ts
- src/types.ts (optional)
- src/weather.ts (optional helper logic)

The exact file organization can vary, but the separation between UI and API logic is mandatory.

---

## 5. Visual Instructions

### 5.1 Overall Design Direction
The design should be centered and visually calm, using mainly grey tones with soft off-white undertones.

Recommended design character:
- neutral grey palette
- off-white panels
- rounded containers
- soft contrast
- simple, modern dashboard layout

### 5.2 Layout Structure
The page should be organized as follows:

- Top area: centered search input
- Below it: main dashboard container with two main blocks
  - left or side panel: weather summary/sidebar
  - right/main panel: forecast content

The sidebar and main content should live inside a larger rounded container with subtle borders and a clean background.

### 5.3 Search Area
- Place the search field near the top center of the page.
- The control should be visually prominent but minimal.
- The layout should leave generous whitespace around the search input.

### 5.4 Sidebar Design
The sidebar should summarize the current weather state.

Include:
- temperature
- city name
- country code
- current day
- day or night indicator
- weather code

This section should be visually distinct from the main content but remain part of the same overall panel.

### 5.5 Main Content Design
The main panel should include:
1. Hourly forecast at the top
2. Daily forecast at the bottom

Each forecast card or row should show:
- weather code
- time or day label
- temperature range or value
- precipitation probability or sum

### 5.6 Empty State Design
The empty state should be visually clear and intentional.

Use:
- a simple neutral placeholder illustration or icon if desired,
- a short message such as “No results found” or a similar user-friendly text,
- enough spacing so the state feels deliberate rather than broken.

### 5.7 Loading State Design
The loading state should appear while the geocoding request and weather request are running.

It should:
- look like a single search action,
- be subtle and not disruptive,
- indicate that the app is fetching weather data.

### 5.8 Visual Tone
The interface should feel:
- modern,
- minimal,
- informative,
- premium but practical,
- comfortable for daily weather checking.

The palette should lean toward grey, white, and subtle neutrals rather than bright or saturated weather colors.

---

## 6. Acceptance Criteria

The feature is considered complete when:
- the user can search a city and see results,
- the app correctly fetches city coordinates and weather forecast data,
- the app handles no-results and invalid data gracefully,
- the UI shows a loading state during the combined request,
- the current, hourly, and daily conditions are displayed clearly,
- the layout matches the grey/off-white dashboard design direction,
- the weather code information is readable and understandable,
- the API logic is separated from the presentation logic.

---

## 7. Summary
This project is a clean city-based weather dashboard with a single-search experience, layered API handling, and a structured forecast UI. It prioritizes clarity, usability, and a restrained visual style while exposing all critical data the user needs to understand the weather at a glance.
