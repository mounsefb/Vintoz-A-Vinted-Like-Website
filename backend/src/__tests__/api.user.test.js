const app = require('../app')
const request = require('supertest');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
let tokenAdmin;
let validTokenForUnknownUser = "eyJhbGciOiJIUzI1NiJ9.bW91bnNlZi5ib3VoYXJAZ21haWwuY29t.uh8rSjVpH5vHPtYrc8w3G3NA8XJvJOaWtHsQoJf5K-w";
let falseToken = "eyJhbGciOiJIUzI1NiJ9.bW91bnNlZi5ib3VoYXJAZ21haWwuY29t.uh8rSjVpH5vHPtYrc8w3G3NA8XJvJOaWtHsQoJf5K-x"
let tokenNonAdmin;



test('Test if user can log in and list users', async () => {
  let response = await request(app)
    .post('/login')
    .send({ email: 'utilisateur1@exemple.com', password: '123456' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('userInfo')
  response = await request(app)
    .get('/api/users')
    .set('x-access-token', response.body.userInfo["token"])
  expect(response.statusCode).toBe(200)
  expect(response.body.message).toBe('Returning users')
  expect(response.body.data.length).toBeGreaterThan(0)
})

test('Test if user can log in', async () => {
  let response = await request(app)
    .post('/login')
    .send({ email: 'utilisateur1@exemple.com', password: '123456' })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('userInfo')
  expect(response.body.message).toBe('Login/Password ok')
  tokenAdmin = response.body.userInfo["token"];
})

test('Test if user can\'t log in without specifying email or password', async () => {
  let response = await request(app)
    .post('/login')
    .send({ password: '12356' })
  expect(response.statusCode).toBe(400)
  expect(response.body.message).toBe('You must specify the email and password')
})

test('Test if user can\'t log in with a wrong email or password', async () => {
  let response = await request(app)
    .post('/login')
    .send({ email: 'Sebastien.Viardot@grenoble-inp.fr', password: '12356' })
  expect(response.statusCode).toBe(403)
  expect(response.body.message).toBe('Wrong email/password')
})

test('Test if user can sign in USER', async () => {
  const formData = new FormData();
  formData.append('email', 'hachim.leh@grenoble-inp.fr');
  formData.append('password', 'StrongPassword1234!');
  formData.append('name', 'hachimLeH');

  const filePath = path.join(__dirname, './test_image.jpg'); // Chemin vers votre image
  formData.append('image', fs.createReadStream(filePath));
  // console.log(formData);
  let response = await request(app)
    .post('/api/users')
    .field('email', 'hachim.leh@grenoble-inp.fr')
    .field('password', 'StrongPassword1234!')
    .field('name', 'hachimLeH')
    .attach('image', fs.createReadStream(path.join(__dirname, './test_image.jpg')))
  expect(response.status).toBe(200);
  expect(response.body.message).toBe('User Added');

  // Envoi de la requête de connexion
  response = await request(app)
    .post('/login')
    .send({ email: 'hachim.leh@grenoble-inp.fr', password: 'StrongPassword1234!' });

  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty('userInfo');
  expect(response.body.message).toBe('Login/Password ok');
  tokenNonAdmin = response.body.userInfo["token"];
  // console.log(tokenNonAdmin, response.body)
});

test('Test if user can list users', async () => {
  let response = await request(app)
    .get('/api/users')
    .set('x-access-token', tokenAdmin)
  expect(response.statusCode).toBe(200)
  expect(response.body.message).toBe('Returning users')
  expect(response.body.data.length).toBeGreaterThan(0)
})

// test('Test if user can access user list without signing in', async () => {
//   const response = await request(app)
//     .get('/api/users')
//     .set('x-access-token', validTokenForUnknownUser);
//   expect(response.statusCode).toBe(404);
//   expect(response.body.message).toBe('User not found');
// });

test('Test if user can access user list with an invalid token', async () => {
  const response = await request(app)
    .get('/api/users')
    .set('x-access-token', falseToken);
  expect(response.statusCode).toBe(403);
  expect(response.body.message).toBe('Token invalid');
});

test('Test if user can access user list without token', async () => {
  const response = await request(app)
    .get('/api/users')
  expect(response.statusCode).toBe(403);
  expect(response.body.message).toBe('Token missing');
});

test('Test if user can update his password', async () => {
  let response = await request(app)
    .put('/api/password')
    .set('x-access-token', tokenAdmin)
    .send({ password: 'StrongPassword1234!' })
  expect(response.statusCode).toBe(200)
  expect(response.body.message).toBe('Password updated')
})

test('Test if user can update his password with a weak password', async () => {
  let response = await request(app)
    .put('/api/password')
    .set('x-access-token', tokenAdmin)
    .send({ password: '123456' })
  expect(response.statusCode).toBe(400)
  expect(response.body.message).toBe('Weak password!')
})

test('Test if user can update his password with a weak password', async () => {
  let response = await request(app)
    .put('/api/password')
    .set('x-access-token', tokenAdmin)
    .send({ password: '123456' })
  expect(response.statusCode).toBe(400)
  expect(response.body.message).toBe('Weak password!')
})

test('Test if user can update his password without specifying the password', async () => {
  let response = await request(app)
    .put('/api/password')
    .set('x-access-token', tokenAdmin)
  expect(response.statusCode).toBe(400)
  expect(response.body.message).toBe('You must specify the new password')
})

test('Test if non-admin can update an user', async () => {
  // console.log(tokenNonAdmin)
  let response = await request(app)
    .put('/api/users/2')
    .set('x-access-token', tokenNonAdmin)
    .send({ name: 'Hachhchc' })
  expect(response.statusCode).toBe(403)
  expect(response.body.message).toBe('You\'re not an admin')
})

test('Test if admin can update an user', async () => {
  let response = await request(app)
    .put('/api/users/3')
    .set('x-access-token', tokenAdmin)
    .send({ name: 'Hachhchc' })
  expect(response.statusCode).toBe(200)
  expect(response.body.message).toBe('User updated')
})

test('Test if a non-admin can delete an user', async () => {
  let response = await request(app)
    .delete('/api/users/2')
    .set('x-access-token', tokenNonAdmin)
  expect(response.statusCode).toBe(403)
  expect(response.body.message).toBe('You\'re not an admin')
})

test('Test if admin can delete an user', async () => {
  let response = await request(app)
    .delete('/api/users/2')
    .set('x-access-token', tokenAdmin)
  expect(response.statusCode).toBe(200)
  expect(response.body.message).toBe('User deleted')
})

