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

test('Test if user can list his groups', async () => {
    let response = await request(app)
      .get('/api/mygroups')
      .set('x-access-token', token)
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Returning groups')
})

test('Test if user can list his groups with an invalid token', async () => {
  let response = await request(app)
    .get('/api/mygroups')
    .set('x-access-token', falseToken)
  expect(response.statusCode).toBe(403);
  expect(response.body.message).toBe('Token invalid');
})

test('Test if user can list his groups without signing in', async () => {
  const response = await request(app)
    .get('/api/mygroups')
    .set('x-access-token', validTokenForUnknownUser);
  expect(response.statusCode).toBe(404);
  expect(response.body.message).toBe('User not found');
});

test('Test if user can list his groups without specifying a token', async () => {
  let response = await request(app)
    .get('/api/mygroups')
  expect(response.statusCode).toBe(403);
  expect(response.body.message).toBe('Token missing');
})

test('Test if user can create a new group', async () => {
    let response = await request(app)
      .post('/api/mygroups')
      .set('x-access-token', token)
      .send({name : 'monnouveaugroupe'})
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Group added')
})

test('Test if user can create a new group without sign in', async () => {
  let response = await request(app)
    .post('/api/mygroups')
    .set('x-access-token', validTokenForUnknownUser)
    .send({name : 'monnouveaugroupe'});
  expect(response.statusCode).toBe(404);
  expect(response.body.message).toBe('User not found');
})

test('Test if user can\'t create a new group without a name', async () => {
    let response = await request(app)
      .post('/api/mygroups')
      .set('x-access-token', token)
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('You must specify the name for your incoming group')
})

test('Test if user can\'t create a new group with a name already existing', async () => {
    let response = await request(app)
      .post('/api/mygroups')
      .set('x-access-token', token)
      .send({name : 'ViardotGroup'})
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Group already existing, find an other name')
})

test('Test if user can access list of group member', async () => {
    let response = await request(app)
      .get('/api/mygroups/1')
      .set('x-access-token', token)
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Returning groups')
    expect(response.body.groupMembers.length).toBe(1)
})

test('Test if an user can add an other to his group', async () => {
    let response = await request(app)
      .put('/api/mygroups/1/2')
      .set('x-access-token', token)
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('User added to the group')
})

test('Test if a user can delete another from his group', async () => {
  let response = await request(app)
    .delete('/api/mygroups/1/2')
    .set('x-access-token', token)
  expect(response.status).toBe(200)
  expect(response.body.message).toBe('User successfully deleted from the group')
})

test('Test if user can access list of member groups', async () => {
    let response = await request(app)
      .get('/api/groupsmember')
      .set('x-access-token', token)
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Returning groups')
    expect(response.body.memberGroups.length).toBe(2)
})