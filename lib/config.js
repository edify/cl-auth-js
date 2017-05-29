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
 * Created by diugalde on 14/09/16.
 */

var config = {
    redis: {
        host: (process.env.CL_REDIS_HOST || 'localhost'),
        port: (process.env.CL_REDIS_PORT || 6379),
        pw: (process.env.CL_REDIS_PW || 'root')
    },
    auth: {
        passphrase: (process.env.CL_AUTH_PASSPHRASE || 'defaultPassphrase')
    }
};


module.exports = config;
