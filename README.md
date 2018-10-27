# Mongoose Document Lock

Easy to use document lock plugin for mongoose. Both in-memory lock and Redis lock.

If you are implementing this lock, it is usually a good idea to remove the `versionKey` field in your schema, since you don't need an optimistic lock if you are using this library.

## Install

```
$ npm install mongoose-schema-lock
```

> Unfortunately mongoose-document-lock is taken :(

Then in your code

```js
mongoose.plugin(require('mongoose-schema-lock'));
```

By default, locks will be stored in-memory, if you wish to use Redis, you can pass an `node_redis` client instance in config (more on this later).

## Basic Usage

To lock a document, simply call `document.lock(callback)`.

```javascript
User.findOne({name: "Jun"}, function(err, user) {
    user.lock(function(release) {
        // Do you stuff here
        release();
    })
})
```

Once you lock a document, no other `.lock` calls will be able to obtain the lock for that specific document until you call `release()`.

You can find some demos within `/demo` folder.

## Use Promises

You can choose to use promises instead of callbacks, to do this, simply pass `promise: true` in configurations.

```javascript
mongoose.plugin(require('mongoose-schema-lock'), {promise: true});

User.findOne({name: "Jun"}, function(err, user) {
    user.lock().then(lock => {
        // Do your sutff
        lock.release();
    })
})
```

## Use Redis

If you have multiple servers load-balanced, or wish to share locks across applications, you might want to use Redis.

To use Redis, simply pass a Redis client in configurations.

```javascript
const redis = require("redis"),
      client = redis.createClient();

mongoose.plugin(require('../index'), {redis: client});
```

## Configurations

```
{
    redis: node_redis.client, // If this is set, locks will use Redis instead of in-memory
    promise: Boolean // If true, lock() will return a promise instead
}
```
