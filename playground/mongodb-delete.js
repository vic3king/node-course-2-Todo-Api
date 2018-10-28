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

  //deleting data from db, deleteMany
  // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
  //   console.log(result)
  // }).catch((err) => {
  //   console.log('Unable to delete docs', err)
  // });

  //delete one
  // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
  //   console.log(result)
  // }).catch((err) => {
  //   console.log('Unable to delete docs', err)
  // });

  //find and delete
  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
  //   console.log(result)
  // }).catch((err) => {
  //   console.log('Unable to delete docs', err)
  // });


  //challenge(find and delete all documents with duplictaes from the user collection)
  // db.collection('User').deleteMany({name: 'Akaniru victory'}).then((result) => {
  //   console.log('Users', result)
  // }).catch((err) => {
  //   console.log('Unable to delete', err)
  // });

  db.collection('User').findOneAndDelete({
    _id: new ObjectID("5bd5acae0ecbc91a24852e83")
  }).then((result) => {
    console.log(result.value)
  }).catch((err) => {
    console.log('Unable to delete', err)
  });
  //closes the connection with the mongodb server
  // db.close()
})