import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

import "./DigitalClock";
import "./StockView";
import "./WeatherInformation";
import "./ScheduleToast";
import { getAccessTokenData, GoogleAccessToken } from "../helpers/auth";

@customElement("home-dashboard")
export class HomeDashboard extends LitElement {
  public static styles = css`
    :host {
      display: flex;
      width: 100%;
      height: 100%;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  `;

  @state()
  protected accessToken: GoogleAccessToken | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    getAccessTokenData().then((result) => {
      this.accessToken = result;
    });
  }

  public render() {
    if (!this.accessToken) {
      return null;
    }
    return html`
      <digital-clock></digital-clock>
      <weather-information
        lat=${import.meta.env.VITE_WEATHER_LAT}
        lon=${import.meta.env.VITE_WEATHER_LON}
      ></weather-information>
      <stock-view
        name=${import.meta.env.VITE_STOCK_VIEW_NAME}
        code=${import.meta.env.VITE_STOCK_VIEW_CODE}
      ></stock-view>
      <schedule-toast .accessToken=${this.accessToken}></schedule-toast>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "home-dashboard": HomeDashboard;
  }
}
