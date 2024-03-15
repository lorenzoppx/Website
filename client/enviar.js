console.log('inside js');
const bf = require('buffer');
const { error } = require('console');

const input = document.getElementById('header');
const output = document.getElementById('output');

function printInput(){
  //output.innerHTML = input.value;
  window.location.assign("http://www.google.com.br/search?q="+input.value);
}

window.Redirect = function Redirect(){
  //output.innerHTML = input.value;
  window.location.assign("./pesquisar.html");
}

window.Manual = function Manual(){
  //output.innerHTML = input.value;
  window.location.assign("./manual.html");
}

window.Dialog = function Dialog(){
  var buttonFile = document.getElementById("buttonFile");
  var file = document.getElementById("file");
  const leitor = new FileReader();

  buttonFile.onclick = function() {
    document.getElementById("file").click();
  };
  /*
  file.onchange = function() {
    var arquivo = file.files[0]
    alert(arquivo.name);
    console.log(arquivo.size);
    console.log(arquivo.type);
    console.log(arquivo.name);
    if(arquivo)
    {
      leitor.readAsText(arquivo);
      console.log(leitor.result);
    }
    
  };
  */
  //console.log(this.files);
}

async function postCsv(result){
  //var int8view = new Uint8Array(leitor.result);
  //var str = new TextDecoder().decode(leitor.result);
  //var json= JSON.parse(str);
  //console.log(int8view);
  const form = new FormData();
  var mybuff = Buffer.from(result);
  form.append("csv", mybuff);
  //console.log(form.get('csv'));

  
  const response = axios({
    method: "post",
    url: "http://localhost:3001/csv",
    data: form,
    //headers: { "Content-Type": "multipart/form-data" },
    headers: { "Content-Type": "application/json" },
    //onabort: abortHandler(),
    //error: errorHandler(),
    //onload: completeHandler(),
    /*
    onUploadProgress: (event) => {
      var progress = Math.round(
        (event.loaded * 100) / event.total
      );
      document.getElementById("progressBar").value = progress;
      console.log(
        `A imagem está ${progress}% carregada... `
      );  
    },
    */
   
  })
    /*
    .then(function (response) {
        //handle success
        console.log('response');
    })
    .catch(function (response) {
        //handle error
        console.log('failed');
    });
  */
}

const inputFile = document.querySelector('#file');
inputFile.addEventListener('change',async function(){
  console.log('start');
  const leitor = new FileReader();
  if(file.files[0]){
    var arquivo = file.files[0];
    document.getElementById("header").value = arquivo.name;
    var print_ = leitor.readAsArrayBuffer(this.files[0]);
  }
  else{
    var arquivo = '';
  }
  leitor.addEventListener('progress',handler,false);
  //leitor.addEventListener('error',errorHandler,false);
  //leitor.addEventListener('abort',abortHandler,false);
  //console.log(arquivo);
  leitor.addEventListener('loadend',async function(){
    //console.log(leitor.result);
    postCsv(leitor.result);
  });
});

const delay = (delayInms) => {
  return new Promise(resolve => setTimeout(resolve, delayInms));
};

async function handler(event){
  var progress = Math.round(
    (event.loaded * 100) / event.total
  );
  document.getElementById("progressBar").value = progress;
  console.log(
    `A imagem está ${progress}% carregada... `
  );  
}

/*
const inputFile = document.querySelector('#file');
inputFile.addEventListener('change',function(){
  var arquivo = file.files[0];
  console.log(arquivo);
  const leitor = new FileReader();
  var formdata = new FormData();
  formdata.append("file", file);
  var ajax = new XMLHttpRequest();
  ajax.upload.addEventListener("progress", progressHandler, false);
  ajax.addEventListener("load", completeHandler, false);

  if(arquivo){
    leitor.readAsText(this.files[0]);
    leitor.readAsArrayBuffer(this.files[0])
  }
  leitor.addEventListener('load',function(){
    console.log(leitor.result);
    document.getElementById("progressBar").value = 100;
    document.getElementById("status").innerHTML = "Uploaded";
    document.getElementById("header").value = arquivo.name;
  })
});
*/

function _(el) {
  return document.getElementById(el);
}

function progressHandler(event) {
  //_("loaded_n_total").innerHTML = "Uploaded " + event.loaded + " bytes of " + event.total;
  var percent = (event.loaded / event.total) * 100;
  console.log(percent);
  _("progressBar").value = Math.round(percent);
  _("status").innerHTML = Math.round(percent) + "% uploaded... please wait";
}

function completeHandler(event) {
  //_("status").innerHTML = event.target.responseText;
  _("status").innerHTML = "Uploaded";
  _("progressBar").value = 100; //wil clear progress bar after successful upload
}

function errorHandler(event) {
  console.log('Upload Failed');
  _("status").innerHTML = "Upload Failed";
}

function abortHandler(event) {
  console.log('Upload Aborted');
  _("status").innerHTML = "Upload Aborted";
}

/*
function Dialog(){
  const fileInput = document.querySelector('input');
  let xhr = new XMLHttpRequest();
  xhr.addEventListener('loadend', () => {
    if (xhr.status === 200) {
      updateStatusMessage('✅ Success');
    } else {
      updateStatusMessage('❌ Error');
    }
  });
}
*/

/*
window.onload = function() {
    input.addEventListener("keyup", function(event) {

            // Number 13 is the "Enter" key on the keyboard
            if (event.keyCode === 13) {
                // Cancel the default action, if needed
                event.preventDefault();
                // Trigger the button element with a click
                document.getElementById("button2").click();
            }
    });
}
*/
