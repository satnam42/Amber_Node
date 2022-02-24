
"use strict";
const auth = require("../permit/auth");
const socketEvents = require('../socket/socketEvents')
const configure = async (io, logger) => {
    const log = logger.start(`settings:socket:configure`);
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.query.token;
            const details = auth.extractToken(token, { logger });
            if (details.name === "TokenExpiredError") {
                throw new Error("token expired");
            }

            if (details.name === "JsonWebTokenError") {
                throw new Error("token is invalid");
            }
            const user = await db.user.findById(details._id)
            socket.userId = user.id;
            socketEvents.connect(io, logger)
            next();
        } catch (err) {
            log.error(err)
            log.end()
            throw new Error(err.message)
        }
    });
    // try {

    //     // await mongoose.connect(dbConfig.url + "/" + dbConfig.database + '?authSource=admin', {
    //     //     useNewUrlParser: true,
    //     //     useUnifiedTopology: true
    //     // });
    //     // if (process.env.NODE_ENV !== 'prod') {
    //     //     mongoose.set('debug', true)
    //     // }
    //     // console.log(`mongoose default connection is open to ${dbConfig.url}`);
    //     // await require("../models").configure();
    //     // global.db = mongoose.models;
    //     // log.end();
    // } catch (err) {
    //     // log.error(`unable to create mongo connection to ${dbConfig.url}`);
    //     throw new Error(err.message);
    //     // log.error(err);
    // }
};

exports.configure = configure;
