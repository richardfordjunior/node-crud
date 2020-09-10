const express = require('express');
const bookRouter = express.Router();
const books = require('../../controllers/book.controller.js');

bookRouter.post('/book', books.post)

bookRouter.get('/books', books.get);

bookRouter.put('/book', books.put);

bookRouter.patch('/book', books.patch);

bookRouter.delete('/book', books.delete);

module.exports = bookRouter;
