const express 	= require("express");
const hbs 		= require("hbs");
const fs 		= require("fs");

const port = process.env.PORT || 3000;
var app = express();

hbs.registerPartials(__dirname + "/views/partials");
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

// app.use((req, res, next) => {
// 	res.render("maintance");
// });

app.use(express.static(__dirname + "/public"));

app.use((req, res, next) => {
	var now = new Date().toString();
	var log = `${now}: ${req.method}: ${req.originalUrl}`
	console.log(log);
	fs.appendFile("server.log", log + "\n", (err) => {
		if (err) {
			console.log("Unable to append to server.log");
		}
	});
	next();
});


hbs.registerHelper("getCurrentYear", () => {
	return new Date().getFullYear();
});

hbs.registerHelper("screamIt", (text) => {
	return text.toUpperCase();
});

function test(page){
	var sites = {
	pageTitle: page,
	welcomeMessage: "Welcome to the homepage!"
	}
	return sites;
};


app.get("/", (req, res) => {
	// res.send("<h1>It works!</h1>");
	res.render("home", test("Home Page!"));
});

app.get("/about", (req, res) => {
	res.render("about", test("About page!"));
});

app.get("/bad", (req, res) => {
	res.send({
		code: "YOLO",
		errorMessage: "Could not find the data!"
	});
});

app.listen(port, () => {
	console.log(`Server is ON! PORT: ${port}`);
});