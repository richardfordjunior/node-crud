
const app = require('./../server').app;
const server = require('./../server').server;
const request = require("supertest").agent(server);
const chai = require('chai')
const expect = chai.expect;
const assert = require('assert');

describe("#Books API", () => {
  it("tests our testing framework is working", () => {
    expect(2).eql(2)
  })

  it("should return the books list", async () => {
    const body = {
      book: "My new book 15"
    }
    const res = await request
      .post('/api/book')
      .send(body)

    if (res.body.data) {
      const response = await request
        .get('/api/books')
        .expect(200)
      expect(response.body.status).to.eql('Ok');
      expect(response.body.data).to.eql('My new book 15');
      expect(response.body.data).to.not.eql('My new book 1');

    }
  });


  it("should raise an error when a selected book for deletion does not exist", async () => {
    let body = { book: 'Test book 15' }
    const resp = await request
      .delete('/api/book')
      .send(body)
    expect(resp.body.status).to.eql('Not Ok');
    expect(resp.body.message).to.eql('The book selected does not exist!');
  });


  it("should delete a book from the books list", async () => {
    const body = {
      book: "My new book 1"
    }
    const deleteBody = {
      book: "My new book 1"
    }
    const res = await request
      .post('/api/book')
      .send(body)
    if (res.body.data) {
      const deleteRequest = await request
        .delete('/api/book')
        .send(deleteBody)
        .expect(204)
    }
  });

  it("should update a book title", async () => {

    const body = {
      original_book: 'My new book 15',
      new_book: 'My new book 16'
    }
    const res = await request
      .patch('/api/book')
      .send(body)
      .expect(200)
    expect(res.body.status).to.eql('Ok')
    expect(res.body.data[0]).to.eql(body.new_book)
  });

  it("should not update a book title when new title is not provided", async () => {

    const body = {
      original_book: 'My new book 15',
      new_book: ''
    }
    const res = await request
      .patch('/api/book')
      .send(body)
      .expect(400)
    expect(res.body.message).to.eql('Book title cannot be empty!')
  });

  it("should create a new book", async () => {
    const body = {
      book: "My new book"
    }
    const res = await request
      .post('/api/book')
      .send(body)
    expect(res.body).to.haveOwnProperty('message')
    expect(res.body.status).to.not.eql('Okay')
    expect(res.body.status).to.eql('Ok')
  });

  it("should save a book to the psuedo-database", async () => {
    const body = {
      book: "My new book 1"
    }
    const res = await request
      .put('/api/book')
      .send(body)
    expect(res.body.message).to.eql('Book has been updated.')
    expect(res.body.data).to.be.an('array')
    expect(res.body.data[2]).to.be.an('object')
    expect(res.body.data[2]).to.haveOwnProperty('timeElapsed')
    expect(res.body.data.length).to.eql(3)
  });
});