var seleccionado, parrafo;

window.onload = function() {
    var nombre = localStorage.getItem('nombre');
    document.getElementById('nombre').textContent = "Hola "+nombre; 
};


// obtener el numero de la seleccion de la apuesta
function seleccionApuesta()
{	
	var select = document.getElementById("selApostador").value;
	var n = parseInt(select);
	var ul = document.getElementById("listaApostador");
	
	// eliminar todos los li de la lista
	while(ul.firstChild) ul.removeChild(ul.firstChild); 
	
	// crear nuevos li en la lista
		for(var i = 0; i< n; i++)
		{
			var li = document.createElement("li"); // creo el elemento li
			li.addEventListener("click",cambiarNombre); // agrego un evento click
			var p = document.createElement("p"); // creo un elemento p
			var guia = i+1;
			var cadena = 'Participante '+guia; // el id para reconocerlo
			p.innerHTML =cadena;
			p.setAttribute("id",'p'+cadena); // agrago un id para el p
			li.setAttribute("id",cadena); // agrago un id para el li
			ul.appendChild(li); // agrego el elemento a la lista como un hijo de ul
			li.appendChild(p);  // agrego el p como un hijo de li
		}

}

// obtener el numero de la seleccion de jugadores es el mismo metodo 
function seleccionJugador()
{	
	var select = document.getElementById("selJugador").value;
	var n = parseInt(select);
	var ul = document.getElementById("listaJugador");
	while(ul.firstChild) ul.removeChild(ul.firstChild);
	
		for(var i = 0; i< n; i++)
		{
			var li = document.createElement("li");
			li.addEventListener("click",cambiarNombre);
			var p = document.createElement("p");
			var guia = i+1;
			var cadena = 'Jugador '+guia;
			p.innerHTML =cadena;
			p.setAttribute("id",'p'+cadena);
			li.setAttribute("id",cadena); 
			ul.appendChild(li);
			li.appendChild(p);
		}

}


// cambiar nombre de el elemento li en p
function cambiarNombre(ev, obj)
{
	seleccionado = document.querySelector( ".seleccionado" ); // condicion del evento click
	
	if( seleccionado == null) // entra la primera vez  no hay nada seleccionado
	{
	ev.target.classList.add( "seleccionado" );	// coloco la condicion
	var input = document.createElement("input"); // creo un nuevo input
	input.setAttribute("id",'input'); // le asigno un id
	var id   = this.id;
	parrafo=  document.getElementById('p'+id); // obtengo el p de donde se dio el click
	parrafo.style.display = 'none'; // lo oculto
	this.addEventListener("keypress",validar); // le agrego al input el evento para reconocer el enter
	this.appendChild(input); // agrego el input como un hijo de li
	
	}


}

//capturar la tecla enter
function validar(e,obj)
 {
	tecla = (document.all) ? e.keyCode : e.which;
	
	if (tecla==13) // codigo de la tecla enter
	{
	  var input = document.getElementById("input");  // obtengo el input 
	  parrafo.style.display = 'block'; // coloco el p visible
	  parrafo.innerText = input.value; // le asigno al p el valor ingresado al input
	  var padre = input.parentNode; // busco el padre del input
	  padre.removeChild(input); // elimino el input
	  seleccionado.classList.remove("seleccionado"); // elimino la seleccion para volver a seleccionar un nuevo elemento
	} 
}

function generarPdf(ev, obj)
{
	
	
	var input =  document.getElementById("valor"); // obtener el input del valor
	var apuesta = parseInt(input.value); 
	
		if(input.value == "") // si esta vacio lanzar alert
		{
		alert("Campo del valor no ha sido dilegenciado");
		}
		else if(Number.isNaN(apuesta)) // si no es un valor numerico que han ingresado
		{
			alert("Campo del valor apostado esta mal diligenciado solo valores númerico.");
			input.value = "";
		}else // datos correctos
		{
			var listaApostador = document.getElementById("listaApostador");
			var listaJugador = document.getElementById("listaJugador");
			
			if(listaJugador.children.length == 0) // no han seleccionado jugadores
			{
			alert("NO se ha seleccionado ningun jugador minimo deben ser 2.");
					
			}
			else if(listaApostador.children.length == 0) // no han seleccionado apostadores
			{
			alert("NO se a seleccionado ningun apostador minimo deben ser 2.");	
			
			}else if(listaJugador.children.length < listaApostador.children.length) // hay mas participantes que jugadores
			{
				alert("NO se puede realizar la apuesta \n deben haber más jugadores que participantes ");
				
			}else
			{
				var rifa = {}; // crear el objeto 
				rifa.arregloJugador = obtenerElementos(listaJugador); // obtener le la lista html todos los textos
				rifa.arregloApostador = obtenerElementos(listaApostador);// obtener le la lista html todos los textos
				rifa.numXplay = Math.floor(rifa.arregloJugador.length/rifa.arregloApostador.length); // calcular el numero de jugadores por participante
				rifa.arregloAleatorio = crearAleatorio(rifa.arregloJugador.length); // arreglo aleatorio para realizar la rifa
				rifa.valor = apuesta;
				//alert(JSON.stringify(rifa));
				crearPdf(rifa);// invocar el metodo  (arregloJugador,arregloApostador,aleatorio,numero,apuesta);
				
				
			}
		}
}

function obtenerElementos(lista)
{
	var areglo = new Array(); // nueva instancia de arreglo
	var contenido = lista.children.length;
		for (var i = 0; i <contenido ; i++)
		{
        var aux ="p"+lista.children[i].id; // encontrar el li
		var texto = document.getElementById(aux).innerText; // capturar el texto de el p
		areglo.push(texto); // agregarlo al arreglo
        }
		return areglo;
}

function crearAleatorio(n) 
{
	var aleatorio = new Array();
	for(var i = 0; i<n; i++)
	{
		aleatorio.push(i); // agregar un elemento al array
	}
	aleatorio.sort(function(a, b){return 0.5 - Math.random()}); // generar el numero aleatorio
    return aleatorio;
}

function crearPdf(rifa) //(jugador, apostador, orden,n,input)
{
	 var pdf = new jsPDF('p', 'pt', 'ledger'); // crear la instancia del documento
	 var tabla = crearTabla(rifa)//(jugador, apostador, orden,n); // creo la tabla html 
	 pdf.setTextColor(204,0,0); // cambio el color a rojo para el titulo
	 pdf.text('Apuestas "EL MACHETICO".', 350, 50); // escribo el titulo
	 
	 var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"); // arreglo con los meses
	 var diasSemana = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"); // arreglo con los dias
	 var f=new Date(); // instancia de la fecha
	 var dd = f.getDate();
	 var mm = f.getMonth()+1;
	 
	 if(dd<10)
	 {
		dd='0'+dd;
	 } 
	if(mm<10)
	{
    mm='0'+mm;
	} 
	 
	 
	 rifa.fechaCorta = dd+'/'+mm+'/'+f.getFullYear()+' -> '+f.getHours()+':'+f.getMinutes()+':'+f.getSeconds()+'.';
	 rifa.fecha = diasSemana[f.getDay()] + ", " + dd + " de " + meses[f.getMonth()] + " de " + f.getFullYear()+ " hora: "+ f.getHours()+":"+f.getMinutes()+":"+f.getSeconds()+"."; 
	 pdf.setTextColor(0,0,0); // canbio el color a negro
	 
	 pdf.text(rifa.fecha, 250, 70); // escribo la fecha
	 
	 pdf.text("EL valor a ganar por cada jugador acertado es de: $ "+ rifa.valor +" pesos colombianos.", 100, 100); // escribo la condicion  del valor
	 pdf.text(" ",10,130); // un salto de linea
	 
	 
	 specialElementHandlers = {
                    '#bypassme' : function(element, renderer) {
                        return true
                    }
                };
                margins = {
                    top : 120, // posicion inicial de la tabla
                    bottom : 40, // ancho de celda
                    left : 40, // posicion izquierda
                    width : 450 // tamaño max de la tabla
                };

                pdf.fromHTML(tabla.outerHTML,  // metodo que construye la tabla en el pdf
                margins.left, 
                margins.top, { 
                    'width' : margins.width, 
                    'elementHandlers' : specialElementHandlers
                },

                function(dispose) { // genera el archivo pdf para descargar 
					pdf.text('Gracias por utilizar nuestros servicios', 250, 1200); // escibo un mensaje 
					
					if(localStorage.getItem('nombre') == "invitado" || localStorage.getItem('nombre') == 'null')
					{
						pdf.save('apuesta.pdf'); // un nombre para el archivo
					}
					else
					{
					enviarJSON(rifa);
					pdf.save('apuesta.pdf'); // un nombre para el archivo
					}
                    
                }, margins);
	}
	
	
	 function crearTabla(rifa)//(jugador, apostador, orden,n)
	 {
		var tabla  = document.createElement('table'); // creo la tabla
		tabla.style.width  = '100px'; // tamaño
		tabla.style.border = '1px solid black'; // bordes
		tabla.style.textAlign= 'justify'; // jusificacion de texto
		tabla.innerHTML +=' <thead> <th>Participante</th><th>Jugador</th> </tr>'; // inserto los titulos de la tabla
		var tamaño = rifa.arregloApostador.length*rifa.numXplay, paso = 0,cuenta = 0, entrada = true; // variables de manejo

		for(var i = 0; i < tamaño; i++)
		{
			var tr = tabla.insertRow(); // creo una fila
			
			for(var j = 0; j < 2; j++) // dos columnas
			{
				
                var td = tr.insertCell(); // creo una columna
				if(j == 0)
				{
					if(paso <rifa.numXplay && entrada) // condicion para el numero de jugadores por participante
					{
						td.appendChild(document.createTextNode(rifa.arregloApostador[cuenta])); // asigno el participante
						td.style.textAlign = 'justify';
						paso += 1;
						cuenta+= 1;
						entrada = false;
					}else
					{
						td.appendChild(document.createTextNode("  ")); // creo el espacio vacio
						td.style.textAlign = 'justify';
						paso += 1;
					}
				}else
				{ 
					var aux = rifa.arregloAleatorio[i]; // capturar el numero aleatorio
					td.appendChild(document.createTextNode(rifa.arregloJugador[aux])); // asginar el jugador
					td.style.textAlign = 'justify';
				} 
				if(paso == rifa.numXplay) // condicion de retorno para otro jugador
				{
					paso = 0;
					entrada = true;
				}
            }
        }
    
		return tabla; // retorno la tabla 
	}
	
	
	function enviarJSON(rifa)
	{
		
		serial = JSON.stringify(rifa);
		var request = new XMLHttpRequest();
		request.open('POST','/rifa',false);
		request.send(serial);
		
	}

	function regresar()
{
	if(localStorage.getItem('nombre') == "invitado" || localStorage.getItem('nombre') == 'null')
	{
		location.href="../inicio/inicio.html";
	}else
	{location.href="../perfil/perfil.html";}

}


	
