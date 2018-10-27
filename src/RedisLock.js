const Lock = require('./Lock');

module.exports = class RedisLock extends Lock {

    constructor(lockName, timeOutValue, client) {
        super(lockName, timeOutValue);
        this.client = client;
    }

    /**
     * Acquire a new redis lock
     * @param client
     * @param lockName
     * @param timeout
     * @param retryDelay
     * @param onLockAcquired
     */
    static acquire(client, lockName, timeout, retryDelay, onLockAcquired) {
        function retry() {
            setTimeout(function () {
                RedisLock.acquire(client, lockName, timeout, retryDelay, onLockAcquired);
            }, retryDelay);
        }

        const lockTimeoutValue = (Date.now() + timeout + 1);
        client.set(lockName, lockTimeoutValue, 'PX', timeout, 'NX', function (err, result) {
            if (err || result === null) return retry();
            let lock = new RedisLock(lockName, lockTimeoutValue, client);
            onLockAcquired(lock);
        });
    }

    /**
     * Release redis lock
     */
    release() {
        this.client.del(this.name, () => {});
    }
};
