export const AIR_QUALITYS = [
  "good",
  "moderate",
  "oops",
  "mask",
  "vomiting",
  "die",
] as const;

export const WEATHER_TYPE_MAP = {
  Rain: "rainy",
  Clear: "cleared",
  Clouds: "cloudy",
} as const;

export const EMOJI_MAP = {
  // λ μ¨
  night: "π",
  sunny: "βοΈ",
  cloudy: "βοΈ",
  thunder: "π©",
  rainy_and_thunder: "β",
  rainy: "π§",
  snowy: "βοΈ",
  foggy: "π«",
  cleared: "π€",
  // μ°μ°
  not_raining: "π",
  ready_raining: "βοΈ",
  // μ΅λ
  humid: "π§",
  dry: "π‘",
  // νμ
  wind_soft: "π",
  wind_medium: "πͺ",
  wind_hard: "π¨",
  // λ―ΈμΈ λ¨Όμ§
  good: "π",
  moderate: "π",
  oops: "π€­",
  mask: "π·",
  vomiting: "π€’",
  die: "π»",
} as const;

export function kelbinToCelsuis(input: number) {
  return Math.floor(input - 273.15);
}

function getAirQuality(air: number) {
  return AIR_QUALITYS[air - 1];
}

export interface WeatherResponse {
  list: {
    components: {
      co: number;
      nh3: number;
      no: number;
      no2: number;
      o3: number;
      pm2_5: number;
      pm10: number;
      so2: number;
    };
    main: {
      aqi: number;
    };
  }[];
  main: {
    temp: number;
    temp_max: number;
    temp_min: number;
    pressure: number;
    humidity: number;
    feels_like: number;
  };
  name: string;
  weather: {
    id: number;
    main: keyof typeof WEATHER_TYPE_MAP;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
}

export function parseWeatherApi(result: WeatherResponse) {
  const currentWeather = result.weather[0];
  return {
    name: result.name, // μ΄λ¦
    weatherType: EMOJI_MAP[WEATHER_TYPE_MAP[currentWeather.main] || "sunny"], // λ μ¨ νμ
    currentTemperature: kelbinToCelsuis(result.main.temp), // νμ¬ μ¨λ
    highTemperature: kelbinToCelsuis(result.main.temp_max), // μ΅κ³  μ¨λ
    lowTemperature: kelbinToCelsuis(result.main.temp_min), // μ΅μ  μ¨λ
    airQuality: EMOJI_MAP[getAirQuality(result.list[0].main.aqi)], // λ―ΈμΈλ¨Όμ§ νμ
  };
}
