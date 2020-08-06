var db = require('./lib/dbV2');
//var sleep = require('system-sleep');
//var sleep = require('sleep-promise');

console.log('mongodb sample');

// var curr = new Date();
// console.log('year:' + curr.getFullYear());
// console.log('mth:' + curr.getMonth());
// console.log('day:' + curr.getDate());
// var formdate = new Date(curr.getFullYear(),
//     curr.getMonth(),
//     curr.getDate(),
//     curr.getHours());
// console.log('formdate->' + formdate.toISOString());

// var lib = require('./lib');
// console.log(lib.say());

// var nconf = require('nconf');
// nconf.file('./config.json');
// console.log('nconf gives you -> ' + nconf.get('mongodb-url'));

// var MongoClient = require('mongodb').MongoClient;
// //var url = "mongodb://sa:1@ds035485.mlab.com:35485/first-mongo";
// var url = nconf.get('mongodb-url');

var years = [2018, 2019];
var mths = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
var days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28
];
var days2 = [1, 2];
var saveCounter = 0;
//db.connect().then(() => {
setTimeout(() => {
    years.forEach(yr => {
        //var yr = 2018;
        mths.forEach(mth => {
            //var mth = 2;
            days2.forEach(day => {
                //var day = 5;
                var filterDate = new Date(yr, mth, day, 9); // 5/1 9am
                var filter = {
                    enable: true,
                    'contents.date': filterDate
                };
                // db.retrieve('schedules', filter).then(schedules => {
                //     console.log('we have ' + schedules.length + ' schedule(s)');
                // }).catch(err => {
                //     console.log(err);
                // });

                db.save('test_schedules', { 'aDate': filterDate }).then(saved => {
                    saveCounter++;
                    console.log(JSON.stringify(filterDate) + ' saved. (' + saveCounter + ')');
                }).catch(err => {
                    console.log(err);
                });

                //console.log('sleep for 3 seconds');
                //sleep(3000);
            });
            //console.log('sleep for 3 seconds');
            //sleep(6000);
        });
    });
}, 3000);

// }).catch(err => {
//     console.log(err);
// });

console.log(`this is for v1.1`);
console.log(`this is branch v1.2`);
console.log('there is soemthing else to do');
console.log('also within v1.2');

console.log(`keep on adding`);