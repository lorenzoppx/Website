console.log('inside js')

// getting-started.js
const mongoose = require('mongoose');
const mongodb = require('mongodb');
//const User = require("./User")
const URI = "mongodb://127.0.0.1:27017/testdb"
//var a = mongoose.connect(URI)

const MongoClient = require("mongodb").MongoClient;

// Connection url
var url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url); // { useUnifiedTopology: true } removes connection warnings;

const dbName = "testdb";

client.connect().then(
    client => client.db(dbName).listCollections().toArray()
    // Returns a promise that will resolve to the list of the collections
    , console.log(client)
)
    //.then(cols => JSON.parse(cols))
    .then(cols => {
        var pendingWrites = [];
        for (let i = 0, endAt = Object.keys(cols).length; i < endAt; i++) {
            let thisWrite = cols[i].name;
            console.log(cols[i]);
            pendingWrites.push(thisWrite);
        }
        //console.log(pendingWrites);
        return Promise.all(pendingWrites);
            
    }).then(cols => console.log(cols))
    .finally(() => client.close());


/**

//const db = new mongoose.createConnection('mongodb://127.0.0.1:27017/testdb');

result = db.listCollections;
const docs = result; // Pega os documentos
console.log(docs);

run()
async function run() {
    const user = new User({ name: "Kyle", age: 26 })
    await user.save()
    console.log(user)
}
**/
/**
run2()
async function run2() {
    try {
        const us = User.findById("65c11322fefff5c2d2735c7b")
        //const query = User.find({ name:'Kyle' });
        const query = User.find({});
        query instanceof mongoose.Query; // true
        const docs = await query; // Pega os documentos
        console.log(docs)
    }
    catch(e) {
        console.log(e.message)
    }
}
**/