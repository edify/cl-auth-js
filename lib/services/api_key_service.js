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
        this.redisClient = redis.createClient(config.redis.port, config.redis.host);
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
            return !secret ? Promise.resolve(secret) : Promise.resolve(utils.decrypt(secret, decryptionPassphrase));
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

