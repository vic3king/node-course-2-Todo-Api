//load in libraries
const express = require('express')
const bodyParser = require('body-parser')

//require mongoose file, User moderl, Todo model, using destructuring technique
const { mongoose } = require('./db/mongoose')
const { User } = require('./models/user')
const { Todo } = require('./models/todo')

//load in object id from todo
const { ObjectID } = require('mongodb')

//express app
const app = express()
//setup for heroku 1
const port = process.env.PORT || 3000

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
    res.send({ todos })
  }).catch((err) => {
    res.status(400).send(err)
  });
})

//challeng fetching a particular todo using its id or any other parameter get route
app.get('/todos/:id', (req, res) => {
  //the id should live on req.params.id
  const id = req.params.id
  //test that the id is valid
  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  //query the database to find the todo matching thatID
  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send()
    }
    res.send({todo})
  }).catch((err) => {
    res.status(400).send()
  });
})

//express app route
app.listen(port, () => {
  console.log(`Started on port ${port}`)
})

module.exports = { app }