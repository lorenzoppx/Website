This project creates pages to search for Labic's datasets inside an web Page. Uses HTML, CSS, node.js, mongoDB and javascript. The pages are created using the Figmas tool. Bellow prints of the pages:
<br />
<p align="center">
<img src="https://github.com/lorenzoppx/Website/blob/main/print_pages/enviar_page.png" width="600">
<p />
This page is used to upload a new dataset to the local server. Uses mongoDB.
<p align="center">
<img src="https://github.com/lorenzoppx/Website/blob/main/print_pages/pesquisar_page.png" width="600">
<p />
This page is used to download a desirable dataset of the local server. Uses mongoDB.
For dev debugger while programming is recommend to use this command:
```shell
  npm run devStart or npm run download
```
And edit the package.json file adding this:
```shell
  "scripts": {
    "devStart": "nodemon scripts.js",
    "download": "nodemon download.js"
  }
```
