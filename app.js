"use strict";

const express = require("express");
const appConfig = require("config").get("app");
const logger = require("@open-age/logger")("server");
const auth = require("./permit/auth");
// const Http = require("http");
const fs = require('fs');
const Https = require("https");
const port = process.env.PORT || appConfig.port || 3000;
const app = express();
const admin = require("firebase-admin");

var serviceAccount = require("./amber-firebase-adminsdk.json");
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// var https = require('https');
// var http = require('http');
// var server = Http.createServer(app);
const options = {
  cert: fs.readFileSync('/etc/letsencrypt/live/amberclubpro.com/fullchain.pem'),
  key: fs.readFileSync('/etc/letsencrypt/live/amberclubpro.com/privkey.pem')
};
// http.createServer(app).listen(80);
// https.createServer(options, app).listen(443);
var server = Https.createServer(options, app);
// var server = Http.createServer(app);
// app.listen = function () {
//   var server = http.createServer(this);
//   return server.listen.apply(server, arguments);
// };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const boot = async () => {

  const log = logger.start("app:boot");
  log.info(`environment:  ${process.env.NODE_ENV}`);
  log.info("starting server");
  server.listen(port, () => {
    log.info(`listening on port: ${port}`);
    log.end();
  });

  const io = await require("socket.io")(server, {
    allowEIO3: true,
    cors: {
      origin: true,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  module.export = io



  await require("./socket/socketEvents").connect(io, logger);

};

const init = async () => {
  await require("./settings/database").configure(logger);
  await require("./settings/express").configure(app, logger);
  await require("./settings/routes").configure(app, logger);
  app.get('/chat', function (req, res) {
    res.sendFile(__dirname + '/templates/index.html');
  });

  boot();
};

init();
