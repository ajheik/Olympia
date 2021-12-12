var KENTAT = ["Medals (Total)"];
var VALITTU_KENTTA = 0; // Tän kun vaihtaa 0 niin kartta piirtyy väkiluvun mukaan
var NOUSEVA = false; // Toplistan suunta: True => Pienin -> Suurin
var LIGHT = true;   // true -> valomoodi päällä, false -> pimeämoodi päällä
var BOLDATTU_MAA;
var NAPPAINYHDISTELMA = [];
var NAPPAINAJASTIN;

// Tietorakenteen avaimina ovat valtioiden ISO 3166-1 alpha-3 -koodit.
// Koodittomat tietueet on merkitty ISO 3166-1 alpha-3 -standardin vapaasti käytettävillä koodeilla seuraavasti:
// XSL: Somaliland
// XNC: Northern Cyprus
// XKO: Kosovo
// XBO: Bohemia
// XBI: British West Indies
// XRC: Republic of China
// XCS: Czechoslovakia
// XEG: East Germany
// XUG: United Team of Germany
// XWG: West Germany
// XIP: Independent Olympic Participants
// XKR: Korea
// XML: Malaya
// XMI: Marshall Islands
// XNB: North Borneo
// XRE: Russian Empire
// XSA: Saar
// XSM: Serbia and Montenegro
// XSU: Soviet Union
// XUT: Unified Team
// XNY: North Yemen
// XSY: South Yemen
// XYS: Yugoslavia
var TIETORAKENNE = {};

const APUKENTAT = {
  "Medals": ["Medals (Total)", "Gold", "Silver", "Bronze", "Medals (Per capita)", "Medals (Summer)", "Medals (Winter)"],
  "Times Hosted": ["Hosts (Total)", "Hosts (Summer)", "Hosts (Winter)"],
  "Appearances": ["Appearances (Total)", "Appearances (Summer)", "Appearances (Winter)"],
  "Medals by Sport": ["Archery", "Athletics", "Boxing", "Fencing", "Judo", "Tennis", "Weightlifting", "Wrestling"]
};

// TODO: Nää voi varmaa heittää johonki toisee tiedostoon niiku ne easter egit myös kai ehkä (?)
const HEATMAP = {
  "Medals (Total)":{ // Kokonaismitalimäärä
    domain:[1, 150, 350, 550, 850, 1200],
    labels:["0", "1 - 150", "150 - 350", "350 - 550", "550 - 850", "850 - 1200", ">1200"],
    range:["#f7fcfd","#e4eef5","#ccddec","#b2cae1","#9cb3d5","#8f95c6","#8c74b5"]
  },
  "Gold":{ // Kokonaiskultamitalimäärä
    domain:[1, 40, 80, 180, 270, 1000],
    labels:["0", "1 - 40", "40 - 80", "80 - 180", "180 - 270", "270 - 1000", ">1000"],
    range:["#ffffe5","#fff8c4","#feeaa1","#fed676","#feba4a","#fb992c","#ee7918"]
  },
  "Silver":{ // Kokonaishopeamitalimäärä
    domain:[1, 30, 90, 150, 240, 400],
    labels:["0", "1 - 30", "30 - 90", "90 - 150", "150 - 240", "240 - 400", ">400"],
    range:["#ffffff","#f2f2f2","#e2e2e2","#cecece","#b4b4b4","#979797","#7a7a7a"]
  },
  "Bronze":{ // Kokonaispronssimitalimäärä
    domain:[1, 35, 75, 140, 210, 340],
    labels:["0", "1 - 35", "35 - 75", "75 - 140", "140 - 210", "210 - 340", ">340"],
    range:["#feeaa1","#fed676","#feba4a","#fb992c","#ee7918","#d85b0a","#8f3204"]
  },
  "Medals (Per capita)":{ // Kokonaismitalimäärä väkilukuun nähden
    domain:[0.01, 4, 12, 35, 55, 80],
    labels:["0", "0.1 - 4", "4 - 12", "12 - 35", "35 - 55", "55 - 80", ">80"],
    range:["#e8f6f9","#d5efed","#b7e4da","#8fd3c1","#68c2a3","#49b17f","#2f9959"]
  },
  "Medals (Winter)":{ // Mitalit talvi
    domain:[1, 20, 70, 120, 220, 360],
    labels:["0", "1 - 20", "20 - 70", "70 - 120", "120 - 220", "220 - 360", ">360"],
    range:["#eff3ff","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#084594"]
  },
  "Medals (Summer)":{ // Mitalit kesä
    domain:[1, 100, 250, 330, 750, 1200],
    labels:["0", "1 - 100", "100 - 250", "250 - 330", "330 - 750", "750 - 1200", ">1200"],
    range:["#edf8e9","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#005a32"]
  },
  "Hosts (Total)":{ // hostit yht
    domain:[1, 2, 3, 4, 5, 6],
    labels:["0", "1", "2", "3", "4", "5", ">5"],
    range:["#f2f0f7","#b6b5d8","#9e9bc9","#8782bc","#7363ac"]
  },
  "Hosts (Summer)":{ // hostit kesä
    domain:[1, 2, 3, 4],
    labels:["0", "1", "2", "3", "4"],
    range:["#edf8e9","#97d494","#4daf62","#157f3b","#036429"]
  },
  "Hosts (Winter)":{ // hostit talvi
    domain:[1, 2, 3, 4, 5],
    labels:["0", "1", "2", "3", "4"],
    range:["#eff3ff","#c6dbef","#9ecae1","#6baed6","#4292c6"]
  },
  "Appearances (Total)":{ // Esiintymiset
    domain:[1, 10, 20, 30, 40, 50],
    labels:["0", "1 - 10", "10 - 20", "20 - 30", "30 - 40", "40 - 50", ">50"],
    range:["#f2f0f7","#cecee5","#bcbddc","#9e9ac8","#807dba","#6a51a3","#4a1486"]
  },
  "Appearances (Winter)":{ // Esiintymiset talvi
    domain:[1, 5, 10, 15, 20, 23],
    labels:["0", "1 - 5", "5 - 10", "10 - 15", "15 - 20", "20 - 23", ">23"],
    range:["#f7fbff","#e3eef9","#cfe1f2","#b5d4e9","#93c3df","#6daed5", "#4b97c9"]
  },
  "Appearances (Summer)":{ // Esiintymiset kesä
    domain:[1, 7, 14, 21, 28],
    labels:["0", "1 - 7", "7 - 14", "14 - 21", "21 - 27", ">27"],
    range:["#edf8e9","#c7e9c0","#a1d99b","#41ab5d","#238b45","#005a32"]
  },
  Archery:{
    domain:[1, 5, 15, 25, 45, 60],
    labels:["0", "1 - 5", "5 - 15", "15 - 25", "25 - 45", "45 - 60", ">60"],
    range:["#ffffe5","#f7fcc4","#e4f4ac","#c7e89b","#a2d88a","#78c578","#4eaf63"]
  },
  Athletics:{
    domain:[1, 30, 90, 150, 270, 350],
    labels:["0", "1 - 30", "30 - 90", "90 - 150", "150 - 270", "270 - 350", ">350"],
    range:["#ffffe5","#f7fcc4","#e4f4ac","#c7e89b","#a2d88a","#78c578","#4eaf63"]
  },
  Boxing:{
    domain:[1, 15, 30, 50, 70, 90],
    labels:["0", "1 - 15", "15 - 30", "30 - 50", "50 - 70", "70 - 90", ">90"],
    range:["#ffffe5","#f7fcc4","#e4f4ac","#c7e89b","#a2d88a","#78c578","#4eaf63"]
  },
  Fencing:{
    domain:[1, 30, 90, 150, 270, 350],
    labels:["0", "1 - 30", "30 - 90", "90 - 150", "150 - 270", "270 - 350", ">350"],
    range:["#ffffe5","#f7fcc4","#e4f4ac","#c7e89b","#a2d88a","#78c578","#4eaf63"]
  },
  Judo:{
    domain:[1, 5, 10, 18, 35, 50],
    labels:["0", "1 - 5", "5 - 18", "18 - 35", "15 - 30", "30 - 50", ">50"],
    range:["#ffffe5","#f7fcc4","#e4f4ac","#c7e89b","#a2d88a","#78c578","#4eaf63"]
  },
  Tennis:{
    domain:[1, 5, 10, 15, 30, 50],
    labels:["0", "1 - 5", "5 - 10", "10 - 15", "15 - 30", "30 - 50", ">50"],
    range:["#ffffe5","#f7fcc4","#e4f4ac","#c7e89b","#a2d88a","#78c578","#4eaf63"]
  },
  Weightlifting:{
    domain:[1, 5, 10, 15, 30, 50],
    labels:["0", "1 - 5", "5 - 10", "10 - 15", "15 - 30", "30 - 50", ">50"],
    range:["#ffffe5","#f7fcc4","#e4f4ac","#c7e89b","#a2d88a","#78c578","#4eaf63"]
  },
  Wrestling:{
    domain:[1, 15, 25, 50, 70, 120],
    labels:["0", "1 - 15", "15 - 25", "25 - 50", "50 - 70", "70 - 120", ">120"],
    range:["#ffffe5","#f7fcc4","#e4f4ac","#c7e89b","#a2d88a","#78c578","#4eaf63"]
  },
};

const EASTEREGGS = {
  "World Domination":{
    yhdistelma:["a","b","c","d","e"],
    funktio:easter_WD
  },
  "litkeissifamfr":{
    yhdistelma:["4","2","0","6","9"],
    funktio:easter_xd
  }
};

function easter_xd(){
  var emojit = ["😍","👌🏻","😤","🍆","😭","💦","😂","😩","🎅🏿","👀","🏃"];

  var tekstit = document.querySelectorAll('p, h1, h2, li, span');
  for(i = 0; i < tekstit.length; i++){
    tekstit[i].innerHTML = generateMEME();
  }

  let container = document.querySelector(".flex-container");

  let index = 0;
  setInterval(function() {
    let meme = document.createElement("div");
    meme.innerHTML = emojit[randomInt(0, emojit.length - 1)];
    meme.style.fontSize = "120px";
    meme.style.position = "absolute";
    meme.style.left = `${randomInt(0, 90)}%`;
    meme.style.top = `${randomInt(0, 90)}%`;
    meme.style.zIndex = index++;
    container.appendChild(meme);
  }, 500);

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateMEME() {
    var result = '';
    lkm = randomInt(5, 15);
    for ( var i = 0; i < lkm; i++ ) {
      result += emojit[(Math.floor(Math.random() * emojit.length))];
    }
    return result;
  }
}

/**
 * Maailmanvalloitus pääsiäismunana
 */
function easter_WD(){
  //TODO: setIntervaliin valloitus ja valloitukseen satunnaisen maan arpominen?
  function valloitaMaa(valloitettava){
    let maa = TIETORAKENNE[valloitettava];
    console.log(maa);
  }
  valloitaMaa("SWE");
}

/**
 * Seuraa käyttäjän näppäimistönpainalluksia ja asettaa ajastimen näppäinyhdistelmälle
 */
document.addEventListener("keydown", function(event){
  NAPPAINYHDISTELMA.push(event.key);
  const maksimiPituus = 5;
  if(NAPPAINYHDISTELMA.length>=maksimiPituus){
    lueYhdistelma();
  }
  if(!NAPPAINAJASTIN){
    NAPPAINAJASTIN = setInterval(lueYhdistelma, 1000);
  }
});

/**
 * Lukee käyttäjän kirjoittaman näppäinyhdistelmän
 */
function lueYhdistelma() {
  let yhdistelma = NAPPAINYHDISTELMA.slice();
  for(i in EASTEREGGS){
    let easter = EASTEREGGS[i];
    if(easter.yhdistelma.toString()==yhdistelma.toString()){
      easter.funktio();
    }
  }
  NAPPAINYHDISTELMA = [];
  clearInterval(NAPPAINAJASTIN);
  NAPPAINAJASTIN = null;
}

d3.select("#dark-light")
  .on("click", lightModeHandler);

/**
 * Vaihtaa valo- ja pimeämoodien välillä
 */
function lightModeHandler() {
  LIGHT = !LIGHT;
  document.getElementById('dark-light').innerHTML = (LIGHT ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>');
  document.body.classList.toggle("dark-mode");
}

let mql = window.matchMedia('(prefers-color-scheme: dark');

/**
 * Jos käyttäjällä pimeämoodi päällä, laittaa sivulle pimeämoodin päälle.
 */
if(mql.matches){
  lightModeHandler();
}

function modeChangeHandler(e){
  if(e.matches){
    if(LIGHT){
      lightModeHandler();
    }
  }
  else{
    if(!LIGHT){
      lightModeHandler();
    }
  }
}

/**
 * Jos käyttäjä muuttaa moodiasetuksiaan, sivu muuttuu vastaamaan niitä
 */
mql.addEventListener("change", modeChangeHandler);

//About-ikkunan JS-koodi, lainattu w3schoolsilta
let modal = document.getElementById("modaali");
let btn = document.getElementById("about");
let span = document.getElementsByClassName("close")[0];
btn.onclick = function() { //Tuo About-ikkunan esille
  modal.style.display = "block";
}
span.onclick = function() { //Piilottaa About-ikkunan ruksia painamalla
  modal.style.display = "none";
}
window.onclick = function(event) { //Piilottaa About-ikkunan ikkunan ulkopuolelta painamalla
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Create a tooltip
var tooltip = d3.select("#tooltip")
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("color", "black")
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "5px")
  .style("padding", "5px")
  .style("position", "absolute");

var projection = d3.geoMercator();

var domain = HEATMAP[KENTAT[VALITTU_KENTTA]].domain;
var labels = HEATMAP[KENTAT[VALITTU_KENTTA]].labels;
var range = HEATMAP[KENTAT[VALITTU_KENTTA]].range;

d3.json("Data/tietorakenne.json").then(function(data){
  TIETORAKENNE = data;
});

let promises = [];
promises.push(d3.json("Data/world.geojson"));

/**
 * Ladattua dataa käyttävät asiat tänne
 */
Promise.all(promises).then(function(my_topo) {

  yhdistaGeo(my_topo[0], "GRL", "DNK");
  
  /*
  // Grönlannin liitto Tanskaan
  {
    let worldGeojson = my_topo[0];

    let greenlandCoords;
    for (let i = 0; i < worldGeojson.features.length; i++) {
      if (worldGeojson.features[i].id == "GRL") {
        greenlandCoords = worldGeojson.features[i].geometry.coordinates;
        worldGeojson.features.splice(i, 1);
        break;
      }
    }
    let denmarkCoords;
    for (let i = 0; i < worldGeojson.features.length; i++) {
      if (worldGeojson.features[i].id == "DNK") {
        denmarkCoords = worldGeojson.features[i].geometry.coordinates;
        break;
      }
    }
    denmarkCoords.push(greenlandCoords);
  }
  */
   
  /**
   * Valtion toiseen liittämisen yleistys
   * TODO: Jostain syystä jotkut yhdistelmät palauttavat jonkun syvälle menevän virheen. Toimii kuitenkin Grönlannin liittoon.
   * Syy vaikuttaisi olevan se, että näitä ei kuuluisi yhdistellä tällä tavalla.
   */
  function yhdistaGeo(worldGeo, liitettava, liittaja){
    let liitettavaCoords, liittajaCoords;
    for(let i=0;i<worldGeo.features.length;i++){
      let id = worldGeo.features[i].id;
      switch(id){
        case liitettava:
          liitettavaCoords = worldGeo.features[i].geometry.coordinates;
          worldGeo.features.splice(i,1);
          i--;
          break;
        case liittaja:
          liittajaCoords = worldGeo.features[i].geometry.coordinates;
          break;
        default:
          break;
      }
    }
    if(liitettavaCoords&&liittajaCoords){
      liittajaCoords.push(liitettavaCoords);
    }
  }

  // Luodaan selectboxei
  var cat1 = document.getElementById("category1"),  // Ylempi selectbox
    cat2 = document.getElementById("category2");  // Alempi selectbox
  for (var x in APUKENTAT) {
    cat1.options[cat1.options.length] = new Option(x, x);
  }
  // Mitä käy kun ylempi selectbox vaihdetaan
  cat1.onchange = function() {
    // Tyhjennetään alempi dropdown
    cat2.length = 1;
    // Pistetään siihen oikeat arvot
    if(cat1.value != ""){
      var z = APUKENTAT[cat1.value];
      for (var i = 0; i < z.length; i++) {
        cat2.options[cat2.options.length] = new Option(z[i], i);
      }
    }
  };
  // Mitä käy kun alempi selectbox vaihdetaan
  cat2.onchange = function() {
    if(cat2.value != ""){
      KENTAT = APUKENTAT[cat1.value];
      VALITTU_KENTTA = cat2.value;
      piirra(my_topo);
    }
  };

/*
// Luo taulukon KENTAT-taulukon alkioista ja niitä vastaavista VALITTU_KENTTA-indekseistä
function kentatJaIndeksit(){
  let tulos = [];
  for (i in KENTAT){
    let alkio = {
      value:i,
      kentta:KENTAT[i]
    };
    tulos.push(alkio);
  }
  return tulos;
}

// Asettaa kenttäselectin valintavaihtoehdot
  d3.select("#selectit").selectAll("option")
    .data(kentatJaIndeksit())
    .join("option")
    .attr("value", function(d){
      return d.value;
    })
    .text(function(d){
      return d.kentta;
    });

// Kenttävalitsimen vaihtotapahtuma
  d3.select("#selectit")
    .on("change", selectHandler);

// Selectin tapahtumankäsittelijä
  function selectHandler() {
    let select = document.getElementById("selectit");
    let luku = parseInt(select.value);

    if(luku>=0&&luku<KENTAT.length){
      VALITTU_KENTTA = luku;
      piirra(my_topo);
    }
  }
*/

  d3.select("#topnappi")
    .on("click", suuntaHandler)
    .style("float", "left");

  // Toplistan suunnanvaihtonapin tapahtumankäsittelijä
  function suuntaHandler(){
    NOUSEVA = !NOUSEVA;
    document.getElementById('topnappi').innerHTML = (NOUSEVA ? '<i class="fas fa-angle-down"></i>' : '<i class="fas fa-angle-up"></i>');
    luoTopLista();
  }

  function luoTopLista() {
    /**
     * Sivun oikean reunan toplistan sisältö
     */
    function topLista(){
      let valtiot = Object.values(TIETORAKENNE).slice(); // Kopio VALTIOLISTAsta, ettei lajittelu muuta alkuperäistä
      let lajittelu = KENTAT[VALITTU_KENTTA];
      valtiot.sort(function (a,b){
        return (NOUSEVA) ? (a[lajittelu]-b[lajittelu]):(b[lajittelu]-a[lajittelu]);
      });
      return valtiot.slice(0,valtiot.length);
    }

    // Asettaa toplistan otsikon annetun kentän mukaan
    d3.select("#topotsikko")
      .text("Top List - " + KENTAT[VALITTU_KENTTA]);

    d3.select("#toplista").selectAll("*").remove();

    // Luo toplistan sivun oikeaan reunaan
    d3.select("#toplista").selectAll("li")
      .data(topLista())
      .join("li")
      .attr("id", function(d){
        return "top_" + d.id;
      })
      .text(
        function(d){
          return d.Nation + (d.Exists == "YES" ? "" : "  ✝");
        })
      .append("span")
      .style("float", "right")
      .text(
        function(d) {
          return `${Math.round(d[KENTAT[VALITTU_KENTTA]] * 100) / 100}`;
        }
      );
      d3.select("#toplista")
      .selectAll("li")
      .attr("class", "");

      d3.select("#top_"+BOLDATTU_MAA)
        .classed("boldattu", true);
  }

  piirra(my_topo);
  /**
   * Kartanpiirtämiset sun muut
   * TODO: Optimointi: Kohdat joita ei tarvitse joka piirroskerralla voisi siirtää tämän yläpuolelle.
   */
  function piirra(topo) {
    d3.select("svg")
      .remove();
    d3.select("#map")
      .append("svg");
    let svg = d3.select("svg")
      .attr("viewBox", "0 -200 960 750");

    var colorScale = d3.scaleThreshold()
      .domain(HEATMAP[KENTAT[VALITTU_KENTTA]].domain)
      .range(HEATMAP[KENTAT[VALITTU_KENTTA]].range);

    let mouseOver = function(d) {
      if (!TIETORAKENNE[d.id]) {return;} // Valtio on kartalla mutta sitä ei löydy tietorakenteesta

      let valtio = TIETORAKENNE[d.id];
      if (valtio){
        tooltip
          .style("opacity", 1)
          .html(valtio.Nation + ": " + d3.format(",")(Math.round(valtio[KENTAT[VALITTU_KENTTA]] * 100) / 100))
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      }
      d3.select("#top_" + valtio.id)
        .classed("hover_boldattu", true);
    };

    let mouseLeave = function(d) {
      if (!TIETORAKENNE[d.id]) {return;} // Valtio on kartalla mutta sitä ei löydy tietorakenteesta

      let valtio = TIETORAKENNE[d.id];
      d3.select("#top_" + valtio.id)
        .classed("hover_boldattu", false);
      tooltip
        .style("opacity", 0);
    };

    // Mitä käy kun jotain valtiota klikataan, tulostaa infot ja vaihtaa klikatun valtion värin
    let click = function(d) {
      let valtio = TIETORAKENNE[d.id];

      // Tulostetaan infot vasempaan reunaan
      // Tää on kunnon tulostus helvetti mut ihsm toimii ja meni joku 5min :^D 
      if(valtio){
        document.getElementById("infootsikko").textContent = "";
        document.getElementById("nimi").textContent = valtio.Nation;
        document.getElementById("nimi").style.color = "#FF4C29";
        document.getElementById("nimi").href = `https://en.wikipedia.org/wiki/${valtio.Nation}_at_the_Olympics`;
        let h2 = document.querySelectorAll("h2");
        for(i = 0; i < h2.length; i++){
          h2[i].style.visibility = "visible";
        }
        
        document.getElementById("lippu").src=valtio.flag;

        document.getElementById("Mitalit").textContent = "Total: " + valtio["Medals (Total)"];
        document.getElementById("Kulta").innerHTML = "<i class='fas fa-medal' style='color:gold'></i> " + valtio.Gold;
        document.getElementById("Hopea").innerHTML = "<i class='fas fa-medal' style='color:silver'></i> " + valtio.Silver;
        document.getElementById("Pronssi").innerHTML = "<i class='fas fa-medal' style='color:#CD7F32'></i> " + valtio.Bronze;
        document.getElementById("MitalitPC").innerHTML = "Total (per capita): " + Math.round(valtio["Medals (Per capita)"]*100)/100;

        document.getElementById("KesaMitalit").textContent = "Total: " + valtio["Medals (Summer)"];
        document.getElementById("KultaK").innerHTML = "<i class='fas fa-medal' style='color:gold'></i> " + valtio.SO_Gold;
        document.getElementById("HopeaK").innerHTML = "<i class='fas fa-medal' style='color:silver'></i> " + valtio.SO_Silver;
        document.getElementById("PronssiK").innerHTML = "<i class='fas fa-medal' style='color:#CD7F32'></i> " + valtio.SO_Bronze;

        document.getElementById("TalviMitalit").textContent = "Total: " + valtio["Medals (Winter)"];
        document.getElementById("KultaT").innerHTML = "<i class='fas fa-medal' style='color:gold'></i> " + valtio.WO_Gold;
        document.getElementById("HopeaT").innerHTML = "<i class='fas fa-medal' style='color:silver'></i> " + valtio.WO_Silver;
        document.getElementById("PronssiT").innerHTML = "<i class='fas fa-medal' style='color:#CD7F32'></i> " + valtio.WO_Bronze;

        document.getElementById("ParasLaji").textContent = valtio.MostSuccessfulSport;
        document.getElementById("KultaP").innerHTML = "<i class='fas fa-medal' style='color:gold'></i> " + valtio.Golds;
        document.getElementById("HopeaP").innerHTML = "<i class='fas fa-medal' style='color:silver'></i> " + valtio.Silvers;
        document.getElementById("PronssiP").innerHTML = "<i class='fas fa-medal' style='color:#CD7F32'></i> " + valtio.Bronzes;
        // Värjätään top-listasta valittu valtio 
        BOLDATTU_MAA = valtio.id;
        d3.select("#toplista")
          .selectAll("li")
          .attr("class", "");

        d3.select("#top_"+BOLDATTU_MAA)
          .attr("class", "boldattu");

        parseHostInfot(valtio.HostInfo);

        // Jäsennellään ja tulostetaan miesten ennätykset
        let ennatyksetM = document.getElementById("otsikko6");
        ennatyksetM.querySelectorAll('*').forEach(n => n.remove());

        info = valtio.RecordsM.split(",");
        for (let i = 0; i < info.length; i++) {
          let p = document.createElement("p");
          p.textContent = info[i].trim();
          ennatyksetM.append(p);
        }

        // Jäsennellään ja tulostetaan naisten ennätykset
        let ennatyksetW = document.getElementById("otsikko7");
        ennatyksetW.querySelectorAll('*').forEach(n => n.remove());

        info = valtio.RecordsW.split(",");
        for (let i = 0; i < info.length; i++) {
          let p = document.createElement("p");
          p.textContent = info[i].trim();
          ennatyksetW.append(p);
        }

        // Valittu valtio maalataan punaiseksi
        valtiot.transition().style("fill", null);
        d3.select(this).transition().style("fill", "#FF4C29");
      }
    };

    // Luodaan joka kisalle oma p ja linkki
    function parseHostInfot(info){
      let infot = document.getElementById("otsikko5");
      infot.querySelectorAll('*').forEach(n => n.remove());

      info = info.split(",");
      for (let i = 0; i < info.length; i++) {
        let a = document.createElement("a");
        a.textContent = info[i].trim();
        a.style.color = "#FF4C29";
        s = info[i].substring(0, info[i].indexOf('('));
        a.href = `https://en.wikipedia.org/wiki/${s}`;
        let p = document.createElement("p");
        p.append(a);
        infot.append(p);
      }
    }

    luoTopLista();

    d3.select("#top_" + BOLDATTU_MAA)
      .attr("class", "boldattu");

    // Tässä tapahtuu zoomaaminen
    const zoom = d3.zoom()
      .scaleExtent([1, 6])  // Tästä säädetään kuinka syvälle saa zoomattua
      .translateExtent([[0, -200], [960, 550]])
      .on('zoom', zoomed);

    svg.call(zoom);

    function zoomed() {
      svg
        .selectAll('path')
        .attr('transform', d3.event.transform);
    }

      var topo = topo[0];
      // Piiretään kartta
      const valtiot = svg.append("g")
        .attr("id", "kartta")
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
        .attr("class", "topo")
        .attr("stroke", "grey")
        .attr("stroke-width", 0.5)
          // Piirretään jokainen valtio
          .attr("d", d3.geoPath()
            .projection(projection)
          )
          // Asetetaan väri jokaiselle valtiolle
          .attr("fill", function (d) {
            let valtio = TIETORAKENNE[d.id];
            let arvo = (valtio) ? (valtio[KENTAT[VALITTU_KENTTA]]) : (0);
            return colorScale(arvo);
          })
        .on("mouseover", mouseOver)
        .on("mousemove", function(){  // Tooltip seuraa hiirtä
          return tooltip
                  .style("top", (d3.event.pageY-28)+"px")
                  .style("left",(d3.event.pageX)+"px");})
        .on("mouseleave", mouseLeave)
        .on("click", click);

      // Selite heatmapille
      svg.append("g")
        .attr("class", "legendQuant");

      var legend = d3.legendColor()
        .labels(HEATMAP[KENTAT[VALITTU_KENTTA]].labels)
        .title(KENTAT[VALITTU_KENTTA])
        .scale(colorScale);

      svg.select(".legendQuant")
        .call(legend);
  }
});
