
const block = async (req, res) => {
    const log = req.context.logger.start(`api:blocks:block ${req.params.id}`);
    try {
        const blocks = await service.block(req.body, req.context);
        const msg = 'user blocked successfully'
        log.end();
        return response.success(res, msg, blocks);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

const unblock = async (req, res) => {
    const log = req.context.logger.start(`api:blocks:unblock `);
    try {
        const blocks = await service.unblock(req.body, req.context);
        const msg = 'user unblock successfully'
        log.end();
        return response.success(res, msg, blocks);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};


const blockList = async (req, res) => {
    const log = req.context.logger.start(`api:blocks:blockLilst`);
    try {
        const users = await service.blockList(req.params.id, req.context);
        const msg = 'list fetched successfully'
        log.end();
        return response.success(res, msg, users);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};
exports.block = block;
exports.unblock = unblock;
exports.blockList = blockList;