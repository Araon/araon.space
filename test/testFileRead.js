
const fs = require("fs");
const markdownIt = require("markdown-it");

const markdownToHtml = (markdown) => {
    const md = markdownIt();
    const html = md.render(markdown);
    return html;
}

const content = fs.readFileSync("test.md", "utf8");


let x = markdownToHtml(content);

fs.writeFileSync("test.html", x);

