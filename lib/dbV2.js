var nconf = require('nconf');
nconf.file('./config.json');
var mongoUrl = nconf.get('mongodb-url');
var mongoDb = nconf.get('mongodb-db');
var mongoClient = require('mongodb').MongoClient;
//var sleep = require('sleep-promise');
var sync = require('sync');
var conn, dbo;
var lastConn = null;
var seconds = 10;
var intervalId;

// sync(function() {
//     console.log('. to create a new connection');
//     mongoClient.connect(mongoUrl, function(err, db) {
//         if (err) console.log(err);
//         var conn = db;
//         dbo = db.db(mongoDb);
//         db.on('close', () => { console.log('-> lost closed'); });
//         db.on('reconnect', () => { console.log('-> reconnected'); });

//         lastConn = new Date();
//         intervalId = setInterval(() => {
//             console.log('conn check .. ' + lastConn);
//             var expiredOn = new Date(lastConn.getTime() + (1000 * seconds));
//             var current = new Date();
//             //console.log(expiredOn + ' > ' + current);
//             if (expiredOn < current) {
//                 clearInterval(intervalId);
//                 conn.close();
//             }
//         }, 1000);
//     });
// });

var connect = () => {
    if (lastConn == null) {
        lastConn = new Date();
        console.log('. to create a new connection');
        mongoClient.connect(mongoUrl, function(err, db) {
            if (err) console.log(err);
            else {
                var conn = db;
                dbo = db.db(mongoDb);
                console.log('connection created');
                db.on('close', () => { console.log('-> lost closed'); });
                db.on('reconnect', () => { console.log('-> reconnected'); });

                //auto close after n seconds of inactivity
                intervalId = setInterval(() => {
                    console.log('conn check .. ' + lastConn);
                    var expiredOn = new Date(lastConn.getTime() + (1000 * seconds));
                    var current = new Date();
                    //console.log(expiredOn + ' > ' + current);
                    if (expiredOn < current) {
                        lastConn = null;
                        clearInterval(intervalId);
                        conn.close();

                    }
                }, 1000);
            }
        });
    }
};

// retrieveOne: (coll, filter) => {
//     return new Promise(function(resolve, reject) {
//         connect().then(dbo => {
//             dbo.collection(coll).findOne(filter, function(err, result) {
//                 if (err) reject(err);
//                 resolve(result);
//             });
//         }).catch(err => {
//             reject(err);
//         });
//     });
// },

var retrieve = (coll, filter) => {
    return new Promise(function(resolve, reject) {
        connect();
        lastConn = new Date();
        dbo.collection(coll).find(filter).toArray(function(err, result) {
            if (err) reject(err);
            resolve(result);
        });
    });

};

// any: (coll, filter) => {
//     return new Promise(function(resolve, reject) {
//         connect().then(dbo => {
//             dbo.collection(coll).findOne(filter, function(err, result) {
//                 if (err) reject(err);
//                 resolve(result);
//             });
//         }).catch(err => {
//             reject(err);
//         });
//     });
// },

var bulkSave = (coll, objs) => {
    lastConn = new Date();
    return new Promise(function(resolve, reject) {
        var col = dbo.collection(coll);
        var batch = col.initializeOrderedBulkOp();
        objs.forEach(obj => {
            batch.insert(obj);
        });
        batch.execute(function(err, result) {
            resolve(result);
        });
    });
};

var save = (coll, obj) => {
    return new Promise(function(resolve, reject) {
        sync(() => {
            connect();
            lastConn = new Date();
            console.log('save> ' + lastConn);

            dbo.collection(coll).insertOne(obj, function(err, result) {
                if (err) reject(err);
                resolve(result);
            });
        });
    });
};

var update = (coll, filter, newValues) => {
    lastConn = new Date();
    return new Promise(function(resolve, reject) {
        dbo.collection(coll).update(filter, newValues, { multi: true }, function(err, result) {
            if (err) reject(err);
            resolve(result);
        });
    });
};

module.exports = {
    //connect: connect,
    bulkSave: bulkSave,
    save: save,
    update: update,
    retrieve: retrieve
}