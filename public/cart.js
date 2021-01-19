if (localStorage.length <= 1) {
    var x = document.createElement('h1');
    x.innerHTML = "Nema unetih proizvoda u korpu";
    document.getElementById('kontejner').appendChild(x);
}
else {
    var x = document.createElement('h1');
    x.innerHTML = "Proizvodi u Vašoj korpi:";
    var kontejner = document.getElementById('kontejner');
    kontejner.appendChild(x);
    var divtabla = document.createElement('div');
    divtabla.classList.add("table-responsive");
    kontejner.appendChild(divtabla);
    var tabla = document.createElement("table");
    tabla.classList.add("table", "table-hover");
    divtabla.appendChild(tabla);
    var thead = document.createElement("thead");
    thead.classList.add("thead-dark");
    tabla.appendChild(thead);
    tabla.style.textAlign = "center";
    var th1 = document.createElement("th");
    th1.scope = "col";
    th1.innerHTML = "#";
    thead.appendChild(th1);
    th1 = document.createElement("th");
    th1.scope = "col";
    th1.innerHTML = "Proizvod";
    thead.appendChild(th1);
    th1 = document.createElement("th");
    th1.scope = "col";
    th1.innerHTML = "";
    thead.appendChild(th1);
    th1 = document.createElement("th");
    th1.scope = "col";
    th1.innerHTML = "Cena";
    thead.appendChild(th1);
    th1 = document.createElement("th");
    th1.scope = "col";
    th1.innerHTML = "Količina";
    thead.appendChild(th1);
    th1 = document.createElement("th");
    th1.scope = "col";
    th1.innerHTML = "Ukupno";
    thead.appendChild(th1);
    th1 = document.createElement("th");
    th1.scope = "col";
    th1.innerHTML = "Izbaci iz korpe";
    thead.appendChild(th1);
    var tbody = document.createElement("tbody");
    var obradjeni = [];
    var indeks = 1;
    var suma = 0;
    for (let i = 1; i < localStorage.length; i++) {
        var kljuc = localStorage.key(i);
        if (kljuc == "Session") continue;
        var pozicijabroj = kljuc.indexOf("broj");
        if (pozicijabroj != -1) {
            pozicijabroj = kljuc.slice(4);
            if (obradjeni.indexOf(pozicijabroj) != -1) continue;
            else {
                let x = JSON.parse(localStorage.getItem(pozicijabroj));
                let y = localStorage.getItem(`broj${pozicijabroj}`);
                obradjeni.push(pozicijabroj);
                var tr = document.createElement("tr");
                tr.classList.add(x._id);
                var th = document.createElement("th");
                th.style.color='white';
                th.scope = "row";
                th.innerHTML = indeks++;
                var td1 = document.createElement("td");
                var img = document.createElement("img");
                img.src = x.url;
                img.classList.add("img-thumbnail", "img-fluid");
                var omotac = document.createElement("div");
                omotac.classList.add("omotac");
                omotac.appendChild(img);
                td1.appendChild(omotac);
                var td2 = document.createElement("td");
                td2.style.verticalAlign = "middle";
                td2.innerHTML = x.ime;
                var td3 = document.createElement("td");
                var td31 = document.createElement("p");
                td3.style.verticalAlign = "middle";
                td31.innerHTML = x.cena;
                td3.appendChild(td31);
                if (x.akcija == true) {
                    td31.style.textDecoration = "line-through";
                    td31.style.fontWeight = 200;
                    var td33 = document.createElement("p");
                    td33.setAttribute("style", 'text-decoration: none !important');
                    td33.textContent = x.akcijskacena;
                    td33.style.fontWeight = 600;
                    td3.appendChild(td33);
                }
                else{
                    td3.style.fontWeight = 600;
                }
                var td4 = document.createElement("td");
                td4.style.verticalAlign = "middle";
                // MINUS I PLUS
                var divminusplus = document.createElement("div");
                var dugmeminus = document.createElement("button");
                dugmeminus.type = "button";
                dugmeminus.classList.add("btn", "btn-info", `minus`);
                dugmeminus.id = `minus${x._id}`;
                dugmeminus.innerHTML = "-";
                var ulazkolicina = document.createElement("input");
                ulazkolicina.type = "number";
                ulazkolicina.disabled = true;;
                ulazkolicina.id = `ulaz${x._id}`;
                ulazkolicina.classList.add("ulaz");
                ulazkolicina.value = y;

                var dugmeplus = document.createElement("button");
                dugmeplus.type = "button";
                dugmeplus.classList.add("btn", "btn-info", `plus`);
                dugmeplus.id = `plus${x._id}`;
                dugmeplus.innerHTML = "+";
                divminusplus.appendChild(dugmeminus);
                divminusplus.appendChild(ulazkolicina);
                divminusplus.appendChild(dugmeplus);
                td4.appendChild(divminusplus);

                var td5 = document.createElement("td");
                td5.style.verticalAlign = "middle";
                var td55 = document.createElement("td");
                    suma += parseInt(x.cena) * parseInt(y);
                    td55.textContent = parseInt(y) * parseInt(x.cena);
                var td6 = document.createElement("button");
                td6.id = x._id;
                td6.classList.add("izbaci", "btn-danger", "btn");
                td6.innerHTML = "Izbaci";
                td6.addEventListener("click", function () {
                    localStorage.removeItem(this.id);
                    localStorage.removeItem("broj" + this.id);
                    // SMANJIVANJE UKUPNO
                    var ukupno = document.getElementById("ukupno");
                    var kontekst = parseInt(ukupno.textContent);
                    ukupno.textContent = kontekst - parseInt(document.getElementsByClassName(this.id)[0].childNodes[5].textContent);
                    var elementbrisi = document.getElementsByClassName(this.id)[0];
                    var onajkojibrise = elementbrisi.parentElement;
                    onajkojibrise.removeChild(elementbrisi);
                    var indeksi = document.getElementsByTagName("th");
                    for (var ind = 7; ind < indeksi.length - 1; ind++) {
                        indeksi[ind].textContent = ind - 6;
                    }
                })
                td5.appendChild(td6);
                tr.appendChild(th);
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);
                tr.appendChild(td55);
                tr.appendChild(td5);

                tbody.appendChild(tr);
            }

        }
        else {

            if (obradjeni.indexOf(kljuc) != -1) continue;
            else {
                let x = JSON.parse(localStorage.getItem(kljuc));
                let y = localStorage.getItem(`broj${kljuc}`);
                obradjeni.push(kljuc);
                var tr = document.createElement("tr");
                tr.classList.add(x._id);
                var th = document.createElement("th");
                th.style.color='white';
                th.scope = "row";
                th.innerHTML = indeks++;
                var td1 = document.createElement("td");
                var img = document.createElement("img");
                img.src = x.url;
                img.classList.add("img-thumbnail", "img-fluid");
                var omotac = document.createElement("div");
                omotac.classList.add("omotac");
                omotac.appendChild(img);
                td1.appendChild(omotac);
                var td2 = document.createElement("td");
                td2.innerHTML = x.ime;
                td2.style.verticalAlign = "middle";
                var td3 = document.createElement("td");
                var td31 = document.createElement("p");
                td3.style.verticalAlign = "middle";
                td31.innerHTML = x.cena;
                td3.appendChild(td31);
                if (x.akcija == true) {
                    td31.style.textDecoration = "line-through";
                    td31.style.fontWeight = 200;
                    var td33 = document.createElement("p");
                    td33.setAttribute("style", 'text-decoration: none !important');
                    td33.textContent = x.akcijskacena;
                    td33.style.fontWeight = 600;
                    td3.appendChild(td33);
                }
                else{
                    td3.style.fontWeight = 600;
                }
                var td4 = document.createElement("td");
                td4.style.verticalAlign = "middle";
                // MINUS I PLUS
                var divminusplus = document.createElement("div");
                var dugmeminus = document.createElement("button");
                dugmeminus.type = "button";
                dugmeminus.classList.add("btn", "btn-info", `minus`);
                dugmeminus.id = `minus${x._id}`;
                dugmeminus.innerHTML = "-";
                var ulazkolicina = document.createElement("input");
                ulazkolicina.type = "number";
                ulazkolicina.disabled = true;;
                ulazkolicina.id = `ulaz${x._id}`;
                ulazkolicina.classList.add("ulaz");
                ulazkolicina.value = y;

                var dugmeplus = document.createElement("button");
                dugmeplus.type = "button";
                dugmeplus.classList.add("btn", "btn-info", `plus`);
                dugmeplus.id = `plus${x._id}`;
                dugmeplus.innerHTML = "+";
                divminusplus.appendChild(dugmeminus);
                divminusplus.appendChild(ulazkolicina);
                divminusplus.appendChild(dugmeplus);
                td4.appendChild(divminusplus);

                var td5 = document.createElement("td");
                td5.style.verticalAlign = "middle";
                var td55 = document.createElement("td");
                suma += parseInt(x.cena) * parseInt(y);
                td55.textContent = parseInt(y) * parseInt(x.cena);
                var td6 = document.createElement("button");
                td6.id = x._id;
                td6.classList.add("izbaci", "btn-danger", "btn");
                td6.innerHTML = "Izbaci";
                td6.addEventListener("click", function () {
                    localStorage.removeItem(this.id);
                    localStorage.removeItem("broj" + this.id);
                    // SMANJIVANJE UKUPNO
                    var ukupno = document.getElementById("ukupno");
                    var kontekst = parseInt(ukupno.textContent);
                    ukupno.textContent = kontekst - parseInt(document.getElementsByClassName(this.id)[0].childNodes[5].textContent);
                    var elementbrisi = document.getElementsByClassName(this.id)[0];
                    var onajkojibrise = elementbrisi.parentElement;
                    onajkojibrise.removeChild(elementbrisi);
                    var indeksi = document.getElementsByTagName("th");
                    for (var ind = 7; ind < indeksi.length - 1; ind++) {
                        indeksi[ind].textContent = ind - 6;
                    }
                })
                td5.appendChild(td6);
                tr.appendChild(th);
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);
                tr.appendChild(td55);
                tr.appendChild(td5);

                tbody.appendChild(tr);
            }

        }

    }
    tabla.appendChild(tbody);

    tr = document.querySelectorAll("table tbody")[1];
    tr = tr.querySelector("tr");
    console.log(tr);
    ukupno = document.createElement("td");
    ukupno.id = "ukupno";
    ukupno.innerHTML = suma;
    tr.appendChild(ukupno);
}
// ZA PLUS I MINUS JQUERY
$('.plus').click(function () {
    var kljucplus = $(this)[0].id.slice(4);
    kljucplus = "broj" + kljucplus;
    localStorage.setItem(kljucplus, parseInt(localStorage.getItem(kljucplus)) + 1);

    var jedanred = $(this)[0].parentElement.parentElement.parentElement;
    //MENJANJE VREDNOSTI UKUPNO NA KRAJU
    var trenutni = document.getElementById("ukupno");
    var vrednost = parseInt(trenutni.innerHTML);
    vrednost += parseInt(jedanred.childNodes[3].lastChild.textContent);
    trenutni.textContent = vrednost;
    //MENJANJE VREDNPSTI UKUPNO U TABELI
    var trenutnitabela = parseInt(jedanred.childNodes[5].textContent);
    jedanred.childNodes[5].textContent = trenutnitabela + parseInt(jedanred.childNodes[3].lastChild.textContent);
    $(this).prev().val(+$(this).prev().val() + 1);
});
$('.minus').click(function () {
    var kljucminus = $(this)[0].id.slice(5);
    kljucminus = "broj" + kljucminus;
    if ($(this).next().val() > 1) {
        // SMANJIVANJE VREDNOSTI U LOCALSTORAGE
        localStorage.setItem(kljucminus, parseInt(localStorage.getItem(kljucminus)) - 1);
        var jedanred = $(this)[0].parentElement.parentElement.parentElement;
        //MENJANJE VREDNOSTI UKUPNO NA KRAJU
        var trenutni = document.getElementById("ukupno");
        var vrednost = parseInt(trenutni.innerHTML);
        vrednost -= parseInt(jedanred.childNodes[3].lastChild.textContent);
        trenutni.textContent = vrednost;
        //MENJANJE VREDNOSTI UKUPNO U TABELI
        var trenutnitabela = parseInt(jedanred.childNodes[5].textContent);
        jedanred.childNodes[5].textContent = trenutnitabela - parseInt(jedanred.childNodes[3].lastChild.textContent);
        $(this).next().val(+$(this).next().val() - 1);
    }
});
// KUPOVINA
document.getElementById("kupovina").addEventListener("click", function () {
    this.disabled=true; // moguc samo jedan klik na dugme
    var poruka = { podaci: [], kolicina: [] };
    for (var i = 0; i < localStorage.length; i++) {
        var kljuc = localStorage.key(i);
        if (kljuc == "Session") continue;
        if (kljuc.indexOf("broj") == -1) {
            poruka.podaci.push(localStorage.getItem(kljuc));
            poruka.kolicina.push(localStorage.getItem("broj" + kljuc));
            poruka.ukupno = parseInt(document.getElementById("ukupno").textContent);
        }
    }
    poruka = JSON.stringify(poruka);
    // ZAHTEV SERVERU
    // Creating a XHR object 
    let xhr = new XMLHttpRequest();
    let url = "/cart";

    // open a connection 
    xhr.open("POST", url, true);

    // Set the request header i.e. which type of content you are sending 
    xhr.setRequestHeader("Content-Type", "application/json");

    // Create a state change callback 
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var responseURL = this.responseURL;
            console.log(this);
            if (this.response.indexOf("Neuspesna") == 0 || this.response.indexOf("Samo") >= 0) {
                if (this.response.indexOf("Niste") == 0) {
                    responseURL = "http://localhost:3000/login";
                }
                var message = document.createElement("div");
                message.classList.add("alert", "alert-danger");
                message.style.zIndex = 3;
                message.role = "alert";
                message.textContent = this.response;
                document.getElementsByClassName("container")[1].appendChild(message);
                (async function () {
                    await $(".alert-danger").delay(400).fadeOut(3000);
                    setTimeout(function FetchData() {
                        window.location.href = responseURL;
                    }, 4000);

                })();
            }
            else {
                localStorage.clear();
                var message = document.createElement("div");
                message.classList.add("alert", "alert-success");
                message.style.zIndex = 3;
                message.role = "alert";
                message.textContent = this.response;
                document.getElementsByClassName("container")[1].appendChild(message);
                (async function () {
                    await $(".alert-success").delay(400).fadeOut(3000);
                    setTimeout(function FetchData() {
                        window.location.href = responseURL;
                    }, 4000);

                })();
            }
        }
    };
    // Converting JSON data to string   
    // Sending data with the request 
    xhr.send(poruka);

});