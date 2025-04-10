const status = require('http-status');
const Offer = require('../models/offer.js');
const userModel = require('../models/user.js');
const postModel = require('../models/post.js');

const jws = require('jws');
require('mandatoryenv').load(['TOKENSECRET']);
const { TOKENSECRET } = process.env;

async function getUserInfo(req){
    if (!req.headers || !req.headers.hasOwnProperty('x-access-token'))
        throw {code: 403, message: 'Token missing'};
    let token = req.headers['x-access-token'];
    if (!jws.verify(req.headers['x-access-token'],'HS256',TOKENSECRET))
        throw {code: 403, message: 'Token invalid'};
    const decodedToken = jws.decode(token);
    const userEmail = decodedToken.payload;
    const user = await userModel.findOne({ where: { email: userEmail } });
    return user;
}

async function verifyToken(req) {
    let user = await getUserInfo(req);
    if (!user) throw { code: 404, message: 'User not found' };
}

module.exports = {
  async getOffersForPost(req, res) {
    try {
      const postId = req.params.id;
      const offers = await Offer.findAll({ where: { postId } });
      res.json({ status: true, message: 'List of offers for post', data: offers });
    } catch (error) {
      res.status(status.INTERNAL_SERVER_ERROR).json({ status: false, message: 'Error while fetching offers' });
    }
  },

  async createOffer(req, res) {
    try {

      let user = await getUserInfo(req);
      if (!user) throw { code: 404, message: 'User not found' };

      const postId = req.params.id;

      const { price } = req.body;

      const post = await postModel.findByPk(postId);

      if (!post) {
        return res.status(status.NOT_FOUND).json({ status: false, message: 'post not found' });
      }
      
      const offer = await Offer.create({ postId : postId, userId: user.id, price : price });
      res.json({ status: true, message: 'Offer created successfully' ,data: offer});
      
    } catch (error) {

      res.status(status.INTERNAL_SERVER_ERROR).json({ status: false, message: 'Error while creating offer, try to log in' });
    }
  },
  
  async getUserOffers(req, res) {
    try {
      await verifyToken(req);
      const user = await getUserInfo(req);
      if (!user) throw { code: 404, message: 'User not found' };
      const userOffers = await Offer.findAll({ where: { userId: user.id } });
      res.json({ status: true, message: 'User offers retrieved successfully', data: userOffers });
    } catch (error) {
      res.status(status.INTERNAL_SERVER_ERROR).json({ status: false, message: 'Error while retrieving user offers' });
    }
  },

  async acceptOrRejectOffer(req, res) {
    try {
      await verifyToken(req);
      const offerId = req.params.oid;
      const { choice } = req.body; // 'accepted' or 'rejected'
      const offer = await Offer.findByPk(offerId);
      if (!offer) {
        return res.status(status.NOT_FOUND).json({ status: false, message: 'Offer not found' });
      }
      if (choice !== 'accepted' && choice !== 'rejected') {
        return res.status(status.BAD_REQUEST).json({ status: false, message: 'Invalid choice' });
      }
      offer.status = choice;
      await offer.save();
      res.json({ status: true, message: 'Offer status updated successfully', data: offer });
    } catch (error) {
      res.status(status.INTERNAL_SERVER_ERROR).json({ status: false, message: 'Error while updating offer status' });
    }
  },

  async cancelOffer(req, res) {
    try {
      await verifyToken(req);
      const offerId = req.params.oid;
      const offer = await Offer.findByPk(offerId);
      if (!offer) {
        return res.status(status.NOT_FOUND).json({ status: false, message: 'Offer not found' });
      }
      await offer.destroy();
      res.json({ status: true, message: 'Offer cancelled successfully' });
    } catch (error) {
      res.status(status.INTERNAL_SERVER_ERROR).json({ status: false, message: 'Error while cancelling offer' });
    }
  },
};
