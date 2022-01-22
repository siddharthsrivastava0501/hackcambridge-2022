const fs = require('fs');
require('dotenv').config();
const {KEY} = require('./config.js')
const { Deepgram } = require('@deepgram/sdk');

const socket = new WebSocket('wss://api.deepgram.com/v1/listen', [
    'token',
    KEY,
])
