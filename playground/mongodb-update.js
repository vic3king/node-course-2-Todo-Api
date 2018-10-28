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

  //update a document in the db findoneandupdate method take in four arguments(filter,update(mongodb update operators),options,callback )
  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID("5bd5a2630ecbc91a24852911")
  // }, {
  //     $set: {
  //       completed: true
  //     }
  //   }, {
  //     returnOriginal: false
  //   }).then((result) => {
  //     console.log(result)
  //   }).catch((err) => {

  //   });
  //update challenge
  db.collection('User').findOneAndUpdate({
    //select array to be updated by id
    _id: new ObjectID("5bce41a6441104155863e22e")
  }, {
    //change a property
      $set: {
        name: 'Akaniru Victory'
      },
      //increase anumber value
      $inc: {
        age: + 1
      }
    }, {
      //returns updated array when set to false
      returnOriginal: false
    }).then((result) => {
      console.log(result)
    }).catch((err) => {

    });

  //closes the connection with the mongodb server
  // db.close()
})