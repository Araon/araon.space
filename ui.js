const fs = require("fs");
const express = require("express");
const markdownIt = require("markdown-it");
const { updateHTML } = require("./populate");
const { populateCSS, populateConfig } = require("./build");
const { updateCommand } = require("./update");
const app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/views"));
app.set("views", __dirname + "/views");
app.use(
    express.json({
        limit: "50mb",
    })
);
app.use(
    express.urlencoded({
        limit: "50mb",
        extended: true,
    })
);

const port = 5000;

const jsdom = require("jsdom").JSDOM,
    options = {
        resources: "usable",
    };
global.DOMParser = new jsdom().window.DOMParser;
const { getBlog, outDir } = require("./utils");


function createBlog(title, subtitle, folder, topImage, content, tags) {
    // Checks to make sure this directory actually exists
    // and creates it if it doesn't
    if (!fs.existsSync(`${outDir}/blog/`)) {
        fs.mkdirSync(
            `${outDir}/blog/`,
            {
                recursive: true,
            },
            (err) => {}
        );
    }

    if (!fs.existsSync(`${outDir}/blog/${folder}`)) {
        fs.mkdirSync(`${outDir}/blog/${folder}`, {
            recursive: true,
        });
    }
    fs.copyFile(
        `${__dirname}/assets/blog/blogTemplate.html`,
        `${outDir}/blog/${folder}/index.html`,
        (err) => {
            if (err) throw err;
            jsdom
                .fromFile(`${outDir}/blog/${folder}/index.html`, options)
                .then(function(dom) {
                    let window = dom.window,
                        document = window.document;
                    let style = document.createElement("link");
                    style.setAttribute("rel", "stylesheet");
                    style.setAttribute("href", "../../index.css");
                    
                    document.getElementsByTagName("head")[0].appendChild(style);
                    document.getElementsByTagName(
                        "title"
                    )[0].textContent = title;
                    document.getElementById("blog_title").textContent = title;
                    document.getElementById(
                        "blog_sub_title"
                    ).textContent = subtitle;

                    // setting meta tags for sharing
                    document
                        .getElementById("meta_tag_author")
                        .setAttribute("content", "Araon");
                    document
                        .getElementById("meta_tag_description")
                        .setAttribute("content", subtitle);
                    document
                        .getElementById("meta_tag_thumbnail")
                        .setAttribute("content", topImage);
                    document.getElementById(
                        "background"
                    ).style.background = `url('${topImage}') center center`;

                    if (content != null) {
                        var parser = new DOMParser();
                        content = parser.parseFromString(content, "text/html");
                        document.getElementById("blog").innerHTML =
                            content.documentElement.innerHTML;
                    }

                    fs.writeFile(
                        `${outDir}/blog/${folder}/index.html`,
                        "<!DOCTYPE html>" +
                            window.document.documentElement.outerHTML,
                        async function(error) {
                            if (error) throw error;

                            let date = new Date();

                            let blog_data = {
                                url_title: folder,
                                title: title,
                                sub_title: subtitle,
                                top_image: topImage,
                                visible: true,
                                tags: tags,
                                timeStamp: date.toISOString(),
                            };
                            console.log(
                                `Saving the following blog: ${blog_data.title}`
                            );
                            const old_blogs = await getBlog();
                            old_blogs.push(blog_data);
                            fs.writeFile(
                                `${outDir}/blog.json`,
                                JSON.stringify(old_blogs, null, " "),
                                function(err) {
                                    if (err) throw err;
                                    console.log(
                                        `Blog created successfully at ${outDir}\\blog\\${folder}\n`
                                    );
                                }
                            );
                        }
                    );
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    );
}

function markdownToHtml(inputData) {
        const md = markdownIt();
        return md.render(inputData);  
}

function readMarkdownFile(file) {

    if (!file.endsWith(".md")) {
        console.log("Not a markdown file, Please Provide a markdown file");
        return;
    }
    fs.readFile(file,"utf8",function(err, data) {
            if (err) throw err;

            let title = data.split("\n")[1].split("Title:")[1].trim();
            let subtitle = data.split("\n")[2].split("subtitle:")[1].trim();
            let topImage = data.split("\n")[3].split("topImage:")[1].trim();
            let tags = data.split("\n")[4].split("tags:")[1].trim().split(",");
            let content = data.split("\n").slice(5).join("\n");

            content = markdownToHtml(content);
            
            let folder = title.replace(/[^a-zA-Z0-9 ]/g, "").replace(/ /g, "-");
            createBlog(title, subtitle, folder, topImage, content, tags);
            // backing the md file up
            // try catch
            try {
                fs.copyFile(file,`${outDir}/blog/${folder}/${folder}.md`, (err) => {
                    if (err) throw err;
                    console.log(`Backed up to ${outDir}/blog/${folder}/${folder}.md}`);
                });
            } catch (error) {
                console.log(`Back of the md file was not successful`);
            }
        }
    );
}

function uiCommand() {
    app.get("/", function(req, res) {
        res.render("index.ejs");
    });

    app.get("/update", function(req, res) {
        if (!fs.existsSync(`${outDir}/config.json`)) {
            return res.send(
                'You need to run build command before using update<br><a href="/">Go Back</a>'
            );
        }
        updateCommand();
        res.redirect("/");
    });

    app.post("/build", function(req, res) {
        let username = req.body.username;
        if (!username) {
            return res.send("username can't be empty");
        }
        let sort = req.body.sort ? req.body.sort : "created";
        let order = req.body.order ? req.body.order : "asc";
        let includeFork = req.body.fork == "true" ? true : false;
        let types = ["owner"];
        let twitter = req.body.twitter ? req.body.twitter : null;
        let linkedin = req.body.linkedin ? req.body.linkedin : null;
        let medium = req.body.medium ? req.body.medium : null;
        let dribbble = req.body.dribbble ? req.body.dribbble : null;
        let background = req.body.background
            ? req.body.background
            : "https://images.unsplash.com/photo-1553748024-d1b27fb3f960?w=1500&q=80";
        let theme = req.body.theme == "on" ? "dark" : "light";
        const opts = {
            sort: sort,
            order: order,
            includeFork: includeFork,
            types,
            twitter: twitter,
            linkedin: linkedin,
            medium: medium,
            dribbble: dribbble,
        };

        updateHTML(username, opts);
        populateCSS({
            background: background,
            theme: theme,
        });
        populateConfig(opts);
        res.redirect("/");
    });

    app.get("/blog", function(req, res) {
        if (!fs.existsSync(`${outDir}/config.json`)) {
            return res.send(
                'You need to run build command before accessing blogs<br><a href="/">Go Back</a>'
            );
        }
        fs.readFile(`${outDir}/config.json`, function(err, data) {
            res.render("blog.ejs", {
                profile: JSON.parse(data),
            });
        });
    });

    app.post("/createBlog", function(req, res) {
        // Todo:
        // 1. add custom author name
        // 4. add audio file to blog

        let title = req.body.title;
        let subtitle = req.body.subtitle;
        let content = req.body.content ? req.body.content : null;
        if (!title) {
            return res.send("title can't be empty");
        }
        if (!subtitle) {
            return res.send("subtitle can't be empty");
        }
        if (!content) {
            return res.send("something isn't working fine, try again :p");
        }
        let folder = title.replace(/[^a-zA-Z0-9 ]/g, "").replace(/ /g, "-");
        let topImage = req.body.top_image;
        createBlog(title, subtitle, folder, topImage, content);
        res.redirect("/blog");
    });

    console.log("\nStarting...");
    app.listen(port);
    console.log(
        `The GUI is running on port ${port}, Navigate to http://localhost:${port} in your browser\n`
    );
}

module.exports = {
    uiCommand,
    readMarkdownFile
};
