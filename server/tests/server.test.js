// load in saved dependencies
const expect = require('expect');
const request = require('supertest');

// load in requires files for testing from server and models
const { app } = require('./../server');
const { Todo } = require('./../models/todo');

// add todos for testing 
const todos = [{
  text: 'First test todo'
}, {
  text: 'Second test todo'
}];

// test lifecycle method lets us run a code before every test case, in our case make sure the db is empty
beforeEach((done) => {
  Todo.deleteOne({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

// describe to group all test cases
describe('POST /todos', () => {
  //  verify that when data is sent everything works
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    //  supper test request the app file
    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({ text }).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  //  test to check if body data is valid
  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        //  fetch from database and test
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

// test for Get route
describe('GET /todos', () => {
  // test to make sure that when a valid id is passed in it returns the id
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});
