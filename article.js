"use strict";

const fs = require("fs");

const FILENAME = "articles.json";
const FILE_INIT = `{
  "currentId": 0,
  "entries": []
}`;

// create the file if it doesn't exist
function accessEntries(callback) {
  try {
    if (!fs.existsSync(FILENAME)) {
      console.error(`${FILENAME} doesn't exist, creating ${FILENAME}`);

      fs.appendFileSync(FILENAME, FILE_INIT, { flag: 'w' });
    }

    const blogEntries = JSON.parse(fs.readFileSync(FILENAME));
    return callback(blogEntries);
  } catch (error) {
    console.error(`Error occurred while opening ${FILENAME}: ${error}`);
    throw error;
  }
}

function getEntry(blogEntries, id) {
  const blogEntry = blogEntries.entries.find(entry => entry.id === Number(id));

  if (!blogEntry) {
    throw new Error(`could not find blog entry with id ${id}`);
  } else {
    return blogEntry;
  }
}

function getBlogEntryList() {
  return accessEntries((blogEntries) => {
    return blogEntries.entries.map(entry => ({
      id: entry.id,
      title: entry.title,
      date: entry.date,
    }));
  });
}

function getBlogEntry(id) {
  return accessEntries((blogEntries) => getEntry(blogEntries, id));
}

function addBlogEntry(title, content) {
  return accessEntries((blogEntries) => {
    const id = blogEntries.currentId;
    
    blogEntries.entries.push({
      id,
      date: new Date().toLocaleDateString("en-us", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      title,
      content,
    });
    blogEntries.currentId += 1;

    fs.writeFileSync(FILENAME, JSON.stringify(blogEntries));
    return id;
  });
}

function updateBlogEntry(id, title, date, content) {
  return accessEntries((blogEntries) => {
    const blogEntry = getEntry(blogEntries, id);

    blogEntry.title = title;
    blogEntry.date = date;
    blogEntry.content = content;

    fs.writeFileSync(FILENAME, JSON.stringify(blogEntries));
    return id;
  });
}

function deleteBlogEntry(id) {
  return accessEntries((blogEntries) => {
    const blogEntry = getEntry(blogEntries, id);

    blogEntries.entries = blogEntries.entries.filter(entry => entry !== blogEntry);

    fs.writeFileSync(FILENAME, JSON.stringify(blogEntries));
  });
}

module.exports = { 
  getBlogEntryList, 
  getBlogEntry, 
  addBlogEntry, 
  updateBlogEntry, 
  deleteBlogEntry 
};