const fs = require("fs");
const imageUserModel = require('../models/imageUser');
const multer = require('multer')
const path = require('path')


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, './src/frontend/Images')
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: '1000000' },
  fileFilter: (req, file, cb) => {
      console.log(req.body);
      const fileTypes = /jpeg|jpg|png|gif/
      const mimeType = fileTypes.test(file.mimetype)  
      const extname = fileTypes.test(path.extname(file.originalname))

      if(mimeType && extname) {
          return cb(null, true)
      }
      cb('Give proper files formate to upload')
  }
}).single('image')

// const uploadFiles = async (req, res) => {

//   let info = {
//       data: req.file.path,
//   }
//   console.log(info);
//   const product = await imageUserModel.create(info)
//   res.status(200).json({ status: true, message: 'Image Uploaded' })
//   console.log(product)

// }

module.exports = {
  // uploadFiles,
  upload
  
}

// module.exports = {
  
//   async uploadFiles(req, res){
//     upload(req);

//     try {
//       console.log(req.file);
  
//       if (req.file == undefined) {
//         return res.send(`You must select a file.`);
//       }
  
//       imageUserModel.create({
//           // add user reference 
//           type: req.file.mimetype,
//           name: req.file.originalname,
//           data: fs.readFileSync(
//               __basedir + "/resources/static/assets/uploads/" + req.file.filename
//           ),
//       }).then((image) => {
//         fs.writeFileSync(
//           __basedir + "/resources/static/assets/tmp/" + image.name,
//           image.data
//         );
  
//         return res.send(`File has been uploaded.`);
//       });
//     } catch (error) {
//       console.log(error);
//       return res.send(`Error when trying upload images: ${error}`);
//     }
//   }
// }



