/**
 * Created by diugalde on 14/09/16.
 */

var config = {
    redis: {
        host: (process.env.CL_REDIS_HOST || 'localhost'),
        port: (process.env.CL_REDIS_PORT || 6379)
    },
    auth: {
        passphrase: (process.env.CL_AUTH_PASSPHRASE || 'defaultPassphrase')
    }
};


module.exports = config;
