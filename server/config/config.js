//setting up my ports to accomodate a test db
//setup for evn variable default is 'production which is set by heroku and the other we set locally 'development'
const env = process.env.NODE_ENV || 'development'
console.log('env ****', env)
if(env === 'development') {
  process.env.PORT = 3000
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp'
} else if(env == 'test') {
  process.env.PORT = 3000
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest'
}

