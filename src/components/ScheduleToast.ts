import { css, html, LitElement } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { customElement, state, property } from "lit/decorators.js";
import { GoogleAccessToken } from "../helpers/auth";

interface CalendarEvent {
  created: string;
  creator: {
    email: string;
    self: boolean;
  };
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  eventType: string;
  htmlLink: string;
  id: string;
  kind: string;
  summary: string;
}

@customElement("schedule-toast")
export class ScheduleToast extends LitElement {
  public static styles = css`
    :host {
      position: fixed;
      bottom: 2vmin;
      left: 2vmin;
      font-family: "HYBE";
    }

    dl {
      display: flex;
      flex-direction: column;
      font-size: 3vmin;
      padding: 0.5em 3em 0.5em 1em;
      background-color: #000;
      color: #fff;
      border-radius: 10px;
      margin: 0;
      position: relative;
      overflow: hidden;
    }

    dl::after {
      position: absolute;
      width: 1.5em;
      height: 100%;
      top: 0;
      right: 0;
      background-color: #f5ff00;
      content: "";
    }

    dl ~ dl {
      margin-top: 0.5em;
    }

    dt {
      font-weight: bold;
    }

    dd {
      margin: 0.5em 0 0 0;
      font-size: 0.7em;
    }
  `;

  @property()
  public accessToken!: GoogleAccessToken;

  @state()
  public items: CalendarEvent[] = [];

  protected abortController = new AbortController();

  public connectedCallback(): void {
    super.connectedCallback();
    this.fetchData();
    const timer = window.setInterval(() => this.fetchData(), 1000 * 60 * 10);
    this.abortController.signal.addEventListener("abort", () => {
      window.clearInterval(timer);
    });
  }

  public disconnectedCallback() {
    super.disconnectedCallback();
    this.abortController.abort();
  }

  protected async fetchData() {
    const response = await fetch(
      `/api/schedules?${new URLSearchParams(Object.entries(this.accessToken))}`,
      { signal: this.abortController.signal }
    );
    const json = await response.json();
    this.items = json.data.items;
  }

  public render() {
    if (!this.items.length) {
      return null;
    }
    return html`
      ${repeat(
        this.items,
        (item) => item.id,
        (item) => {
          const startDate = new Date(item.start.dateTime);
          return html`
            <dl>
              <dt>${item.summary}</dt>
              <dd>${startDate.toLocaleString()}</dd>
            </dl>
          `;
        }
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "schedule-toast": ScheduleToast;
  }
}
