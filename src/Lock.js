module.exports = class Lock {
    constructor(lockName, timeOutValue) {
        this.name = lockName;
        this.timeOutValue = timeOutValue;
    }

    isTimedOut() {
        return this.timeOutValue < Date.now();
    }

    static acquire() {}
    static release() {}
};
