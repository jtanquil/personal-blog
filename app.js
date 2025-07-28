"use strict";

const express = require("express");
const app = express();

const { getBlogEntryList, getBlogEntry } = require('./article.js');

const PORT = 3000;

app.set("view engine", "pug");

app.use("/public", express.static("public"));

app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("/home", (req, res) => {
  res.render("home", {
    blogEntries: getBlogEntryList(),
  });
});

app.get("/article/:id", (req, res) => {
  res.render("article", {
    ...getBlogEntry(req.params.id),
  });
});

app.get("/admin", (req, res) => {
  res.send("admin");
});

app.route("/edit/:id")
  .get((req, res) => {
    res.send(`edit article id: ${req.params.id}`);
  });

app.route("/new")
  .get((req, res) => {
    res.send("new");
  });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});