require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();
const Productrouter = require('./routes/productRoutes');
const fileUpload = require('express-fileupload'); //even for uploading the file to cludinary from the server we need the express-fileupload

//cloudnary setup - use v2
const cloudnary = require('cloudinary').v2;
cloudnary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});
// database
const connectDB = require('./db/connect');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// app.use(express.static('./public')); // server can use the assets only if the folder is made public
app.use(express.json()); //we can access the req.body
app.use(fileUpload({ useTempFiles: true })); //invoke file upload
app.get('/', (req, res) => {
  res.send('<h1>File Upload Starter</h1>');
});

app.use('/api/v1/products', Productrouter);
// middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URIMONGO_URL);
    console.log('DB connected........................');
    app.listen(port, () => console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
