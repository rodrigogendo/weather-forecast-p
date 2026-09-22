# Project: Weather Forecast

This project will get a city and search the weather of that place, showing the main weather info, such as temperature, humidity, precipitation, etc.

### Technical Aspects

The project will be made with Vite + Vanilla + Typescript

### API Information
It will use the OpenMeteo API with the following endpoints:

#### To find the latitude and longitude from the city name:
https://geocoding-api.open-meteo.com/v1/search?name={CITY-NAME}&count=1&language=en&format=json

{CITY-NAME} = City name the user typed

Example of response:
{
  "results": [
    {
      "id": 1850147,
      "name": "Tokyo",
      "latitude": 35.6895,
      "longitude": 139.69171,
      "elevation": 44,
      "feature_code": "PPLC",
      "country_code": "JP",
      "admin1_id": 1850144,
      "timezone": "Asia/Tokyo",
      "population": 9733276,
      "country_id": 1861060,
      "country": "Japan",
      "admin1": "Tokyo"
    }
  ],
  "generationtime_ms": 0.6814003
}

Information needed for this project:
- name
- latitude
- longitude
- country-code
- timezone

#### To find the weather info:

https://api.open-meteo.com/v1/forecast?latitude={LATITUDE}&longitude={LONGITUDE}&hourly=temperature_2m,precipitation,precipitation_probability&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,wind_direction_10m,wind_speed_10m,precipitation,weather_code,rain,showers,snowfall&timezone={TIMEZONE}

{LATITUDE} = latitude
{LONGITUDE} = longitude
{TIMEZONE} = timezone

Example of response:
{
  "latitude": 35.7,
  "longitude": 139.6875,
  "generationtime_ms": 0.417351722717285,
  "utc_offset_seconds": 32400,
  "timezone": "Asia/Tokyo",
  "timezone_abbreviation": "GMT+9",
  "elevation": 40,
  "current_units": {
    "time": "iso8601",
    "interval": "seconds",
    "temperature_2m": "°C",
    "relative_humidity_2m": "%",
    "apparent_temperature": "°C",
    "is_day": "",
    "wind_speed_10m": "km/h",
    "wind_direction_10m": "°",
    "precipitation": "mm",
    "weather_code": "wmo code",
    "rain": "mm"
  },
  "current": {
    "time": "2026-09-22T12:15",
    "interval": 900,
    "temperature_2m": 29.8,
    "relative_humidity_2m": 47,
    "apparent_temperature": 31.5,
    "is_day": 1,
    "wind_speed_10m": 6.5,
    "wind_direction_10m": 3,
    "precipitation": 0,
    "weather_code": 1,
    "rain": 0
  },
  "hourly_units": {
    "time": "iso8601",
    "temperature_2m": "°C",
    "precipitation_probability": "%",
    "weather_code": "wmo code",
    "precipitation": "mm"
  },
  "hourly": {
    "time": [
      "2026-09-22T00:00",
      "2026-09-22T01:00",
      "2026-09-22T02:00",
      "2026-09-22T03:00",
      "2026-09-22T04:00",
      "2026-09-22T05:00",
      "2026-09-22T06:00",
      "2026-09-22T07:00",
      "2026-09-22T08:00",
      "2026-09-22T09:00",
      "2026-09-22T10:00",
      "2026-09-22T11:00",
      "2026-09-22T12:00",
      "2026-09-22T13:00",
      "2026-09-22T14:00",
      "2026-09-22T15:00",
      "2026-09-22T16:00",
      "2026-09-22T17:00",
      "2026-09-22T18:00",
      "2026-09-22T19:00",
      "2026-09-22T20:00",
      "2026-09-22T21:00",
      "2026-09-22T22:00",
      "2026-09-22T23:00",
      "2026-09-23T00:00",
      "2026-09-23T01:00",
      "2026-09-23T02:00",
      "2026-09-23T03:00",
      "2026-09-23T04:00",
      "2026-09-23T05:00",
      "2026-09-23T06:00",
      "2026-09-23T07:00",
      "2026-09-23T08:00",
      "2026-09-23T09:00",
      "2026-09-23T10:00",
      "2026-09-23T11:00",
      "2026-09-23T12:00",
      "2026-09-23T13:00",
      "2026-09-23T14:00",
      "2026-09-23T15:00",
      "2026-09-23T16:00",
      "2026-09-23T17:00",
      "2026-09-23T18:00",
      "2026-09-23T19:00",
      "2026-09-23T20:00",
      "2026-09-23T21:00",
      "2026-09-23T22:00",
      "2026-09-23T23:00",
      "2026-09-24T00:00",
      "2026-09-24T01:00",
      "2026-09-24T02:00",
      "2026-09-24T03:00",
      "2026-09-24T04:00",
      "2026-09-24T05:00",
      "2026-09-24T06:00",
      "2026-09-24T07:00",
      "2026-09-24T08:00",
      "2026-09-24T09:00",
      "2026-09-24T10:00",
      "2026-09-24T11:00",
      "2026-09-24T12:00",
      "2026-09-24T13:00",
      "2026-09-24T14:00",
      "2026-09-24T15:00",
      "2026-09-24T16:00",
      "2026-09-24T17:00",
      "2026-09-24T18:00",
      "2026-09-24T19:00",
      "2026-09-24T20:00",
      "2026-09-24T21:00",
      "2026-09-24T22:00",
      "2026-09-24T23:00",
      "2026-09-25T00:00",
      "2026-09-25T01:00",
      "2026-09-25T02:00",
      "2026-09-25T03:00",
      "2026-09-25T04:00",
      "2026-09-25T05:00",
      "2026-09-25T06:00",
      "2026-09-25T07:00",
      "2026-09-25T08:00",
      "2026-09-25T09:00",
      "2026-09-25T10:00",
      "2026-09-25T11:00",
      "2026-09-25T12:00",
      "2026-09-25T13:00",
      "2026-09-25T14:00",
      "2026-09-25T15:00",
      "2026-09-25T16:00",
      "2026-09-25T17:00",
      "2026-09-25T18:00",
      "2026-09-25T19:00",
      "2026-09-25T20:00",
      "2026-09-25T21:00",
      "2026-09-25T22:00",
      "2026-09-25T23:00",
      "2026-09-26T00:00",
      "2026-09-26T01:00",
      "2026-09-26T02:00",
      "2026-09-26T03:00",
      "2026-09-26T04:00",
      "2026-09-26T05:00",
      "2026-09-26T06:00",
      "2026-09-26T07:00",
      "2026-09-26T08:00",
      "2026-09-26T09:00",
      "2026-09-26T10:00",
      "2026-09-26T11:00",
      "2026-09-26T12:00",
      "2026-09-26T13:00",
      "2026-09-26T14:00",
      "2026-09-26T15:00",
      "2026-09-26T16:00",
      "2026-09-26T17:00",
      "2026-09-26T18:00",
      "2026-09-26T19:00",
      "2026-09-26T20:00",
      "2026-09-26T21:00",
      "2026-09-26T22:00",
      "2026-09-26T23:00",
      "2026-09-27T00:00",
      "2026-09-27T01:00",
      "2026-09-27T02:00",
      "2026-09-27T03:00",
      "2026-09-27T04:00",
      "2026-09-27T05:00",
      "2026-09-27T06:00",
      "2026-09-27T07:00",
      "2026-09-27T08:00",
      "2026-09-27T09:00",
      "2026-09-27T10:00",
      "2026-09-27T11:00",
      "2026-09-27T12:00",
      "2026-09-27T13:00",
      "2026-09-27T14:00",
      "2026-09-27T15:00",
      "2026-09-27T16:00",
      "2026-09-27T17:00",
      "2026-09-27T18:00",
      "2026-09-27T19:00",
      "2026-09-27T20:00",
      "2026-09-27T21:00",
      "2026-09-27T22:00",
      "2026-09-27T23:00",
      "2026-09-28T00:00",
      "2026-09-28T01:00",
      "2026-09-28T02:00",
      "2026-09-28T03:00",
      "2026-09-28T04:00",
      "2026-09-28T05:00",
      "2026-09-28T06:00",
      "2026-09-28T07:00",
      "2026-09-28T08:00",
      "2026-09-28T09:00",
      "2026-09-28T10:00",
      "2026-09-28T11:00",
      "2026-09-28T12:00",
      "2026-09-28T13:00",
      "2026-09-28T14:00",
      "2026-09-28T15:00",
      "2026-09-28T16:00",
      "2026-09-28T17:00",
      "2026-09-28T18:00",
      "2026-09-28T19:00",
      "2026-09-28T20:00",
      "2026-09-28T21:00",
      "2026-09-28T22:00",
      "2026-09-28T23:00"
    ],
    "temperature_2m": [25.9, 26, 25.9, 24.8, 25.3, 25.6, 25.1, 25.8, 26.5, 27.3, 28.1, 28.9, 29.7, 30.1, 30.3, 29.7, 29, 27.7, 26.2, 25.5, 25.1, 24.7, 24.3, 24, 23.7, 23.4, 23, 22.7, 22.5, 22.3, 22, 22.1, 22.2, 22.4, 22.7, 23.1, 23.4, 23.7, 23.9, 23.9, 23.7, 23.4, 22.9, 22.6, 22.2, 21.8, 21.9, 21.4, 21.2, 21, 20.8, 20.7, 20.5, 20.4, 20.3, 20.7, 21.5, 22.3, 23.3, 24.7, 26.1, 27, 27.3, 27.3, 27.1, 26.6, 25.8, 25.1, 24.7, 24.2, 23.7, 23.5, 22.8, 22, 21.4, 20.9, 20.7, 20.4, 20.2, 20.7, 21.8, 22.3, 22.5, 23.2, 23.3, 25, 25.2, 25.1, 24.6, 23.5, 22.2, 21.3, 21, 20.6, 20.1, 19.6, 19.2, 19.1, 19.1, 19.1, 18.9, 18.6, 18.6, 19, 19.6, 20.1, 20.7, 21.2, 21.6, 21.8, 21.9, 21.7, 21.3, 20.8, 20.3, 20, 19.7, 19.5, 19.1, 18.8, 18.5, 18.2, 17.9, 17.7, 17.4, 17.3, 17.4, 18.2, 19.2, 20, 20.3, 20.4, 20.4, 20.4, 20.4, 20.2, 20, 19.6, 19.3, 19, 18.6, 18.3, 18, 17.8, 17.5, 17.3, 17.1, 16.9, 19.8, 20.4, 21.1, 21.9, 22.5, 23.1, 23.5, 24, 24.3, 24.6, 24.8, 24.7, 24.4, 23.9, 23.3, 22.6, 21.9, 21.4, 21, 20.6],
    "precipitation_probability": [94, 66, 28, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 4, 10, 18, 22, 19, 13, 8, 7, 7, 8, 10, 12, 14, 13, 12, 12, 16, 22, 27, 31, 34, 35, 32, 26, 22, 23, 25, 27, 26, 25, 24, 26, 29, 31, 30, 28, 25, 20, 13, 8, 5, 3, 2, 3, 6, 10, 17, 26, 35, 43, 51, 55, 51, 44, 37, 33, 30, 29, 29, 31, 33, 37, 42, 43, 38, 29, 22, 18, 16, 14, 12, 10, 10, 11, 14, 16, 18, 19, 22, 26, 31, 37, 44, 53, 59, 62, 63, 63, 62, 60, 57, 54, 51, 49, 49, 49, 49, 46, 42, 39, 38, 38, 37, 34, 30, 29, 32, 37, 41, 43, 45, 47, 49, 51, 53, 58, 63, 65, 62, 56, 51, 48, 46, 43, 40, 37, 33, 28, 23, 20, 22, 25, 27, 24, 20, 16, 15, 14, 14, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25],
    "weather_code": [2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 2, 2, 2, 2, 3, 2, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 3, 3, 2, 2, 2, 1, 2, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 51, 51, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 51, 1, 1, 2, 3, 2, 3, 3, 3, 3, 1, 1, 2, 2, 3, 3, 2, 2, 2, 1, 1, 2, 2, 3, 3, 3, 53, 53, 53, 53, 53, 53, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 3, 3, 3, 3, 3, 51, 51, 51, 51, 51, 51, 51, 51, 51, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 1, 0, 3, 3, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 51, 51, 51, 51, 51, 51, 3, 3],
    "precipitation": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.1, 0.1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.05, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.3, 0.3, 0.3, 0.4, 0.4, 0.4, 0.2, 0.2, 0.2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0, 0]
  },
  "daily_units": {
    "time": "iso8601",
    "weather_code": "wmo code",
    "temperature_2m_max": "°C",
    "temperature_2m_min": "°C",
    "precipitation_sum": "mm",
    "precipitation_probability_max": "%"
  },
  "daily": {
    "time": [
      "2026-09-22",
      "2026-09-23",
      "2026-09-24",
      "2026-09-25",
      "2026-09-26",
      "2026-09-27",
      "2026-09-28"
    ],
    "weather_code": [3, 3, 51, 51, 53, 51, 51],
    "temperature_2m_max": [30.3, 23.9, 27.3, 25.2, 21.9, 20.4, 24.8],
    "temperature_2m_min": [24, 21.4, 20.3, 19.6, 18.6, 17.3, 16.9],
    "precipitation_sum": [0, 0, 0.2, 0.05, 3.6, 2.7, 0.6],
    "precipitation_probability_max": [94, 35, 55, 43, 63, 65, 33]
  }
}

Information needed for this project:
- current_units, hourly_units and daily_units have the measurement unit types
- current, hourly and daily have the value of the properties

Mandatory information:
- For current:
    time, temperature_2m, relative_humidity_2m, apparent_temperature, is_day, wind_speed_10m, wind_direction_10m, precipitation
- For hourly:
    time, temperature_2m, precipitation_probability
- For daily:
    temperature_2m_max, temperature_2m_min, precipitation_sum, precipitation_probability_max

#### IMPORTANT:
The project won't make direct requisitions to the API, so we'll have a separate file with the OpenMeteo functions.

Search steps to receive the city name and obtain weather info:
- The user types the city name
- The project uses OpenMeteo to obtain the latitude, longitude and timezone from the typed city
- With those 3 informations, the project does the requisition to obain the weather info for that region
- In case it can't find the city, show that there was no result
- In case it found the city, but not the weather info, also show that there was no result

The search involves both requisitions (search latitude/longitude/timezone and search weater), but to the user it looks like only one, with a 'loading' visual.

The OpenMeteo functions should verify if the parameters were obtained, otherwise act like it didn't.

### Visual Design and UX

Needs Empty State.

Area at the top, centralized, with the search input for the city

The project will have a sidebar with:
- Temperature
- City name, Country Code
- Current day
- If it's day or night
- Weather code

The main area will have two sections:
- At the top an hourly forecast showing weather code, time, temperature and precipitation probability
- At the bottom a daily forecast showing weather code, max and min temperatures and precipitation sum and probability

Overall design:
- Mainly grey shades
- Sidebar and Main areas inside a Div with round borders, centralized with off-white with undertones of grey

Weather Code information:
WMO Weather interpretation codes (WW)
Code	Description
0	Clear sky
1, 2, 3	Mainly clear, partly cloudy, and overcast
45, 48	Fog and depositing rime fog
51, 53, 55	Drizzle: Light, moderate, and dense intensity
56, 57	Freezing Drizzle: Light and dense intensity
61, 63, 65	Rain: Slight, moderate and heavy intensity
66, 67	Freezing Rain: Light and heavy intensity
71, 73, 75	Snow fall: Slight, moderate, and heavy intensity
77	Snow grains
80, 81, 82	Rain showers: Slight, moderate, and violent
85, 86	Snow showers slight and heavy
95 *	Thunderstorm: Slight or moderate
96, 99 *	Thunderstorm with slight and heavy hail