var express = require('express');
var app = express();
const cors = require('cors')
var bodyParser = require('body-parser')
const dotenv = require('dotenv');
var path = require('path');
var PizZip = require('pizzip');
var Docxtemplater = require('docxtemplater');
var fs = require("fs");
DICCIONARIO={};
var content = fs
    .readFileSync(path.resolve(__dirname, 'templates/prueba.docx'), 'binary');

var zip = new PizZip(content);

var doc = new Docxtemplater();
doc.loadZip(zip);


dotenv.config();


const readline = require('readline');


//          (_    ,_,    _) 
//          / `'--) (--'` \
//         /  _,-'\_/'-,_  \
//        /.-'     "     '-.\
//         Julia Orion Smith

const port = 2121; 
const _K = "MTIzNHx8b3Jpb24="; 


app.use(bodyParser.json())
var fs = require("fs");
var path = require('path');

//console.log("public",__dirname + '/sitio')
app.use('/', express.static(__dirname + '/sitio'));
app.use('/bandeja/', express.static(__dirname + '/bandeja'));
app.use('/ordenes/', express.static(__dirname + '/ordenes'));
app.use('/archivo/', express.static(__dirname + '/archivo'));
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})
const corsOptions = {
  origin: 'http://localhost:2121'
}

app.use(cors(corsOptions))


app.post("/menu", function(req,res){

	name=req.body["name"];
	console.log("getting "+name)
	if (fs.existsSync('cuestionarios/'+name+'.json')) {
	    		fs.readFile('cuestionarios/'+name+'.json', 'utf8', (err, jsonString) => {
				    if (err) {
				        console.log("Error reading file from disk:", err)
				        res.json({});
				       
				    }
				    try {
				        this.liveMenu=JSON.parse(jsonString);
				        res.json(this.liveMenu);
				} catch(err) {
				        console.log('Error parsing JSON string:', err)
				        res.json({});
				    }
				})
	  }
	  else{
	  	res.json({});
	  }
	
	
})



//SITIO PRINCIPAL


app.get('/', function (req, res) {
		console.log("miau");
	   res.sendFile(path.join(__dirname + '/sitio/cuestionario.html'));


});
app.post("/saveprogress", function(req,res){
	name=req.body["name"];
	cuestionario=req.body["cuestionario"];
	fs.writeFile('cuestionarios/'+name+'.json', JSON.stringify(cuestionario), (err) => {
	    if (err) throw err;
	    console.log('Data written to file');
	    res.json({status:"saved"});
	});
	console.log(name,"cuestionario")
})
app.post('/makedoc', function (req, res) {
		cuest=req.body["cuestionario"];
		console.log(cuest)
		respuestas={
		    	evaluador:cuest.metadata.evaluador, 
		    	participante:cuest.metadata.participante,
		    	fecha:cuest.metadata.fecha,
		    	p1:cuest["evaluación"]["inputs"][0]["respuesta"],
		    	p2:cuest["evaluación"]["inputs"][1]["respuesta"],
		    	regimenfiscal:cuest["Info"]["inputs"][1]["respuesta"],
		    	legalagreement:cuest["Info"]["inputs"][4]["respuesta"],
		    	correo:cuest["Info"]["inputs"][2]["respuesta"]

		    };

		    console.log(respuestas);
		    writeTemplate(respuestas,cuest.metadata.evaluador+"-"+cuest.metadata.participante);
		    res.json({link:"/bandeja/"+cuest.metadata.evaluador+"-"+cuest.metadata.participante+".docx"});
});

meses={
	"01":"enero",
	"02":"febrero",
	"03":"marzo",
	"04":"abril",
	"05":"mayo",
	"06":"junio",
	"07":"julio",
	"08":"agosto",
	"09":"septiembre",
	"10":"octubre",
	"11":"noviembre",
	"12":"diciembre",
}
function writeTemplate(obj,name){
	//set the templateVariables
	doc.setData(obj);

	try {
	    // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
	    doc.render()
	}
	catch (error) {
	    var e = {
	        message: error.message,
	        name: error.name,
	        stack: error.stack,
	        properties: error.properties,
	    }
	    console.log(JSON.stringify({error: e}));
	    // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
	    throw error;
	}

	var buf = doc.getZip()
	             .generate({type: 'nodebuffer'});

	// buf is a nodejs buffer, you can either write it to a file or do anything else with it.
	fs.writeFileSync(path.resolve(__dirname, "bandeja/demo.docx"), buf);
}


//PUERTO

console.log(`Your port is ${port}`);

app.listen(port, function () {
  console.log('Example app listening on port '+port+'!!!');
});


function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}