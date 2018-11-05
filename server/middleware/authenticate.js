//require user 
const { User } = require('./../models/user')

//middleware to makke our routes private
const authenticate = (req, res, next) => {
  //get the value from header
  const token = req.header('x-auth')

  //model method
  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject()
    }

    req.user = user
    req.token = token
    next()
  }).catch((e) => {
    res.status(401).send()
  })
}

module.exports = { authenticate }