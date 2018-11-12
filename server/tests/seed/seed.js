//this file is responsible for creating dummy data for testing our app
const { ObjectID } = require('mongodb')
const jwt = require('jsonwebtoken')

const { Todo } = require('../../models/todo')
const { User } = require('./../../models/user')

const userOneId = new ObjectID()
const userTwoId = new ObjectID()
const users = [{
  _id: userOneId,
  email: 'victory@example.com',
  password: 'userOnepass',
  tokens: [{
    acess: 'auth',
    token: jwt.sign({ _id: userOneId, access: 'auth' }, 'process.env.JWT_SECRET').toString()
  }]
}, {
  _id: userTwoId,
  email: 'john@example.com',
  password: 'userTwoPass',
  tokens: [{
    acess: 'auth',
    token: jwt.sign({ _id: userTwoId, access: 'auth' }, 'process.env.JWT_SECRET').toString()
  }]
}]
//add todos for testing 
const todos = [{
  _id: new ObjectID(),
  text: 'First test todo',
  _creator: userOneId
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333,
  _creator: userTwoId
}];


const populateTudos = (done) => {
  Todo.deleteMany({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done()).catch((err) => {

  });
}

const populateUsers = (done) => {
  User.deleteMany({}).then(() => {
    const userOne = new User(users[0].save())
    const userTwo = new User(user[1].save())

    //takes an array of promises
    return Promise.all([userOne, userTwo])
  }).then(() => done()).catch((err) => {

  });
}
module.exports = { todos, populateTudos, users, populateUsers }