const status = require('http-status')
const userModel = require('../models/user.js')
const has = require('has-keys')
const CodeError = require('../util/CodeError.js')
const bcrypt = require('bcrypt')
const jws = require('jws')
require('mandatoryenv').load(['TOKENSECRET'])
const { TOKENSECRET } = process.env
const multer = require('multer')
const path = require('path')

function validPassword (password) {
  return /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/.test(password)
}

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

async function verifyAdmin(req) {
  let user = await getUserInfo(req);
  if (!user.isAdmin) throw {code: 403, message: 'You\'re not an admin'}
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'Images')
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: '1000000' },
  fileFilter: (req, file, cb) => {
      // console.log(req.body);
      const fileTypes = /jpeg|jpg|png|gif/
      const mimeType = fileTypes.test(file.mimetype)  
      const extname = fileTypes.test(path.extname(file.originalname))

      if(mimeType && extname) {
          return cb(null, true)
      }
      cb('Give proper files formate to upload')
  }
}).single('image')



module.exports = {
  upload,
  async login (req, res) {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Verify credentials of user using email and password and return token'
    // #swagger.parameters['obj'] = { in: 'body', schema: { $email: 'John.Doe@acme.com', $password: '12345'}}
    try{
      if (!has(req.body, ['email', 'password'])) throw new CodeError('You must specify the email and password', status.BAD_REQUEST)
      const { email, password } = req.body
      const user = await userModel.findOne({ where: { email } })
      if (user) {
        if (await bcrypt.compare(password, user.passhash)) {
          userInfo = {"username" : user.name, "email" : user.email, "id" : user.id, 'image' : user.profilePic, "solde" : user.solde}
          userInfo["token"] = jws.sign({ header: { alg: 'HS256' }, payload: email, secret: TOKENSECRET })
          res.json({ status: true, message: 'Login/Password ok', userInfo })
          return;
        }
      }
      res.status(status.FORBIDDEN).json({ status: false, message: 'Wrong email/password' })
    }
    catch (error) {
      res.status(error.code).json({ status: false, message: error.message});
    }
  },
  async newUser (req, res) {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'New User'
    // #swagger.parameters['obj'] = { in: 'body', description:'Name and email', schema: { $name: 'John Doe', $email: 'John.Doe@acme.com', $password: '1m02P@SsF0rt!'}}
    // console.log(req.body);
    try{
    //   console.log(req.file.path);
    //   console.log(req.body);
      //console.log(req.body)

      if (!req.body.name || !req.body.email || !req.body.password){
        throw new CodeError('You must specify the name and email', status.BAD_REQUEST)
      }
      const { name, email, password } = req.body;
      const profilePic = req.file.path.split('frontend/')[1];;
      //console.log({ name, profilePic, email, passhash: await bcrypt.hash(password, 2)})
      if (!validPassword(password)) throw new CodeError('Weak password!', status.BAD_REQUEST)
      await userModel.create({ name, profilePic, email, passhash: await bcrypt.hash(password, 2)})
      
      res.json({ status: true, message: 'User Added' })
    }
    catch (error) {
      //console.log(error)
      res.status(error.code).json({ status: false, message: error.message });
    }
  },
  async getUsers (req, res) {
    // TODO : verify if the token is valid...
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Get All users'

    try {
      await verifyToken(req);
  
      const data = await userModel.findAll({ attributes: ['id', 'name', 'email', 'solde', 'isAdmin'] });
      res.json({ status: true, message: 'Returning users', data });
    } catch (error) {
      res.status(error.code).json({ status: false, message: error.message });
    }
  },
  async updateUser (req, res) {
    // TODO : verify if the token is valid and correspond to an admin
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Mettre à jour les informations de l utilisateur (réservé à un utilisateur administrateur)'
    // #swagger.parameters['obj'] = { in: 'body', schema: { $name: 'John Doe', $email: 'John.Doe@acme.com', $password: '1m02P@SsF0rt!' }}

    try {
      await verifyToken(req);
      const user = await userModel.findOne({ where: { id: req.params.id } });
      if (!user) throw { code: 404, message: 'User not found' };
      const userReq = await getUserInfo(req);
      if(userReq.id != user.id) {
        await verifyAdmin(req);
      }

      // await verifyAdmin(req);
      // return res.json({ status: true, message: req.body });
      const userModified = {}
      // const field of ['solde', 'email', 'password']
      // if(req.body.solde){
      //   userModified['solde'] = req.body.solde
      // }
      // else{
        for (const field of ['name', 'email', 'password', 'solde']) {
          if (has(req.body, field)) {
            if (field === 'password') {
              userModified.passhash = await bcrypt.hash(req.body.password, 2)
            } else {
              userModified[field] = req.body[field]
            }
          }
        }
      // }
      if (Object.keys(userModified).length === 0) throw new CodeError('You must specify the name, email or password', status.BAD_REQUEST)
      
      await userModel.update(userModified, { where: { id: req.params.id } })
      res.json({ status: true, message: 'User updated' })
    } catch (error) {
      res.status(error.code).json({ status: false, message: error.message });
    }
  },
  
  async deleteUser (req, res) {
    // TODO : verify if the token is valid and correspond to an admin
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Delete User'
    try {
      await verifyToken(req);
      await verifyAdmin(req);
      if (!has(req.params, 'id')) throw new CodeError('You must specify the id', status.BAD_REQUEST)
      const { id } = req.params
      await userModel.destroy({ where: { id } })
      res.json({ status: true, message: 'User deleted' })
    } catch (error) {
      res.status(error.code).json({ status: false, message: error.message });
    }
  },

  async updatePwd(req, res) {
    try {
      await verifyToken(req);
  
      const userModified = {};
  
      if (has(req.body, 'password')) {
        const newPassword = req.body.password;
        if (!validPassword(newPassword))
          throw new CodeError('Weak password!', status.BAD_REQUEST);
        
        userModified.passhash = await bcrypt.hash(newPassword, 10);
      } else {
        throw new CodeError('You must specify the new password', status.BAD_REQUEST);
      }
      
      await userModel.update(userModified, { where: { email: jws.decode(req.headers['x-access-token']).payload} });
      res.json({ status: true, message: 'Password updated' });
    } catch (error) {
      res.status(error.code).json({ status: false, message: error.message });
    }
  }    
}