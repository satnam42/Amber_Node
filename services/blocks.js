

const block = async (model, context) => {
    const log = context.logger.start(`services:users:block`);
    const user = await db.user.findById(model.byUser)
    const isBlocked = await db.block({ toUser: model.toUser, byUser: model.byUser })
    if (isBlocked) {
        throw new Error('user already blocked')
    }
    const block = await new db.block({
        toUser: model.toUser,
        byUser: model.byUser,
    }).save();

    let index = 0

    if (model.to == 'following') {
        for (const item of user.following) {
            if (model.toUser == item.userId) {
                user.following[0].status = 'blocked'
                user.following[0].blockId = block.id
                index++
            }
        }
    } else {
        for (const item of user.followers) {
            if (model.toUser == item.userId) {
                user.followers[0].status = 'blocked'
                user.followers[0].blockId = block.id
                index++
            }
        }
    }
    await user.save()
    log.end();
    return block
};

const unblock = async (model, context) => {
    const log = context.logger.start(`services:users:unblock`);
    const user = await db.user.findById(model.byUser)
    const block = await db.block({ toUser: model.toUser, byUser: model.byUser })
    if (!block) {
        throw new Error('user not found')
    }

    let index = 0

    if (model.to == 'following') {
        for (const item of user.following) {
            if (model.toUser == item.userId) {
                user.following[0].status = 'un-block'
                user.following[0].blockId = ""
                index++
            }
            else {
                throw new Error('user not present in your following list please check ')
            }
        }
    } else {
        for (const item of user.followers) {
            if (model.toUser == item.userId) {
                user.followers[0].status = 'un-block'
                user.followers[0].blockId = ""
                index++
            } else {
                throw new Error('user not present in your followers list please check ')
            }
        }
    }
    await user.save()
    log.end();
    return block
};

const blockList = async (id, context) => {
    const log = context.logger.start(`services:blocks:blockLilst`);
    if (!id) {
        throw new Error('user id is requried')
    }
    const block = await db.block.find({ byUser: id }).populate('toUser')
    log.end();
    return block.toUser
};

exports.block = block;
exports.unblock = unblock;
exports.blockList = blockList;