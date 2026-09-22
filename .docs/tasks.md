# Implementation Tasks

This task list follows the requirements in @file:prd.md and is structured to be completed progressively, one task at a time.

Type declarations in this project should use TypeScript type aliases (`type`) instead of interfaces for all custom types.

[X] 1. Set up the project foundation and app shell
  - Create the base Vite + TypeScript app structure and confirm the project runs locally.
  - Prepare the initial HTML, CSS, and TypeScript entry files needed for the dashboard layout.
  - Approval criteria:
    - `npm install` and the app start command complete without errors.
    - The page renders a blank but valid app shell with the expected root container.
    - The file structure supports the later dashboard, API layer, and styling work.

[X] 2. Build the UI layout and visual structure
  - Implement the top search area and the main dashboard container with sidebar and forecast content regions.
  - Apply the neutral grey/off-white visual style described in the PRD, including spacing, borders, rounded panels, and responsive layout.
  - Approval criteria:
    - The page shows a centered search field near the top.
    - The layout clearly separates the summary panel from the main forecast area.
    - The design is responsive and remains legible on smaller screens.

[X] 3. Create the city-search input behavior
  - Add the search field interaction so the user can type a city name and trigger a search action.
  - Connect the UI to the app state that tracks idle, loading, success, error, and no-result states.
  - Approval criteria:
    - Typing a city and submitting a search updates the application state.
    - The app distinguishes between an initial idle state and an active search.
    - The input remains usable and the flow feels like a single user action.

[X] 4. Implement the Open-Meteo API abstraction layer
  - Create a dedicated API module that owns all Open-Meteo requests and validation logic.
  - Encapsulate city lookup and weather forecast requests as separate functions, with parameter checks before requests are made.
  - Approval criteria:
    - No direct API logic exists in the UI layer.
    - Missing or invalid parameters are treated as empty or failed results rather than causing crashes.
    - The API functions return structured empty/error states for invalid or missing data.

[X] 5. Add city geocoding request and validation
  - Implement the city lookup request using the geocoding endpoint and validate the returned city data.
  - Confirm that required fields such as name, latitude, longitude, country code, and timezone are present before continuing.
  - Approval criteria:
    - A valid city responds with location data and timezone information.
    - A missing or malformed city response is treated as “no result” and does not break rendering.
    - A failed geocoding request is handled gracefully with the correct empty-state behavior.

[X] 6. Add weather forecast request and validation
  - Implement the weather request using latitude, longitude, and timezone from the city result.
  - Validate that the response contains the required current, hourly, and daily fields before rendering.
  - Approval criteria:
    - Weather data loads only when all required parameters are valid.
    - Missing weather data produces a no-result state rather than broken UI.
    - The app handles both failed and empty weather responses consistently.

[X] 7. Normalize and prepare weather data for rendering
  - Convert API responses into the app’s forecast structure, including current conditions, hourly entries, and daily entries.
  - Apply the required weather-code mapping to readable descriptions.
  - Approval criteria:
    - The app receives a consistent data model for display.
    - Weather codes map to human-readable labels such as “Clear sky” or “Rain”.
    - Rendering logic can consume the normalized data without depending on raw API shapes.

[X] 8. Render the sidebar summary information
  - Display the current temperature, city name, country code, current day, day/night indicator, and weather code in the summary panel.
  - Ensure the summary remains visually distinct and easy to scan.
  - Approval criteria:
    - The sidebar shows the main current condition details for the selected city.
    - The day/night state is represented clearly.
    - The displayed values are sourced from validated forecast data.

[] 9. Render the hourly forecast section
  - Build the top forecast panel with a horizontal or scrollable list of hourly entries.
  - Show weather code, time, temperature, and precipitation probability for each entry.
  - Approval criteria:
    - The section is placed at the top of the main content area.
    - Each card or item includes all required data points.
    - The layout remains readable and usable across screen sizes.

[] 10. Render the daily forecast section
  - Build the lower forecast panel with daily entries and show the required values.
  - Include maximum temperature, minimum temperature, precipitation sum, precipitation probability maximum, and weather code.
  - Approval criteria:
    - The daily list or table is clearly structured and readable.
    - Each row includes the required forecast information.
    - The layout matches the dashboard design direction without clutter.

[] 11. Implement loading, empty, and error states
  - Add the loading indicator during the combined city-plus-weather search flow and ensure it appears as one action.
  - Add the no-result and empty-state messages for no city, no weather data, or no search yet.
  - Approval criteria:
    - The user sees a loading state while both requests are in progress.
    - Each invalid or empty search ends in a clear user-friendly message.
    - The UI does not show broken data or a blank panel when the search result is empty.

[] 12. Final integration and behavior verification
  - Connect all UI, state management, API, and rendering pieces into the full weather-dashboard flow.
  - Verify the complete user journey: search city -> validate city -> fetch weather -> render results -> handle empty/error states.
  - Approval criteria:
    - The app works end-to-end for a valid city search.
    - The user can successfully complete the required flow without direct API logic in the UI.
    - Required acceptance criteria from the PRD are met for search, loading, rendering, and empty states.
