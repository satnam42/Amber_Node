var socketio = require('socket.io');
var events = require('events');
var moment = require('moment');
var _ = require('lodash');
var eventEmitter = new events.EventEmitter();
const service = require('../services/notifications')
const sockets = async (http, logger) => {
    io = socketio.listen(http);
    var ioChat = io
    var userStack = {};
    var oldChats, sendUserStack, setRoom;
    var userSocket = {};
    ioChat.on('connection', async (socket) => {
        console.log("socketio chat connected.");
        //function to get user name
        socket.on('set-user-data', (userId) => {
            console.log(userId + "  logged In");
            //storing variable.
            socket.userId = userId;
            userSocket[socket.userId] = socket.id;
            console.log("userSocket", userSocket)
            //getting all users list
            eventEmitter.emit('get-all-users');
            // sending all users list. and setting if online or offline.
            sendUserStack = function () {
                for (i in userSocket) {
                    for (j in userStack) {
                        if (j == i) {
                            userStack[j] = "Online";
                        }
                    }
                }
                //for popping connection message.
                ioChat.emit('onlineStack', userStack);
            } //end of sendUserStack function.

        }); //end of set-user-data event.

        //setting room.
        socket.on('set-room', function (room) {
            //leaving room. 
            try {
                socket.leave(socket.room);
                //getting room data.
                eventEmitter.emit('get-room-data', room);
                //setting room and join.
                setRoom = function (roomId) {
                    socket.room = roomId;
                    console.log("roomId : " + socket.room);
                    socket.join(socket.room);
                    ioChat.to(userSocket[socket.userId]).emit('set-room', socket.room);
                };
            } catch (e) {
                socket.emit('oops', e.message);
                return;
            }


        }); //end of set-room event.

        //showing msg on typing.
        socket.on('typing', function () {
            socket.to(socket.room).broadcast.emit('typing', " typing...");
        });

        //for showing chats.
        socket.on('chat-msg', async function (data) {
            //emits event to save chat to database.
            eventEmitter.emit('save-chat', {
                msgFrom: socket.userId,
                msgTo: data.msgTo,
                msg: data.msg,
                room: socket.room,
                date: data.date
            });
            const user = await db.user.findById(data.msgTo)
            if (user && user.deviceToken != "" && user.deviceToken != undefined) {
                let response = service.pushNotification(user.deviceToken, user.firstName, data.msg)
            }

            let msgDate = moment.utc(data.date).format()

            ioChat.to(socket.room).emit('chat-msg', {
                msgFrom: socket.userId,
                msg: data.msg,
                date: msgDate
            });

            // for (user in userStack) {

            //     if (user == socket.userId) {
            //         delete userStack[user]
            //     }

            // }

            // let addUser = socket.userId

            // const updateStack = { [addUser]: 'Online', ...userStack }

            // userStack = updateStack;

            // ioChat.emit('onlineStack', userStack);

        });

        //for popping disconnection message.
        socket.on('disconnect', function () {
            console.log(socket.userId + "  logged out");
            socket.broadcast.emit('broadcast', { description: socket.userId + ' Logged out' });
            console.log("chat disconnected.");
            _.unset(userSocket, socket.userId);
            // userStack[socket.userId] = "Offline";
            // ioChat.emit('onlineStack', userStack);
        }); //end of disconnect event.

    }); //end of io.on(connection).
    //end of socket.io code for chat feature.

    //database operations are kept outside of socket.io code.
    //saving chats to database.
    eventEmitter.on('save-chat', async (data) => {
        console.log("save-chat:", data)
        // var today = Date.now();
        try {
            if (data == undefined || data == null || data == "") {
                console.log("message body not received ");
            }
            const message = await new db.message({
                sender: data.msgFrom,
                content: data.msg,
                read: data.read || false,
                conversation: data.room
            }).save()
            if (message) {
                console.log("message saved .");
            }

        } catch (error) {
            console.log("message Error : " + error);
        }
    });

    //end of saving chat.

    //listening for get-all-users event. creating list of all users.

    eventEmitter.on('get-all-users', function () {
        db.user.find({})
            .select('name')
            .exec(function (err, result) {
                if (err) {
                    console.log("Error : " + err);
                } else {
                    userStack = {}
                    //console.log(result);
                    for (var i = 0; i < result.length; i++) {
                        userStack[result[i].id] = "Offline";
                    }
                    //console.log("stack "+Object.keys(userStack));
                    sendUserStack();
                }
            });
    }); //end of get-all-users event.

    //listening get-room-data event.
    eventEmitter.on('get-room-data', async (room) => {
        console.log("get-room-data:", room)
        try {
            var today = Date.now();
            if (room == "" || room == undefined || room == null) {
                console.log("set-room parameter is required");
            }
            var conversation = await db.conversation.findOne({ $or: [{ user1: room.conversationFrom, user2: room.conversationTo }, { user1: room.conversationTo, user2: room.conversationFrom }] })
            if (conversation == "" || conversation == undefined || conversation == null || conversation == []) {
                const conversation = await new db.conversation({
                    user1: room.conversationFrom,
                    user2: room.conversationTo,
                    lastActive: today,
                    createdOn: today
                }).save()
                if (conversation) {
                    console.log("conversation saved ");
                }
                setRoom(conversation._id)
            } else {
                conversation.lastActive = today
                await conversation.save()
                setRoom(conversation._id)
            }
        } catch (error) {
            console.log("Error : " + error);
        }
    })//end of get-room-data listener.
    //end of database operations for chat feature.
};





exports.sockets = sockets;