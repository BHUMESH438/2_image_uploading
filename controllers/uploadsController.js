const path = require('path'); //built in node module
const { StatusCodes } = require('http-status-codes');
const Product = require('../models/Product');
const { BadRequestError } = require('../errors');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
//upload through popstman to server
const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new BadRequestError('No file Uploaded');
  }

  //1.storing that image in a variable
  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith('image')) {
    throw new BadRequestError('please upload the image');
  }
  const maxsize = 1024 * 1024;
  if (Number(productImage.size) > maxsize) {
    throw new BadRequestError('please upload the file size less than 1mb');
  }
  //2.create a path
  const imagepath = path.join(__dirname, '../public/uploads/' + `${productImage.name}`);
  //3.moving the recived file to desire folder
  await productImage.mv(imagepath);
  console.log('>>>img req', req);
  //4.befor response make the folder public and return the res
  return res.status(StatusCodes.OK).json({
    image: {
      src: `/uploads/${productImage.name}`
    }
  });
};
//upload from cloudnary to server
const uploadProductImage = async (req, res) => {
  //in file upload we should pass the path,use the file name and set it to true
  const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, { use_filename: true, folder: 'file-upload' });
  console.log('result>>>>>>>>', result);
  res.status(StatusCodes.CREATED).json({ image: { src: result.secure_url } });
  //after uploading to the cloudinary remove the temp file by using file structure  unsync inside that give the folder path
  fs.unlinkSync(req.files.image.tempFilePath);
};
module.exports = { uploadProductImage };
