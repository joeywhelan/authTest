/**
 * @fileoverview Twitter OAuth example.
 * @author Joey Whelan <joey.whelan@gmail.com>
 */

/*jshint esversion: 6 */
'use strict';
'use esversion 6';

const fetch = require('node-fetch');
const btoa = require('btoa');

const CONSUMER_KEY = process.env.CONSUMER_KEY;
const CONSUMER_SECRET = process.env.CONSUMER_SECRET;
const AUTH_URL = 'https://api.twitter.com/oauth2/token';

function urlEncode (str) {
    return encodeURIComponent(str)
      .replace(/!/g, '%21')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\*/g, '%2A')
}

/**
 * Fetches an app-only bearer token via Twitter's oauth2 interface
 * @param {string} origin - URL to Twitter's OAuth2 interface
 * @return {string} - Bearer token
 */
function getTwitterToken(url) {
    const consumerToken = btoa(urlEncode(CONSUMER_KEY) + ':' + urlEncode(CONSUMER_SECRET));

    return fetch(url, {
        method: 'POST',
        headers: {
            'Authorization' : 'Basic ' + consumerToken,
            'Content-Type' : 'application/x-www-form-urlencoded;charset=UTF-8'
        }, 
        body : 'grant_type=client_credentials'
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        else {
            throw new Error('Response Status: ' + response.status);
        }
    })
    .then(json => {
        if (json.token_type == 'bearer') {
            return json.access_token;
        }
        else {
            throw new Error('Invalid token type: ' + json.token_type);
        }
    });  
}


getTwitterToken(AUTH_URL)
.then(token => {
    console.log(token);
})
