//load in mongoose
const mongoose = require('mongoose')

//creating a model for everything to be stored in our collection
const Todo = mongoose.model('Todo', {
  text: {
    //validation for text type and if field will be required
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
})

module.exports = { Todo }