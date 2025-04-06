const express = require("express");
const fetch = require("node-fetch");
const NodeCache = require("node-cache");
const { google } = require("googleapis");

require("dotenv").config();

const app = express();
const cache = new NodeCache({
  stdTTL: 60 * 9,
});

app.get("/api/stock", async (req, res) => {
  const code = req.query.code;
  if (!(typeof code === "string")) {
    throw new Error("code is required");
  }
  const cacheKey = `stock:${code}`;
  let data;
  if (!cache.has(cacheKey)) {
    const response = await fetch(
      `https://m.stock.naver.com/api/stock/${code}/basic`
    );
    data = await response.json();
    cache.set(cacheKey, data);
  } else {
    data = cache.get(cacheKey);
  }
  res.send(data);
});

// Weather
const openWeatherAppKey = process.env.OPENWEATHER_API_KEY;

function getWeather({ lon, lat }) {
  const url = new URL(`http://api.openweathermap.org/data/2.5/weather`);
  url.searchParams.set("lat", lat);
  url.searchParams.set("lon", lon);
  url.searchParams.set("appid", openWeatherAppKey);
  return fetch(url).then((res) => res.json());
}

function getAirCondition({ lon, lat }) {
  const url = new URL(`http://api.openweathermap.org/data/2.5/air_pollution`);
  url.searchParams.set("lat", lat);
  url.searchParams.set("lon", lon);
  url.searchParams.set("appid", openWeatherAppKey);
  return fetch(url).then((res) => res.json());
}

app.get("/api/weather", async (req, res) => {
  const geolocation = {
    lat: req.query.lat,
    lon: req.query.lon,
  };
  const cacheKey = `weather:${JSON.stringify(geolocation)}`;
  let data;
  if (!cache.has(cacheKey)) {
    const [weather, airCondition] = await Promise.all([
      getWeather(geolocation),
      getAirCondition(geolocation),
    ]);
    data = { ...weather, ...airCondition };
    cache.set(cacheKey, data);
  } else {
    data = cache.get(cacheKey);
  }
  res.send(data);
});

function createOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    process.env.GOOGLE_OAUTH_CLIENT_REDIRECT_URI
  );
}

app.get("/api/google-token-url", (req, res) => {
  res.send({
    url: createOAuthClient().generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/calendar.readonly"],
    }),
  });
});

app.get("/api/google-token-generate", async (req, res) => {
  const oAuth2Client = createOAuthClient();
  try {
    const token = await oAuth2Client.getToken(req.query.code);
    res.send(token);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/api/schedules", async (req, res) => {
  try {
    const cacheKey = `weather:${JSON.stringify(req.query)}`;
    let data;
    if (!cache.has(cacheKey)) {
      const auth = createOAuthClient();
      auth.setCredentials(req.query);
      const calendar = google.calendar({ version: "v3", auth });
      const result = await calendar.events.list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        maxResults: 5,
        singleEvents: true,
        orderBy: "startTime",
      });
      data = result;
      cache.set(cacheKey, data);
    } else {
      data = cache.get(cacheKey);
    }
    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

app.listen(3001, () => {
  console.log("listen on http://localhost:3001");
});
