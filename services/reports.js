
const buildReport = async (model, context) => {
    const { text, userId, reportBy } = model;
    const log = context.logger.start(`services:reports:buildReport${model}`);
    const report = await new db.report({
        text: text,
        user: userId,
        reportBy: reportBy,
    }).save();
    log.end();
    return report;
};



const create = async (model, context) => {
    const log = context.logger.start("services:reports:create");
    let report = await db.report.findOne({ reportBy: model.reportBy, user: model.userId });
    if (report) {
        throw new Error(`your are already reported this user `);
    } else {
        report = await buildReport(model, context);
        log.end();
        return report
    }
};


const getReports = async (query, context) => {
    const log = context.logger.start(`services:reports:getReports`);
    let pageNo = Number(query.pageNo) || 1;
    let pageSize = Number(query.pageSize) || 10;
    let skipCount = pageSize * (pageNo - 1);
    // const reportId = context.report.id || context.report._id
    const reports = await db.report.find().skip(skipCount).limit(pageSize)
    reports.count = await db.report.find().count();
    log.end()
    return reports
};


exports.create = create;
exports.getReports = getReports;



