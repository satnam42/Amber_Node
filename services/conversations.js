const message = require("../models/message")
const ObjectId = require('mongodb').ObjectID


const getOldChat = async (query, context) => {
    const log = context.logger.start('services:conversations:getOldChat')
    let pageNo = Number(query.pageNo) || 1
    let pageSize = Number(query.pageSize) || 10

    let skipCount = pageSize * (pageNo - 1)

    const chat = await db.message.find({ conversation: ObjectId(query.conversationId) }).sort({ createdAt: -1 }).skip(skipCount).limit(pageSize)

    chat.count = await db.message.find({ conversation: ObjectId(query.conversationId) }).count()

    // let skipCount = parseInt(query.skip_messages);
    // let chat = await db.chats.find({ room: query.room_id }).sort('-createdOn').skip(skipCount).lean()
    //     .limit(5)

    log.end()
    return chat
}

const conversationList = async (id, context) => {
    const log = context.logger.start('services:conversations:conversationList')
    if (!id) {
        throw Error('id is required')
    }
    // let conversation = await db.conversation.find({ 'sender': id }).populate('receiver', null, 'user', )
    let conversation = await db.conversation.aggregate([
        {
            "$match": { $or: [{ "user1": ObjectId(id) }, { "user2": ObjectId(id) }] }
        },
        {
            "$lookup": {
                "from": 'messages',
                "localField": '_id',
                "foreignField": 'conversation',
                "as": 'messages'
            }
        },
        {
            "$unwind": {
                "path": "$messages",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            "$lookup":
            {
                "from": "users",
                'let': { 'candidateId': "$messages.sender" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$_id", "$$candidateId"] },
                                    { $ne: [ObjectId(id), "$_id"] },
                                ]
                            }
                        }
                    },
                ],
                "as": "users"
            }
        },
        {
            "$unwind": {
                "path": "$users",
            }
        },
        {
            $group: {
                _id: { _id: "$users._id", },
                "user": { $first: '$users' },
                "conversationsId": { $first: '$_id' },

            }
        },

        { $sort: { "lastActive": -1, } },
        // { $limit: { "messages": 1, } },
        //getting last message from array list 
        // { $addFields: { lastElem: { $last: "$messages.content" } } },
        //mapping response

        {
            $project: {
                "_id": 0,
                "firstName": "$user.firstName",
                "userId": "$user._id",
                "image": "$user.profileImageName",
                // "user2": "$user2.username",
                // "user2Id": "$user2._id",
                // "user2Image": "$user2.profileImageName",
                // "sender": "$sender.username",
                // "senderId": "$sender._id",
                // "status": "$receiver.status",
                // "convertedId": "$convertedId",
                // "lastMessage": "$messages",
                "conversationId": "$conversationsId"
            }
        }
    ])
    log.end()
    return conversation
}

exports.getOldChat = getOldChat
exports.conversationList = conversationList