//load in mongoose 
const mongoose = require('mongoose')

//tell mongoose to use promises
mongoose.Promise = global.Promise
// connect to database 
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp', { useNewUrlParser: true })


//export to server js
module.exports = { mongoose }