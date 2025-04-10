const request = require('supertest');
const app = require('../app');

let tokenAdmin;

test('Log in',async () => {
  // Connectez-vous en tant qu'administrateur pour obtenir un token valide
  let response = await request(app)
    .post('/login')
    .send({ email: 'Sebastien.Viardot@grenoble-inp.fr', password: '123456' });
  tokenAdmin = response.body.userInfo.token;
});

test('Get offers for a post', async () => {
  let response = await request(app)
    .get('/api/items/1/offers')
    .set('x-access-token', tokenAdmin);
  expect(response.statusCode).toBe(200);
  expect(response.body.status).toBe(true);
  expect(response.body.message).toBe('List of offers for post');
  // Vous pouvez ajouter d'autres assertions pour vérifier le contenu de la réponse
});

test('Create an offer', async () => {
  let response = await request(app)
    .post('/api/items/15/offers')
    .set('x-access-token', tokenAdmin)
    .send({ price: 100 }); // Remplacez par le prix approprié
  expect(response.statusCode).toBe(200);
  expect(response.body.status).toBe(true);
  expect(response.body.message).toBe('Offer created successfully');
  // Vous pouvez ajouter d'autres assertions pour vérifier le contenu de la réponse
});

test('Get user offers', async () => {
  let response = await request(app)
    .get('/api/myoffers')
    .set('x-access-token', tokenAdmin);
  expect(response.statusCode).toBe(200);
  expect(response.body.status).toBe(true);
  expect(response.body.message).toBe('User offers retrieved successfully');
  // Vous pouvez ajouter d'autres assertions pour vérifier le contenu de la réponse
});

test('Accept or reject an offer', async () => {
  let response = await request(app)
    .put('/api/myoffers/1')
    .set('x-access-token', tokenAdmin)
    .send({ choice: 'accepted' }); // Remplacez par 'accepted' ou 'rejected'
  expect(response.statusCode).toBe(200);
  expect(response.body.status).toBe(true);
  expect(response.body.message).toBe('Offer status updated successfully');
  // Vous pouvez ajouter d'autres assertions pour vérifier le contenu de la réponse
});

test('Cancel an offer', async () => {
  let response = await request(app)
    .delete('/api/myoffers/1')
    .set('x-access-token', tokenAdmin);
  expect(response.statusCode).toBe(200);
  expect(response.body.status).toBe(true);
  expect(response.body.message).toBe('Offer cancelled successfully');
});
