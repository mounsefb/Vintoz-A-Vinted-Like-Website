const status = require('http-status')
const userModel = require('../models/user.js')
const postModel = require('../models/post.js')
const favoriteModel = require('../models/favorite.js')
const has = require('has-keys')
const CodeError = require('../util/CodeError.js')
const bcrypt = require('bcrypt')
const jws = require('jws')
const Sequelize = require('sequelize')
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

    async addItem(req, res) {
      try {
        let user = await getUserInfo(req);
        if (!user) throw { code: 404, message: 'User not found' };
        // if (!has(req.body, 'content')) throw new CodeError('Content is required', status.BAD_REQUEST);
        // const { content } = req.body;
        if (!req.body.title || !req.body.description|| !req.body.price){
            throw new CodeError('You must specify the title, the descriptin and price of article', status.BAD_REQUEST)
        }
        const { title, description, price } = req.body;
        const postImage = req.file.path.split('frontend/')[1];
        let response = await postModel.findOne({comment : "verify if the item isn't already existing in the db", where :{ title: title, description : description, price : price, ownerId: user.id }});
        if (response) throw new CodeError('You alrealdy have created this item', status.BAD_REQUEST)
        // console.log({ postImage, title, description, price, ownerId: user.id });
        await postModel.create({ postImage, title, description, price, ownerId: user.id });
        res.json({ status: true, message: 'Item added successfully' });
      } catch (error) {
        res.status(error.code).json({ status: false, message: error.message });
      }
    },

    async deleteItem (req, res) {
        // TODO : verify if the token is valid and correspond to an admin
        // #swagger.tags = ['Users']
        // #swagger.summary = 'Delete User'
        try {
            let user = await getUserInfo(req);
            if (!user) throw { code: 404, message: 'User not found' };

            const { id } = req.params
            // verify the ownership

            let response = await postModel.findOne({comment : "verify if owner", where : { id : id}})
            if (!response) {
                //else verify if user is an admin
                throw new CodeError('This item doesn\'t exist', status.BAD_REQUEST)
            }
            else if(response.ownerId != user.id){
                if (!user.isAdmin) throw {code: 403, message: 'You\'re not an admin'}
            }
            await postModel.destroy({ where: { id } })
            res.json({ status: true, message: 'Item deleted' })
        } catch (error) {
            res.status(error.code).json({ status: false, message: error.message });
        }
    },

    async updateItem (req, res) {
        // TODO : verify if the token is valid and correspond to an admin
        // #swagger.tags = ['Users']
        // #swagger.summary = 'Mettre à jour les informations de l utilisateur (réservé à un utilisateur administrateur)'
        // #swagger.parameters['obj'] = { in: 'body', schema: { $name: 'John Doe', $email: 'John.Doe@acme.com', $password: '1m02P@SsF0rt!' }}
    
        try {
            // console.log(req.body)

            await verifyToken(req);
            const post = await postModel.findOne({ where: { id: req.params.id } });
            if (!post) throw { code: 404, message: 'Post not found' };    
            let user = await getUserInfo(req);
            if(post.ownerId != user.id){
                throw { code: 404, message: 'This post doesn\'t belongs to you'};
            }
            // console.log(req.body)
            const postModified = {}
            for (const field of ['title', 'description', 'price']) {
                if (req.body[field] !== "" && req.body[field] !== undefined) {
                    // console.log(field + " modifié" + req.body[field])
                    postModified[field] = req.body[field]
                }
            }
            // console.log("au tour du fichier")

            if(req.file){
                // console.log(req.file.path)
                postModified['postImage'] = req.file.path.split('frontend/')[1];;
            }

            // console.log("fichier fini")
            if (Object.keys(postModified).length === 0) throw new CodeError('You must specify the new title, desciption or price', status.BAD_REQUEST)
            await postModel.update(postModified, { where: { id: req.params.id } })

            res.json({ status: true, message: 'Post updated' })
        } catch (error) {
            res.status(error.code).json({ status: false, message: error.message });
        }
    },

    async getAllItems(req, res) {
        let data = await postModel.findAll({
            attributes: ['id', 'postImage', 'title', 'description', 'price'],
            include: [{
                model: userModel,
                attributes: ['name', 'profilePic'],
                // where: { id: Sequelize.col('posts.ownerId') },
            }]
        });
        res.json({ status: true, message: 'Returning posts', data });
    },

    async getItem(req, res) {
        const { id } = req.params;

        const item = await postModel.findByPk(id, {
            attributes: ['id', 'postImage', 'title', 'description', 'price', 'postImage'],
            include: [{
                model: userModel,
                attributes: ['name','profilePic','id'],
            }]
        });

        if (item) {
            res.json({ status: true, message: 'Returning item details', data: item });
        } else {
            res.status(404).json({ status: false, message: 'Item not found' });
        }
    },
    

    async getMyItems(req, res){
        try {
            let user = await getUserInfo(req);
            let data = await postModel.findAll({
                attributes: ['id', 'postImage', 'title', 'description', 'price'],
                where : {ownerId : user.id},
            });
            res.json({ status: true, message: 'Returning user posts', data });
        } catch (error) {
            res.status(error.code).json({ status: false, message: error.message });
        }
    }
  }


