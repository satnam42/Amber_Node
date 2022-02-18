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
    var oldChats, sendUserStack;
    var userSocket = {};
    ioChat.on('connection', async (socket) => {
        console.log("socketio chat connected.");
        //function to get user name
        socket.on('set-user-data', (userId) => {
            if (!userId) {
                console.log('set-user-data is required', userId)
                // socket.emit('oops', {
                //     status:"NOK",
                //     event: 'set-user-data',
                //     data: 'set-user-data is required'
                // });
                socket.emit('oops', {
                    // status:"NOK",
                    event: 'set-user-data',
                    data: 'set-user-data is required'
                });
            } else {
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
            }
        }); //end of set-user-data event.

        //setting room.
        socket.on('set-room', async function (room) {
            console.log('set-room called', { room })
            //leaving room. 
            socket.leave(socket.room);
            try {
                //getting room data.
                // eventEmitter.emit('get-room-data', room);
                let conversation = await getRoomAndSetRoom(room)
                //setting room and join.
                if (conversation) {
                    socket.room = conversation.id;
                    console.log("roomId : " + socket.room);
                    socket.join(socket.room);
                    ioChat.to(userSocket[socket.userId]).emit('set-room', socket.room);
                }

            } catch (e) {
                console.log('set-room Err', e.message)
                socket.emit('oops',
                    {
                        event: 'set-room',
                        data: e.message
                    });
            }


        }); //end of set-room event.

        //showing msg on typing.
        socket.on('typing', function () {
            socket.to(socket.room).broadcast.emit('typing', " typing...");
        });

        //for showing chats.
        socket.on('chat-msg', async function (data) {
            console.log('chat-msg called', { data })
            try {
                await saveChat({
                    msgFrom: socket.userId,
                    msg: data.msg,
                    msgTo: data.msgTo,
                    room: socket.room,
                    date: data.date
                })
                const user = await db.user.findById(data.msgTo)
                if (user && user.deviceToken != "" && user.deviceToken != undefined) {
                    let response = service.pushNotification(user.deviceToken, user.firstName, data.msg)
                    console.log('pushNotification called', { response })
                }

                let msgDate = moment.utc(data.date).format()

                ioChat.to(socket.room).emit('chat-msg', {
                    msgFrom: socket.userId,
                    msg: data.msg,
                    date: msgDate
                });
            } catch (e) {
                console.log('chat-msg Err', e.message)
                socket.emit('oops',
                    {
                        event: 'chat-msg',
                        data: e.message
                    });
                return;
            }


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

    getRoomAndSetRoom = async (room) => {
        console.log("getRoomAndSetRoom:", room)
        var today = Date.now();
        if (room && room.conversationFrom == "" && room.conversationTo == "") {
            console.log("set-room parameter is required");
            throw new Error('set-room parameter is required')
        }
        if (room.conversationFrom == room.conversationTo) {
            console.log("set-room parameter is required");
            throw new Error('set-room parameter not be same ')
        }

        let conversation = await db.conversation.findOne({ $or: [{ user1: room.conversationFrom, user2: room.conversationTo }, { user1: room.conversationTo, user2: room.conversationFrom }] })


        if (!conversation) {
            const conversation = await new db.conversation({
                user1: room.conversationFrom,
                user2: room.conversationTo,
                lastActive: today,
                createdOn: today
            }).save()
            console.log("conversation saved ");
            return conversation
            // setRoom(conversation._id)
        } else {
            conversation.lastActive = today
            await conversation.save()
            return conversation
            // setRoom(conversation._id)
        }


    }


    saveChat = async (data) => {
        console.log("saveChat:", data)
        if (!data) {
            throw new Error('message body is Required')
        }
        if (!data.msg) {
            throw new Error('msg is Required')
        }
        if (!data.room) {
            throw new Error('room id is Required')
        }
        if (!data.msgTo) {
            throw new Error('msgTo  is Required')
        }
        const message = await new db.message({
            sender: data.msgFrom,
            receiver: data.msgTo,
            content: data.msg,
            read: data.read || true,
            conversation: data.room
        }).save()
        console.log("message saved .");
        return message

    }
    //saving chats to database.
    // eventEmitter.on('save-chat', async (data) => {
    //     console.log("save-chat:", data)
    //     // var today = Date.now();
    //     try {
    //         if (data == undefined || data == null || data == "") {
    //             console.log("message body not received ");
    //         }
    //         const message = await new db.message({
    //             sender: data.msgFrom,
    //             receiver: data.msgTo,
    //             content: data.msg,
    //             read: data.read || true,
    //             conversation: data.room
    //         }).save()
    //         if (message) {
    //             console.log("message saved .");
    //         }

    //     } catch (error) {
    //         console.log("message Error : " + error);
    //     }
    // });

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

};

exports.sockets = sockets;