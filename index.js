/*
 * Highly modified version of redis-lock
 * https://github.com/errorception/redis-lock/blob/master/index.js
 */

const InMemoryLock = require('./src/InMemoryLock');
const RedisLock = require('./src/RedisLock');

const DEFAULT_TIMEOUT = 5000;
const DEFAULT_RETRY_DELAY = 50;

module.exports = function (schema, options) {

    schema.methods.lock = function (taskToPerform) {

        // Promise style
        if(options && options.promise) {
            return new Promise(resolve => {
                if (options.redis && options.redis.setnx) {
                    RedisLock.acquire(options.redis, this._id.toString(), DEFAULT_TIMEOUT, DEFAULT_RETRY_DELAY, lock => {
                        resolve(lock);
                    });
                } else {
                    InMemoryLock.acquire(this._id.toString(), DEFAULT_TIMEOUT, DEFAULT_RETRY_DELAY, lock => {
                        resolve(lock);
                    });
                }
            })
        }

        // Old fashion callback
        function onLockAcquired(lock) {
            taskToPerform(function() {
                lock.release();
            });
        }

        // Check if it is redis or normal lock
        if (options && options.redis && options.redis.setnx) {
            RedisLock.acquire(options.redis, this._id.toString(), DEFAULT_TIMEOUT, DEFAULT_RETRY_DELAY, onLockAcquired);
        } else {
            InMemoryLock.acquire(this._id.toString(), DEFAULT_TIMEOUT, DEFAULT_RETRY_DELAY, onLockAcquired);
        }
    };

};
