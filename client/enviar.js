console.log('inside js');
//const bf = require('buffer');
//const { error } = require('console');

const axios = require('axios/dist/browser/axios.cjs');

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

/*
window.Dialog = function Dialog() {
  var buttonFile = document.getElementById("buttonFile");
  var file = document.getElementById("file");
  const leitor = new FileReader();

  // Aqui prevenimos o comportamento padrão (caso o button esteja tentando enviar alguma coisa)
  buttonFile.onclick = function(event) {
    event.preventDefault();  // Isso previne qualquer comportamento de envio de formulário ou recarregamento da página
    file.click();  // Simula o clique no input de arquivo
  };

  file.onchange = function() {
    var arquivo = file.files[0];
    if (arquivo) {
      leitor.readAsArrayBuffer(arquivo);  // Lê o arquivo como ArrayBuffer
    }
  };

  leitor.onload = function(e) {
    const result = e.target.result;  // Conteúdo do arquivo
    const name = file.files[0].name;  // Nome do arquivo

    // Agora chamamos a função para enviar o arquivo sem recarregar a página
    postClip(result, name);
  };
};
*/
document.getElementById("buttonFile").addEventListener("click", function(e) {
    e.preventDefault(); // <-- Isso impede o refresh
    Dialog(); // ou sua função de envio
  })

window.Dialog = function Dialog(event){
  if (event) event.preventDefault();

  var buttonFile = document.getElementById("buttonFile");
  var file = document.getElementById("file");
  const leitor = new FileReader();

  buttonFile.onclick = function() {
    document.getElementById("file").click();
  }
  /*
  file.onchange = function() {
    var arquivo = file.files[0]
    //alert(arquivo.name);
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

/*
async function postClip(result, name, event) {
  if (event) event.preventDefault();
  
  // Log the input data
  console.log('Input result:', result); // Should be ArrayBuffer/Uint8Array
  console.log('Input name:', name); // Should include extension (e.g., "image.jpg")

  const form = new FormData();
  const blob = new Blob([result], { type: 'image/png' }); // Explicit MIME type
  console.log("Blob size:", blob.size);
  form.append("img", blob, name);

  try {
      const response = await fetch("http://localhost:3001/clips", {
        method: 'POST',
        body: form,
        headers: {name  // Keep your custom header if needed
        }
      });
    console.log("Server response:", response.data);
    alert("Success!");
  } catch (err) {
    console.error("Error:", err);
    alert("Upload failed!");
  }
}
*/
/*
async function postClip(result, name) {
  console.log('start postClip');
  const form = new FormData();
  const blob = new Blob([result]); // result deve ser um ArrayBuffer, Uint8Array, string, etc.
  form.append("img", blob, name);
  
  console.log('start axios');

  try {
    const response = await axios.post("http://localhost:8001/clip1", form, {
      timeout: 10000,headers: {
        "name": name // não defina Content-Type — o browser cuida disso
      }
    });

    console.log("Success:");
    console.log(response);
    //console.log(response.data.embedding);
    console.log(response.data);
    alert("Success");
  } catch (err) {
    console.error("Erro no envio:", err);
    alert("Erro ao enviar o arquivo!");
  }

  //await getClip(name);
}
*/

async function postClip(result, name) {
  console.log('start postClip');
  
  // Verifique o tipo de `result` antes de criar o Blob
  if (!(result instanceof ArrayBuffer || result instanceof Uint8Array || typeof result === 'string')) {
    console.error("Tipo inválido para result:", result);
    alert("Tipo de arquivo inválido!");
    return; // interrompe a execução
  }

  const form = new FormData();
  const blob = new Blob([result]); // result deve ser um ArrayBuffer, Uint8Array ou string
  form.append("img", blob, name);
  
  console.log('start axios');

  try {
    let response = await axios.post("http://localhost:8001/clip1", form, {
      timeout: 10000,
      headers: {
        "name": name // não defina Content-Type — o browser cuida disso
      }
    });

    // Verificar se a resposta foi bem-sucedida
    if (response.status === 200) {
      console.log("Success:");
      console.log(response);
      //console.log(response.data.embedding);  // Verifique o campo correto da resposta
      console.log(response.data);
      //alert("Success");
      return true;
    } else {
      console.error("Erro inesperado na resposta:", response.status, response.statusText);
      alert("Erro ao processar o arquivo!");
      return false;
    }

  } catch (err) {
    // Melhor tratamento de erro
    console.error("Erro no envio:", err);
    
    if (err.response) {
      // Se a resposta do servidor estiver disponível
      console.error("Resposta de erro do servidor:", err.response);
    } else if (err.request) {
      // Se a requisição foi feita, mas não houve resposta
      console.error("Erro na requisição (sem resposta):", err.request);
    } else {
      // Qualquer outro erro
      console.error("Erro inesperado:", err.message);
    }

    alert("Erro ao enviar o arquivo!");
  }

  //await getClip(name);
}


async function getClip(name) {
  
  try {
    console.log("start getClip");
    let response = await axios.get(`http://localhost:8001/embedding_status/${name}`, {
      timeout: 10000,
    });

    console.log("Status response:", response);
    console.log("Embedding response:", response.data.embedding);
    console.log("Status response status:", response.data.status);

    if (response.data.status === "complete") {
      console.log("✅ Embedding complete!");
      //const embedding = response.data.embedding;
      return response.data.embedding;
      //await sendRequest(embedding);
      // You can stop polling or trigger the next step here
    } else if (response.data.status === "processing") {
      console.log("⏳ Still processing...");
      // Wait 3 seconds before checking again
      return setTimeout(() => getClip(name), 1000);
    } else if (response.data.status === "not_found") {
      console.log("❌ Embedding not found.");
      return null;
    }

  } catch (error) {
    console.error("Error checking status:", error);
    alert("Erro ao enviar o arquivo!");
  }
  return null;
}


// current-page.js
//sessionStorage.setItem('hasuraData',null);

async function sendRequestImagem(embedding){
  
  try {
    console.log("sendRequest");
    let formData = new FormData();
    formData.append('input_vector',JSON.stringify(embedding));
    console.log("em:",embedding);
    formData.append('days_interval', 30);
    
    //axios.defaults.headers.common['x-hasura-admin-secret'] = 'myadminsecretkey';
    let response1 = await axios.post('http://srv794331.hstgr.cloud:8080/api/rest/search_similar_posts_openclip_image_track',formData, {
      timeout: 10000,
      headers: {
      "x-hasura-admin-secret": "myadminsecretkey"
      }
    });
    
    /*
    let response1 = await axios.post('http://srv794331.hstgr.cloud:8080/api/rest/myquery',{}, {
      timeout: 10000,
      headers: {
      "x-hasura-admin-secret": "myadminsecretkey"
      }
    });
    */
    console.log("response1");
    console.log(response1.data);
    
    if (response1.data) {
      sessionStorage.setItem('hasuraData', JSON.stringify(response1.data));
      window.location.href = '/client/result.html'; // or '/result' if using a router
    }else{
      setTimeout(() => sendRequestImagem(embedding), 1000);
    }
      
  } catch (err) {
    console.error("Error:", err);
    alert("Request failed!");
  }
}


async function sendRequestTexto(embedding){
  
  try {
    console.log("sendRequest");
    let formData = new FormData();
    formData.append('input_vector',JSON.stringify(embedding));
    console.log("em:",embedding);
    formData.append('days_interval', 30);
    
    //axios.defaults.headers.common['x-hasura-admin-secret'] = 'myadminsecretkey';
    let response1 = await axios.post('http://srv794331.hstgr.cloud:8080/api/rest/search_similar_posts_openclip_track',formData, {
      timeout: 10000,
      headers: {
      "x-hasura-admin-secret": "myadminsecretkey"
      }
    });
    
    /*
    let response1 = await axios.post('http://srv794331.hstgr.cloud:8080/api/rest/myquery',{}, {
      timeout: 10000,
      headers: {
      "x-hasura-admin-secret": "myadminsecretkey"
      }
    });
    */
    console.log("response1");
    console.log(response1.data);
    
    if (response1.data) {
      sessionStorage.setItem('hasuraData', JSON.stringify(response1.data));
      window.location.href = '/client/result.html'; // or '/result' if using a router
    }else{
      setTimeout(() => sendRequestTexto(embedding), 1000);
    }
      
  } catch (err) {
    console.error("Error:", err);
    alert("Request failed!");
  }
}


/*
function sendRequest(embedding) {
  console.log("sendRequest");

  // Create FormData
  let formData = new FormData();
  formData.append('input_vector', JSON.stringify(embedding));
  console.log("sendRequest embedding:", embedding);
  formData.append('days_interval', 30);
  console.log("sendRequest days_interval: 30");
  // Send POST request
  axios
    .post(
      'http://srv794331.hstgr.cloud:8080/api/rest/search_similar_posts_openclip_track',
      formData,
      {
        timeout: 10000,
        headers: {
          "x-hasura-admin-secret": "myadminsecretkey"
        }
      }
    )
    .then((response1) => {
      console.log("response1");
      console.log(response1.data);

      if (response1.data) {
        // Store data and navigate
        sessionStorage.setItem('hasuraData', JSON.stringify(response1.data));
        window.location.href = '/client/result.html'; // or '/result' if using a router
      } else {
        // Retry after 1 second
        setTimeout(() => sendRequest(embedding), 1000);
      }
    })
    .catch((err) => {
      console.error("Error:", err);
      alert("Request failed!");
    });
}
*/


document.addEventListener("getTexto", async (event) => {
  try{
    const name = event.detail.name;
    //sessionStorage.setItem('name', name_);
    //window.location.reload();
    console.log("EVENT GET TEXTO");
    //const name = sessionStorage.getItem('name');
    
    let embedding = await getClip(name); // Passa o conteúdo do arquivo e o nome
    if (!embedding) {
      console.error("getClip failed, stopping.");
    }else{
      //alert("sendReq");
      sendRequestTexto(embedding);
    }


  } catch (err){
    console.log("err,",err)
  }

});

document.addEventListener("getImagem", async (event) => {
  try{
    const name = event.detail.name;
    //sessionStorage.setItem('name', name_);
    //window.location.reload();
    console.log("EVENT GET IMAGEM");
    //const name = sessionStorage.getItem('name');
    
    let embedding = await getClip(name); // Passa o conteúdo do arquivo e o nome
    if (!embedding) {
      console.error("getClip failed, stopping.");
    }else{
      //alert("sendReq");
      sendRequestImagem(embedding);
    }


  } catch (err){
    console.log("err,",err)
  }

});


document.addEventListener("send", async (event) => {
  try{
    console.log("EVENT SEND");
    const leitorResult = event.detail.leitorResult;
    const name = event.detail.name;

    const postSuccess = await postClip(leitorResult, name);
    if (!postSuccess) {
      console.error("postClip failed, stopping.");
    }
    const done = new CustomEvent("getComplete", { detail: { name } });
    document.dispatchEvent(done);

    // Step 2: Add a small delay to ensure server state is updated
    //console.log("Waiting 2s before polling getClip...");
    //await new Promise((resolve) => setTimeout(resolve, 2000));

    //localStorage.clear(); // Clears all items in localStorage
    //sessionStorage.clear(); // Clears all items in sessionStorage
    //const embedding2=null;

  } catch (err){
    console.log("err,",err)
  }

});




//let em = null;
//sendRequest(em);


/*
async function postClip(result,name){
  //var int8view = new Uint8Array(leitor.result);
  //var str = new TextDecoder().decode(leitor.result);
  //var json= JSON.parse(str);
  //console.log(int8view);
  const form = new FormData();
  var mybuff = Buffer.from(result);
  form.append("img", mybuff);
  //console.log(form.get('csv'));

  
  const response = axios({
    method: "post",
    url: "http://localhost:3001/clip",
    data: form,
    //headers: { "Content-Type": "multipart/form-data" ,
     headers: { "Content-Type": "application/json" ,
      "name": name
    },
    //onabort: abortHandler(),
    //error: errorHandler(),
    //onload: completeHandler(),
    
    onUploadProgress: (event) => {
      var progress = Math.round(
        (event.loaded * 100) / event.total
      );
      document.getElementById("progressBar").value = progress;
      console.log(
        `A imagem está ${progress}% carregada... `
      );  
    },
    
   
  })
  .then(function (response) {
    console.log("✅ Success:");
    console.log(response.data); // This will print the message, filename, and embedding from the server
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
  
}
*/
/*
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
    url: "http://localhost:3001/clip",
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
    
   
  })
  .then(function (response) {
    console.log("✅ Success:");
    console.log(response.data); // This will print the message, filename, and embedding from the server
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
*/
//let embedding=null;
//sendRequest(embedding);

window.onload = function () {
  // Your initialization code here
  let myVar = 'Initialized on page load';
  console.log(myVar);
  const progress = document.getElementById('progressBar');
  progress.setAttribute('data-status', 'loading');
  progress.value = 0;

  const ball = document.getElementById('statusBall');
};


const ball = document.getElementById('statusBall');
ball.classList.remove('green');
ball.classList.remove('red');
let ball_ = sessionStorage.getItem('ball');
ball.classList.add(ball_);

let name_ = sessionStorage.getItem('name');
document.getElementById("header").value = name_;
let status_ = sessionStorage.getItem('status');
const progress = document.getElementById('progressBar');
progress.setAttribute('data-status', status_);
let perc_ = sessionStorage.getItem('perc');
progress.value = perc_;

const sendButtonImagem = document.querySelector('#buttonFilePesquisarImagem');
if (sendButtonImagem) {
  sendButtonImagem.addEventListener('click', () => {
    console.log("Send Request button clicked");

    let name_ = sessionStorage.getItem('name');
    const event = new CustomEvent("getImagem", {detail: {name: name_}});
    document.dispatchEvent(event);
    // Optionally disable button to prevent multiple clicks
    sendButtonImagem.disabled = true;

  });
} else {
  console.error("Send Request button not found");
}


const sendButtonTexto = document.querySelector('#buttonFilePesquisarTexto');
if (sendButtonTexto) {
  sendButtonTexto.addEventListener('click', () => {
    console.log("Send Request button clicked");

    let name_ = sessionStorage.getItem('name');
    const event = new CustomEvent("getTexto", {detail: {name: name_}});
    document.dispatchEvent(event);
    // Optionally disable button to prevent multiple clicks
    sendButtonTexto.disabled = true;

  });
} else {
  console.error("Send Request button not found");
}


const inputFile = document.querySelector('#file');

inputFile.addEventListener('change',async function(event){
  const ball = document.getElementById('statusBall');
  // Set to green
  ball.classList.remove('red');
  ball.classList.add('green');
  event.preventDefault();
  console.log('start');
  const leitor = new FileReader();
  if(file.files[0]){
    var arquivo = file.files[0];
    document.getElementById("header").value = arquivo.name;
    sessionStorage.setItem('name', arquivo.name);
    var print_ = leitor.readAsArrayBuffer(this.files[0]);
  }
  else{
    var arquivo = '';
  }
  leitor.addEventListener('progress',handler,false);
  //leitor.addEventListener('error',errorHandler,false);
  //leitor.addEventListener('abort',abortHandler,false);
  //console.log(arquivo);
  leitor.addEventListener('loadend', async function() {
    try {
      //console.log('Leitura finalizada!');
      if (leitor.result) {
        //console.log('Resultado da leitura:', leitor.result);
        const event = new CustomEvent("send", {detail: {leitorResult: leitor.result,name: arquivo.name}});
        document.dispatchEvent(event);
        const progress = document.getElementById('progressBar');
        // Update status from "loading" to "loaded"
        progress.setAttribute('data-status', 'loaded');
        sessionStorage.setItem('status', 'loaded');
        // Optional: change value to 100 if needed
        progress.value = 100;
        sessionStorage.setItem('ball', 'green');
      }
      else {
        console.warn('No data read from file');
        alert('No data available');
      }
    }catch(error) {
      console.error('Operation failed:', error);
      alert('Operation failed: ' + error.message);
    }
  });

    
})


inputFile.addEventListener('drop',async function(event){
  const ball = document.getElementById('statusBall');
  // Set to green
  ball.classList.remove('red');
  ball.classList.add('green');
  event.preventDefault();
  console.log('start');
  const leitor = new FileReader();
  if(file.files[0]){
    var arquivo = file.files[0];
    document.getElementById("header").value = arquivo.name;
    sessionStorage.setItem('name', arquivo.name);
    var print_ = leitor.readAsArrayBuffer(this.files[0]);
  }
  else{
    var arquivo = '';
  }
  leitor.addEventListener('progress',handler,false);
  //leitor.addEventListener('error',errorHandler,false);
  //leitor.addEventListener('abort',abortHandler,false);
  //console.log(arquivo);
  leitor.addEventListener('loadend', async function() {
    try {
      //console.log('Leitura finalizada!');
      if (leitor.result) {
        //console.log('Resultado da leitura:', leitor.result);
        const event = new CustomEvent("send", {detail: {leitorResult: leitor.result,name: arquivo.name}});
        document.dispatchEvent(event);
        const progress = document.getElementById('progressBar');
        // Update status from "loading" to "loaded"
        progress.setAttribute('data-status', 'loaded');
        sessionStorage.setItem('status', 'loaded');
        // Optional: change value to 100 if needed
        progress.value = 100;
        sessionStorage.setItem('ball', 'green');
      }
      else {
        console.warn('No data read from file');
        alert('No data available');
      }
    }catch(error) {
      console.error('Operation failed:', error);
      alert('Operation failed: ' + error.message);
    }
  });

    
})

const delay = (delayInms) => {
  return new Promise(resolve => setTimeout(resolve, delayInms));
}

async function handler(event){
  event.preventDefault();
  var progress = Math.round(
    (event.loaded * 100) / event.total
  );
  document.getElementById("progressBar").value = progress;
  //console.log(`A imagem está ${progress}% carregada... `);  
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
/*
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
*/
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
