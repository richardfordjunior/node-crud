
const app = require('./../server').app;
const server = require('./../server').server;
const request = require("supertest").agent(server);
const chai = require('chai')
const expect = chai.expect;

after(done => {
 server.close();
  done();
});

describe("#Testing the books API", () => {
  it("tests our testing framework is working", () => {
    expect(2).eql(2)
  })
  it("should return the books list", (done) => {
    const body = {
      book: "My new book 15"
    }
    request
      .post('/api/book')
      .send(body)
      .then(res => {
        if (res.body.data) {
          request
            .get('/api/books')
            .expect(200)
            .then(response => {
              expect(response.body.status).toBe('Ok');
              expect(response.data).to.eql('My new book 15');
            })
        }   
      })
    done()
  });


  it("should raise an error when a selected book for deletion does not exist", (done) => {
    let body = { book: 'Test book 15' }
    request
      .delete('/api/book')
      .send(body)
      .then((resp) => {
        expect(response.body.status).toBe('Not Ok');
        expect(response.body.message).toBe('The book selected does not exist!');
      })
    done();
  });


  it("should delete a book from the books list", (done) => {
    const body = {
      book: "My new book 15"
    }
    const deleteBody = {
      book: "My new book 15"
    }
    request
      .post('/api/book')
      .send(body)
      .expect(201)
      .then(response => {
        if (response.body.data) {
          request
            .delete('/api/book')
            .send(deleteBody)
            .expect(204)
          .end(done)
        }
      });
  });

  it("should update a book title",  (done) => {
    const body = {
      original_book: 'Book1',
      new_book: 'My new title'
    }
    request
      .patch('/api/book')
      .send(body)
      .expect(200)
      .then(res => {
        expect(res.body.status).toEql('Ok')
      })
    done()
  });

  it("should create a new book", (done) => {
    const body = {
      book: "My new book 15"
    }
    request
      .post('/api/book')
      .send(body)
      .expect(201)
      .end(done)
      .then(response => {
        expect(response.body.status).toBe('Ok');
        expect(response.message).toEql('New book: "My new book 15" added successfully.')
      })
  });

  it("should save a book to the psuedo-database", (done) => {
    const body = {
      book: "My new book 1"
    }
    request
      .put('/api/book')
      .send(body)
      .expect(200)
      .then(res => {
        expect(res.body.message).toEql('Book has been updated.')
        expect(res.body.data).to.haveOwnProperty('timeElapsed')
        expect(res.body.data).to.haveOwnProperty('title')
        expect(res.body.data.length).to.eql(1)
      })
    done()
  });
});