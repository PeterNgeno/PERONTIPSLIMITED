const axios = require('axios');
require('dotenv').config();

const initiateSTKPush = async (phone, amount) => {
    try {
        // Logic to send STK Push using Mpesa Daraja API
        console.log(`STK Push initiated for ${phone} with amount ${amount}`);
    } catch (error) {
        console.error('Payment error:', error);
    }
};

module.exports = initiateSTKPush;
