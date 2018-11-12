// //load in saved dependencies
const expect = require('expect');
const request = require('supertest');

//load in ObjectId to enable get test
const { ObjectID } = require('mongodb');

//load in requires files for testing from server and models
const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user')
const { todos, populateTodos, users, populateUsers } = require('./seed/seed')

//test lifecycle method lets us run a code before every test case, in our case make sure the db is empty, populateTodos is called from seed file

beforeEach(populateUsers)
beforeEach(populateTodos)

//describe to group all test cases
describe('POST /todos', () => {
  //verify that when data is sent everything works
  it('should create a new todo', (done) => {
    const text = 'Test todo text'

    //supper test request the app file
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
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

  //test to check if body data is valid
  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        //db query
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

//test for Get route
describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should not return todo doc created by other user', (done) => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    const hexId = new ObjectID().toHexString();

    request(app)
      .get(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123abc')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});


//test for delete post 
describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    const hexId = todos[1]._id.toHexString()

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', user[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        //custmon expect to determine that id on todos body matches the hexid
        expect(res.body.todo._id).toBe(hexId)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        //query db
        //db query
        Todo.findById(hexId).then((todo) => {
          expect(todo).toBeFalsy();
          done();
        }).catch((e) => done(e));
      })
  })

  it('should remove a todo', (done) => {
    const hexId = todos[0]._id.toHexString()

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', user[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        //query db
        //db query
        Todo.findById(hexId).then((todo) => {
          expect(todo).toExist();
          done();
        }).catch((e) => done(e));
      })
  })

  it('should return 404 if todo not found', (done) => {
    const hexId = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('it should return 404 if the id is invalid', (done) => {
    request(app)
      .delete('/todos/123abc')
      .set('x-auth', user[1].tokens[0].token)
      .expect(404)
      .end(done);
  })
})

//test for PATCH route

describe('PATCH /todos/:id', () => {
  it('should update todo', (done) => {
    //grab id of first todo
    const hexId = todos[0]._id.toHexString()
    const text = 'Test todo text'

    //request appto be tested
    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        text,
        completed: true
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text)
        expect(res.body.completed).toBe(true)
        // expect(res.body.completedAt).toBe(completedAt).toBeA('number')
      })
      .end(done)

  })

  it('should not update todo created by other user', (done) => {
    //grab id of first todo
    const hexId = todos[0]._id.toHexString()
    const text = 'Test todo text'

    //request appto be tested
    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        text,
        completed: true
      })
      .expect(404)
      .end(done)

  })

  it('should clear completedAt when todo is false', (done) => {
    //grab id of first todo
    const hexId = todos[1]._id.toHexString()
    const text = 'Test todo text'

    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        text,
        completed: false
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text)
        expect(res.body.completed).toBe(false)
        expect(res.body.completedAt).toBeFalsy()
      })
      .end(done)
  })
})

//test cases for  users
describe('GET /users/me', () => {
  //for get users
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString())
        expect(res.body.email).toBe(users[0].email)
      })
      .end(done)
  })


  it('should return a 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({})
      })
      .end(done)
  })
})

//post users test cases
describe('POST /users', () => {
  it('should create a user', (done) => {
    const email = 'example@example.com'
    const password = '123abc'
    request(app)
      .post('/users')
      .send({ email, password })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist()
        expect(res.body._id).toExist()
        expect(res.body.email).toBe(email)
      })
      //instead of done pass a custom function to query db
      .end((err) => {
        if (err) {
          return done(err)
        }

        User.findOne({ email }).then((user) => {
          expect(user).toExist()
          expect(user.password).toNotBe(password)
          done()
        }).catch((e) => done(e))
      })
  })

  it('should return validation errors if request is invalid', (done) => {
    request(app)
      .post('/users')
      .send({
        email: 'and',
        password: '123'
      })
      .expect(400)
      .end(done)
  })


  it('should not create a user is email is in use', (done) => {
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: 'userOnepass'
      })
      .expect(400)
      .end(done)
  })
})

//test for users login
describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.header['x-auth']).toExist()
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        return User.findById(users[1]._id).then((user) => {
          expect(user.token[1]).toInclude({
            access: 'auth',
            tokek: res.header['x-auth']
          })
            .done()
        }).catch((e) => done(e))
      })
  })

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + '1'
      })
      .expect(400)
      .expect((res) => {
        expect(res.header['x-auth']).toNotExist()
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        return User.findById(users[1]._id).then((user) => {
          expect(user.token.length).toBe(1)
            .done()
        }).catch((e) => done(e))
      })
  })
})

//test for logout user route
describe('DELETE /users/me/token', () => {
  it('should remve auth token on logout', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        return User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0)
            .done()
        }).catch((e) => done(e))
      })
  })
})