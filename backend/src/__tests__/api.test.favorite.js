const request = require('supertest');
const app = require('../app');

let tokenAdmin;
let tokenNonAdmin;
let validTokenForUnknownUser = "eyJhbGciOiJIUzI1NiJ9.bW91bnNlZi5ib3VoYXJAZ21haWwuY29t.uh8rSjVpH5vHPtYrc8w3G3NA8XJvJOaWtHsQoJf5K-w";
let falseToken = "eyJhbGciOiJIUzI1NiJ9.bW91bnNlZi5ib3VoYXJAZ21haWwuY29t.uh8rSjVpH5vHPtYrc8w3G3NA8XJvJOaWtHsQoJf5K-x";

test('Test if user can log in', async () => {
  let response = await request(app)
    .post('/login')
    .send({ email: 'Sebastien.Viardot@grenoble-inp.fr', password: '123456' });
  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty('userInfo');
  expect(response.body.message).toBe('Login/Password ok');
  tokenAdmin = response.body.userInfo["token"];
});

test('Test if user can log in with incorrect password', async () => {
  let response = await request(app)
    .post('/login')
    .send({ email: 'Sebastien.Viardot@grenoble-inp.fr', password: 'incorrect_password' });
  expect(response.statusCode).toBe(403);
  expect(response.body.message).toBe('Wrong email/password');
});

test('Test if user can log in with unknown email', async () => {
  let response = await request(app)
    .post('/login')
    .send({ email: 'unknown_email@example.com', password: '123456' });
  expect(response.statusCode).toBe(403);
  expect(response.body.message).toBe('Wrong email/password');
});

test('Test if user can log in with missing credentials', async () => {
  let response = await request(app)
    .post('/login')
    .send({});
  expect(response.statusCode).toBe(400);
  expect(response.body.message).toBe('You must specify the email and password');
});


test('Add a favorite', async () => {
    let response = await request(app)
      .post('/api/myfavorites/10')
      .set('x-access-token', tokenAdmin);
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe('Post added to favorites');
  });
  
  test('List favorites', async () => {
    let response = await request(app)
      .get('/api/myfavorites')
      .set('x-access-token', tokenAdmin);
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe('Returning favorites');
    // Vous pouvez ajouter d'autres assertions pour vérifier le contenu de la réponse
  });
  
  test('Remove a favorite', async () => {
    let response = await request(app)
      .delete('/api/myfavorites/10')
      .set('x-access-token', tokenAdmin);
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe('Post removed from favorites');
  });