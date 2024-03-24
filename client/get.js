console.log('inside index2.js');
//<script src="./node_modules/axios/dist/axios.min.js"></script>
//const axios = require('axios');

const datasets = document.getElementById('datasets');
const content = document.getElementById('content');

window.addEventListener('load', function () { 
    const pagina = document.getElementById('pagina');
    pagina.innerText = 'Dataset:\n' + window.localStorage.getItem('pagina_inf');
    printContent();
  });

//var x = document.createElement("button");
//button.innerText = 'Can you click me?';
//document.body.appendChild(button)
//const cars = ["Saab", "Volvo", "BMW"];
//document.getElementById("button").innerHTML = cars;

//const out = document.querySelector('.out');
const search = document.querySelector(".filter-input");


search.addEventListener("input", filter);

let listDatasetHTML = document.querySelector('.out');

let dataset = [];

const dataout = document.getElementById('dataprint');

function printData(){
  alert(dataset);
  console.log(dataset);
  dataout.innerHTML=dataset;
}
async function DownMongo(){
    var dataset = window.localStorage.getItem('pagina_inf');
    const link = `http://localhost:3001/export/${dataset}`;

    //open download link in new page
    window.open( link );

    //redirect current page to success page
    window.location="http://127.0.0.1:5500/client/pesquisar.html";
    window.focus();
    /*
    try {
        var dataset = window.localStorage.getItem('pagina_inf');
        const link = `http://localhost:3001/export/${dataset}`;
        console.log(link)
        const response = await fetch(link);
        const data = await response.json();
        const posts = data.data.children.map(child => child.data);
        console.log(posts.map(post => post.title));
      } catch (error) {
        console.log('uq')
        console.error(error);
      }
      */
    /*
    var dataset = window.localStorage.getItem('pagina_inf');
    alert(dataset);
    console.log(dataset);
    const link = `http://localhost:3001/export/${dataset}`;
    //window.open(link,'_self');
    window.location.assign(link);
    //dataout.innerHTML=dataset;
    */
}

async function printDatasets()
{
    const x = axios.get('http://127.0.0.1:3001/getDatasets')
    .then(resp => {
        console.log(resp.data);
        //datasets.innerHTML = resp.data;
        return resp.data;
    })
    .catch(e => console.log(e));

    return x;
}

function printContent()
{
    var dataset = window.localStorage.getItem('pagina_inf');
    axios.get(`http://localhost:3001/getline/${dataset}`)
    .then(resp => {
        console.log(resp.data);
        var pendingWrites = [];
        for (let i = 0, endAt = 2; i < endAt; i++) {
            let thisWrite = 'Twitter:' + resp.data[i].text + '\t\tUser:' + resp.data[i].from_user;
            console.log(resp.data[i]);
            pendingWrites.push(thisWrite);
        }
        var str = '<ul style="list-style:none;">';
        for(let i=0, endAt=parseInt(pendingWrites.length); i<endAt; i++){
            str = str + '<li>' + pendingWrites[i] + '<li>';
        }
        str = str + '<ul>';
        console.log(str);
        content.innerHTML = str;
    })
    .catch(e => console.log(e));
}
/*
function printContent()
{
    axios.get('http://127.0.0.1:3001/getline/new3')
    .then(resp => {
        console.log(resp.data);
        let thisWrite = 'Twitter:' + resp.data.text;
        var str = '<ul style="list-style:none;">';
        str = str + '<li>' + thisWrite + '<li>';
        str = str + '<ul>';
        console.log(str);
        content.innerHTML = str;
    })
    .catch(e => console.log(e));
}
*/
async function filter(e) {

    var x = await printDatasets();
    let temp = '';
    const result  = x.filter(item=> item.toLowerCase().includes(e.target.value.toLowerCase()));
    listDatasetHTML.innerHTML = temp;
    if(result.length>0){
        //temp = `<ul class="list-items">`;
        result.forEach((item) => {
                let newItem = document.createElement('div');
                //newItem.dataset.id = `${item}_id`;
                newItem.dataset.id = item;
                newItem.classList.add('item');
                listDatasetHTML.appendChild(newItem);       
                newItem.innerHTML = `<li class="listDataset list-item"> ${item} </li>`;
        });
        //temp += `</ul>`;
    }else{
        temp =`<div class="no-item"> No Item Found </div>`;
    }
    
}
/*
listDatasetHTML.addEventListener('click', (event) => {
    console.log('click');
    let positionClick = event.target;
    console.log(positionClick);
    if(positionClick.classList.contains('list-item')){
        let id_dataset = positionClick.parentElement.dataset.id;
        console.log(id_dataset);
        console.log('func');
        addToMem(id_dataset);
        window.localStorage.setItem('pagina_inf', id_dataset); 
        window.location.replace("./get.html");
        const pagina = document.getElementById('pagina');
        pagina.innerText=id_dataset;
    }
})
*/
function addToMem(id_dataset)
{
    let positionThisProductInCart = dataset.findIndex((value) => value.id_dataset == id_dataset);
    if(dataset.length <= 0){
        dataset = [{
            id_dataset: id_dataset,
            quantity: 1
        }];
    }else if(positionThisProductInCart < 0){
        dataset.push({
            dataset_id: id_dataset,
            quantity: 1
        });
    }else{
        dataset[positionThisProductInCart].quantity = dataset[positionThisProductInCart].quantity + 1;
    }
    localStorage.setItem('dataset', JSON.stringify(dataset));
}

const initApp = () => {
    // get data cart from memory
    if(localStorage.getItem('dataset')){
        dataset = JSON.parse(localStorage.getItem('dataset'));
        //addCartToHTML();
    }
}
initApp();


console.log('inside js')
//const input = document.getElementById('header');
const output = document.getElementById('output');
/*
function printInput(){
  //output.innerHTML = input.value;
  window.location.assign("http://www.google.com.br/search?q="+input.value);
}
*/
function Redirect(){
  //output.innerHTML = input.value;
  window.location.assign("./enviar.html");
}
function Manual(){
    //output.innerHTML = input.value;
    window.location.assign("./manual.html");
  }
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

console.log('finish index2.js');