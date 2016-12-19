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
 * Created by diugalde on 05/09/16.
 */

const args = require('args');
const jsonStableStringify = require('json-stable-stringify');

const signer = require('./sauthc1');


function generateRandomString(len) {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(let i = 0; i < len; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function main() {
    try {
        args.option('url', 'URL');
        args.option('method', 'HTTP Method');
        args.option('body', 'In case it\'s a POST request, the JSON data would go here');
        args.option('id', 'ApiKeyId');
        args.option('secret', 'ApiSecretKey');
        const flags = args.parse(process.argv);

        let headers = {};
        let method = flags.method.toUpperCase();
        let url = flags.url;
        let body;
        let date = new Date();
        let nonce = generateRandomString(10);
        let credentials = {apiKeyId: flags.id, apiSecretKey: flags.secret};

        if (method == 'POST') {
            body = JSON.parse(flags.body);
            body = jsonStableStringify(body).replace(/[ \n]/g, "");
        } else {
            body = '';
        }

        signer.sign(headers, method, url, body, date, credentials, nonce);

        console.log(headers);
    } catch (err) {
        console.log(err);
    }

}


module.exports = {
    main: main
};
