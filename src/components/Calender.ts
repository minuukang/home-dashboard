import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("calender-view")
export class Calender extends LitElement {
  public static styles = css`
    table {
      width: 100%;
      border-collapse: collapse;
      font-family: "HYBE";
      text-align: center;
    }

    td,
    th {
      padding: 3px 5px;
    }

    tr td:nth-child(1),
    tr th:nth-child(1) {
      color: red;
    }

    tr td:nth-child(7),
    tr th:nth-child(7) {
      color: blue;
    }

    .today {
      background-color: #f0f0f0;
      border-radius: 50%;
    }
  `;

  protected clockTimer: number = 0;

  @state()
  protected currentDate = new Date();

  public connectedCallback(): void {
    super.connectedCallback();
    this.clockTimer = window.setInterval(() => {
      this.currentDate = new Date();
      this.dispatchEvent(
        new CustomEvent("change", {
          detail: {
            date: this.currentDate,
          },
        })
      );
    }, 10000);
  }

  public render() {
    const date = this.currentDate.getDate();
    const month = this.currentDate.getMonth();
    const year = this.currentDate.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDayOfMonth = new Date(year, month, daysInMonth).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const firstChunk = Array.from({ length: firstDayOfMonth }, () => null);
    const lastChunk = Array.from({ length: 6 - lastDayOfMonth }, () => null);
    const chunkedDays = chunk([...firstChunk, ...days, ...lastChunk], 7);

    return html`
      <table>
        <thead>
          <tr>
            <th scope="row">Sun</th>
            <th scope="row">Mon</th>
            <th scope="row">Tue</th>
            <th scope="row">Wed</th>
            <th scope="row">Thu</th>
            <th scope="row">Fri</th>
            <th scope="row">Sat</th>
          </tr>
        </thead>
        <tbody>
          ${chunkedDays.map(
            (dates) =>
              html`<tr>
                ${dates.map(
                  (d) =>
                    html`<td class="${date === d ? "today" : ""}">${d}</td>`
                )}
              </tr>`
          )}
        </tbody>
      </table>
    `;
  }
}

function chunk<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );
}

declare global {
  interface HTMLElementTagNameMap {
    "calender-view": Calender;
  }
}
