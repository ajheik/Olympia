// Pudota pommi selaimeen, kun projektisivu on auki
let preTietorakenne;
let tietorakenne = {};
d3.csv("Data/datacsv.csv").then(function(data) {
    preTietorakenne = data;
    for (let country of preTietorakenne) {
        tietorakenne[country.id] = country;
    }
    let tempAnkkuriElementti123 = document.createElement("a");
    tempAnkkuriElementti123.setAttribute("id", "tempAnkkuriElementti123");
    tempAnkkuriElementti123.style.display = "none";
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tietorakenne));
    tempAnkkuriElementti123.setAttribute("href", dataStr);
    tempAnkkuriElementti123.setAttribute("download", "tiedosto.json");
    tempAnkkuriElementti123.click();
});
