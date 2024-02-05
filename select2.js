const { MongoClient } = require('mongodb');
const csv = require('fast-csv');
const fs = require('fs');
// or as an es module:
// import { MongoClient } from 'mongodb'
// Connection URL
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
// Database Name
const dbName = 'testdb';
const run = async () => {
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
        const cursor = db.collection('users').aggregate(pipelineStages)
        const csvStream = csv.format({ headers: true });
        const writeStream = fs.createWriteStream('./myfile.csv');
        csvStream.pipe(writeStream).on('end', () => {
            console.log("DONE");
        }).on('error', err => console.error(err));
        while (await cursor.hasNext()) {
            const doc = await cursor.next();
            csvStream.write(doc);
            console.log(`${doc._id} written`);
        }
        console.log('done')
        console.timeEnd("X")
        csvStream.end();
        writeStream.end();
    } catch (e) {
        console.error(e);
    }

}
run();