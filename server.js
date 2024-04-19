const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const knex = require('knex');

const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')

const db = knex({
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
});

console.log('Database connection details:');
console.log('Host:', process.env.DB_HOST);
console.log('Port:', process.env.DB_PORT);
console.log('User:', process.env.DB_USER);
console.log('Password:', process.env.DB_PASSWORD);
console.log('Database:', process.env.DB_NAME);




const app = express();

app.use(bodyParser.json());
app.use(cors())

app.get('/', (req,res) => {
    res.send('success');
})

app.post('/signin', (req,res) => {signin.handleSignin(req,res,db,bcrypt)});

app.post('/register', (req,res) => {register.handleRegister(req,res,db,bcrypt)})

app.get('/profile/:id', (req,res) => {profile.handleProfileGet(req,res,db)})

app.put('/image', (req,res) => image.handleImage(req,res,db))

app.post('/imageurl', (req,res) => image.handleApiCall(req,res))



const PORT = process.env.DB_PORTPORT || 3000;

app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`)
})

