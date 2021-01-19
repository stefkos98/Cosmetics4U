// PROMENLJIVE
var proizvodi, termini, prodavci, administratori, korisnici;
//EXPRESS
var express = require('express');
var app = express();
// za konvertovanje string query u json
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// FOLDER ZA CSS, JS I DRUGE FAJLOVE
app.use(express.static("public"));
// FLASH poruke
app.use(require('express-session')({ secret: "Passport do pobede", resave: false, saveUninitialized: false }));
var flash = require('connect-flash'); // za prikaz flash poruka niste ulogovani itd(kad se uradi i logovanje)
app.use(flash());
//  FLASH poruke vidljive svim metodama
app.use((req, res, next) => {
    res.locals.message = req.flash("success");
    res.locals.error = req.flash("error");
    next();

});
// ZA DELETE I PUT METODE
var methodOverride = require('method-override'); // za delete i put http metode
app.use(methodOverride("_method"));
// KONEKCIJA SA BAZOM
var mongoose = require('mongoose');
mongoose.connect("mongodb+srv://stefkos98:Ss1998!!!@cluster0-hqhmi.mongodb.net/cosmetics4u?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true }); // onlajn baza
mongoose.set('useCreateIndex', true);
var validator = require('validator');

// SEME
var Korisnik = require('./models/korisnik');
var Prodavac = require('./models/prodavac');
var Proizvod = require('./models/proizvod');
var Prodavnica = require('./models/prodavnica');
var Kupovina = require('./models/kupovina');

// PASSPORT VERZIJA
var passport = require('passport');
var localStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
app.use(passport.initialize());
app.use(passport.session());
// PASSPORT SERIJALIZACIJA I DESERIJALIZACIJA USERA
passport.serializeUser(function (user, done) {
    return done(null, user);
});
passport.deserializeUser(function (user, done) {
    if (user != null)
        return done(null, user);
});
// PASSPORT LOKALNE STRATEGIJE
passport.use('korisniklocal', new localStrategy({ usernameField: 'email' }, function (username, password, done) {
    Korisnik.findOne({ email: username }, async function (err, user) {
        if (err) { return done(err); }
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        const t = await bcrypt.compare(password, user.password)
        if (!t) return done(null, false, { message: 'Incorrect password' });
        return done(null, user);
    });
}));
passport.use('prodavaclocal', new localStrategy({ usernameField: 'email' }, function (username, password, done) {
    Prodavac.findOne({ email: username }, async function (err, user) {
        if (err) { return done(err); }
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        const t = await bcrypt.compare(password, user.password)
        if (!t) return done(null, false, { message: 'Incorrect password' });
        return done(null, user);
    });
}));

// PASSPORT RUTE ZA LOGIN I REGISTER
app.get("/login", function (req, res) {
    if (req.user != undefined) {
        req.flash("error", "Vec ste ulogovani");
        res.redirect("/");
    }
    else res.render('login.ejs', { user: req.user });
});
app.post('/login', passport.authenticate(["prodavaclocal", "korisniklocal"], { successRedirect: "/", failureRedirect: "/login" }), (req, res) => { });

app.get('/logout', (req, res) => { req.logout(); req.flash("success", "Uspesna odjava"); res.redirect('/') });

app.get("/register", (req, res) => {
    if (req.user != undefined) {
        req.flash("error", "Vec ste ulogovani");
        res.redirect("/");
    }
    res.render("registration.ejs", { user: req.user });
});

app.post("/register", async function (req, res) {
    if (req.user != undefined) {
        req.flash("error", "Vec ste ulogovani");
        res.redirect("/");
    }
    var postojiemail= await Korisnik.findOne({ email: req.body.email });
    if (!postojiemail)
        postojiemail = await Prodavac.findOne({ email: req.body.email });
    var postojiusername = await Korisnik.findOne({ username: req.body.username });
    if (!postojiusername)
        postojiusername = await Prodavac.findOne({ username: req.body.username });
    if (!validator.isEmail(req.body.email) || postojiemail) {
        req.flash("error", "Email nije validan!");
        res.redirect("/register");
    }
    else {

        if (postojiusername) {
            req.flash("error", "Vec postoji korisnik sa tim username-om, izaberite drugi!");
            res.redirect("/register");
        }
        else {
            var pattern = /^06\d{7,8}$/;
            if (pattern.test(req.body.telefon) == false) {
                req.flash("error", "Pogresan format telefona!");
                res.redirect("/register");
            }
            else {
                var user = new Korisnik({ tipkorisnika: req.body.tip, ime: req.body.ime, prezime: req.body.prezime, username: req.body.username, email: req.body.email, password: req.body.password, telefon: req.body.telefon });
                if (req.body.tip == "prodavac") {
                    user = new Prodavac({ tipkorisnika: req.body.tip, ime: req.body.ime, prezime: req.body.prezime, username: req.body.username, odobren: 0, email: req.body.email, password: req.body.password, telefon: req.body.telefon });
                }
                    await user.save();
                    req.flash("success", "Uspesna registracija, sada se mozete ulogovati!");
                    res.redirect("/");
                }
            }
        }
});
// POCETNA STRANICA
app.get("/", async function (req, res) {
    res.render("home.ejs", { user: req.user });
});
// PRIKAZ VISE INFORMACIJA O PROIZVODU
app.get("/products/:id", (req, res) => {
    Proizvod.findById(req.params.id, (err, proizvod) => {
        res.render("showproduct.ejs", { proizvod: proizvod, user: req.user });
    });
});
// PRIKAZ NAKON IZBORA IZ MENIJA ILI SA POCETNE STRANE (kategorija,tip,podtip)
app.get("/products/show/:kategorija/:tip/:podtip", async (req, res) => {
    var rezultattip = await Proizvod.find({ kategorija: req.params.kategorija, tip: req.params.tip,podtip:req.params.podtip });
    var x = await Prodavnica.find({});
    var broj = req.query.brojfilter;
    if (req.query.prodavnicafilter != undefined && req.query.prodavnicafilter != '0') {
        var proizvodiizprodavnice = await Prodavnica.findOne({ ime: req.query.prodavnicafilter });
        var rezultattip2 = [];
        for (var i = 0; i < rezultattip.length; i++) {
            if (proizvodiizprodavnice.proizvodi.indexOf(rezultattip[i]._id) > -1) {
                rezultattip2.push(rezultattip[i]);
            }
        }
        rezultattip = rezultattip2;
    }
    if (broj == undefined) {
        broj = 10;
    }
    if (broj == 6) {
        broj = rezultattip.length;
    }
    var sort = req.query.sortfilter;
    if (sort != undefined) {
        switch (sort) {
            case '0': {

                res.render("showproductstype.ejs", {
                    proizvodi: rezultattip, prodavnicee: x,
                    user: req.user, kategorija: req.params.kategorija, tip: req.params.tip,podtip:req.params.podtip, broj: broj, sort: sort, prod: req.query.prodavnicafilter
                }); break;
            }
            case '1': {
                for (var i = 0; i < rezultattip.length; i++) {
                    var temp;
                    for (var j = i + 1; j < rezultattip.length; j++) {
                        if (rezultattip[i].cena > rezultattip[j].cena) {
                            temp = rezultattip[i];
                            rezultattip[i] = rezultattip[j];
                            rezultattip[j] = temp;
                        }
                    }
                }
                res.render("showproductstype.ejs", {
                    proizvodi: rezultattip, prodavnicee: x,
                    user: req.user, kategorija: req.params.kategorija, tip: req.params.tip,podtip:req.params.podtip, broj: broj, sort: sort, prod: req.query.prodavnicafilter
                }); break;
            }
            case '2': {
                for (var i = 0; i < rezultattip.length; i++) {
                    var temp;
                    for (var j = i + 1; j < rezultattip.length; j++) {
                        if (rezultattip[i].cena < rezultattip[j].cena) {
                            temp = rezultattip[i];
                            rezultattip[i] = rezultattip[j];
                            rezultattip[j] = temp;
                        }
                    }
                }

                res.render("showproductstype.ejs", {
                    proizvodi: rezultattip, prodavnicee: x,
                    user: req.user, kategorija: req.params.kategorija, broj: broj, tip: req.params.tip,podtip:req.params.podtip, sort: sort, prod: req.query.prodavnicafilter
                }); break;
            }
            case '3': {
                rezultattip.sort((a, b) => a.ime.localeCompare(b.ime));
                res.render("showproductstype.ejs", {
                    proizvodi: rezultattip, prodavnicee: x,
                    user: req.user, kategorija: req.params.kategorija, broj: broj, tip: req.params.tip,podtip:req.params.podtip, sort: sort, prod: req.query.prodavnicafilter
                }); break;
            }
            case '4': {
                rezultattip.sort((a, b) => b.ime.localeCompare(a.ime));
                res.render("showproductstype.ejs", {
                    proizvodi: rezultattip, prodavnicee: x,
                    user: req.user, kategorija: req.params.kategorija, broj: broj, broj: req.params.tip,podtip:req.params.podtip, sort: sort, prod: req.query.prodavnicafilter
                }); break;
            }
            case '5': {
                const sortedActivities = rezultattip.sort((a, b) => b.vremedodavanja - a.vremedodavanja);
                res.render("showproductstype.ejs", {
                    proizvodi: sortedActivities, prodavnicee: x,
                    user: req.user, kategorija: req.params.kategorija, broj: broj, tip: req.params.tip,podtip:req.params.podtip, sort: sort, prod: req.query.prodavnicafilter
                }); break;
            }
            case '6': {
                const sortedActivities = rezultattip.sort((a, b) => a.vremedodavanja - b.vremedodavanja);
                res.render("showproductstype.ejs", {
                    proizvodi: sortedActivities, prodavnicee: x,
                    user: req.user, kategorija: req.params.kategorija, tip: req.params.tip,podtip:req.params.podtip, broj: broj, sort: sort, prod: req.query.prodavnicafilter
                }); break;
            }
        }
    }
    else {
        sort = 0;
        res.render("showproductstype.ejs", {
            proizvodi: rezultattip, prodavnicee: x,
            user: req.user, kategorija: req.params.kategorija, tip: req.params.tip,podtip:req.params.podtip, broj: broj, sort: sort, prod: req.query.prodavnicafilter
        });
    }
});
// PROFIL KORISNIKA I PRODAVCA
app.get("/profile", async function (req, res) {
    prodavci = await Prodavac.find({});
    korisnici = await Korisnik.find({});
    if (req.user.tipkorisnika == 'prodavac') {

        await Prodavac.findOne({ email: req.user.email }).populate("prodavnice").exec(function (err, prodavac) {
            res.render("profile_prodavac.ejs", { user: req.user, prodavnice: prodavac.prodavnice });
        });
    }
    else
    if (req.user.tipkorisnika == 'korisnik') {
        let nizKupovinaProizvodi = [];

        await Korisnik.findById(req.user._id).populate({ path: 'kupovine', populate: { path: 'proizvodi' } }).exec(async (err, korisnik) => {
            if (korisnik.kupovine.length == 0) {
                nizKupovinaProizvodi = undefined;
            }
            else {
                nizKupovinaProizvodi.push(korisnik.kupovine)
            }
            res.render("profile_korisnik.ejs", { user: req.user, nizKupovinaProizvodi: nizKupovinaProizvodi });
        })
    }
});
// GET METODA ZA DODAVANJE NOVE PRODAVNICE
app.get("/profile/prodavac/prodavnica/new", async (req, res) => {
    res.render("addprodavnica.ejs", { user: req.user });
})
// POST METODA ZA CUVANJE NOVE PRODAVNICE
app.post("/profile/prodavac/prodavnica", async (req, res) => {
    console.log(req.body.ime);
    if (req.body.ime == "" || req.body.adresa == "" || req.body.ime == undefined || req.body.adresa == undefined) {
        req.flash("error", "Morate popuniti sva polja");
        res.redirect("/profile/prodavac/prodavnica/new");
    }
    else {
        await Prodavac.findById(req.user._id).populate("prodavnice").exec(async (err, prodavac) => {
            if (err) console.log(err);
            else {
                await Prodavnica.create({ "ime": req.body.ime, "adresa": req.body.adresa, "telefon": prodavac.telefon }, async function (err, prodavnica) {
                    if (err) {
                        console.log("Error");
                        req.flash("error", "Prodavnica nije sacuvana u bazi");
                    }
                    else {
                        prodavac.prodavnice.push(prodavnica);
                        await prodavac.save();
                        req.flash("success", "Prodavnica je uspesno dodata u bazu");
                        res.redirect('/profile');
                    }
                });
            }
        });
    }
})
// PRIKAZ PROIZVODA JEDNE PRODAVNICE
app.get("/profile/prodavac/prodavnica/:id/proizvodi", async (req, res) => {
    await Proizvod.find({}, async (err, proizvods) => {
            var ime= await Prodavnica.findOne({ _id: req.params.id });
            var rezultat = [];
        for (var i = 0; i < proizvods.length; i++) {
            if (ime.proizvodi.indexOf(proizvods[i]._id) > -1) {
                rezultat.push(proizvods[i]);
            }
        }
            res.render("profile_prodavac_prodavnica_proizvodi.ejs", { user: req.user, proizvodi: rezultat, broj: rezultat.length,prodavnica:ime });

    });
})
//PRIKAZ STRANICE ZA EDITOVANJE PODATAKA O JEDNOJ PRODAVNICI
app.get("/profile/prodavac/prodavnica/:id/edit", async (req, res) => {
    var prodavnica = await Prodavnica.findById(req.params.id);
    res.render("editprodavnica.ejs", { user: req.user, prodavnica: prodavnica });
});
// PROMENA PODATAKA O PRODAVNICI 
app.put("/profile/prodavac/prodavnica/:id", async (req, res) => {
    function isBlank(str) {
        return (!str || /^\s*$/.test(str));
    }
    if (req.body.ime.length == 0 || req.body.adresa.length == 0) {
        req.flash("error", "Morate popuniti sva polja");
        res.redirect("/profile/prodavac/prodavnica/" + req.params.id + "/edit");
    }
    else {
        await Prodavnica.findByIdAndUpdate(req.params.id, { ime: req.body.ime, adresa: req.body.adresa }, { upsert: true, new: true }, async (err, camp) => {
            if (err) {
                req.flash("error", "Doslo je do greske prilikom cuvanja promena");
                res.redirect('/profile');
            }
            else {
                req.flash("success", "Uspesno azuriranje podataka");
                res.redirect('/profile');
            }

        });
    }
});
// DODAVANJE NOVOG PROIZVODA U PRODAVNICU
app.get("/prodavnica/:id/addproduct", async (req, res) => {
    res.render("addproizvod.ejs", { user: req.user, prodavnica: req.params.id });
})
// POST METODA ZA DODAVANJE PROIZVODA U PRODAVNICU
app.post("/prodavnica/:id", async (req, res) => {
    await Prodavnica.findById(req.params.id).populate("proizvodi").exec(async (err, prodavnica) => {
        if (err) console.log(err);
        else {
            if (req.body.ime == "" || req.body.kolicina == "" || req.body.cena == ""  ||
                req.body.opis == "" || req.body.url == "") {
                req.flash("error", " Niste popunili sva polja");
                res.redirect("/prodavnica/" + req.params.id + "/addproduct");
            }
            else {
                var currentDate = new Date(Date.now()).toISOString();
                    await Proizvod.create({
                        "ime": req.body.ime, "kolicina": req.body.kolicina, "cena": req.body.cena,
                        "vremedodavanja": currentDate, "opis": req.body.opis, "kategorija": req.body.kategorija, "tip": req.body.tip,"podtip":req.body.podtip, "url": req.body.url,
                    }, async function (err, proizvod) {
                        if (err) {
                            console.log("Error");
                            req.flash("error", "Proizvod nije sacuvan u bazi");
                        }
                        else {
                            prodavnica.proizvodi.push(proizvod);
                            await prodavnica.save();
                            req.flash("success", "Proizvod je uspesno dodat u bazu");
                            res.redirect('/profile/prodavac/prodavnica/' + req.params.id + '/proizvodi');
                        }
                    });
                }
            }
});});
// GET METODA ZA PRIKAZ STRANICE ZA EDITOVANJE PROIZVODA
app.get("/profile/prodavac/prodavnica/:idprodavnica/proizvodi/:id/edit", async (req, res) => {
    var proizvod = await Proizvod.findById(req.params.id);
    res.render("editproizvod.ejs", { user: req.user, prodavnica: req.params.idprodavnica, proizvod: proizvod });
});
// PUT METODA ZA PROMENU PODATAKA O PROIZVODIMA
app.put("/profile/prodavac/prodavnica/:idprodavnica/proizvodi/:id", async (req, res) => {
    if (req.body.ime == "" || req.body.kolicina == "" || req.body.cena == "" || req.body.podtip=="" ||
        req.body.opis == "" || req.body.url == "") {
        req.flash("error", "Morate popuniti sva polja");
        res.redirect("/profile/prodavac/prodavnica/" + req.params.idprodavnica + "/proizvodi" + req.params.id + "/edit");
    }
    else {
        var currentDate = new Date(Date.now()).toISOString();
            await Proizvod.findByIdAndUpdate(req.params.id, {
                "ime": req.body.ime, "kolicina": req.body.kolicina, "cena": req.body.cena,
                "vremedodavanja": currentDate, "opis": req.body.opis, "kategorija": req.body.kategorija, "tip": req.body.tip,"podtip":req.body.podtip, "url": req.body.url
            }, { upsert: true, new: true },
                async (err, camp) => {
                    if (err) {
                        req.flash("error", "Doslo je do greske prilikom cuvanja promena");
                        res.redirect("/profile/prodavac/prodavnica/" + req.params.idprodavnica + "/proizvodi" + req.params.id + "/edit");
                    }
                    else {
                        req.flash("success", "Uspesno azuriranje podataka");
                        res.redirect('/profile/prodavac/prodavnica/' + req.params.idprodavnica + '/proizvodi');
                    }

                });
        }

});
// BRISANJE JEDNOG PROIZVODA IZ JEDNE PRODAVNICE
app.delete("/profile/prodavac/prodavnica/:idprodavnica/proizvodi/:idproizvod", async function (req, res) {
    await Prodavnica.findByIdAndUpdate(req.params.idprodavnica, { $pull: { 'proizvodi': req.params.idproizvod } });
    await Proizvod.findByIdAndDelete(req.params.idproizvod, async (err, proizvod) => {
        if (err) {
            req.flash("error", "Proizvod nije obrisan iz prodavnice");
            res.redirect('/profile/prodavac/prodavnica/' + req.params.idprodavnica + '/proizvodi');
        }
        else {
            req.flash("success", "Proizvod je uspesno obrisan iz prodavnice");
            res.redirect('/profile/prodavac/prodavnica/' + req.params.idprodavnica + '/proizvodi');

        }
    });
})
// BRISANJE JEDNE PRODAVNICE
app.delete("/profile/prodavac/prodavnica/:id", async (req, res) => {
    var prodavnica = await Prodavnica.findById(req.params.id);
    for (var i = 0; i < prodavnica.proizvodi.length; i++) {
        await Proizvod.findByIdAndDelete(prodavnica.proizvodi[i]);
    }
    await Prodavnica.findByIdAndDelete(req.params.id);
    await Prodavac.findByIdAndUpdate(req.user._id, { $pull: { 'prodavnice': req.params.id } }, async (err, proizvod) => {
        if (err) {
            req.flash("error", "Prdavnica nije uspesno obrisana");
            res.redirect('/profile');
        }
        else {
            req.flash("success", "Prodavnica je uspesno obrisana");
            res.redirect('/profile');

        }
    });
});
// BRISANJE NALOGA PRODAVCA
app.delete("/profile/prodavac/:id", async (req, res) => {

    var p = await Prodavac.findById(req.params.id);
    var prod = p.prodavnice;
    for (var t of prod) {
        var t1 = await Prodavnica.findById(t);
        var proizvodi = t1.proizvodi;
        for (var i of proizvodi) {
            await Proizvod.findByIdAndDelete(i);
        }
        await Prodavnica.findByIdAndDelete(t);
    }
    await Prodavac.findByIdAndDelete(req.params.id);
    req.flash("success","Uspesno ste obrisali nalog prodavca");
    if (req.user._id===req.params.id) {
        req.logout();
        res.redirect("/");
    }
    else{
    res.redirect("/profile");
    }
});
// BRISANJE PROFILA KORISNIKA
app.delete("/profile/korisnik/:id", async (req, res) => {
    var korisnik = await Korisnik.findById(req.params.id);
    var kup = korisnik.kupovine;
    for (var k of kup) {
        await Kupovina.findByIdAndDelete(k);
    }
    await Korisnik.findByIdAndDelete(req.params.id);
    req.flash("success","Uspesno ste obrisali nalog vlasnika");

    if (req.user._id===req.params.id) {
        req.logout();
        res.redirect("/");
    }
    else{
    res.redirect("/profile");
    }
});
// PROMENA PODATAKA O PRODAVCU
app.put("/profile/prodavac/edit/:id", async (req, res) => {
    var x = await Prodavac.findById(req.params.id);
    var postojiemail = undefined;
    if (x.email != req.body.email) {
            postojiemail = await Korisnik.findOne({ email: req.body.email });
        if (!postojiemail)
            postojiemail = await Prodavac.findOne({ email: req.body.email });
    }
    var postojiusername = undefined;
    if (x.username != req.body.username) {
            postojiusername = await Korisnik.findOne({ username: req.body.username });
        if (!postojiusername)
            postojiusername = await Prodavac.findOne({ username: req.body.username });
    }

    if (!validator.isEmail(req.body.email) || postojiemail) {
        req.flash("error", "Email nije validan!");
        res.redirect("/profile");
    }
    else {
        if (postojiusername) {
            req.flash("error", "Vec postoji korisnik sa tim username-om, izaberite drugi!");
            res.redirect("/profile");
        }
        else {
            x = await Prodavac.findById(req.params.id);
            x.ime = req.body.ime;
            x.prezime = req.body.prezime;
            x.username = req.body.username;
            x.email = req.body.email;
            x.telefon = req.body.telefon;
            const t = await bcrypt.compare(req.body.password, x.password);
            if (!t) {
                req.flash("error", "Uneli ste pogresnu sifru. Podaci nisu promenjeni!");
                res.redirect("/profile");
            }
            else {
                if (req.body.password2 != "") {
                    x.password = await bcrypt.hash(req.body.password2, 8);
                }
                await Prodavac.findByIdAndUpdate(req.params.id, x);
                var prodavac = await Prodavac.findById(req.params.id);
                for (var i = 0; i < prodavac.prodavnice.length; i++) {
                    await Prodavnica.findByIdAndUpdate(prodavac.prodavnice[i], { telefon: prodavac.telefon });
                }
                var user = await Prodavac.findById(req.params.id);
                req.login(user, function (err) {
                    if (err) return next(err)
                });
                req.flash("success", "Uspesno ste izmenili podatke!");
                res.redirect("/profile");
            }
        }
    }
});
//PROMENA PODATAKA O KORISNIKU
app.put("/profile/korisnik/edit/:id", async (req, res) => {
    var x = await Korisnik.findById(req.params.id);
    var postojiemail = undefined;
    if (x.email != req.body.email) {
            postojiemail = await Korisnik.findOne({ email: req.body.email });
        if (!postojiemail)
            postojiemail = await Prodavac.findOne({ email: req.body.email });
    }
    var postojiusername = undefined;
    if (x.username != req.body.username) {
            postojiusername = await Korisnik.findOne({ username: req.body.username });
        if (!postojiusername)
            postojiusername = await Prodavac.findOne({ username: req.body.username });
    }

    if (!validator.isEmail(req.body.email) || postojiemail) {
        req.flash("error", "Email nije validan!");
        res.redirect("/profile");
    }
    else {
        if (postojiusername) {
            req.flash("error", "Vec postoji korisnik sa tim username-om, izaberite drugi!");
            res.redirect("/profile");
        }
        else {
            x = await Korisnik.findById(req.params.id);
            x.ime = req.body.ime;
            x.prezime = req.body.prezime;
            x.username = req.body.username;
            x.email = req.body.email;
            x.telefon = req.body.telefon;
            const t = await bcrypt.compare(req.body.password, x.password);
            if (!t) {
                req.flash("error", "Uneli ste pogresnu sifru. Podaci nisu promenjeni!");
                res.redirect("/profile");
            }
            else {
                if (req.body.password2 != "") {
                    x.password = await bcrypt.hash(req.body.password2, 8);
                }
                await Korisnik.findByIdAndUpdate(req.params.id, x);
                var user = await Korisnik.findById(req.params.id);
                req.login(user, function (err) {
                    if (err) return next(err)
                });
                req.flash("success", "Uspesno ste izmenili podatke!");
                res.redirect("/profile");
            }
        }
    }
});
// PRETRAGA
app.get("/search", async (req, res) => {
    var prodavnicee = await Prodavnica.find({});
    var search = req.query.key;
    var kategorija = req.query.kategorijafilter;
    var tip = req.query.tipfilter;
    var broj = req.query.brojfilter;
    if (broj == undefined) {
        broj = 10;
    }
    var sort = req.query.sortfilter;
    if (search != undefined && search.indexOf("*") == -1) {
        await Proizvod.find({ ime: { $regex: new RegExp(".*" + search.toLowerCase() + ".*", 'i') } }, async (err, proizvods) => {
            var rezultatkategorija = [];


            // FILTRIRANJE PO KATEGORIJI
            if (kategorija != undefined && kategorija != "0") {
                for (var i = 0; i < proizvods.length; i++) {
                    if (proizvods[i].kategorija == kategorija) {
                        rezultatkategorija.push(proizvods[i]);
                    }
                }
            }
            if (kategorija == undefined) {
                kategorija = 0;
                rezultatkategorija = proizvods;
            }
            // FILTRIRANJE PO TIPU
            var rezultattip = [];
            if (tip != undefined && tip != "0") {

                for (var i = 0; i < rezultatkategorija.length; i++) {
                    if (rezultatkategorija[i].tip == tip) {
                        rezultattip.push(rezultatkategorija[i]);
                    }
                }
            }
            if (tip == undefined) {
                tip = 0;
                rezultattip = rezultatkategorija;
            }
            if (req.query.prodavnicafilter != undefined && req.query.prodavnicafilter != '0') {
                var proizvodiizprodavnice = await Prodavnica.findOne({ ime: req.query.prodavnicafilter });
                var rezultattip2 = [];
                for (var i = 0; i < rezultattip.length; i++) {
                    if (proizvodiizprodavnice.proizvodi.indexOf(rezultattip[i]._id) > -1) {
                        rezultattip2.push(rezultattip[i]);
                    }
                }
                rezultattip = rezultattip2;
            }
            //AKO JE PRIKAZI SVE
            if (broj == 6) {
                broj = rezultattip.length;
            }
            if (sort != undefined) {
                switch (sort) {
                    case '0': {

                        res.render("search.ejs", { user: req.user, proizvodi: rezultattip, kljuc: search, broj: broj, kategorija: kategorija, sort: sort, tip: tip, prodavnicee: prodavnicee, prod: req.query.prodavnicafilter });
                        break;
                    }
                    case '1': {
                        for (var i = 0; i < rezultattip.length; i++) {
                            var temp;
                            for (var j = i + 1; j < rezultattip.length; j++) {
                                if (rezultattip[i].cena > rezultattip[j].cena) {
                                    temp = rezultattip[i];
                                    rezultattip[i] = rezultattip[j];
                                    rezultattip[j] = temp;
                                }
                            }
                        }
                        console.log(rezultattip);
                        res.render("search.ejs", { user: req.user, proizvodi: rezultattip, kljuc: search, broj: broj, kategorija: kategorija, sort: sort, tip: tip, prodavnicee: prodavnicee, prod: req.query.prodavnicafilter });
                        break;
                    }
                    case '2': {
                        for (var i = 0; i < rezultattip.length; i++) {
                            var temp;
                            for (var j = i + 1; j < rezultattip.length; j++) {
                                if (rezultattip[i].cena < rezultattip[j].cena) {
                                    temp = rezultattip[i];
                                    rezultattip[i] = rezultattip[j];
                                    rezultattip[j] = temp;
                                }
                            }
                        }

                        res.render("search.ejs", { user: req.user, proizvodi: rezultattip, kljuc: search, broj: broj, kategorija: kategorija, sort: sort, tip: tip, prodavnicee: prodavnicee, prod: req.query.prodavnicafilter });
                        break;
                    }
                    case '3': {
                        rezultattip.sort((a, b) => a.ime.localeCompare(b.ime));
                        res.render("search.ejs", { user: req.user, proizvodi: rezultattip, kljuc: search, broj: broj, kategorija: kategorija, sort: sort, tip: tip, prodavnicee: prodavnicee, prod: req.query.prodavnicafilter });
                        break;
                    }
                    case '4': {
                        rezultattip.sort((a, b) => b.ime.localeCompare(a.ime));
                        res.render("search.ejs", { user: req.user, proizvodi: rezultattip, kljuc: search, broj: broj, kategorija: kategorija, sort: sort, tip: tip, prodavnicee: prodavnicee, prod: req.query.prodavnicafilter });
                        break;
                    }
                    case '5': {
                        const sortedActivities = rezultattip.sort((a, b) => b.vremedodavanja - a.vremedodavanja);
                        res.render("search.ejs", { user: req.user, proizvodi: sortedActivities, kljuc: search, broj: broj, kategorija: kategorija, sort: sort, tip: tip, prodavnicee: prodavnicee, prod: req.query.prodavnicafilter });
                        break;
                    }
                    case '6': {
                        const sortedActivities = rezultattip.sort((a, b) => a.vremedodavanja - b.vremedodavanja);
                        res.render("search.ejs", { user: req.user, proizvodi: sortedActivities, kljuc: search, broj: broj, kategorija: kategorija, sort: sort, tip: tip, prodavnicee: prodavnicee, prod: req.query.prodavnicafilter });
                        break;
                    }
                }
            }
            else {
                sort = 0;
                res.render("search.ejs", { user: req.user, proizvodi: rezultattip, kljuc: search, broj: broj, kategorija: kategorija, sort: sort, tip: tip, prodavnicee: prodavnicee, prod: req.query.prodavnicafilter });
            }
        });
    }
    else {
        res.render("search.ejs", { user: req.user, proizvodi: [], kljuc: [], broj: broj, kategorija: kategorija, sort: sort, tip: tip, prodavnicee: prodavnicee, prod: req.query.prodavnicafilter });
    }
});

// PRODAVNICE U MREZI
app.get("/shops",async(req,res)=>{
    var prodavnice= await Prodavnica.find({});
    res.render("shops.ejs",{user:req.user,prodavnice:prodavnice});
})

// KOLICA
app.get("/cart", async (req, res) => {
    res.render("cart.ejs", { user: req.user });
});
app.post("/cart", async (req, res) => {
    let user = req.user;
    if (req.body.podaci == undefined || req.body.podaci.length == 0) {
        res.write("Korpa je prazna");
        res.end();
    }
    else if (user == undefined) {
        // res.writeHead(301, { 'Location': 'http://localhost:3000/login' });   
        res.write("Niste ulogovani. Samo korisnici ulogovani kao Vlasnik mogu izvrsiti kupovinu");
        res.end();
    }
    else if (user.tipkorisnika != "korisnik") {
        res.write("Samo korisnici ulogovani kao Korisnik mogu izvrsiti kupovinu");
        res.end();
    }
    else {
        let poruka = "Neuspesna kupovina";
        var podaci = req.body.podaci;
        var kolicina = req.body.kolicina;
        let error = 0;
        for (let i = 0; i < podaci.length; i++) {
            var parsovan = JSON.parse(podaci[i]);
            let proizvod = await Proizvod.findById(parsovan._id);
            if (parseInt(proizvod.kolicina) < parseInt(kolicina[i])) {
                error = 1;
                let novakolicina = parseInt(kolicina[i]) - parseInt(proizvod.kolicina);
                poruka = poruka + ",\n" + "Proizvod " + parsovan.ime + ": Nedostaje " + novakolicina;
            }
        }
        if (error == 1) {
            res.write(poruka);
        }
        else {
            for (let i = 0; i < podaci.length; i++) {
                var parsovan = JSON.parse(podaci[i]);
                let proizvod = await Proizvod.findById(parsovan._id);
                    let novakolicina = parseInt(proizvod.kolicina) - parseInt(kolicina[i]);
                    await Proizvod.findByIdAndUpdate(parsovan._id, { kolicina: novakolicina });
            }
            var currentDate = new Date(Date.now());
            await Kupovina.create({
                "kupac": user._id, "datum": currentDate, "proizvodi": [], kolicina: []
            }, async function (err, kupovina) {
                var podaci = req.body.podaci;
                var kolicina = req.body.kolicina;
                for (let i = 0; i < podaci.length; i++) {
                    var parsovan = JSON.parse(podaci[i]);
                    kupovina.proizvodi.push(parsovan._id);
                    kupovina.kolicina.push(parseInt(kolicina[i]));
                    kupovina.cene.push(parseInt(parsovan.cena));
                }
                kupovina.racun = req.body.ukupno;
                await kupovina.save();
                var korisnik = await Korisnik.findById(kupovina.kupac);
                korisnik.kupovine.push(kupovina._id);
                await korisnik.save();
            });
            res.write("Uspesno izvrsena kupovina");
        }
        res.end();

    }
})
app.post("/cart/:id/:broj", async (req, res) => {
    req.flash("success", "Proizvod je uspesno dodat u korpu");
    if (req.params.broj == 1)
        res.redirect("back");
    else
        res.redirect("/products/" + req.params.id);

});
// STARTOVANJE SERVERA
app.listen(3000, function () {
    console.log("Listening on port 3000");
});