const app = require('../app')
const request = require('supertest');
let token;
let falseToken = "eyJhbGciOiJIUzI1NiJ9.bW91bnNlZi5ib3VoYXJAZ21haWwuY29t.uh8rSjVpH5vHPtYrc8w3G3NA8XJvJOaWtHsQoJf5K-x"
let validTokenForUnknownUser = "eyJhbGciOiJIUzI1NiJ9.bW91bnNlZi5ib3VoYXJAZ21haWwuY29t.uh8rSjVpH5vHPtYrc8w3G3NA8XJvJOaWtHsQoJf5K-w";


test('Test if user can log in', async () => {
    let response = await request(app)
      .post('/login')
      .send({ email: 'Sebastien.Viardot@grenoble-inp.fr', password: '123456' })
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('userInfo')
    expect(response.body.message).toBe('Login/Password ok')
    token = response.body.userInfo["token"];
  })
  
test('Test if user can list message of a group', async () => {
    let response = await request(app)
      .get('/api/messages/1')
      .set('x-access-token', token)
    expect(response.status).toBe(200)
    expect(response.body.messages.length).toBe(1)
})

test('Test if user post a message on a group', async () => {
    let response = await request(app)
      .post('/api/messages/1')
      .set('x-access-token', token)
      .send({content : 'et je suis plutot vieux'})
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Message added successfully')
})

test('Test if user can list message of a group with an invalid token', async () => {
    let response = await request(app)
      .get('/api/messages/1')
      .set('x-access-token', falseToken)
    expect(response.statusCode).toBe(403)
  expect(response.body.message).toBe('Token invalid');
})

test('Test if user can list message of a group without a token', async () => {
    let response = await request(app)
      .get('/api/messages/1')
    expect(response.statusCode).toBe(403)
  expect(response.body.message).toBe('Token missing');
})


test('Test if user post a message on a group without a token', async () => {
    let response = await request(app)
      .post('/api/messages/1')
      .send({content : 'et je suis plutot vieux'})
    expect(response.statusCode).toBe(403)
    expect(response.body.message).toBe('Token missing');
})