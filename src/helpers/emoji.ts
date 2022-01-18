import { html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import twemoji from "twemoji";

export function toEmojiSvg(emoji: string) {
  return html`${unsafeHTML(
    twemoji.parse(emoji, {
      base: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/13.1.0/svg/",
      ext: ".svg",
      callback(str, options) {
        const { base, ext } = options as twemoji.ParseObject;
        return `${base}${str}${ext}`;
      },
    })
  )}`;
}
