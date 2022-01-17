

const join = async (model, context) => {
    const log = context.logger.start(`services:club:join`);
    const query = {
        name: model.clubName,
        members: { $elemMatch: { $eq: model.userId, } }
    }
    const isMember = await db.user.find(query)
    if (isMember) {
        return isMember
        // throw new Error('user already clubed')
    }
    const Update = {
        $addToSet: { members: model.userId }
    }
    const joined = await db.club.findOneAndUpdate(query, Update)
    return joined
    log.end();
};


const leave = async (model, context) => {
    const log = context.logger.start(`services:club:leave`);
    const user = await db.user.findById(model.byUser)
    const club = await db.club({ toUser: model.toUser, byUser: model.byUser })
    if (!club) {
        throw new Error('user not found')
    }

    let index = 0

    if (model.to == 'following') {
        for (const item of user.following) {
            if (model.toUser == item.userId) {
                user.following[0].status = 'un-club'
                user.following[0].clubId = ""
                index++
            }
            else {
                throw new Error('user not present in your following list please check ')
            }
        }
    } else {
        for (const item of user.followers) {
            if (model.toUser == item.userId) {
                user.followers[0].status = 'un-club'
                user.followers[0].clubId = ""
                index++
            } else {
                throw new Error('user not present in your followers list please check ')
            }
        }
    }
    await user.save()
    log.end();
    return club
};


exports.join = join;
exports.leave = leave;