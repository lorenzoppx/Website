//import axios from 'axios';
const axios = require('axios'); // legacy way
const fs = require('fs');
//const fs = require('fs');

/*
axios.post('http://localhost:3001/user', {
    firstName: 'Fred',
    lastName: 'Flintstone'
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
*/
async function appJpg(){

    const form = new FormData();

    // Pass image stream from response directly to form
    form.append('im', 'kitten');
    const image = await fs.promises.readFile('./ada_lovelace.jpg');
    console.log(image);
    var blob = new Blob([image], {type: "image/jpeg"});
    //form.append('image', await blob.text());
    form.append('image_buffer', image);
    console.log(blob);
    console.log(form.get('image'));
    console.log(form.get('im'));
    // Send form data with axios
    //axios.post('http://localhost:3001/user', form)
    /*
    axios({
        method: 'post',
        url: 'http://localhost:3001/user',
        data: {
          firstName: 'Fred',
          lastName: 'Flintstone'
        }
      });
    */
    
    const response_ = axios({
        method: "post",
        url: "http://localhost:3001/jpg",
        data: form,
        //headers: { "Content-Type": "multipart/form-data" },
        headers: { "Content-Type": "application/json" },
      })
        .then(function (response) {
            //handle success
            console.log('response');
        })
        .catch(function (response) {
            //handle error
            console.log('failed');
        });
    
}

async function appCsv(){
    // Fetch external image as a stream
    const response = await axios.get('https://bit.ly/2mTM3nY', { responseType: 'stream' });

    const form = new FormData();
    
    var blob = new Blob([response.data], {type: "multipart/form-data"});
    // Pass image stream from response directly to form
    form.append('im', 'kitten');


    const image = await fs.readFile('./example.csv');
    console.log(image);
    var blob = new Blob([image], {type: "application/json"});
    form.append('image', blob, 'kitten.jpg');
    form.append('image_buffer', image);
    console.log(blob);
    //console.log(form.getHeaders());
    console.log(form.get('image'));
    console.log(form.get('im'));
    // Send form data with axios
    //axios.post('http://localhost:3001/user', form)
    /*
    axios({
        method: 'post',
        url: 'http://localhost:3001/user',
        data: {
          firstName: 'Fred',
          lastName: 'Flintstone'
        }
      });
    */
    
    const response_ = axios({
        method: "post",
        url: "http://localhost:3001/csv",
        data: form,
        //headers: { "Content-Type": "multipart/form-data" },
        headers: { "Content-Type": "application/json" },
      })
        .then(function (response) {
            //handle success
            console.log('response');
        })
        .catch(function (response) {
            //handle error
            console.log('failed');
        });
    
}
appJpg();
/*
// GET request for remote image in node.js
axios({
    method: 'get',
    url: 'https://bit.ly/2mTM3nY',
    responseType: 'stream'
  })
    .then(function (response) {
      response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'))
});

// GET request for remote image in node.js
axios({
    method: 'get',
    url: 'http://localhost:3001/getDatasets',
    responseType: 'stream'
  })
    .then(function (response) {
      response.data.pipe(fs.createWriteStream('ada_lovelace.csv'))
});
*/




/*

// Make a request for a user with a given ID
axios.get('/user?ID=12345')
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });

// Optionally the request above could also be done as
axios.get('/user', {
    params: {
      ID: 12345
    }
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })
  .finally(function () {
    // always executed
  });

// Want to use async/await? Add the `async` keyword to your outer function/method.
async function getUser() {
  try {
    const response = await axios.get('/user?ID=12345');
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
*/