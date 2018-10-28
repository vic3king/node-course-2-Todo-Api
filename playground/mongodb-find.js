//load in mongoClient which helps you connect to the server and issue commands related to the database
// const mongoClient = require('mongodb').MongoClient

//using es6 destructuring to pull out a property of an object and save it to a variable
const { MongoClient, ObjectID } = require('mongodb')


//call mongoClient and load in url and callback
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  //handle error case
  if (err) {
    console.log('Unable to connect to MongoDb server')
  } else {
    console.log('Connected to MongoDb server')
  }

  //acessing the database, fetch,convert to array(returns a promise and the print it to the screen using a callback)
  // db.collection('Todos').find().toArray().then((docs) => {
  //   console.log('Todos')
  //   console.log(JSON.stringify(docs, undefined, 2))
  // }, (err) => {
  //   console.log('Unable to fetch todos', err)
  // })

  //query by a specific value
  // db.collection('Todos').find({
  //   _id: new ObjectID("5bd58e690ecbc91a248523e7")
  // }).toArray().then((docs) => {
  //   console.log('Todos')
  //   console.log(JSON.stringify(docs, undefined, 2))
  // }, (err) => {
  //   console.log('Unable to fetch todos', err)
  // })

  //using other methods available to find(count)
  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`Todos count:${count}`)
  
  // }, (err) => {
  //   console.log('Unable to fetch todos', err)
  // })

  //query for a specific name in a db(challenge) 
  db.collection('User').find({name: 'Akaniru victory'}).toArray().then((docs) => {
    console.log('Todos')
    console.log(JSON.stringify(docs, undefined, 2))
  }).catch((err) => {
    console.log('Unable to fetch', err)
  });
  //closes the connection with the mongodb server
  // db.close()
})