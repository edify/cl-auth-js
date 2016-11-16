/**
 * Created by diugalde on 01/09/16.
 */

const assert = require('assert');

const sautchc1 = require('../lib/sauthc1');


describe('Generate authorization header using sauthc1', function() {

    let method = 'get';
    let body = '';
    let date = new Date(Date.UTC(2013, 6, 1, 0, 0, 0, 0));
    let credentials = {apiKeyId: 'MyId', apiSecretKey: 'Shush!'};
    let nonce = 'a43a9d25-ab06-421e-8605-33fd1e760825';

    it('Works when the url does not contain query params', function(done) {
        let headers = {};
        let requestURL = 'https://api.stormpath.com/v1/';
        let authHeader = sautchc1.sign(headers, method, requestURL, body, date, credentials, nonce);

        let expAuthHeader = 'SAuthc1 sauthc1Id=MyId/20130701/a43a9d25-ab06-421e-8605-33fd1e760825/sauthc1_request, ' +
                            'sauthc1SignedHeaders=host;x-stormpath-date, ' +
                            'sauthc1Signature=990a95aabbcbeb53e48fb721f73b75bd3ae025a2e86ad359d08558e1bbb9411c';

        assert.equal(authHeader, expAuthHeader);
        done()
    });

    it('Works when the url contains multiple query params', function(done) {
        let headers = {};
        let requestURL = 'https://api.stormpath.com/v1/applications/77JnfFiREjdfQH0SObMfjI/groups?q=group&limit=25&offset=25';
        let authHeader = sautchc1.sign(headers, method, requestURL, body, date, credentials, nonce);

        let expAuthHeader = 'SAuthc1 sauthc1Id=MyId/20130701/a43a9d25-ab06-421e-8605-33fd1e760825/sauthc1_request, ' +
                            'sauthc1SignedHeaders=host;x-stormpath-date, ' +
                            'sauthc1Signature=e30a62c0d03ca6cb422e66039786865f3eb6269400941ede6226760553a832d3';

        assert.equal(authHeader, expAuthHeader);
        done()
    });

});
