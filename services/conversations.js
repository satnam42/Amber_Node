const message = require("../models/message")
const ObjectId = require('mongodb').ObjectID


const getOldChat = async (query, context) => {
    const log = context.logger.start('services:conversations:getOldChat')
    let pageNo = Number(query.pageNo) || 1
    let pageSize = Number(query.pageSize) || 10

    let skipCount = pageSize * (pageNo - 1)

    const chat = await db.message.find({ conversation: ObjectId(query.conversationId) }).sort({ createdOn: 1 }).skip(skipCount).limit(pageSize)

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
                "as": "user1"
            }
        },
        {
            "$lookup":
            {
                "from": "users",
                "localField": "user2",
                "foreignField": "_id",
                "as": "user2"
            }
        },
        {
            "$unwind": {
                "path": "$user1",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            "$unwind": {
                "path": "$user2",
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
        // { $limit: { "messages": 1, } },


        //getting last message from array list 
        //getting last message from array list 

        // { $addFields: { lastElem: { $last: "$messages.content" } } },

        //mapping response
        {
            $project: {
                "_id": 0,
                "user1": "$user1.username",
                "user1Id": "$user1._id",
                "user1Image": "$user1.profileImageName",
                "user2": "$user2.username",
                "user2Id": "$user2._id",
                "user2Image": "$user2.profileImageName",
                // "sender": "$sender.username",
                // "senderId": "$sender._id",
                // "status": "$receiver.status",
                // "convertedId": "$convertedId",
                // "lastMessage": "$messages",
                "conversationId": "$_id"
            }
        }
    ])
    log.end()
    return conversation
}

exports.getOldChat = getOldChat
exports.conversationList = conversationList