import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

const timeFormat = (v: number) => v.toString().padStart(2, "0");
const dayFormat = [
  "Sunday",
  "Monsday",
  "Thuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

@customElement("digital-clock")
export class DigitalClock extends LitElement {
  public static styles = css`
    :host {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: "HYBE";
    }

    time {
      display: flex;
      font-size: 15vmin;
    }

    p {
      font-size: 5vmin;
      margin-top: -1vmin;
    }

    strong + strong::before {
      content: ":";
    }
  `;

  protected clockTimer: number = 0;

  @state()
  protected currentDate = new Date();

  public connectedCallback(): void {
    super.connectedCallback();
    this.clockTimer = window.setInterval(() => {
      this.currentDate = new Date();
    }, 500);
  }

  public disconnectedCallback() {
    super.disconnectedCallback();
    window.clearInterval(this.clockTimer);
  }

  public render() {
    return html`
      <time datetime="${this.currentDate.toISOString()}">
        <strong>${timeFormat(this.currentDate.getHours())}</strong>
        <strong>${timeFormat(this.currentDate.getMinutes())}</strong>
        <strong>${timeFormat(this.currentDate.getSeconds())}</strong>
      </time>
      <p>
        ${this.currentDate.getFullYear()}-${timeFormat(
          this.currentDate.getMonth() + 1
        )}-${timeFormat(this.currentDate.getDate())}
        (${dayFormat[this.currentDate.getDay()]})
      </p>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "digital-clock": DigitalClock;
  }
}
