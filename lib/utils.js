/*
 * Copyright 2016 Edify Software Consulting.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


 /**
 * Created by diugalde on 31/08/16.
 */

// Imports.
const _ = require('lodash');
const crypto = require('crypto');
const denodeify = require('denodeify');


/**
 * Returns a hased string using the sha256 algorithm.
 *
 * @param str
 * @returns string (Hashed value)
 */
function hash(str) {
    var hash256 = crypto.createHash('sha256')
        .update(str);
    return hash256.digest('hex');
}

/**
 * Returns a signature using mac-sha256 algorithm.
 *
 * @param strData - string
 * @param keyBuffer - buffer
 * @returns buffer (signature)
 */
function sign(strData, keyBuffer) {
    let hmac = crypto.createHmac('sha256', keyBuffer);
    hmac.update(strData);
    return hmac.digest();
}

/**
 * Escapes regex expression.
 *
 * @param str
 * @returns string
 * @private
 */
function _escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

/**
 * Replace all occurrences of a string.
 *
 * @param str - string
 * @param find - string
 * @param replace - string
 * @returns string
 */
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(_escapeRegExp(find), 'g'), replace);
}

/**
 * EncodeURL equivalent to java.net.URLEncoder.encode
 *
 * @param str - string
 * @returns string
 */
function encodeUrl(str) {
    return encodeURI(str)
        .replace(/%20/g, "+")
        .replace(/!/g, "%21")
        .replace(/'/g, "%27")
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29")
        .replace(/~/g, "%7E");
}

/**
 * Generate a random string with the specified length.
 *
 * @param length - integer.
 * @returns string (random sequence).
 */
function generateRandomString(length) {
    let buf = crypto.randomBytes(length);
    return buf.toString('hex');
}

/**
 * Decrypts an encrypted secret
 *
 * @param encryptedSecret the string to decrypt
 * @returns the decrypted string
 * @private
 */
function decrypt(encryptedSecret, passphrase) {
    let algorithm = 'aes-128-cbc';
    let iterations = 1024;
    let keyLength = 32;
    let salt = 'RwKwsDB3qUo6RD8YwHLoy+UkHTcgitWGLriAoGBXt30=';

    let pbkdf2 = denodeify(crypto.pbkdf2);
    return pbkdf2(new Buffer(passphrase), new Buffer(salt, 'base64'), iterations, keyLength, 'sha512').then(function(key) {

        var iv = key.slice(0, 16);
        var slicedKey = key.slice(16, key.length);

        var decipher = crypto.createDecipheriv(algorithm, slicedKey, iv);
        var dec = decipher.update(new Buffer(encryptedSecret, 'base64'), 'binary', 'base64');
        dec += decipher.final('base64');

        return Promise.resolve(new Buffer(dec, 'base64').toString())
    }).catch(function(err) {
        throw Promise.reject(err);
    })
}

/**
 * Encrypts a secret
 *
 * @param secret plain string to encrypt
 * @returns the encrypted string
 * @private
 */
function encrypt(secret, passphrase) {
    let algorithm = 'aes-128-cbc';
    let iterations = 1024;
    let keyLength = 32;
    let salt = 'RwKwsDB3qUo6RD8YwHLoy+UkHTcgitWGLriAoGBXt30=';

    let pbkdf2 = denodeify(crypto.pbkdf2);
    return pbkdf2(new Buffer(passphrase), new Buffer(salt, 'base64'), iterations, keyLength, 'sha512').then(function(key) {
        let iv = key.slice(0, 16);
        let slicedKey = key.slice(16, key.length);

        let cipher = crypto.createCipheriv(algorithm, slicedKey, iv);
        let enc = cipher.update(new Buffer(secret), 'binary', 'base64');
        enc += cipher.final('base64');

        return Promise.resolve(enc)
    }).catch(function(err) {
        throw err
    })
}


module.exports = {
    replaceAll: replaceAll,
    generateRandomString: generateRandomString,
    hash: hash,
    sign: sign,
    decrypt: decrypt,
    encrypt: encrypt,
    encodeUrl: encodeUrl
};
