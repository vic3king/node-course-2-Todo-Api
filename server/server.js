//load in libraries
const express = require('express')
const bodyParser = require('body-parser')

//require mongoose file, User moderl, Todo model, using destructuring technique
const { mongoose } = require('./db/mongoose')
const { User } = require('./models/user')
const { Todo } = require('./models/todo')

//express app
const app = express()

//config middleware(accessing stuff from the library)
app.use(bodyParser.json())

//route to add new todo(Post)
app.post('/todos', (req, res) => {
  //create an instance of a mongose model to set props
  const todo = new Todo({
    text: req.body.text
  })

  //save to db and send post content to user
  todo.save().then((doc) => {
    res.send(doc)
  }).catch((err) => {
    res.status(400).send(err)
  });
  console.log(req.body.text)
})

//route to get all todos and show to user(GET)
app.get('/todos', (req, res) => {
  //find all todos
  Todo.find().then((todos) => {
    //sending back all response using an array instead of an array
    res.send({todos})
  }).catch((err) => {
    res.status(400).send(err)
  });
})
//express app route
app.listen(3000, () => {
  console.log('Started on port 3000')
})

module.exports = { app }