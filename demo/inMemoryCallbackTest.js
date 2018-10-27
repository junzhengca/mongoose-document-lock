const mongoose = require('mongoose');

mongoose.plugin(require('../index'));

mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});

const testSchema = new mongoose.Schema({
    name: String
}, {timestamps: true});

const Test = mongoose.model('Test', testSchema);

// Promise style
Test.findOne({name: 'lol'})
    .then(doc => {
        doc.lock(release => {
            console.log("Locked 1.");
            setTimeout(() => {
                console.log("Release lock");
                release();
            }, 1000);
        });
    });


Test.findOne({name: 'lol'})
    .then(doc => {
        doc.lock(release => {
            console.log("Locked 2.");
            setTimeout(() => {
                console.log("Release lock");
                release();
            }, 1000);
        });
    });
