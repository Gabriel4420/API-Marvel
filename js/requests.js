const privateKey = "798ad1abb791ec4e95d998c39df37dc57e2a3171";
const publicKey = "e64686edbf6176c8736bb2208709a322";
const maxCharacters = 1500;


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
  const offset = 1;
  //hash para validar a requisição
  const hash = createHash(timeStamp);


  const urlAPI = "http://gateway.marvel.com/v1/public/characters?limit=4&offset=" + offset + "&ts=" + timeStamp + "&apikey=" + publicKey + "&hash=" + hash;
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

async function renderTable(data) {
  tableContainer.innerHTML = "";
 
  await data.data.results.map(renderData);
  
}

function goNext(data) {
  return data.offset = data.offset += 4;
}
function goPrevious(data) {
  return data.offset --;
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

async function main() {
  const data = await fetchAPI();
  
  renderTable(data)
}

main();