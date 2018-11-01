const { ObjectID } = require('mongodb')
const { mongoose } = require('./../server/db/mongoose')
const { Todo } = require('./../server/models/todo')
const { User } = require('./../server/models/user')

const id = '5bd62fdb2545771e3c51ce28'
// 5bd95dfb6fe0e80bc87ad129
// //object id validation
// if (!ObjectID.isValid(id)) {
//   console.log('ID not valid')
// }
// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos)
// }).catch((err) => {

// });

// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo)
// }).catch((err) => {

// })

// Todo.findById(id).then((todo) => {
//   if(!todo) {
//     return console.log('ID not found')
//   }
//   console.log('Todo by ID', todo)
// }).catch((err) => {
//   console.log(err)
// })

// id validation if the query works but theres no user, if the user is found, and when an error occurs

User.findById(id).then((user) => {
  if (!user) {
    return console.log('Unable to find User')
  }
  console.log('User  by ID ', user)
}).catch((err) => {
  console.log(err)
});