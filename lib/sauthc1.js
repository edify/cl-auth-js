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
const dateFormat = require('dateformat');
const url = require('url');

const utils = require('./utils');


// Constant variables.
const HOST_HEADER               = "Host";
const AUTHORIZATION_HEADER      = "Authorization";
const STORMPATH_DATE_HEADER     = "X-Stormpath-Date";
const ID_TERMINATOR             = 'sauthc1_request';
const ALGORITHM                 = 'HMAC-SHA-256';
const AUTHENTICATION_SCHEME     = 'SAuthc1';
const SAUTHC1_ID                = 'sauthc1Id';
const SAUTHC1_SIGNED_HEADERS    = 'sauthc1SignedHeaders';
const SAUTHC1_SIGNATURE         = 'sauthc1Signature';
const DATE_FORMAT               = 'yyyymmdd';
const TIMESTAMP_FORMAT          = "yyyymmdd'T'HHMMss'Z'";


/**
 * Generates an authorization header using the SAuthc1 algorithm for the signature.
 * Note: The received headers object will be modified. This function adds Host and date headers.
 *
 * @param headers - object
 * @param method - string
 * @param requestURL - string
 * @param body - string
 * @param date - date object
 * @param credentials - object with the following structure {apiKeyId: 'string', apiSecretKey: 'string'}
 * @param nonce - string (should be random)
 * @returns string (Authorization header ready to be sent).
 */
function sign(headers, method, requestURL, body, date, credentials, nonce) {
    try {
        let timestamp = dateFormat(date, TIMESTAMP_FORMAT, true);
        let dateStamp = dateFormat(date, DATE_FORMAT, true);
        let urlObject = url.parse(requestURL, true);

        // Set new headers.
        headers[HOST_HEADER] = urlObject.host;
        headers[STORMPATH_DATE_HEADER] = timestamp;

        let signedHeadersString = getSignedHeadersString(headers);

        // Build canonical request.
        let canonicalRequest = `${method.toUpperCase()}\n${canonicalizeResourcePath(urlObject.pathname)}\n` +
            `${canonicalizeQueryString(urlObject.query)}\n${canonicalizeHeadersString(headers)}\n` +
            `${signedHeadersString}\n${utils.hash(body)}`;

        // Create string to sign.
        let id = `${credentials.apiKeyId}/${dateStamp}/${nonce}/${ID_TERMINATOR}`;
        let stringToSign = `${ALGORITHM}\n${timestamp}\n${id}\n${utils.hash(canonicalRequest)}`;

        // Generate final signature.
        let secret = `${AUTHENTICATION_SCHEME}${credentials.apiSecretKey}`;
        let signDate = utils.sign(dateStamp, secret);
        let signNonce = utils.sign(nonce, signDate);
        let signing = utils.sign(ID_TERMINATOR, signNonce);
        let signature = utils.sign(stringToSign, signing).toString('hex');

        let authorizationHeader = `${AUTHENTICATION_SCHEME} ` +
            `${SAUTHC1_ID}=${id}, ${SAUTHC1_SIGNED_HEADERS}=${signedHeadersString}, ${SAUTHC1_SIGNATURE}=${signature}`;

        // Set authorization header.
        headers[AUTHORIZATION_HEADER] = authorizationHeader;

        return authorizationHeader;
    } catch(err) {
        throw err
    }
}

/**
 * Creates a string containing all header names and their values.
 * The headers are sorted by name first.
 * @example header1:value1
*           header2:value2
 *
 * @param headers - object.
 * @returns string
 */
function canonicalizeHeadersString(headers) {
    let headerNames = Object.keys(headers).sort();
    let headerStringList = _.map(headerNames, function(headerName) {
        return `${headerName.toLowerCase()}:${headers[headerName]}`
    });
    return `${_.join(headerStringList, '\n')}\n`
}

/**
 * Creates a string containing all query params and their values properly encoded.
 * The query params are sorted first.
 * @example param1=value1&param2=value2
 *
 * @param queryParams - object.
 * @returns string
 */
function canonicalizeQueryString(queryParams) {
    queryParamsNames = Object.keys(queryParams).sort();

    let encodedName, paramValue, encodedValue;
    let queryStringList = _.map(queryParamsNames, function(paramName) {
        encodedName = encodeURL(decodeURIComponent(paramName), false, true);
        paramValue = queryParams[paramName];
        encodedValue = encodeURL(decodeURIComponent(paramValue), false, true);
        return `${encodedName}=${encodedValue}`
    });
    return _.join(queryStringList, '&')
}

/**
 * Creates a string containing all header names separated by ; properly encoded.
 * The header names are sorted and lowercase.
 * @example host;x-stormpath-date
 *
 * @param headers - object.
 * @returns string
 */
function getSignedHeadersString(headers) {
    let sortedHeaderNames = Object.keys(headers).sort();
    let signedHeaderStringList = _.map(sortedHeaderNames, function(headerName) {
        return headerName.toLowerCase()
    });
    return _.join(signedHeaderStringList, ';')
}

/**
 * Encodes the received path.
 *
 * @param path - url string.
 * @returns string (encoded path).
 */
function canonicalizeResourcePath(path) { return path.length === 0 ? '/' : encodeURL(decodeURIComponent(path), true, true) }

/**
 * Encodes the string value doing the following replacements:
                                                            + to %20
                                                            * to %2A
                                                            %7E back to ~
                                                            %2F back to /

 *
 * @param value - string to encode.
 * @param isPath - boolean.
 * @param isCanonical - boolean.
 * @returns string (encoded value).
 */
function encodeURL(value, isPath, isCanonical) {
    if(!value || value === '') {
        return ''
    }

    let encoded = encodeURIComponent(value);

    if(isCanonical) {
        encoded = utils.replaceAll(encoded, "+", "%20");
        encoded = utils.replaceAll(encoded, "*", "%2A");
        encoded = utils.replaceAll(encoded, "%7E", "~");
        if(isPath) {
            encoded = utils.replaceAll(encoded, "%2F", "/")
        }
    }
    return encoded
}

module.exports = {
    sign: sign
};
