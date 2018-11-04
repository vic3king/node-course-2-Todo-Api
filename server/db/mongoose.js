//load in mongoose 
const mongoose = require('mongoose')

//tell mongoose to use promises
mongoose.Promise = global.Promise
// connect to database mongodb uri environment variable
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
mongoose.set('useCreateIndex', true)


//export to server js
module.exports = { mongoose }