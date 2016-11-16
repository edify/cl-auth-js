/**
 * Created by diugalde on 13/09/16.
 */

const bluebird = require('bluebird');
const redis = require('redis');

const config = require('../config');
const utils = require('../utils');

// Promisify redis client.
bluebird.promisifyAll(redis.RedisClient.prototype);

var apiKeyService = {

    /**
     * Set passphrase and redisClient properties.
     */
    init() {
        this.passphrase = config.auth.passphrase;
        this.redisClient = redis.createClient(config.redis.port);
    },

    /**
     * Retrieves and decrypts the corresponding secret key for the given apiKeyId.
     *
     * @param apiKeyId
     * @returns promise
     * @private
     */
    getApiSecretKey(apiKeyId) {
        let decryptionPassphrase = this.passphrase;
        return this.redisClient.hgetAsync(apiKeyId, 'apiSecretKey').then(function(secret) {
            return Promise.resolve(utils.decrypt(secret, decryptionPassphrase));
        }).catch(function(err) {
            return Promise.reject(err);
        });
    }
};


module.exports = (function() {
    let service = Object.create(apiKeyService);
    service.init();
    return service
})();

