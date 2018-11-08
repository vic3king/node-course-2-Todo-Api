//load in mongoose
const mongoose = require('mongoose')

//load in validator
const validator = require('validator')

//loadash to enable pick
const _ = require('lodash')

//require jwt
const jwt = require('jsonwebtoken')

//require bcrypt js to enable salting an d hashing
const bcrypt = require('bcryptjs')

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

//instance methd to logout a user by removing their token
UserSchema.methods.removeToken = function (token) {
  //pull lets you remove item from an array that match a certain criteria 
  const user = this

  return user.updateOne({
    $pull: {
      tokens: { token }
    }
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

//login should find by credetials
UserSchema.statics.findByCredentials = function (email, password) {
  const User = this
  //return the promise from find  user by email 
  return User.findOne({ email }).then((user) => {
    if (!user) {
      return Promise.reject()
    }
    //main login function compare the plain password from a user with the hashed password in the database, we are returning this promise because bcrypt doesnt return a promise it ruturns a callback
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user)
        } else {
          reject()
        }
      })
    })
  })
}
//mongoose iddleware lets us hash our passwords before saving to database 
UserSchema.pre('save', function (next) {
  const user = this

  //hash passwords before saving
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash
        next()
      })
    })
  } else {
    next()
  }

})
//create a model for a user as a challenge
const User = mongoose.model('User', UserSchema)

module.exports = { User }