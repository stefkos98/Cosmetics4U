var td4 = document.createElement("td");
td4.style.verticalAlign = "middle";
// MINUS I PLUS
var divminusplus = document.createElement("div");
var dugmeminus = document.createElement("button");
dugmeminus.type = "button";
dugmeminus.classList.add("btn", "btn-info", `minus`);
dugmeminus.id = `minus`;
dugmeminus.innerHTML = "-";
var ulazkolicina = document.createElement("input");
ulazkolicina
ulazkolicina.type = "number";
ulazkolicina.disabled = true;;
ulazkolicina.id = `ulaz`;
ulazkolicina.classList.add("ulaz");
ulazkolicina.value = 1;

var dugmeplus = document.createElement("button");
dugmeplus.type = "button";
dugmeplus.classList.add("btn", "btn-info", `plus`);
dugmeplus.id = `plus`;
dugmeplus.innerHTML = "+";
divminusplus.appendChild(dugmeminus);
divminusplus.appendChild(ulazkolicina);
divminusplus.appendChild(dugmeplus);
td4.appendChild(divminusplus);
document.getElementById("tu").appendChild(td4);

$('.plus').click(function () {
    $(this).prev().val(+$(this).prev().val() + 1);
});
$('.minus').click(function () {
    if ($(this).next().val() > 1) {
        $(this).next().val(+$(this).next().val() - 1);
    }

});
async function funkcija()
{
    var brojka=document.getElementById("ulaz").value;
    return brojka;
}