import { css, html, LitElement } from "lit";
import { customElement, state, property } from "lit/decorators.js";

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

  protected abortController = new AbortController();
  protected timer = 0;

  @state()
  protected data: StockResult | null = null;

  public connectedCallback(): void {
    super.connectedCallback();
    this.fetchData();
    this.timer = window.setInterval(() => this.fetchData(), 1000 * 60 * 30);
    this.abortController.signal.addEventListener("abort", () => {
      window.clearInterval(this.timer);
    });
  }

  public disconnectedCallback() {
    super.disconnectedCallback();
    this.abortController.abort();
  }

  protected fetchData() {
    fetch(`/api/stock?code=${this.code}`, {
      signal: this.abortController.signal,
    })
      .then((response) => response.json())
      .then((json) => (this.data = json.result));
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
