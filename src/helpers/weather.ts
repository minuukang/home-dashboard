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
  // 날씨
  night: "🌙",
  sunny: "☀️",
  cloudy: "☁️",
  thunder: "🌩",
  rainy_and_thunder: "⛈",
  rainy: "🌧",
  snowy: "❄️",
  foggy: "🌫",
  cleared: "🌤",
  // 우산
  not_raining: "🌂",
  ready_raining: "☂️",
  // 습도 (상대습도)
  dry: "🌾",
  normal: "🌿",
  humid: "💦",
  // 이슬점
  veryDry: "🏜",
  comfortable: "☀️",
  slightlyHumid: "🌤",
  moderatelyHumid: "☁️",
  veryHumid: "🌫",
  extremelyHumid: "💦",
  dangerous: "🌊",
  // 풍속
  wind_soft: "🍃",
  wind_medium: "🪁",
  wind_hard: "💨",
  // 미세 먼지
  good: "😄",
  moderate: "🙂",
  oops: "🤭",
  mask: "😷",
  vomiting: "🤢",
  die: "👻",
} as const;

export function kelbinToCelsuis(input: number) {
  return Math.floor(input - 273.15);
}
function getHumidityLevel(humidity: number) {
  if (humidity <= 30) return "dry";
  if (humidity <= 60) return "normal";
  return "humid";
}
function calculateDewPoint(tempCelsius: number, humidityPercent: number): number {
  const a = 17.27;
  const b = 237.7;
  const alpha = (a * tempCelsius) / (b + tempCelsius) + Math.log(humidityPercent / 100);
  return Math.round((b * alpha) / (a - alpha));
}
function getDewPointEmoji(dewPoint: number): string {
  if (dewPoint <= 10) return EMOJI_MAP.veryDry;
  if (dewPoint <= 15) return EMOJI_MAP.comfortable;
  if (dewPoint <= 18) return EMOJI_MAP.slightlyHumid;
  if (dewPoint <= 21) return EMOJI_MAP.moderatelyHumid;
  if (dewPoint <= 24) return EMOJI_MAP.veryHumid;
  if (dewPoint <= 26) return EMOJI_MAP.extremelyHumid;
  return EMOJI_MAP.dangerous;
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
  const tempCelsius = kelbinToCelsuis(result.main.temp);
  const humidityPercent = result.main.humidity;
  return {
    name: result.name, // 이름
    weatherType: EMOJI_MAP[WEATHER_TYPE_MAP[currentWeather.main] || "sunny"], // 날씨 타입
    currentTemperature: tempCelsius, // 현재 온도
    highTemperature: kelbinToCelsuis(result.main.temp_max), // 최고 온도
    lowTemperature: kelbinToCelsuis(result.main.temp_min), // 최저 온도
    airQuality: EMOJI_MAP[getAirQuality(result.list[0].main.aqi)], // 미세먼지 타입
    humidity: EMOJI_MAP[getHumidityLevel(humidityPercent)], // 습도
    humidityValue: humidityPercent, // 습도 수치
    dewPoint: calculateDewPoint(tempCelsius, humidityPercent), // 이슬점
    dewPointEmoji: getDewPointEmoji(calculateDewPoint(tempCelsius, humidityPercent)), // 이슬점 이모지
  };
}
