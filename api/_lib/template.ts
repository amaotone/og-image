import { readFileSync } from "fs";
import marked from "marked";
import { sanitizeHtml } from "./sanitizer";
import { ParsedRequest } from "./types";
const twemoji = require("twemoji");
const twOptions = { folder: "svg", ext: ".svg" };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const mincho = readFileSync(
  `${__dirname}/../_fonts/NotoSerifJP-Regular.otf`
).toString("base64");
const bg = readFileSync(`${__dirname}/../_bg/ichibunichie.jpg`).toString(
  "base64"
);

function getCss(theme: string, fontSize: string, fontFamily: string) {
  let background = "white";
  let foreground = "black";

  if (theme === "dark") {
    background = "black";
    foreground = "white";
  }
  return ` 
    @font-face {
        font-family: 'Noto Serif JP';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/otf;charset=utf-8;base64,${mincho}) format('opentype');
    }

    body {
        background: ${background};
        background-image: url(data:image/jpg;base64,${bg});
        background-size: 1200px 630px;
        height: 100vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        padding: 0 60px;
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }

    .logo {
        margin: 0 75px;
    }

    .spacer {
        margin: 150px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }
    
    .heading {
        font-family: '${sanitizeHtml(fontFamily)}';
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        opacity: 0.8;
        color: ${foreground};
        line-height: 1.5;
    }`;
}

export function getHtml(parsedReq: ParsedRequest) {
  const { text, theme, md, fontSize, fontFamily } = parsedReq;
  return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize, fontFamily)}
    </style>
    <body>
      <div class="heading">
        ${emojify(md ? marked(text) : sanitizeHtml(text))}
      </div>
    </body>
</html>`;
}

// function getImage(src: string, width = "auto", height = "225") {
//   return `<img
//         class="logo"
//         alt="Generated Image"
//         src="${sanitizeHtml(src)}"
//         width="${sanitizeHtml(width)}"
//         height="${sanitizeHtml(height)}"
//     />`;
// }

// function getPlusSign(i: number) {
//   return i === 0 ? "" : '<div class="plus">+</div>';
// }
