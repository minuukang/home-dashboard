/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WEATHER_LAT: string;
  readonly VITE_WEATHER_LON: string;
  readonly VITE_STOCK_VIEW_NAME: string;
  readonly VITE_STOCK_VIEW_CODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
