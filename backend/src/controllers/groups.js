const status = require('http-status')
const userModel = require('../models/user.js')
const groupModel = require('../models/groups.js')
const userGroupModel = require('../models/user_group.js')

const has = require('has-keys')
const CodeError = require('../util/CodeError.js')
const bcrypt = require('bcrypt')
const jws = require('jws')
const { token } = require('morgan')
require('mandatoryenv').load(['TOKENSECRET'])
const { TOKENSECRET } = process.env

async function verifyToken(req) {
  if (!req.headers || !req.headers.hasOwnProperty('x-access-token'))
      throw {code: 403, message: 'Token missing'}
  let token = req.headers['x-access-token'];
  if (!jws.verify(req.headers['x-access-token'],'HS256',TOKENSECRET))
    throw {code: 403, message: 'Token invalid'}
  const decodedToken = jws.decode(token);
  const userEmail = decodedToken.payload;
  const user = await userModel.findOne({ where: { email: userEmail } });
  if (!user) throw { code: 404, message: 'User not found' };
}

async function verifyOwner(req, groupOwnerId) {
    let token = req.headers['x-access-token'];
    const decodedToken = jws.decode(token);
    const userEmail = decodedToken.payload;
    const user = await userModel.findOne({ where: { email: userEmail } });
    return true ? user.id === groupOwnerId : false;
}

module.exports = {
  async newGroups(req, res) {
    try {
      await verifyToken(req);
      if (!has(req.body, ['name'
      // , 'articleId'
    ])) {
        throw new CodeError('You must specify the name and articleId for your new group', status.BAD_REQUEST);
      }
      const { name
        // , articleId 
      } = req.body;
      let token = req.headers['x-access-token'];
      const decodedToken = jws.decode(token);
      const userEmail = decodedToken.payload;
      let user = await userModel.findOne({ where: { email: userEmail } });
      
      if (!user) {
        throw new CodeError('User not found', status.BAD_REQUEST);
      }

      let group = await groupModel.findOne({ where: { name: req.body['name'], ownerId: user.id } });
      if (group) {
        res.json({ status: false, message: 'Group already existing', groupId: group.id });
        return;
      }

      await groupModel.create({ name, ownerId: user.id
        // , articleId
       }); // Crée le groupe avec l'articleId
      group = await groupModel.findOne({ where: { name: req.body['name'], ownerId: user.id } });
      await userGroupModel.create({ member_id: group.ownerId, groupId: group.id });

      res.json({ status: true, message: 'Group added', groupId: group.id });
    } catch (error) {
      res.status(error.code).json({ status: false, message: error.message });
    }
  },
  async getGroups(req, res) {
    try {
      await verifyToken(req);
      const data = await groupModel.findAll({ attributes: ['id', 'name', 'ownerId'] }) // Inclut l'articleId
      const ownerGroups = [];
      for (const elt of data) {
        if (verifyOwner(req, elt["ownerId"])) ownerGroups.push(elt);
      }
      res.json({ status: true, message: 'Returning groups', ownerGroups })
    } catch (error) {
      res.status(error.code).json({ status: false, message: error.message });
    }
  },
  async listGroupMembers (req, res) {
    // TODO : verify if the token is valid and correspond to an admin
    // #swagger.tags = ['groups']
    // #swagger.summary = 'Mettre à jour les informations de l utilisateur (réservé à un utilisateur administrateur)'
    // #swagger.parameters['obj'] = { in: 'body', schema: { $name: 'John Doe', $email: 'John.Doe@acme.com', $password: '1m02P@SsF0rt!' }}

    try {
      await verifyToken(req);
      if (!has(req.params, 'gid')) throw new CodeError('You must specify the group id', status.BAD_REQUEST)

      let group = await groupModel.findOne({where : {id : req.params.gid}})
      if(!verifyOwner(req, group)) throw new CodeError('This group doesn\'t belong to you', status.NOT_FOUND);
      let members = await userGroupModel.findAll({where :  {groupId : req.params.gid}})
      let groupMembers = []
      for (const elt of members){
          let member = await userModel.findOne({where : {id : elt.member_id}})
          groupMembers.push(member);
      }
      res.json({ status: true, message: 'Returning groups',  groupMembers})
    } catch (error) {
      res.status(error.code).json({ status: false, message: error.message });
    }
  },
  async addGroupMember (req, res) {
    // return;
    // TODO : verify if the token is valid and correspond to an admin
    // #swagger.tags = ['groups']
    // #swagger.summary = 'Delete User'

    try {
      await verifyToken(req);
      if (!has(req.params, 'gid')) throw new CodeError('You must specify the group id', status.BAD_REQUEST)
      if (!has(req.params, 'uid')) throw new CodeError('You must specify the user id', status.BAD_REQUEST)

      let group = await groupModel.findOne({where : {id : req.params.gid}})
      if(!group) throw new CodeError('This group doesn\'t exist', status.NOT_FOUND);
      if(!verifyOwner(req, group)) throw new CodeError('This group doesn\'t belong to you', status.NOT_FOUND);
      let newMember = await userModel.findOne({where : {id : req.params.uid}})
      if(!newMember) throw new CodeError('This member doesn\'t exist', status.NOT_FOUND);
      await userGroupModel.create({ member_id : req.params.uid, groupId: req.params.gid})
      res.json({ status: true, message: 'User added to the group'})
    } catch (error) {
      res.status(error.code).json({ status: false, message: error.message });
    }
  },

  //elements rajoutés
  async deleteGroupMember(req, res) {
    try {
      await verifyToken(req);

      if (!has(req.params, 'gid')) throw new CodeError('You must specify the group id', status.BAD_REQUEST)
      if (!has(req.params, 'uid')) throw new CodeError('You must specify the user id', status.BAD_REQUEST)
      // throw new CodeError('This group doesn\'t exist', status.NOT_FOUND);
      let group = await groupModel.findOne({where : {id : req.params.gid}})
      if(!group) throw new CodeError('This group doesn\'t exist', status.NOT_FOUND);
      if(!verifyOwner(req, group)) throw new CodeError('This group doesn\'t belong to you', status.NOT_FOUND);
      let newMember = await userModel.findOne({where : {id : req.params.uid}})
      if(!newMember) throw new CodeError('This member doesn\'t exist', status.NOT_FOUND);
      await userGroupModel.destroy({where : { member_id : req.params.uid, groupId: req.params.gid}})
      res.json({ status: true, message: 'User successfully deleted from the group'})
      res.status(error.code).json({ status: false, message: error.message });
    } catch (error) {
      res.status(error.code).json({ status: false, message: error.message });
    }
  } ,
  async getMemberGroups(req, res) {
    try {
      await verifyToken(req);
      let token = req.headers['x-access-token'];
      const decodedToken = jws.decode(token);
      const userEmail = decodedToken.payload;
      const user = await userModel.findOne({ where: { email: userEmail } });
      let memberGroupsId = await userGroupModel.findAll({where : {member_id : user.id}})
      let memberGroups = []
      for (const elt of memberGroupsId){
          let memberGroupName = await groupModel.findOne({where : {id : elt['groupId']}})
          memberGroups.push(memberGroupName);
      }
      res.json({ status: true, message: 'Returning groups',  memberGroups})
    } catch (error) {
      res.status(error.code).json({ status: false, message: error.message });
    }
  }
}
