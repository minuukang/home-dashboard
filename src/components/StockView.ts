import { css, html, LitElement } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import { createFetcherAndAbortController } from "../helpers/fetch";

export interface StockResult {
  stockEndType: string;
  itemCode: string;
  reutersCode: string;
  stockName: string;
  sosok: string;
  closePrice: string;
  compareToPreviousClosePrice: string;
  compareToPreviousPrice: CompareToPreviousPrice;
  fluctuationsRatio: string;
  marketStatus: string;
  localTradedAt: string;
  tradeStopType: TradeStopType;
  stockExchangeType: StockExchangeType;
  stockExchangeName: string;
  imageCharts: ImageCharts;
  scriptChartTypes: string[];
  delayTime: number;
  delayTimeName: string;
  endUrl: string;
  chartIqEndUrl: string;
  newlyListed: boolean;
}

export interface CompareToPreviousPrice {
  code: string;
  text: string;
  name: string;
}

export interface TradeStopType {
  code: string;
  text: string;
  name: string;
}

export interface StockExchangeType {
  code: string;
  zoneId: string;
  nationType: string;
  delayTime: number;
  startTime: string;
  endTime: string;
  closePriceSendTime: string;
  nameKor: string;
  nameEng: string;
  nationCode: string;
  nationName: string;
  name: string;
}

export interface ImageCharts {
  transparent: string;
  candleWeek: string;
  areaYear: string;
  areaYearThree: string;
  candleMonth: string;
  areaMonthThree: string;
  areaYearTen: string;
  day_up_tablet: string;
  candleDay: string;
  day_up: string;
  day: string;
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
    (json) => (this.data = json)
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
        <dt>${this.name || this.data.stockName}</dt>
        <dd>
          <strong class="value">${this.data.closePrice}</strong>
          <em
            class="change ${this.data.compareToPreviousPrice.name === "RISING"
              ? "up"
              : this.data.compareToPreviousPrice.name === "FALLING"
              ? "down"
              : ""}"
          >
            ${this.data.compareToPreviousClosePrice}
            (${this.data.fluctuationsRatio}%)
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
