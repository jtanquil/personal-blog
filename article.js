"use strict";

const fs = require("fs");

const FILENAME = "articles.json";
const FILE_INIT = `{
  "currentId": 0,
  "blogEntries": []
}`;

// create the file if it doesn't exist
function accessEntries(callback, ...args) {
  try {
    if (!fs.existsSync(FILENAME)) {
      console.error(`${FILENAME} doesn't exist, creating ${FILENAME}`);

      fs.appendFileSync(FILENAME, FILE_INIT, { flag: 'w' });
    }

    return callback(...args);
  } catch (error) {
    console.error(`Error occurred while opening ${FILENAME}: ${error}`);
    throw error;
  }
}

function getBlogEntryList() {
  return accessEntries(() => {
    const blogEntries = JSON.parse(fs.readFileSync(FILENAME));
    return blogEntries.blogEntries.map(entry => ({
      id: entry.id,
      title: entry.title,
      date: entry.date,
    }));
  });
}

function getBlogEntry(id) {
  return accessEntries((id) => {
    const blogEntries = JSON.parse(fs.readFileSync(FILENAME));
    const blogEntry = blogEntries.blogEntries.find(entry => entry.id === Number(id));

    if (!blogEntry) {
      throw new Error(`could not find blog entry with id ${id}`);
    } else {
      return blogEntry;
    }
  }, id);
}

module.exports = { getBlogEntryList, getBlogEntry };