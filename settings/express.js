"use strict";
const path = require("path");
const cors = require("cors");
const express = require("express");
// var multer = require('multer');
// const bodyParser = require('body-parser')

// image uplaod location //
// var storage = multer.diskStorage({

//   destination: function (req, file, cb) {
//     var total = req.headers['content-length'];
//     let progress = 0
//     req.on('data', function (chunk) {
//       progress += chunk.length;
//       var perc = parseInt((progress / total) * 100);
//       console.log('percent complete: ' + perc + '%\n');
//       // response.write('percent complete: '+perc+'%\n');
//     });

//     if (file.originalname.match(/\.(mp4|MPEG-4|mkv|avi|mov)$/)) {
//       cb(null, path.join(__dirname, '../', 'assets/videos'));
//     } else {
//       cb(null, path.join(__dirname, '../', 'assets/images'));
//     }
//   },

//   filename: function (req, file, cb) {
//     cb(null, Date.now() + file.originalname.replace(/ /g, ''));
//   }

// });

const configure = async (app, logger) => {
  const log = logger.start("settings:express:configure");
  // app.use('/api/gifts/credit', express.raw({ type: "*/*" }));
  app.use(express.json({
    // verify: function (req, res, buf) {
    //   var url = req.originalUrl;
    //   if (url.startsWith('/stripe')) {

    //   }
    limit: "50mb"
    // }



  }));
  // app.use('/api/gifts/credit', bodyParser.raw({ type: 'application/json' }));
  app.use(cors());
  //Add the client URL to the CORS policy
  // const whitelist = ["http://localhost:3000"];
  // const corsOptions = {
  //   origin: function (origin, callback) {
  //     if (!origin || whitelist.indexOf(origin) !== -1) {
  //       callback(null, true);
  //     } else {
  //       callback(new Error("Not allowed by CORS"));
  //     }
  //   },
  //   credentials: true,
  // };
  // app.use(cors(corsOptions));

  // app.use(multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 50 } }).any());


  app.use(express.urlencoded({
    extended: true,
    limit: "50mb",
    parameterLimit: 50000
  })
  );

  // app.use(
  //   bodyParser({
  //     limit: "50mb",
  //     keepExtensions: true
  //   })
  // );

  const root = path.normalize(__dirname + "./../");
  app.use(express.static(path.join(root, "public")));
  log.end();

};

exports.configure = configure;
