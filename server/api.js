const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserModel = require('./User.js');
let fs = require('fs'); 

const mongodb = require("mongodb");

const bodyParser = require('body-parser');
const app = express();
app.use(cors());
//app.use(express.json());
//app.use(bodyParser.urlencoded({extended: false}));
//app.use(express.json({limit: '50mb'}));
//app.use(express.urlencoded({limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

mongoose.connect("mongodb://127.0.0.1:27017/testdb");
const MongoClient = require("mongodb").MongoClient;

app.get('/getDatasets', (req,res) => {
    
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
        })
        .then(cols => {
            console.log(cols);
            res.json(cols);
        })
        .catch(err => res.json(err))
        .finally(() => client.close());
});

app.get('/getUsers', (req,res) => {
    UserModel.find()
    .then(users => res.json(users))
    .catch(err => res.json(err))
});

app.post('/csv', (req, res, next) => {
    //console.log(req.body); // This will log the parsed JSON
    //console.log(req.body['firstName']);
    console.log(req.complete); 
    console.log(req.body);

    console.log("User received!");
    //res.send('User received!');
    //fs.appendFileSync('./csv/_myImage_' + '-' + Date.now() + '.csv', Buffer.from(arrayBuffer));

    let writer = fs.createWriteStream('../csv/myImage' + '-' + Date.now() + '.csv');
  
    // Read and display the file data on console
    console.log(req.body.csv);  
    writer.write(req.body.csv);
});

app.post('/jpg', (req, res, next) => {
    //console.log(req.body); // This will log the parsed JSON
    //console.log(req.body['firstName']);
    
    //console.log(req.complete); 
    //console.log(req.body);
    //console.log(req.body.image);

    console.log("Image received!");
    res.send('Image received!');
    let writer = fs.createWriteStream('./jpg/myImage' + '-' + Date.now() + '.jpg');
  
    // Read and display the file data on console
    //console.log(req.body.image_buffer);  
    var mybuff = Buffer.from(req.body.csv);
    var int8view = new Uint8Array(req.body.csv);
    writer.write(mybuff);
});

/*
let multer = require ( 'multer' );
let processMultipart = multer ( { storage : multer.memoryStorage () } );

app.use ( '/foo', processMultipart.array ( "foo" ), ( req, res ) => {
    console.log ( req.body );
    res.send ( "ok" );
} );
*/

app.listen(3001, () => {
    console.log("Serve ris running");
}).setTimeout(0);