let locks = {};

const Lock = require('./Lock');

module.exports = class InMemoryLock extends Lock {

    constructor(lockName, timeOutValue) {
        super(lockName, timeOutValue);
    }

    /**
     * Acquire a new in memory lock
     * @param lockName
     * @param timeout
     * @param retryDelay
     * @param onLockAcquired
     */
    static acquire(lockName, timeout, retryDelay, onLockAcquired) {
        function retry() {
            setTimeout(function () {
                InMemoryLock.acquire(lockName, timeout, retryDelay, onLockAcquired);
            }, retryDelay);
        }

        // The lock was not released
        if (locks[lockName] && !locks[lockName].isTimedOut()) {
            return retry();
        } else {
            locks[lockName] = new InMemoryLock(lockName, Date.now() + timeout + 1);
            onLockAcquired(locks[lockName]);
        }
    }

    /**
     * Release the in memory lock
     */
    release() {
        locks[this.name] = null;
    }
};
