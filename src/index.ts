import { html, render } from "lit";

import "./components/HomeDashboard";

render(html`<home-dashboard />`, document.querySelector("#app") as HTMLElement);
