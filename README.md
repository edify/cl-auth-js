# cl-auth-js

Common Library Authentication Package for nodejs. This npm package is used to generate authentication headers using the Stormpath's SAuthc1 algorithm.

---

## Usage

If you want to use the signer, you must import it and invoke the sign function like the example below:
```javascript
    const require('path/to/sauthc1');

    let headers = {};
    let requestURL = 'https://api.stormpath.com/v1/';
    let method = 'get';
    let body = '';
    let date = new Date(Date.UTC(2013, 6, 1, 0, 0, 0, 0));
    let credentials = {apiKeyId: 'MyId', apiSecretKey: 'Shush!'};
    let nonce = 'a43a9d25-ab06-421e-8605-33fd1e760825';

    let authHeader = sautchc1.sign(headers, method, requestURL, body, date, credentials, nonce);

    console.log(authHeader);

    /*
        Result:
        'SAuthc1 sauthc1Id=MyId/20130701/a43a9d25-ab06-421e-8605-33fd1e760825/sauthc1_request, ' +
        'sauthc1SignedHeaders=host;x-stormpath-date, ' +
        'sauthc1Signature=990a95aabbcbeb53e48fb721f73b75bd3ae025a2e86ad359d08558e1bbb9411c'
    */

```

If you want to import the apiKeyService, you must set the following environment variables:
```bash
$ export CL_AUTH_PASSPHRASE=
$ export CL_REDIS_PORT=
```


In case you want to use the sauthc1_cli:
```bash
$ npm install
$ chmod +x bin/sauthc1_cli
$ ./bin/sauthc1_cli -h
```
