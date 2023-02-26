
import {keychain, isKeychainInstalled, hasKeychainBeenUsed} from '@hiveio/keychain'
import { notification } from 'antd';
import axios from 'axios';

const API_URL = 'https://ctt-api.onrender.com'

export default {
    async savePaymentDetails(paymentDetails) {
        const savePD = await axios.post(`${API_URL}/save-payment`, paymentDetails);
        return savePD
    }
}