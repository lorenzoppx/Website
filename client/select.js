console.log('inside js')

//const mongoose = require('mongoose');
const mongodb = require("mongodb");

const MongoClient = require("mongodb").MongoClient;


function printList() {

    const dbName = "testdb";
    // Connection url
    var url = 'mongodb://127.0.0.1:27017';
    const client = new MongoClient(url);
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
        .then(cols => {
            let data = ["Ram", "Shyam", "Sita", "Gita"];
            let list = document.getElementById("myList");
            for (i = 0; i < data.length; ++i) {
                let li = document.createElement('li');
                li.innerText = data[i];
                list.appendChild(li);
            }
        })
        .finally(() => client.close());
}

function printLi() {
            let data = ["Ram", "Shyam", "Sita", "Gita"];
            let list = document.getElementById("myList");
            for (i = 0; i < data.length; ++i) {
                let li = document.createElement('li');
                li.innerText = data[i];
                list.appendChild(li);
            }
}