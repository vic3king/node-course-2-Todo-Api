//load in mongoose
const mongoose = require('mongoose')

//load in validator
const validator = require('validator')

//loadash to enable pick
const _ = require('lodash')

//require jwt
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
  email: {
    //validation for email type and if field will be required
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    //validate email 
    validate: {
      validator: validator.isEmail,
      message: '{value} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  //setup tokens 
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
})
//overide d default method(determines what gets sent back when a mongoose model is converted to a json value)
UserSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()
  return _.pick(userObject, ['_id', 'email'])
}

//instance methods(signs and saves each user doc)
UserSchema.methods.generateAuthToken = function () {
  //stores individual document
  const user = this
  //setting properties for the user model above
  const access = 'auth'
  //sign the user id, for hashing
  const token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123').toString()

  //update the user array
  user.tokens.push({ access, token })

  //save the updaated changes , return a callback to be used later in the server file
  return user.save().then(() => {
    //token to be used later in server js
    return token
  })
}

//create model method(verifys signed user data and returns it )
UserSchema.statics.findByToken = function (token) {
  const User = this
  //store decoded jwt values
  let decoded

  try {
    decoded = jwt.verify(token, 'abc123')
  } catch (e) {
    return Promise.reject()
  }

  //success case find the user with token value
  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
}

//create a model for a user as a challenge
const User = mongoose.model('User', UserSchema)

module.exports = { User }