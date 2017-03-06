var seleccionado, parrafo;

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
			var cadena = 'apostador '+guia; // el id para reconocerlo
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
			var cadena = 'jugador '+guia;
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
		else if(Number.isNaN(apuesta))
		{
			alert("Campo del valor apostado esta mal diligenciado solo valores númerico.");
			input.value = "";
		}else
		{
			var listaApostador = document.getElementById("listaApostador");
			var listaJugador = document.getElementById("listaJugador");
			
			if(listaJugador.children.length == 0) 
			{
			alert("NO se a seleccionado ningun jugador minimo deben ser 2.");
					
			}
			else if(listaApostador.children.length == 0)
			{
			alert("NO se a seleccionado ningun apostador minimo deben ser 2.");	
			
			}else if(listaJugador.children.length < listaApostador.children.length)
			{
				alert("NO se puede realizar la apuesta \n deben haber más jugadores que apostadores ");
				
			}else
			{
				var arregloJugador = obtenerElementos(listaJugador);
				var arregloApostador = obtenerElementos(listaApostador);
				var numero = Math.floor(arregloJugador.length/arregloApostador.length);
				var aleatorio = crearAleatorio(arregloJugador.length);
				//alert(aleatorio + "   el modulo " + numero);
				crearPdf(arregloJugador,arregloApostador,aleatorio,numero,apuesta);
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
		aleatorio.push(i);
	}
	aleatorio.sort(function(a, b){return 0.5 - Math.random()});
    return aleatorio;
}

function crearPdf(jugador, apostador, orden,n,input)
{
	 var pdf = new jsPDF('p', 'pt', 'ledger');
	 var tabla = crearTabla(jugador, apostador, orden,n);
	 pdf.setTextColor(204,0,0);
	 pdf.text('Apuestas <nombre de las apuestas>.', 350, 50);
	 
	 var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
	 var diasSemana = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");
	 var f=new Date();
	 var fecha = diasSemana[f.getDay()] + ", " + f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear()+ " hora: "+ f.getHours()+":"+f.getMinutes()+":"+f.getSeconds()+"."; 
	 pdf.setTextColor(0,0,0);
	 pdf.text(fecha, 250, 70);
	 pdf.text("EL valor a ganar por cada jugador acertado es de: $ "+ input +" pesos colombianos.", 100, 100);
	 pdf.text(" ",10,130);
	 
	 specialElementHandlers = {
                    '#bypassme' : function(element, renderer) {
                        return true
                    }
                };
                margins = {
                    top : 120,
                    bottom : 40,
                    left : 40,
                    width : 450
                };

                pdf.fromHTML(tabla.outerHTML, 
                margins.left, 
                margins.top, { 
                    'width' : margins.width, 
                    'elementHandlers' : specialElementHandlers
                },

                function(dispose) {
					pdf.text('Gracias por utilizar nuestros servicios', 250, 1200);
                    pdf.save('apuesta.pdf');
                }, margins);
	}
	
	
	 function crearTabla(jugador, apostador, orden,n)
	 {
		var tabla  = document.createElement('table');
		tabla.style.width  = '100px';
		tabla.style.border = '1px solid black';
		tabla.style.textAlign= 'justify';
		tabla.innerHTML +=' <thead> <th>Apostador</th><th>Jugador</th> </tr>';
		var tamaño = apostador.length*n, paso = 0,cuenta = 0, entrada = true;

		for(var i = 0; i < tamaño; i++)
		{
			var tr = tabla.insertRow();
			
			for(var j = 0; j < 2; j++)
			{
				
                var td = tr.insertCell();
				if(j == 0)
				{
					if(paso <n && entrada)
					{
						td.appendChild(document.createTextNode(apostador[cuenta]));
						td.style.textAlign = 'justify';
						paso += 1;
						cuenta+= 1;
						entrada = false;
					}else
					{
						td.appendChild(document.createTextNode("  "));
						td.style.textAlign = 'justify';
						paso += 1;
					}
				}else
				{ 
					var aux = orden[i];
					td.appendChild(document.createTextNode(jugador[aux]));
					td.style.textAlign = 'justify';
				} 
				if(paso == n)
				{
					paso = 0;
					entrada = true;
				}
            }
        }
    
		return tabla;
	}

	
