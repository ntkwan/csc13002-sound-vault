if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const HOST_EMAIL = process.env.HOST_EMAIL;

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI,
);

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
            isSong: true,
            email: email,
            fullName: fullName,
            idNumber: idNumber,
            phoneNumber: phoneNumber,
            rpType: rpType,
            rpCategory: rpCategory,
            reason: reason,
        });
        await report.save();

        /*TBD: 
               Attach document to 'document' field
        */
        auto_email(email, rpType, report._id, fullName, (isSong = true));
        return res.status(200).json({
            message: 'Report sent',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const send_report_on_profile = async (req, res) => {
    const profileId = req.params.profileId;
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
            contentLink: process.env.CLIENT_URI + '/profile/' + profileId,
            isSong: false,
            email: email,
            fullName: fullName,
            idNumber: idNumber,
            phoneNumber: phoneNumber,
            rpType: rpType,
            rpCategory: rpCategory,
            reason: reason,
        });
        await report.save();

        auto_email(email, rpType, report._id, fullName, (isSong = false));
        return res.status(200).json({
            message: 'Report sent',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const auto_email = async (send_to, rpType, reportID, fullName, isSong) => {
    try {
        oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
        const accessToken = await oAuth2Client.getAccessToken();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: HOST_EMAIL,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });

        const options = isSong ? 'song' : 'profile';

        const mailOptions = {
            from: HOST_EMAIL,
            to: send_to,
            subject:
                '[NO-REPLY] We received report ' +
                reportID.toString() +
                ' about ' +
                rpType +
                ' on SoundVault',
            html: `<p>Hi ${fullName},</p><p>Your report on a violated ${options} has been received. We will review it as soon as possible.</p>`,
        };

        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        return error;
    }
};

const reply_email = async (
    send_to,
    rpType,
    reportID,
    email,
    message,
    fullName,
) => {
    try {
        oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
        const accessToken = await oAuth2Client.getAccessToken();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: HOST_EMAIL,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });

        console.log(HOST_EMAIL, send_to);

        const mailOptions = {
            from: HOST_EMAIL,
            to: send_to,
            subject:
                '[NO-REPLY] Reply to report ' +
                reportID.toString() +
                ' about ' +
                rpType +
                ' on SoundVault',
            html: `<p>Hi ${fullName},</p><p>${message}</p><p>For further information, please contact me at <a href="${email}">${email}</a></p>`,
        };

        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        return error;
    }
};

const reply_report = async (req, res) => {
    const { reportID, message } = req.body;
    try {
        const report = await ReportModel.findById(reportID);
        if (!report) {
            return res.status(404).json({
                message: 'Report is not found',
            });
        }

        email = req.user.email;
        const result = await reply_email(
            report.email,
            report.rpType,
            reportID,
            email,
            message,
            report.fullName,
        );

        if (!result) {
            return res.status(500).json({
                message: 'Failed to send your reply',
            });
        }

        report.status = true;
        report.assignee = req.user.name;
        await report.save();

        return res.status(200).json({
            status: report.status,
            assignee: report.assignee,
            message: 'Reply sent',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const reject_report = async (req, res) => {
    const { reportID } = req.body;
    try {
        const report = await ReportModel.findById(reportID);
        if (!report) {
            return res.status(404).json({
                message: 'Report is not found',
            });
        }
        email = req.user.email;
        const result = await reply_email(
            report.email,
            report.rpType,
            reportID,
            email,
            'Your report has been rejected',
            report.fullName,
        );

        if (!result) {
            return res.status(500).json({
                message: 'Failed to send your reply',
            });
        }

        report.status = false;
        report.assignee = req.user.name;
        await report.save();

        return res.status(200).json({
            status: report.status,
            assignee: report.assignee,
            message: 'Report rejected',
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
                    createdAt: report.createdAt,
                    isSong: report.isSong,
                    assignee: report.assignee,
                    status: report.status,
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
    reply_report,
    reject_report,
    send_report_on_profile,
    send_report_on_song,
    get_reports,
};
