const privateKey = "798ad1abb791ec4e95d998c39df37dc57e2a3171";
const publicKey = "e64686edbf6176c8736bb2208709a322";
const maxCharacters = 1500;
var currentPage = 0;
var offset = currentPage;

const tableContainer = document.querySelector('#table');

function createHash(timeStamp) {

  const toBeHashed = timeStamp + privateKey + publicKey;
  const hashedMessage = md5(toBeHashed);
  return hashedMessage;

}


async function fetchAPI() {
  //tempo agora
  const timeStamp = Date.now().toString();
  //numero randomico de herois

  //hash para validar a requisição
  const hash = createHash(timeStamp);


  const urlAPI = "http://gateway.marvel.com/v1/public/characters?limit=4&offset=" + offset + "&ts=" + timeStamp + "&apikey=" + publicKey + "&hash=" + hash;
  console.log(urlAPI);
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);
      goNext(data);
      goPrevious(data);
      renderTable(data);
    }
  };
  xhttp.open("GET", urlAPI, true);

  xhttp.send()
}

async function fetchAPICharacter() {
  //tempo agora
  const timeStamp = Date.now().toString();
  //hash para validar a requisição
  const hash = createHash(timeStamp);

  const input = document.querySelector('input');

  if (input.value == '') {
    fetchAPI();
  }

  const urlAPI = "http://gateway.marvel.com/v1/public/characters?ts=" + timeStamp + "&apikey=" + publicKey + "&hash=" + hash + "&limit=4" + "&nameStartsWith=" + input.value;
  console.log(urlAPI);


  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);
      renderTable(data);
    }
  };
  xhttp.open("GET", urlAPI, true);

  xhttp.send()
}

async function fetchAPIModal() {
  //tempo agora
  const timeStamp = Date.now().toString();
  //hash para validar a requisição
  const hash = createHash(timeStamp);

  const input = document.querySelector('input');

  if (input.value == '') {
    fetchAPI();
  }

  const urlAPI = "http://gateway.marvel.com/v1/public/characters?ts=" + timeStamp + "&apikey=" + publicKey + "&hash=" + hash + "&limit=4" + "&nameStartsWith=" + input.value;
  console.log(urlAPI);


  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);
      renderModal(data);
    }
  };
  xhttp.open("GET", urlAPI, true);

  xhttp.send()
}

function renderTable(data) {
  tableContainer.innerHTML = "";

  data.data.results.map(renderData);

}

function renderModal(data) {
  tableContainer.innerHTML = "";
  data.data.results.map(Modal);

}

function Modal(data) {
  let i = 0;

  const div = document.createElement("div");

  div.className = "table";



  div.innerHTML = `

  <div class="tableContent">
    <div class="row" style=".row:nth-child(2n){
        background-color: blue !important;
        color: white;
    }">
            
      <div class="info">
        <ul>
            ${data.series.items.length > 0 ? data.series.items.map(item => `<li>${item.name}</li>`).slice(0,3).join(' ') : 'inexistente' }
        </ul>
      </div>
      
      <div class="infoEventos">
        <ul>
            ${data.events.items.length > 0 ? data.events.items.map(item => `<li>${item.name}</li>`).slice(0,3).join(' ') : 'inexistente' }
        </ul>
     </div>
    </div>
   
  </div>

  
  
    `;

  tableContainer.appendChild(div);
}



function goNext() {
  const button = document.querySelector('#next');


  button.addEventListener('click', () => {
    currentPage = currentPage + 8 - 4;
    offset = currentPage;
    fetchAPI();
  });



}

function goPrevious() {
  const button = document.querySelector('#previous');


  button.addEventListener('click', () => {
    currentPage = currentPage - 4;
    if (offset > 8) {
      offset = currentPage;
      fetchAPI();
    }

  });

}



async function renderData(data) {

  let i = 0;

  const div = document.createElement("div");

  div.className = "table";



  div.innerHTML = `

  <div class="tableContent">
    <div class="row" style=".row:nth-child(2n){
        background-color: blue !important;
        color: white;
    }">
      <div class="character">
        <img src="${data.thumbnail.path}.${data.thumbnail.extension}"/>
        <h3>${data.name}</h3>
      </div>
      
      <div class="info">
        <ul>
            ${data.series.items.length > 0 ? data.series.items.map(item => `<li>${item.name}</li>`).slice(0,3).join(' ') : 'inexistente' }
        </ul>
      </div>
      
      <div class="infoEventos">
        <ul>
            ${data.events.items.length > 0 ? data.events.items.map(item => `<li>${item.name}</li>`).slice(0,3).join(' ') : 'inexistente' }
        </ul>
     </div>
    </div>
   
  </div>

  
  
    `;

  tableContainer.appendChild(div);
}

function main() {
  const data = fetchAPI();
  renderTable(data)
}

main();