let booksArrayList = [];

exports.post = (req, res) => {
  const book = req.body.book;
  if (!book) {
    return res.status(400).send({
      status: 'Not Ok',
      message: "Book title cannot be empty!"
    });
  }
  let found = booksArrayList.find(el => el === book)
  if (!found) {
    booksArrayList.push(book);
    return res.status(201).send({
      status: 'Ok',
      message: `New book: '${book}' added successfully.`,
      data: booksArrayList,
      createdDate: new Date()
    })
  } else {
    return res.status(400).send({
      status: 'Not Ok',
      message: "A book with the given title already exists in the library."
    });
  }
};

exports.delete = (req, res) => {
  const book = req.body.book;
  if (!book) {
    return res.status(400).send({
      status: 'Not Ok',
      message: "Book title cannot be empty!"
    });
  }
  if (!booksArrayList.includes(book)) {
    return res.status(400).send({
      status: 'Not Ok',
      message: "The book selected does not exist!"
    });
  }
  let filtered = booksArrayList.filter((val, index, arr) => {
    return arr[index] !== req.body.book
  });
  booksArrayList = filtered;
  res.sendStatus(204);
};

exports.patch = (req, res) => {
  const { original_book, new_book } = req.body;

  if (!new_book || !original_book) {
    return res.status(400).send({
      status: 'Not Ok',
      message: "Book title cannot be empty!"
    });
  }

  if (!booksArrayList.includes(new_book)) {
    let updatedList = booksArrayList.map(el => {
      return el === original_book ? new_book : el
    })
    booksArrayList = updatedList;
    res.status(200).send({
      status: "Ok",
      data: booksArrayList
    })
  }
};

exports.get = (req, res) => { 
  let allBooks = getBookList(booksArrayList);
  res.status(200).send({
    status: 'Ok',
    data: allBooks
  });
};

exports.put = (req, res) => {
  let bookTitle = req.body.book;
  let errors = [];
  Promise.all([saveItemOnDatabase(bookTitle)])
    .then((response) => {
      response.forEach(elem => {
        if (elem.message !== 'success') {
          errors.push(elem)
        }
        return errors.length > 0 ? res.status(400).send({
          status: 'Not Ok',
          message: `Error saving book to database: ${err.message}`
        }) : res.status(200).send({
          status: 'Ok',
          message: "Book has been updated.",
          data: elem.booksArrayList
        });
      })
    })
};

let saveItemOnDatabase = (title) => {
  let interval = title.length + Math.random();
  timeElapsed = Math.round(new Date().getMilliseconds() - interval);
  let found = booksArrayList.find(o => o.title === title);
  if (!found) {
    booksArrayList.push({ title, timeElapsed });
  }
  let response = { message: 'success', booksArrayList };
  return new Promise((resolve, reject) => {
    setInterval(resolve, interval, response)
  })
}

 let getBookList = (list) => {
  return list.join(';');
}
