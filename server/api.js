const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserModel = require('./User.js');
let fs = require('fs'); 

const mongodb = require("mongodb");

const csv = require('fast-csv');

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

const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
  };
app.get('/export/:collectionId', function(req, res){
    var collection = req.params.collectionId;
    const { spawn } = require("child_process");
    var file = './'+ collection + '.csv';
    const ls = spawn('mongoexport',['--db','testdb','--collection',collection,'--out',file]);
    console.log('export');
    ls.stdout.on("data", data => {
        console.log(`stdout: ${data}`);
    });
    
    ls.stderr.on("data", data => {
        console.log(`stderr: ${data}`);
    });
    
    ls.on('error', (error) => {
        console.log(`error: ${error.message}`);
    });
    
    ls.on("close", code => {
        console.log(`child process exited with code ${code}`);
        var file = './'+ collection + '.csv';
        res.download(file); // Set disposition and send it.
        var loc = process.cwd();
        console.log('Current directory: ' + loc);
        console.log(loc);
    });

});

app.get('/getUsers', (req,res) => {
    UserModel.find()
    .then(users => res.json(users))
    .catch(err => res.json(err))
});

app.get('/getline/:collectionID', (req,res) => {
    var collection = req.params.collectionID;
    console.log(collection)
    const dbName = "testdb";
    // Connection url
    var url = 'mongodb://127.0.0.1:27017';
    const client = new MongoClient(url);
    client.connect().then(
        client => client.db(dbName).collection(collection).find({}).toArray()
        //.toArray()
        // Returns a promise that will resolve to the list of the collections
        //, console.log(client)
    )
    .then(cli => {
        console.log(cli);
        res.json(cli);
    })
    .catch(err => res.json(err))
    .finally(() => client.close());
    //client.close();
      
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

var server = app.listen(3001, () => {
    console.log("Serve ris running");
});
server.setTimeout(500000);


/*OLD ROUTES
app.get('/download/:collectionId', async function(req, res){
    try {
        const dbName = "testdb";
        // Connection url
        var url = 'mongodb://127.0.0.1:27017';
        const client = new MongoClient(url);
        await client.connect();
        console.log("db connected");
        const db = client.db(dbName);
        console.time("X")
        const pipelineStages = [{
            $match: {
                // your pipeline here
            }
        }, {
            $sort: {
                _id: -1
            }
        }, {
            $limit: 500000000
        }]
        var collection = req.params.collectionId;
        //const cursor = db.collection(collection).aggregate(pipelineStages);
        const cursor = db.collection(collection).aggregate(pipelineStages);
        const csvStream = csv.format({ headers: true });
        const writeStream = fs.createWriteStream('./'+ collection + '.csv');
        csvStream.pipe(writeStream).on('finish', () => {
            console.log("DONE");
            var file = './'+ collection + '.csv';
            res.download(file); // Set disposition and send it.
            var loc = process.cwd();
            console.log('Current directory: ' + loc);
            console.log(loc);
            
        }).on('error', err => console.error(err));
        var x = 0;
        while (await cursor.hasNext()) {
            x = x+1;
            const doc = await cursor.next();
            csvStream.write(doc);
            console.log(`${doc._id} written: ${x}`);
            let delayres = await delay(0.001);
        }
        console.log('done');
        console.timeEnd("X");
        csvStream.end();
        writeStream.end();
    } catch (e) {
        console.error(e);
    }
  });
app.get('/get2/:collectionId', async (req, res) => {
    console.log(req.params.collectionId);
    const dbName = "testdb";
    // Connection url
    var url = 'mongodb://127.0.0.1:27017';
    const client = new MongoClient(url);
    try {
        await client.connect();
        console.log("db connected");
        const db = client.db(dbName);
        console.time("X")
        const bucket = new mongodb.GridFSBucket(db);
        let downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId('65c119c5e8c59276c3cfcfbb'))

        downloadStream.on("file", (file)=>{
            res.set("Content-Type", file.contentType)
        })

        downloadStream.pipe(res)
    }
    catch (e) {
        console.error(e);
    }

});

app.get('/get/:collectionId', async (req, res) => {
    console.log(req.params.collectionId);
    const dbName = "testdb";
    // Connection url
    var url = 'mongodb://127.0.0.1:27017';
    const client = new MongoClient(url);
    try {
        await client.connect();
        console.log("db connected");
        const db = client.db(dbName);
        console.time("X")
        const pipelineStages = [{
            $match: {
                // your pipeline here
            }
        }, {
            $sort: {
                _id: -1
            }
        }, {
            $limit: 50000
        }]
        const cursor = db.collection(req.params.collectionId).aggregate(pipelineStages);
        const csvStream = csv.format({ headers: true });
        const writeStream = fs.createWriteStream('./myfile.csv');

        csvStream.pipe(writeStream).on('finish', () => {
            console.log("DONE");
            const file = `myfile.csv`;
            res.download(file); // Set disposition and send it.
        }).on('error', err => console.error(err));
        while (await cursor.hasNext()) {
            const doc = await cursor.next();
            csvStream.write(doc);
            console.log(`${doc._id} written`);
        }
        console.log('done');
        console.timeEnd("X");
        csvStream.end();
        writeStream.end();
    } catch (e) {
        console.error(e);
    }
  });

let multer = require ( 'multer' );
let processMultipart = multer ( { storage : multer.memoryStorage () } );

app.use ( '/foo', processMultipart.array ( "foo" ), ( req, res ) => {
    console.log ( req.body );
    res.send ( "ok" );
} );

app.get('/download2/:collectionId', function(req, res){
    // let url = "mongodb://username:password@localhost:27017/";
    let url = "mongodb://localhost:27017/";
    var collection = req.params.collectionId;
    const ws = fs.createWriteStream('./'+ collection + '.csv');
    mongodb.MongoClient.connect(
        url,
        { useNewUrlParser: true, useUnifiedTopology: true },
        (err, client) => {
          if (err) throw err;
      
          client
            .db("testdb")
            .collection(collection)
            .find({})
            .toArray((err, data) => {
              if (err) throw err;
      
              console.log(data);
              fastcsv
                .write(data, { headers: true })
                .on("finish", function() {
                  console.log("Write to bezkoder_mongodb_fastcsv.csv successfully!");
                })
                .pipe(ws);
      
              client.close();
            });
        }
      );
});
*/