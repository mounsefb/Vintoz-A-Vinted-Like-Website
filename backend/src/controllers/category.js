const status = require('http-status');
const userModel = require('../models/user.js');
const postModel = require('../models/post.js');
const categoryModel = require('../models/category.js')
const categoryPostModel = require('../models/category_post.js')
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

module.exports = {
    async addCategory(req, res) {
        let user = await getUserInfo(req);
        if (!user) throw { code: 404, message: 'User not found' };
        if (!user.isAdmin) throw {code: 403, message: 'You\'re not an admin'}
        console.log(req.body)
        let existingCategory = await categoryModel.findOne({ where: { name : req.body.name} });
        if (existingCategory) throw new CodeError('This category is already existing', status.BAD_REQUEST);
        
        await categoryModel.create({name : req.body.name});
        res.json({ status: true, message: 'Category added successfully' });
    },
  
    async listCategory(req, res) {
            const categories = await categoryModel.findAll({attributes : ['name']});
            res.json({ status: true, message: 'Returning categories', data: categories });
    },

    async listCategoryPost(req, res) {
        // try{
            // if (!req.params || !req.params.cateId) throw new CodeError('Categorie ID is required', status.BAD_REQUEST);
            // const category = await categoryModel.findAll({attributes : 'name', where : { id: req.params.cateID }});
            const postIDs = await categoryPostModel.findAll({attributes : ['postId'], where : { categoryId : req.params.cateId}})
            const posts = Array();
            for (const elt of postIDs){
                posts.push(await postModel.findOne({attributes : ['id', 'title', 'description', 'price'], where : {id : elt['postId']}}));
            }
            res.json({ status: true, message: 'Returning category post', data: posts });
        // } catch(error){
            // res.status(error.code || 500).json({ status: false, message: error.message });
        // }
    },

    async removeCategory(req, res) {
        try {
            let user = await getUserInfo(req);
            if (!user) throw { code: 404, message: 'User not found' };
            if (!user.isAdmin) throw {code: 403, message: 'You\'re not an admin'}
            if (!req.params || !req.params.cateId) throw new CodeError('Category ID is required', status.BAD_REQUEST);
            
            let cateId = req.params.cateId;
                        
            const category = await categoryModel.findOne({ where: { id : cateId } });
            if (!category) throw new CodeError('This category doesn\'t exist', status.BAD_REQUEST);
            
            await category.destroy();
            res.json({ status: true, message: 'Category removed successfully' });
        } catch (error) {
            res.status(error.code || 500).json({ status: false, message: error.message });
        }
    }
};
