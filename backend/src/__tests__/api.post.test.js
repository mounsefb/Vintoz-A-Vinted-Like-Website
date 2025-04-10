const app = require('../app')
const request = require('supertest');
const fs = require('fs');
const path = require('path');
let tokenAdmin;
let validTokenForUnknownUser = "eyJhbGciOiJIUzI1NiJ9.bW91bnNlZi5ib3VoYXJAZ21haWwuY29t.uh8rSjVpH5vHPtYrc8w3G3NA8XJvJOaWtHsQoJf5K-w";
let falseToken = "eyJhbGciOiJIUzI1NiJ9.bW91bnNlZi5ib3VoYXJAZ21haWwuY29t.uh8rSjVpH5vHPtYrc8w3G3NA8XJvJOaWtHsQoJf5K-x"
let tokenNonAdmin;

test('Test if user can log in', async () => {
    let response = await request(app)
      .post('/login')
      .send({ email: 'Sebastien.Viardot@grenoble-inp.fr', password: '123456' })
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('userInfo')
    expect(response.body.message).toBe('Login/Password ok')
    tokenAdmin = response.body.userInfo["token"];
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
  

// test('', async () => {
    
//   })

test('Test if any type of user can list all items', async () => {
    let response = await request(app)
        .get('/api/items') 
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('data')
    expect(response.body.message).toBe('Returning posts')
})

test('Test if any type of user can list item detail', async () => {
    let response = await request(app)
        .get('/api/items/1') 
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('data')
    expect(response.body.message).toBe('Returning item details')
})

test('Test if any type of user can\'t list item detail of non-existant item', async () => {
    let response = await request(app)
        .get('/api/items/0') 
    expect(response.statusCode).toBe(404)
    expect(response.body.message).toBe('Item not found')
})


test('Test if registered user can list his items', async () => {
    let response = await request(app)
        .get('/api/myitems')
        .set('x-access-token', tokenAdmin) 
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('data')
    expect(response.body.message).toBe('Returning user posts')
})

test('Test if registered user can list his items', async () => {
    let response = await request(app)
        .get('/api/myitems')
        .set('x-access-token', tokenAdmin) 
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('data')
    expect(response.body.message).toBe('Returning user posts')
})

test('Test if non registered user can list his items', async () => {
    let response = await request(app)
        .get('/api/myitems')
    expect(response.statusCode).toBe(403)
    expect(response.body.message).toBe('Token missing')
})

test('Test if wrong user can list his items', async () => {
    let response = await request(app)
        .get('/api/myitems')
        .set('x-access-token', falseToken)
    expect(response.statusCode).toBe(403)
    expect(response.body.message).toBe('Token invalid')
})

test('Test if user can create a post', async () => {
    let response = await request(app)
      .post('/api/myitems')
      .set('x-access-token', tokenAdmin) 
      .field('title', 'Titre test')
      .field('description', 'Description test')
      .field('price', '100')
      .attach('image', fs.createReadStream(path.join(__dirname, './test_image.jpg')))
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Item added successfully');
})

test('Test if user can create a double post', async () => {
    let response = await request(app)
      .post('/api/myitems')
      .set('x-access-token', tokenAdmin) 
      .field('title', 'Titre test')
      .field('description', 'Description test')
      .field('price', '100')
      .attach('image', fs.createReadStream(path.join(__dirname, './test_image.jpg')))
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('You alrealdy have created this item');
})

test('Test if user can create a post lacking argument', async () => {
    let response = await request(app)
      .post('/api/myitems')
      .set('x-access-token', tokenAdmin) 
      .field('description', 'Description test')
      .field('price', '100')
      .attach('image', fs.createReadStream(path.join(__dirname, './test_image.jpg')))
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('You must specify the title, the descriptin and price of article');
})

test('Test if user can delete an article', async () => {
    let response = await request(app)
      .delete('/api/items/10')
      .set('x-access-token', tokenAdmin) 
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Item deleted');
})

test('Test if user can delete an article', async () => {
    let response = await request(app)
        .delete('/api/items/0')
        .set('x-access-token', tokenAdmin) 
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('This item doesn\'t exist');
})

test('Test if user can delete an article', async () => {
    let response = await request(app)
        .delete('/api/items/2')
        .set('x-access-token', tokenNonAdmin) 
    expect(response.status).toBe(403);
    expect(response.body.message).toBe('You\'re not an admin');
})

test('Test if user can update an article', async () => {
    let response = await request(app)
        .put('/api/myitems/1')
        .set('x-access-token', tokenAdmin) 
        .field('description', 'Description test')
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Post updated');
})

test('Test if user can update a non-existant article', async () => {
    let response = await request(app)
        .put('/api/myitems/0')
        .set('x-access-token', tokenAdmin) 
        .field('description', 'Description test')
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Post not found');

})

test('Test if user can update a article from another user', async () => {
    let response = await request(app)
        .put('/api/myitems/11')
        .set('x-access-token', tokenAdmin) 
        .field('description', 'Description test')
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('This post doesn\'t belongs to you');  
})