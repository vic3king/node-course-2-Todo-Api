//import crypto hashing model
const { SHA256 } = require('crypto-js')

//use jwt
const jwt = require('jsonwebtoken')

//load in bcrypt
const bcrypt = require('bcryptjs')

let password = '123abc'

//hash using bcrypt, salt it first, then hash 
// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash)
//   })
// })

let hashedPassword = '$2a$10$gN1b.0ZycXl8sgl2beeT3.wDeKvTIUOk4N4cuu1nE10rJXaDTkXGu'

//compare the hashed value with the plain text
bcrypt.compare(password, hashedPassword, (err, res) => {
console.log(res)
})

// let data = {
//   id: 10
// }
//takes the object(user id) and signs it(hashing & salting)
// let token = jwt.sign(data, '123abc')
// console.log(token)

//takes the object(toke and secret) and makes sure it was not manipulated it(salting)
// const decoded = jwt.verify(token, '123abc')
// console.log('decoded', decoded)


//to hash a variable we create the variable and pass it into a d sha function
// const message = 'i am user number 3'
// const hash = SHA256(message).toString()

// console.log(`Message: ${message}`)
// console.log(`Hash: ${hash}`)

// let data = {
//   id: 4
// }

// let token = {
//   data,
//hash value of the data
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// } 

// token.data.id = 5
// token.hash = SHA256(JSON.stringify(token.data)).toString()

// let resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString()

// if(resultHash === token.hash) {
//   console.log('Data was not changed')
// } else {
//   console.log('Data was changed. Do not trust')
// }