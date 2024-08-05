if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const ReportModel = require('../models/report.schema');

const send_report_on_song = async (req, res) => {
    const songId = req.params.songId;
    const {
        fullName,
        phoneNumber,
        email,
        idNumber,
        rpType,
        rpCategory,
        reason,
    } = req.body;

    try {
        const report = new ReportModel({
            account: req.user._id,
            contentLink: process.env.CLIENT_URI + '/song/' + songId,
            email: email,
            fullName: fullName,
            idNumber: idNumber,
            phoneNumber: phoneNumber,
            rpType: rpType,
            rpCategory: rpCategory,
            reason: reason,
        });
        await report.save();

        /*TBD: Send report confirmation to that email
               Attach document to 'document' field
        */
        return res.status(200).json({
            message: 'Report sent',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const get_reports = async (req, res) => {
    try {
        const reports = await ReportModel.find();
        res.status(200).send(
            reports.map((report) => {
                return {
                    id: report._id,
                    account: report.account,
                    contentLink: report.contentLink,
                    email: report.email,
                    fullName: report.fullName,
                    idNumber: report.idNumber,
                    phoneNumber: report.phoneNumber,
                    rpType: report.rpType,
                    rpCategory: report.rpCategory,
                    reason: report.reason,
                    document: report.document,
                };
            }),
        );
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    send_report_on_song,
    get_reports,
};
