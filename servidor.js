var http = require('http');
var fs = require('fs');
var apuesta = [];
var indiceActual= -1;
var leer = fs.readFile('apuesta/apuesta.JSON',cargarApuesta);



function cargarApuesta(error,data)
{
	if(error == null)
	{
		if(!isEmpty(data))
		{
		apuesta= JSON.parse(data);
		console.log('datos registrados: ');
		console.log(apuesta);	
		}else
		{
		console.log("sin datos en el JSON");
		}

	}else
	{
	console.log(error);
	
	}
}
// instancia servidor HTTP
var server = http.createServer(atenderServidor);


console.log('servidor iniciado');
// iniciar la escucha del servidor en el puerto 8088
server.listen(8088);
//app.set('port', (process.env.PORT || 5000));
// mejoras de javascript coffeScript o typeScript
// peticion respuesta  
// local Host 127.0.0.1

function atenderServidor(request, response)
{
	
	if(request.url == '/')
	{
		//cargarInicio(request,response);
	}
	
	else if(request.url.includes('.'))
	{
		retornarCualquierArchivo(request,response)
	}
	else if(request.url == '/nuevoReg')
	{
		console.log('recibir datos...');
		nuevoRegistro(request,response);
	}
	else if(request.url == "/rifa")
	{
	console.log("Obtener una rifa...");
	guardarRifa(request,response);
	
	}
	
	else
	{
	
	console.log('peticion recibida : '+ request.url);
	response.end('<h1>hola mundo no tienes extension!! <h1>');
			
	}
}

function nuevoRegistro(request,response)
{
	request.on('data',recibir);

	function recibir(data)	
	{
	//console.log(data.toString());
	var usser = JSON.parse(data.toString());
	indiceActual = validar(usser);
	if(indiceActual >= 0)
	{
		var salida = JSON.stringify(apuesta[indiceActual].rifas);
		response.end(salida);	
	}
	response.end();
	
	}
}

function validar(perfil)
{
	var tamaño = apuesta.length;
	if( tamaño > 0)
	{
		for(var i =0; i < tamaño; i++)
		{
			if(perfil.name ==  apuesta[i].name)
			{
				return i;
			}
		}
		perfil.rifas = [];
		apuesta.push(perfil);
		fs.writeFile('apuesta/apuesta.JSON',JSON.stringify(apuesta),null);
		return i;
	}
	return -1;
	
}

function guardarRifa(request,response)
{
	request.on('data',recibir);

	function recibir(data)	
	{
	var juego = JSON.parse(data.toString() );
	juego.nombre= 'apuesta #'+(apuesta[indiceActual].rifas.length+1)+'.';
	apuesta[indiceActual].rifas.push(juego);
	console.log(apuesta);
	fs.writeFile('apuesta/apuesta.JSON',JSON.stringify(apuesta),null);
	response.end();
	}
	
}


function guardarRegistro(request,response)
{
	request.on('data',recibir);

	function recibir(data)	
	{
	var usser = JSON.parse(data.toString() );
	usuario.push(usser);
	console.log(usuario);
	fs.writeFile('usuario.JSON',JSON.stringify(usuario),null);
	response.end('datos recibidos');
	}

}

function cargarInicio(request,response)
{
		fs.readFile('inicio/inicio.html',archivoListo);
	
	function archivoListo(error,data)
		{
			if(error)
			{
				console.log(error);
				response.end(error.toString());
				
			}else
			{
				response.write(data);
				response.end();
			}
		}
	
}


function retornarCualquierArchivo(request,response)
{
	var elemento = request.url;
	
	fs.readFile(elemento.substr(1),archivoListo);
	
	function archivoListo(error,data)
		{
			if(error)
			{
				console.log(error);
				response.end(error.toString());
				
			}else
			{
				response.write(data);
				response.end();
			}
		}
}


function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}




