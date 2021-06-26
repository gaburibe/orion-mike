var PizZip = require('pizzip');
var Docxtemplater = require('docxtemplater');
var fs = require('fs');
var path = require('path');
var csv = require("fast-csv");
var fs = require("fs");
DICCIONARIO={};


//Load the docx file as a binary
var content = fs
    .readFileSync(path.resolve(__dirname, 'output.docx'), 'binary');

var zip = new PizZip(content);

var doc = new Docxtemplater();
doc.loadZip(zip);

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

fs.readFile('cuestionarios2/respondedbiossman.json', (err, data) => {
    if (err) throw err;
    let cuest = JSON.parse(data);
    respuestas={};
    for(categoria in cuest){
    	for(i=0;i<cuest[categoria].length;i++){
    		categoriaT=categoria.split(":");
    		respuestas[categoriaT[0]+"-"+i]=cuest[categoria][i].respuesta;
    	}
    }
    console.log(respuestas);
    writeTemplate(respuestas,"doc");
})







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
	fs.writeFileSync(path.resolve(__dirname, "bandeja/"+name+'.docx'), buf);
}

