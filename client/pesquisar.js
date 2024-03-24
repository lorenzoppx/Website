console.log('inside index2.js');
//<script src="./node_modules/axios/dist/axios.min.js"></script>
//const axios = require('axios');

const datasets = document.getElementById('datasets');
const content = document.getElementById('content');

//var x = document.createElement("button");
//button.innerText = 'Can you click me?';
//document.body.appendChild(button)
const cars = ["Saab", "Volvo", "BMW"];
//document.getElementById("button").innerHTML = cars;

//const out = document.querySelector('.out');
const search = document.querySelector(".filter-input");

window.addEventListener('DOMContentLoaded',loadList);

search.addEventListener("input", filter);

let listDatasetHTML = document.querySelector('.out');

let dataset = [];

const dataout = document.getElementById('dataprint');

function printData(){
  alert(dataset);
  console.log(dataset);
  dataout.innerHTML=dataset;
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
    axios.get('http://127.0.0.1:3001/getUsers')
    .then(resp => {
        console.log(resp.data);
        content.innerHTML = resp.data[0].name;
    })
    .catch(e => console.log(e));
}

async function filter(e) {

    var x = await printDatasets();
    let temp = '';
    const result  = x.filter(item=> item.toLowerCase().includes(e.target.value.toLowerCase()));
    listDatasetHTML.innerHTML = temp;
    if(result.length>0){
        //temp = `<ul class="list-items">`;
        result.slice(0,7).forEach((item) => {
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

async function loadList()
{
    var x = await printDatasets();
    console.log(typeof(x));
    console.log(x);
    
    //let temp = '<ul class="list-items">';
    let temp = '';
    x.slice(0,7).forEach(item => {
            let newItem = document.createElement('div');
            //newItem.dataset.id = `${item}_id`;
            newItem.dataset.id = item;
            newItem.classList.add('ul');
            listDatasetHTML.appendChild(newItem);       
            newItem.innerHTML = `<li class="listDataset list-item"> ${item} </li>`;
        });
    //temp+='</ul>';
    console.log(temp);


    //out.innerHTML = temp;
    //const u = document.getElementById('rt');
    //u.innerText='RTS'
}

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
        //const pagina = document.getElementById('pagina');
        //pagina.innerText=id_dataset;
    }
})

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