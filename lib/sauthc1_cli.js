/**
 * Created by diugalde on 05/09/16.
 */

const args = require('args');

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
            body = flags.body;
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
