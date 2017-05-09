var http = require('http');
var fs = require('fs');

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
		cargarInicio(request,response);
	}
	
	else
	{
		retornarCualquierArchivo(request,response)
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



function guardarProducto(request,response)
{
	request.on("data",recibir);
	
	// recibe asyncronicamente el payload de una peticion POST
	function recibir(data)
	{
	console.log(data.toString());
	var producto = JSON.parse(data.toString());
	console.log("me llego un producto: " + producto.codigo);
	fs.writeFile('archivo.txt',data.toString(),"utf8");
	
	}

}



