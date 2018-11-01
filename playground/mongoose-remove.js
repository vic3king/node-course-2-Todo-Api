const { ObjectID } = require('mongodb')
const { mongoose } = require('./../server/db/mongoose')
const { Todo } = require('./../server/models/todo')
const { User } = require('./../server/models/user')

//Todo.remove removes everthing from our database

// Todo.deleteMany({}).then((result) => {
//   console.log(result)
// }).catch((err) => {

// });

//find one and remove(removes the first document in the collection)

// Todo.findOneAndDelete({_id: '5bdb821d5bfe30af720975bf'})

//find by id and remove will remove the particular document matching that id and its result returns the removed document
Todo.findByIdAndDelete('5bdb821d5bfe30af720975bf').then((todo) => {
  console.log(todo)
}).catch((err) => {

});