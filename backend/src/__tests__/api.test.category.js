const app = require('../app')
const request = require('supertest');
let token;
let tokenNonAdmin;
let validTokenForUnknownUser = "eyJhbGciOiJIUzI1NiJ9.bW91bnNlZi5ib3VoYXJAZ21haWwuY29t.uh8rSjVpH5vHPtYrc8w3G3NA8XJvJOaWtHsQoJf5K-w";
let falseToken = "eyJhbGciOiJIUzI1NiJ9.bW91bnNlZi5ib3VoYXJAZ21haWwuY29t.uh8rSjVpH5vHPtYrc8w3G3NA8XJvJOaWtHsQoJf5K-x"

test('Test if user can log in', async () => {
    let response = await request(app)
      .post('/login')
      .send({ email: 'Sebastien.Viardot@grenoble-inp.fr', password: '123456' })
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('userInfo')
    expect(response.body.message).toBe('Login/Password ok')
    token = response.body.userInfo["token"];
  })

  test('Test if user can log in non admin', async () => {
    let response = await request(app)
      .post('/login')
      .send({ email: 'utilisateur1@exemple.com', password: '123456' })
    expect(response.statusCode).toBe(403)
    expect(response.body).toHaveProperty('userInfo')
    expect(response.body.message).toBe('Login/Password ok')
    tokenNonAdmin = response.body.userInfo["token"];
  })

test('Test if user can access categories', async () => {
    let response = await request(app)
      .get('/api/categories')
      .set('x-access-token', token)
    expect(response.statusCode).toBe(200)
    expect(response.body.message).toBe('Returning categories')
})

test('Test if user can access category posts', async () => {
    let response = await request(app)
      .get('/api/categories/1')
      .set('x-access-token', token)
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('data')
    expect(response.body.message).toBe('Returning category post')
})

test('Test if admin can delete category' , async () => {
    let response = await request(app)
      .delete('/api/categories/1')
      .set('x-access-token', token)
    expect(response.statusCode).toBe(200)
    expect(response.body.message).toBe('Category removed successfully')
})

test('Test if user can delete category', async () => {
    let response = await request(app)
      .delete('/api/categories/1')
      .set('x-access-token', tokenNonAdmin)
    expect(response.statusCode).toBe(403)
    expect(response.body.message).toBe('You\'re not an admin')
})

test('Test if user can delete category', async () => {
    let response = await request(app)
      .delete('/api/categories/1')
      .set('x-access-token', validTokenForUnknownUser)
    expect(response.statusCode).toBe(404)
    expect(response.body.message).toBe('User not found')
})

test('Test if unregistered user can delete categories', async () => {
    let response = await request(app)
        .delete('/api/categories/1')
    expect(response.statusCode).toBe(403)
    expect(response.body.message).toBe('Token missing')
})

test('Test if invalid user can delete categories', async () => {
    let response = await request(app)
      .delete('/api/categories/1')
      .set('x-access-token', falseToken)
    expect(response.statusCode).toBe(403)
    expect(response.body.message).toBe('Token invalid')
})

test('Test if admin can add category', async () => {
    let response = await request(app)
      .post('/api/categories')
      .set('x-access-token', token)
      .send({ name: 'test category'})
    expect(response.statusCode).toBe(200)
    expect(response.body.message).toBe('Category added successfully')
})

test('Test if admin can double add category', async () => {
    let response = await request(app)
      .post('/api/categories')
      .set('x-access-token', token)
      .send({ name: 'test category'})
    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe('This category is already existing')
})