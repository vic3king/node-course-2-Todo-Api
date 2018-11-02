// load in lodash libraries to use the methods available on it
const _ = require('lodash')

//load in libraries
const express = require('express')
const bodyParser = require('body-parser')

//require mongoose file, User moderl, Todo model, using destructuring technique
const { mongoose } = require('./db/mongoose')
const { User } = require('./models/user')
const { Todo } = require('./models/todo')

//deprecated warning fix
mongoose.set('useFindAndModify', false)

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
    res.send({ todo })
  }).catch((err) => {
    res.status(400).send()
  });
})

//create a delete route
app.delete('/todos/:id', (req, res) => {
  //validate the id before deleting
  const id = req.params.id
  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }
  //find and delete using id
  Todo.findByIdAndDelete(id).then((todo) => {
    if (!todo) {
      return res.status(404).send()
    }
    res.send({ todo })
  }).catch((err) => {
    res.status(400).send()
  });
})

//patch route updates a todo items
app.patch('/todos/:id', (req, res) => {
  //the id should live on req.params.id
  const id = req.params.id

  //var body,updates are stored on req body
  const body = _.pick(req.body, ['text', 'completed'])

  //test that the id is valid
  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  //check is lodash body.completed is a boolean and is truthy
  if (_.isBoolean(body.completed) && body.completed) {
    //updates completedAt timestamp once completed value is changed to true
    body.completedAt = new Date().getTime()
  } else {
    body.completed = false
    body.completedAt = null
  }

  //querry db to update file which will be found by its id
  Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((todo) => {
    if (!todo) {
      return res.status(404).send()
    }

    res.send(todo)
  }).catch((err) => {
    res.status(400).send()
  });

})
//express app route
app.listen(port, () => {
  console.log(`Started on port ${port}`)
})

module.exports = { app }