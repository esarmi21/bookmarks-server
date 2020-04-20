const express = require('express');
const uuid = require('uuid/v4');
const bookmarksRouter = express.Router();
const bookmarks = require('../store')
const bodyParser = express.json();
const logger = require('../../logger')

bookmarksRouter
.route('/bookmarks')
.get((req, res) => {
  res.json(bookmarks)
})
.post(bodyParser, (req, res)=> {
  const { title, url, rating, description } = req.body;
  if (!title) {
    logger.error(`Title is required`);
    return res
      .status(400)
      .send('Invalid data');
  }
  if (!url) {
    logger.error(`Url is required`);
    return res
      .status(400)
      .send('Invalid data');
  }
  const id = uuid();

const bookmark= {
  id,
  title,
  url, 
  rating, 
  description
};
console.log(bookmarks);
bookmarks.push(bookmark);
logger.info(`Bookmark with id ${id} created`);

res
  .status(201)
  .location(`http://localhost:8000/card/${id}`)
  .json(bookmark);
})

bookmarksRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
    // move implementation logic into here
    const { id } = req.params;
    let chosenBookmark = bookmarks.find(bookmark => bookmark.id === id);
    if (!chosenBookmark) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Bookmark Not Found');
    }
    res.json(chosenBookmark);
  })
  .delete((req, res) => {
    // move implementation logic into here
    const { id } = req.params;
   
  const bookmarkIndex = bookmarks.findIndex(bookmark => bookmark.id == id);

  if (bookmarkIndex === -1) {
    logger.error(`Bookmark with id ${id} not found.`);
    return res
      .status(404)
      .send('Not Found');
  }

  bookmarks.splice(bookmarkIndex, 1);

  logger.info(`Bookmark with id ${id} deleted.`);
  res
    .status(204)
    .send(`Bookmark with id ${id} deleted.`)
    .end();

  })

module.exports = bookmarksRouter;