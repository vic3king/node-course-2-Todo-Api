//load in mongoose
const mongoose = require('mongoose')

//create a model for a user as a challenge
const User = mongoose.model('User', {
  email: {
    //validation for text type and if field will be required
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
})

module.exports = { User }