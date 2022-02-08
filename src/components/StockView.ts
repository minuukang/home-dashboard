import { css, html, LitElement } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import { createFetcherAndAbortController } from "../helpers/fetch";

interface StockResult {
  cd: string;
  pcv: number;
  ms: "CLOSE";
  nv: number;
  lv: number;
  cr: number;
  cv: number;
  nm: string;
}

@customElement("stock-view")
export class StockView extends LitElement {
  public static styles = css`
    dl {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 4vmin;
      font-family: "HYBE";
    }

    dt {
      margin-right: 1vmin;
      font-weight: normal;
    }

    dd {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .value {
      font-weight: bold;
      font-size: 1.2em;
    }

    .change {
      font-size: 0.5em;
    }

    .change.up {
      color: red;
    }

    .change.down {
      color: blue;
    }
  `;

  @property()
  public code!: string;

  @property()
  public name: string | undefined;

  protected fetcher = createFetcherAndAbortController(
    () => `/api/stock?code=${this.code}`,
    json => this.data = json.result
  );

  @state()
  protected data: StockResult | null = null;

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
      return html`loading...`;
    }
    return html`
      <dl>
        <dt>${this.name || this.data.nm}</dt>
        <dd>
          <strong class="value">${this.data.nv.toLocaleString()}</strong>
          <em
            class="change ${this.data.cv > 0
              ? "up"
              : this.data.cv < 0
              ? "down"
              : ""}"
          >
            ${this.data.cv} (${this.data.cr}%)
          </em>
        </dd>
      </dl>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "stock-view": StockView;
  }
}
