var i = document.getElementById("brojka");
var trenutnastranica = 1;
var pages = document.querySelectorAll("div[id^='page']");
var naredni = document.getElementById("next");
var prethodni = document.getElementById("previous");
// Ako je jedna stranica
if (i!=undefined && i.value == 1) {
    naredni.parentElement.classList.add("disabled");
    prethodni.parentElement.classList.add("disabled");
}
if(i !=undefined && i.value==0)
{
    naredni.parentElement.style.display="none";
    prethodni.parentElement.style.display="none";
}
if(i!=undefined){
for (let j = 1; j <= i.value; j++) {
    if (j > 1) {
        pages[j - 1].classList.add("klasa");
    }
    else {
        document.getElementById(`link${1}`).parentElement.classList.add("active");
    }
    let dugme = document.getElementById(`link${j}`);
    console.log(dugme);
    dugme.addEventListener("click", function (dugme) {
        this.parentElement.classList.add("active");
        for (var k = 1; k <= i.value; k++) {
            if (document.getElementById(`link${k}`) != this) {
                document.getElementById(`link${k}`).parentElement.classList.remove("active");
            }
            if (k == j) {
                pages[k - 1].classList.remove("klasa");
                trenutnastranica = k;
            }
            else {
                pages[k - 1].classList.add("klasa");

            }
            if (j == 1) {
                prethodni.parentElement.classList.add("disabled");
                naredni.parentElement.classList.remove("disabled");
            }
            else if (j == i.value) {
                naredni.parentElement.classList.add("disabled");
                prethodni.parentElement.classList.remove("disabled");
            }
            else {
                prethodni.parentElement.classList.remove("disabled");
                naredni.parentElement.classList.remove("disabled");
            }
        }
    });
}
}
naredni.addEventListener("click", function () {
    if (trenutnastranica == i.value - 1) {
        naredni.parentElement.classList.add("disabled");
        prethodni.parentElement.classList.remove("disabled");
        trenutnastranica = i.value;
    }
    else {
        trenutnastranica++;
        prethodni.parentElement.classList.remove("disabled");
    }
    for (var k = 1; k <= i.value; k++) {
        document.getElementById(`link${k}`).parentElement.classList.remove("active");
        if (k == trenutnastranica) {
            pages[k - 1].classList.remove("klasa");
            trenutnastranica = k;
            document.getElementById(`link${k}`).parentElement.classList.add("active");
        }
        else {
            pages[k - 1].classList.add("klasa");

        }
        if (trenutnastranica == 1) {
            prethodni.parentElement.classList.add("disabled");
            naredni.parentElement.classList.remove("disabled");
        }
        else if (trenutnastranica == i.value) {
            naredni.parentElement.classList.add("disabled");
            prethodni.parentElement.classList.remove("disabled");
        }
        else {
            prethodni.parentElement.classList.remove("disabled");
            naredni.parentElement.classList.remove("disabled");
        }
    }
});
prethodni.addEventListener("click", function () {
    if (trenutnastranica == 2) {
        prethodni.parentElement.classList.add("disabled");
        naredni.parentElement.classList.remove("disabled");
        trenutnastranica = 1;
    }
    else {
        trenutnastranica--;
        naredni.parentElement.classList.remove("disabled");
    }
    for (var k = 1; k <= i.value; k++) {
        document.getElementById(`link${k}`).parentElement.classList.remove("active");
        if (k == trenutnastranica) {
            pages[k - 1].classList.remove("klasa");
            
            trenutnastranica = k;
            document.getElementById(`link${k}`).parentElement.classList.add("active");
        }
        else {
            pages[k - 1].classList.add("klasa");

        }
        if (trenutnastranica == 1) {
            prethodni.parentElement.classList.add("disabled");
            naredni.parentElement.classList.remove("disabled");
        }
        else if (trenutnastranica == i.value) {
            naredni.parentElement.classList.add("disabled");
            prethodni.parentElement.classList.remove("disabled");
        }
        else {
            prethodni.parentElement.classList.remove("disabled");
            naredni.parentElement.classList.remove("disabled");
        }
    }
});
// PODESAVANJE SELECT BUTTONA
var par1 = document.querySelector("input[name='par1']");
if(par1!=null) par1=par1.value;
var par2 = document.querySelector("input[name='par2']");
if(par2!=null) par2=par2.value;
var par3 = document.querySelector("input[name='par3']").value;
var par4 = document.querySelector("input[name='par4']").value;
var par5=document.querySelector("input[name='par5']");
if(par5!=null) par5=par5.value;
if (par5=="") par5=0;
console.log(par1 + par2);
if (par1!=null && par1 == "0") {
    document.querySelector(`select[name='kategorijafilter']`).value = 0;
}
else if(par1!=null){
     if(document.querySelector(`select[name='kategorijafilter']`)!=null){document.querySelector(`select[name='kategorijafilter']`).value = par1;}

}
if (par2!=null && par2 == "0") {
   document.querySelector(`select[name='tipfilter']`).value = 0;
}
else if(par2!=null) {
    if(document.querySelector(`select[name='tipfilter']`)!=null)
    document.querySelector(`select[name='tipfilter']`).value = par2;

}
if (par3 != 5 && par3 != 10 && par3 != 20 && par3 != 50 && par3 != 100) {
    par3 = 6;
}
document.querySelector(`select[name='brojfilter']`).value = par3;;
document.querySelector(`select[name='sortfilter']`).value = par4;
if(par5!=null && par5=="0")
{
document.querySelector(`select[name='prodavnicafilter']`).value =0 ;
}
else if(par5!=null)
{
    document.querySelector(`select[name='prodavnicafilter']`).value =par5;

}
// oblacic Ukloni filtere
function myFunction() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
  }