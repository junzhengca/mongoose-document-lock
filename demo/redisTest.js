const mongoose = require('mongoose');
const redis = require("redis"),
    client = redis.createClient();

mongoose.plugin(require('../index'), {
    promise: true,
    redis: client
});

mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});

const testSchema = new mongoose.Schema({
    name: String
}, {timestamps: true});

const Test = mongoose.model('Test', testSchema);


Test.findOne({name: 'lol'})
    .then(doc => {
        doc.lock().then(lock => {
            console.log("Locked 1.");
            setTimeout(() => {
                console.log("Release lock");
                lock.release();
            }, 1000);
        })
    });


Test.findOne({name: 'lol'})
    .then(doc => {
        doc.lock().then(lock => {
            console.log("Locked 2.");
            setTimeout(() => {
                console.log("Release lock");
                lock.release();
            }, 1000);
        })
    });
