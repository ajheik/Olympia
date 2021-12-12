let objekti = ???

let tempAnkkuriElementti123 = document.createElement("a");
tempAnkkuriElementti123.setAttribute("id", "tempAnkkuriElementti123");
tempAnkkuriElementti123.style.display = "none";

let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(objekti));
tempAnkkuriElementti123.setAttribute("href", dataStr);
tempAnkkuriElementti123.setAttribute("download", "tiedosto.json");
tempAnkkuriElementti123.click();
