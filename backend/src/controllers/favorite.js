const status = require('http-status');
const favoriteModel = require('../models/favorite.js');
const userModel = require('../models/user.js');
const postModel = require('../models/post.js');
const has = require('has-keys')
const CodeError = require('../util/CodeError.js')
const jws = require('jws')
require('mandatoryenv').load(['TOKENSECRET'])
const { TOKENSECRET } = process.env

async function getUserInfo(req){
    if (!req.headers || !req.headers.hasOwnProperty('x-access-token'))
        throw {code: 403, message: 'Token missing'}
    let token = req.headers['x-access-token'];
    if (!jws.verify(req.headers['x-access-token'],'HS256',TOKENSECRET))
        throw {code: 403, message: 'Token invalid'}
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
async addFavorite(req, res) {
    try {
        await verifyToken(req);
        if (!req.params || !req.params.postId) throw new CodeError('Post ID is required', status.BAD_REQUEST);
            
        let postId = req.params.postId;

        let user = await getUserInfo(req);

        let existingFavorite = await favoriteModel.findOne({ where: { memberId: user.id, postId: postId } });
        if (existingFavorite) throw new CodeError('This post is already in your favorites', status.BAD_REQUEST);
        
        await favoriteModel.create({ memberId: user.id, postId: postId });
        res.json({ status: true, message: 'Post added to favorites' });
    } catch (error) {
      res.status(error.code || 500).json({ status: false, message: error.message });
    }
  },
  
  async listFavorites(req, res) {
    try {
        await verifyToken(req);


        let user = await getUserInfo(req);

        const favorites = await favoriteModel.findAll({ where: { memberId: user.id }, include: [{ model: postModel }] });
        res.json({ status: true, message: 'Returning favorites', data: favorites });
    } catch (error) {
        res.status(error.code || 500).json({ status: false, message: error.message });
    }
  },
  
  async removeFavorite(req, res) {
    try {
        await verifyToken(req);

        if (!req.params || !req.params.postId) throw new CodeError('Post ID is required', status.BAD_REQUEST);
        
        let postId = req.params.postId;
        
        let user = await getUserInfo(req);
        
        const favorite = await favoriteModel.findOne({ where: { memberId: user.id, postId: postId } });
        if (!favorite) throw new CodeError('This post is not in your favorites', status.BAD_REQUEST);
        
        await favorite.destroy();
        res.json({ status: true, message: 'Post removed from favorites' });
    } catch (error) {
        res.status(error.code || 500).json({ status: false, message: error.message });
    }
  }
};
