const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserModel = require('./User.js');
let fs = require('fs'); 
const { spawn } = require('child_process');
const path = require('path');
const Busboy = require('@fastify/busboy');
const mongodb = require("mongodb");
const timeout = require('connect-timeout');

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


app.post('/clip1', (req, res, next) => {
    //console.log(req.body); // This will log the parsed JSON
    //console.log(req.body['firstName']);
    console.log(req.complete); 
    console.log(req.body);
    
    console.log("User received!");
    console.log(req.headers['name']);
    const ext = path.extname(req.headers['name']);
    //res.send('User received!');
    //fs.appendFileSync('./csv/_myImage_' + '-' + Date.now() + '.csv', Buffer.from(arrayBuffer));
    
    console.log(req.body.img);
    
    const imagePath = './jpg/myImage' + '-' + Date.now() + ext;
    console.log(imagePath);
    
    // Read and display the file data on console
    //console.log(req.body.csv);
    
    //writer.write(req.body.img);
    
    // Respond with success message and the embedding
    //res.json({message: 'CSV received and saved successfully.',//filename: fileName,//embedding: embedding});
    
    // Call Python script to compute embedding
    const python = spawn('python', ['./server/embed_img.py', imagePath]);
    
    let result = '';
    python.stdout.on('data', data => result += data.toString());
    
    python.stderr.on('data', data => console.error(data.toString()));
    
    python.on('close', code => {
        if (code === 0) {
        //console.log(result);
        res.status(200).json(JSON.parse(result));
        } else {
        res.status(500).send('Embedding failed.');
        }
    });
    
    
    });

const { IncomingForm } = require('formidable');
app.use(cors());

app.post('/clipss', (req, res) => {
    const form = new IncomingForm({
      multiples: false,
      uploadDir: path.join(__dirname, './jpg'),
      keepExtensions: true,
      filename: (originalName, originalExt, part) => {
        const headerName = req.headers['name'] || originalName || 'file.unknown';
        const ext = path.extname(headerName) || originalExt || '.dat';
        return `myImage-${Date.now()}${ext}`;
      }
    });
  
    form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('❌ Erro no upload:', err);
          return res.status(500).send('Upload failed');
        }
    
        const file = files.img;
        if (!file) {
          return res.status(400).send('No file uploaded');
        }
    
        const filepath = Array.isArray(file) ? file[0].filepath : file.filepath;
        console.log('✅ Arquivo salvo em:', filepath);
    
        const python = spawn('python', ['server/embed_img.py', filepath]);
    
        let result = '';
        let pythonError = '';
    
        python.stdout.on('data', (data) => {
          result += data.toString();
        });
    
        python.stderr.on('data', (data) => {
          pythonError += data.toString();
          console.error('Python stderr:', data.toString());
        });
    
        python.on('close', (code) => {
          //fs.unlink(filepath, () => {}); // opcional: remove a imagem após o uso
    
          if (code !== 0) {
            console.error('❌ Python script failed:', pythonError);
            return res.status(500).send('Embedding generation failed');
          }
    
          try {
            const parsed = JSON.parse(result);
            console.log(parsed)
            res.status(200).json({ embedding: parsed });
          } catch (e) {
            console.error('❌ JSON parse error:', e);
            res.status(500).send('Invalid Python output');
          }
        });
      });
    });

app.use('/clip3', timeout('60s'));
app.post('/clip3', (req, res, next) => {
    const busboy = Busboy({ headers: req.headers });
    let imagePath = '';
    let fileExtension = '';

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        console.log(`Receiving file: ${filename.filename}`);

        fileExtension = path.extname(filename.filename);
        imagePath = `./jpg/myImage-${Date.now()}${fileExtension}`;
        
        // Save the file
        const writeStream = fs.createWriteStream(imagePath);
        file.pipe(writeStream);
    });

    busboy.on('field', (fieldname, val) => {
        console.log(`Received field ${fieldname}: ${val}`);
    });

    busboy.on('finish', () => {
        console.log('File upload completed!');
        
        if (!imagePath) {
            return res.status(400).send('No file uploaded.');
        }

        console.log('User received!');
        console.log('Image path:', imagePath);

        // Call Python script to compute embedding
        const python = spawn('python', ['./server/embed_img.py', imagePath]);

        let result = '';
        python.stdout.on('data', data => result += data.toString());

        python.stderr.on('data', data => {
            console.error('Python script error:', data.toString());
        });

        python.on('close', code => {
            // Clean up the saved image file
            fs.unlink(imagePath, (err) => {
                if (err) console.error('Error deleting file:', err);
            });

            if (code === 0) {
                try {
                    res.status(200).json(JSON.parse(result));
                } catch (err) {
                    res.status(500).send('Invalid response from Python script.');
                }
            } else {
                res.status(500).send('Embedding failed.');
            }
        });
    });

    busboy.on('error', err => {
        console.error('Busboy error:', err);
        res.status(500).send('File upload failed.');
    });

    req.pipe(busboy);
});

/*
app.post('/csv1', (req, res, next) => {
    //console.log(req.body); // This will log the parsed JSON
    //console.log(req.body['firstName']);
    console.log(req.complete); 
    console.log(req.body);

    console.log("User received!");
    //res.send('User received!');
    //fs.appendFileSync('./csv/_myImage_' + '-' + Date.now() + '.csv', Buffer.from(arrayBuffer));

    const imagePath = '../csv/myImage' + '-' + Date.now() + '.csv'
    let writer = fs.createWriteStream(imagePath);
  
    // Read and display the file data on console
    console.log(req.body.csv);  
    writer.write(req.body.csv);
});

app.use('/clip30', timeout('30s'));
app.post('/clip30', (req, res) => {
    const nameHeader = req.headers['name'] || 'file.unknown';
    const ext = path.extname(nameHeader) || '.dat';
    const filename = 'myImage-' + Date.now() + ext;
    const filepath = path.join(__dirname, './jpg', filename);
    
    let fileSaved = false;

    const busboy = new Busboy({ headers: req.headers });

    busboy.on('file', (fieldname, file, filename) => {
        console.log(`Uploading ${filename}...`);
        const writeStream = fs.createWriteStream(filepath);
        file.on('data', () => console.log('Receiving file chunk...'));
        file.pipe(writeStream);

        writeStream.on('close', () => {
            console.log('✅ Arquivo salvo em:', filepath);
            fileSaved = true;
        });

        writeStream.on('error', (err) => {
            console.error('Error saving file:', err);
            if (!res.headersSent) {
                res.status(500).send('Error saving file');
            }
        });
    });
    
    busboy.on('error', (err) => {
        console.error('Busboy error:', err);
        if (!res.headersSent) {
            res.status(500).send('Error processing upload');
        }
    });
    
    busboy.on('finish', () => {
        //if (!fileSaved) {return res.status(400).send('No file was uploaded');}

        const python1 = spawn('python', ['./server/embed_img.py', filepath]);
        let result = '';
        
        python1.stdout.on('data', (data) => {
            console.log('Python stdout:', data.toString());
            result += data.toString();
          });
          
          python1.stderr.on('data', (data) => {
            console.error('Python stderr:', data.toString());
          });

        python1.on('close', (code) => {
            console.log('Python process exited with code:', code);
            console.log('Raw Python output:', result); // Check this output
            if (code === 0) {
                try {
                    console.log(result)
                    const parsedResult = JSON.parse(result);
                    res.status(200).json(parsedResult); // Properly send JSON response
                } catch (e) {
                    console.error('Erro ao processar o resultado:', e);
                    res.status(500).send('Erro ao processar o embedding.');
                }
            } else {
                res.status(500).send('Falha ao gerar o embedding.');
            }
        });
    });
    
    req.pipe(busboy);
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
    var mybuff = Buffer.from(req.body.img);
    var int8view = new Uint8Array(req.body.img);
    writer.write(mybuff);
});
*/

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