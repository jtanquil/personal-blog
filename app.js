"use strict";

const express = require("express");
const app = express();

const { 
  getBlogEntryList, 
  getBlogEntry, 
  addBlogEntry, 
  updateBlogEntry, 
  deleteBlogEntry } = require('./article.js');
const auth = require('./auth.js');

const PORT = 3000;

app.set("view engine", "pug");

app.use("/public", express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("/home", (req, res) => {
  res.render("home", {
    entries: getBlogEntryList(),
  });
});

app.get("/article/:id", (req, res) => {
  res.render("article", {
    ...getBlogEntry(req.params.id),
  });
});

app.use(["/admin", "/edit/:id", "/new", "/delete/:id"], auth);

app.get("/admin", (req, res) => {
  res.render("admin", {
    entries: getBlogEntryList(),
  });
});

app.route("/edit/:id")
  .get((req, res) => {
    res.render("edit-article", {
      route: `/edit/${req.params.id}`,
      ...getBlogEntry(req.params.id),
    });
  })
  .post((req, res) => {
    updateBlogEntry(req.params.id, req.body.title, req.body.date, req.body.content);
    res.redirect(`/article/${req.params.id}`);
  })

app.route("/new")
  .get((req, res) => {
    res.render("edit-article", {
      route: "/new",
    });
  })
  .post((req, res) => {
    const newArticleId = addBlogEntry(req.body.title, req.body.content);
    res.redirect(`/article/${newArticleId}`);
  });

app.route("/delete/:id")
  .post((req, res) => {
    deleteBlogEntry(req.params.id);
    res.redirect("/admin");
  });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});