const express = require('express');
const router = express.Router();
const offer = require('../controllers/offers.js');



router.get('/api/items/:id/offers', offer.getOffersForPost);
router.post('/api/items/:id/offers', offer.createOffer);

router.get('/api/myoffers', offer.getUserOffers);
router.put('/api/myoffers/:oid', offer.acceptOrRejectOffer);
router.delete('/api/myoffers/:oid', offer.cancelOffer);


module.exports = router;
