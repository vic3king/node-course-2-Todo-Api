//load in mongoClient which helps you connect to the server and issue commands related to the database
// const mongoClient = require('mongodb').MongoClient

//using es6 destructuring to pull out a property of an object and save it to a variable
const {MongoClient, ObjectID} = require('mongodb')

// //new objectid 
// const obj = new ObjectID()
// console.log(obj)

//call mongoClient and load in url and callback
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  //handle error case
  if(err) {
    console.log('Unable to connect to MongoDb server')
  } else {
    console.log('Connected to MongoDb server')
  }

  //inserting records into the db
  db.collection('Todos').insertOne({
    text: 'Do something',
    completed: false
  }, (err, result) => {
    //error handling
       if(err) {
       console.log('Unable to insert todo', err)
       } else {
         //saving to db using pretty printing and .ops property
        console.log(JSON.stringify(result.ops, undefined, 2))
       }
  })

  //challenge add User collection to the db
  db.collection('User').insertOne({
    name: 'Akaniru victory',
    age: 25,
    location: 'no 1 city of power avenue off pedro road, palmgroove lagos'

  }, (err, result) => {
    if (err) {
      console.log('Unable to insert User', err)
    } else {
      //the ops attribute called on result stores all the docs inserted(insertOne)
      // console.log(JSON.stringify(result.ops, undefined, 2))
      //to pull out the parts of the unique id(timestamp)
      console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2))
    }
  })


  //closes the connection with the mongodb server
  db.close()
})