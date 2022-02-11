const message = require("../models/message")
const ObjectId = require('mongodb').ObjectID


const getOldChat = async (query, context) => {
    const log = context.logger.start('services:conversations:getOldChat')
    let pageNo = Number(query.pageNo) || 1
    let pageSize = Number(query.pageSize) || 10

    let skipCount = pageSize * (pageNo - 1)

    const chat = await db.message.find({ conversation: query.conversationId }).sort({ createdOn: -1 }).skip(skipCount).limit(pageSize)

    chat.count = await db.message.find({ conversation: query.conversationId }).count()

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
            "$match": { $or: [{ "user1": id }, { "user2": id }] }
        },
        // $match: {
        //     $and: [ 
        //         {type: {$in: ["TOYS"]}}, 
        //         {type: {$nin: ["BARBIE"]}}
        // {
        //     $addFields: {
        //         receiverId: { $toObjectId: "$receiver" }
        //     }
        // },
        // {
        //     $addFields: {
        //         senderId: { $toObjectId: "$sender" }
        //     }
        // },
        // {
        //     "$addFields": {
        //         "date": {
        //             "$dateFromParts": {
        //                 "year": { "$year": "$lastActive" },
        //                 "month": { "$month": "$lastActive" },
        //                 "day": { "$dayOfMonth": "$lastActive" }
        //             }
        //         }
        //     }
        // },

        /// convert date to simple fomate 28-10-2000 
        // {
        //     "$addFields": {
        //         "date": {
        //             "$dateToString": {
        //                 "format": "%Y-%m-%d", "date": "$lastActive"
        //             }
        //         }
        //     }
        // },

        {
            "$lookup":
            {
                "from": "users",
                "localField": "user1",
                "foreignField": "_id",
                "as": "receiver"
            }
        },
        {
            "$lookup":
            {
                "from": "users",
                "localField": "user2",
                "foreignField": "_id",
                "as": "sender"
            }
        },
        {
            "$unwind": {
                "path": "$receiver",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            "$unwind": {
                "path": "$sender",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            "$lookup": {
                "from": 'messages',
                "localField": '_id',
                "foreignField": 'conversation',
                "as": 'messages'
            }
        },

        { $sort: { "lastActive": -1, } },

        //getting last message from array list 

        { $addFields: { lastElem: { $last: "$messages.content" } } },

        //mapping response
        {
            $project: {
                "_id": 0,
                "receiver": "$receiver.name",
                "receiverId": "$receiver._id",
                "sender": "$sender.name",
                "profileImageName": "$sender.profileImageName",
                "status": "$receiver.status",
                "convertedId": "$convertedId",
                "lastMessage": "$lastElem",
                "conversationId": "$_id"
            }
        }
    ])
    log.end()
    return conversation
}

exports.getOldChat = getOldChat
exports.conversationList = conversationList