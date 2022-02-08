import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { toEmojiSvg } from "../helpers/emoji";
import { createFetcherAndAbortController } from "../helpers/fetch";
import { parseWeatherApi, WeatherResponse } from "../helpers/weather";

@customElement("weather-information")
export class WeatherInformation extends LitElement {
  public static styles = css`
    :host {
      font-family: "HYBE";
      font-size: 5vmin;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    p {
      margin: 0;
    }

    .emoji {
      width: 1em;
      height: 1em;
      vertical-align: middle;
    }
  `;

  @property()
  public lat!: string | number;

  @property()
  public lon!: string | number;

  @state()
  protected data: WeatherResponse | null = null;

  protected fetcher = createFetcherAndAbortController(
    () => `/api/weather?lat=${this.lat}&lon=${this.lon}`,
    json => this.data = json
  );

  public connectedCallback(): void {
    super.connectedCallback();
    this.fetcher.call();
    const timer = window.setInterval(() => this.fetcher.call(), 1000 * 60 * 30);
    this.fetcher.controller.signal.addEventListener("abort", () => {
      window.clearInterval(timer);
    });
  }

  public disconnectedCallback() {
    super.disconnectedCallback();
    this.fetcher.abort();
  }

  public render() {
    if (!this.data) {
      return html`Loading...`;
    }
    const result = parseWeatherApi(this.data);
    return html`
      <p>
        ${result.currentTemperature}℃ (${toEmojiSvg(result.weatherType)} &
        ${toEmojiSvg(result.airQuality)})
      </p>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "weather-information": WeatherInformation;
  }
}
