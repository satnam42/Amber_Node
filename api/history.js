
const create = async (req, res) => {
    const log = req.context.logger.start(`api:history:create ${req.body}`);
    try {
        const history = await service.create(req.body, req.context);
        const msg = 'history created successfully'
        log.end();
        return response.success(res, msg, history);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

const getByUserId = async (req, res) => {
    const log = req.context.logger.start(`api:history:getByUserId `);
    try {
        const history = await service.getHistoryByUserId(req.params.id, req.context);
        const msg = 'fetched history successfully'
        log.end();
        return response.success(res, msg, history);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

exports.create = create;
exports.getByUserId = getByUserId;