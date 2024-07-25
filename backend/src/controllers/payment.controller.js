if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const axios = require('axios');

const deposit = async (req, res) => {
    const { amount, orderInfo } = req.body;
    const redirectUrl = process.env.CLIENT_URI;

    var partnerCode = 'MOMO';
    var accessKey = 'F8BBA842ECF85';
    var secretkey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    var requestId = partnerCode + new Date().getTime();
    var orderId = requestId;
    var ipnUrl = 'https://callback.url/notify';
    // var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
    var requestType = 'captureWallet';
    var extraData = '';

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature =
        'accessKey=' +
        accessKey +
        '&amount=' +
        amount +
        '&extraData=' +
        extraData +
        '&ipnUrl=' +
        ipnUrl +
        '&orderId=' +
        orderId +
        '&orderInfo=' +
        orderInfo +
        '&partnerCode=' +
        partnerCode +
        '&redirectUrl=' +
        redirectUrl +
        '&requestId=' +
        requestId +
        '&requestType=' +
        requestType;
    //puts raw signature
    console.log('--------------------RAW SIGNATURE----------------');
    console.log(rawSignature);
    //signature
    const crypto = require('crypto');
    var signature = crypto
        .createHmac('sha256', secretkey)
        .update(rawSignature)
        .digest('hex');
    console.log('--------------------SIGNATURE----------------');
    console.log(signature);

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        accessKey: accessKey,
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        extraData: extraData,
        requestType: requestType,
        signature: signature,
        lang: 'en',
    });

    const options = {
        method: 'POST',
        url: 'https://test-payment.momo.vn/v2/gateway/api/create',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody),
        },
        data: requestBody,
    };

    try {
        const response = await axios(options);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    deposit,
};
