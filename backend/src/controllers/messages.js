const status = require('http-status')
const userModel = require('../models/user.js')
const groupModel = require('../models/groups.js')
const userGroupModel = require('../models/user_group.js')
const messageModel = require('../models/messages.js')
const jws = require('jws')
const has = require('has-keys')
const CodeError = require('../util/CodeError.js')
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

async function verifyMember(req, gid) {
    let token = req.headers['x-access-token'];
    const decodedToken = jws.decode(token);
    const userEmail = decodedToken.payload;
    const user = await userModel.findOne({ where: { email: userEmail } });
    const group = await groupModel.findOne({ where: { id: gid } });
    if (!group) throw new CodeError('Group not found', status.NOT_FOUND);
    const isMember = await userGroupModel.findOne({ where: { member_id: user.id, groupId: gid } });
    if (!isMember) throw new CodeError('User is not a member of this group', status.FORBIDDEN);
}

module.exports = {
    async listMessages(req, res) {
      try {
        await verifyToken(req);
        if (!has(req.params, 'gid')) throw new CodeError('You must specify the group id', status.BAD_REQUEST)
        const gid = req.params.gid; // Extraire le gid du paramètre de chemin
        await verifyMember(req, gid);
        const messages = await messageModel.findAll({ where: { gid } });
        res.json({ status: true, messages });
      } catch (error) {
        res.status(error.code).json({ status: false, message: error.message });
      }
    },
  
    async addMessage(req, res) {
      try {
        await verifyToken(req);
        if (!has(req.params, 'gid')) throw new CodeError('You must specify the group id', status.BAD_REQUEST)
        const gid = req.params.gid; // Extraire le gid du paramètre de chemin
        if (!has(req.body, 'content')) throw new CodeError('Content is required', status.BAD_REQUEST);
        await verifyMember(req, gid);
        const { content } = req.body;
        const token = req.headers['x-access-token'];
        const decodedToken = jws.decode(token);
        const userEmail = decodedToken.payload;
        const user = await userModel.findOne({ where: { email: userEmail } });
        await messageModel.create({ content, gid, uid: user.id });
        res.json({ status: true, message: 'Message added successfully' });
      } catch (error) {
        res.status(error.code).json({ status: false, message: error.message });
      }
    }
  }
