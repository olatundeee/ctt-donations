import { getToken } from '@chakra-ui/react';
import axios from 'axios';
var jwt = require('jsonwebtoken');

const API_URL = 'https://ctt-api.onrender.com'

export default  {
    savePaymentDetails: async function (paymentDetails) {
        const savePD = await axios.post(`${API_URL}/save-payment`, paymentDetails);
        return savePD
    },

    getToken: async function (username) {
        try {
            const token = jwt.sign({ id: username }, 'config#2*Tm34', {
                expiresIn: 86400
            });
            console.log(token)
            return token;   
        } catch (error) {
            console.log(error)
        }
    },

    getAllDonations: async function () {
        const donations = await axios.get(`${API_URL}/all-donations`);
        return donations
    }
}