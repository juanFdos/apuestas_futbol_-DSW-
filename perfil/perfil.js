
var datos;

function apostar()
{
	var cadena = document.getElementById('nickname').textContent;
	var inicio = 11;
	var fin = cadena.length;
	var valor = cadena.substring(inicio,fin);
	localStorage.setItem('nombre',valor);
	location.href="../contenido/principal.html";
	
}

window.onload = function() {
  
  var lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN);

  // buttons
  var btn_login = document.getElementById('btn-login');
  var btn_logout = document.getElementById('btn-logout');

   if(localStorage.getItem('valor') == "msg")
   {
	lock.show(); 
	var valor = "msp";
	localStorage.setItem('valor',valor);	
   }
	
	btn_login.addEventListener('click', function()
	{
	lock.show(); 
	var valor = "msp";
	localStorage.setItem('valor',valor);
	});
  
  btn_logout.addEventListener('click', function() {
    logout();
  });

  lock.on("authenticated", function(authResult) {
    lock.getProfile(authResult.idToken, function(error, profile) {
      if (error) {
        // Handle error
        return;
      }
      localStorage.setItem('id_token', authResult.idToken);
      // Display user information
      show_profile_info(profile);
    });
  });

  //retrieve the profile:
  var retrieve_profile = function() {
    var id_token = localStorage.getItem('id_token');
    if (id_token) {
      lock.getProfile(id_token, function (err, profile) {
        if (err) {
          return alert('There was an error getting the profile: ' + err.message);
        }
        // Display user information
         valor = show_profile_info(profile);
      });
    }
  };

  var show_profile_info = function(profile) { // cargar la informacion despues de la autenticacion
		var perfil = {}; // crear un objeto
		perfil.name = profile.nickname; // le asigno el nombre
		var datos = document.getElementById('contact');
		var div = document.getElementById('apost');
		var btn = document.getElementById('apostar');
		var avatar = document.getElementById('avatar');
		document.getElementById('nickname').textContent = "Bienvenido: " +perfil.name+'.'; // mensaje de bienvenida 
		btn_login.style.display = "none";
		btn_logout.style.display = 'block';
		avatar.style.display = 'block';
		datos.style.display = 'block';
		div.style.display = 'block';
		btn.style.display = '';
		avatar.src = profile.picture;
		enviarJSON(perfil);
	
  };

  var logout = function() {
    localStorage.removeItem('id_token');
    window.location.href = "/inicio/Inicio.html";
  };

  retrieve_profile();

};




	function enviarJSON(json)
	{
		
		serial = JSON.stringify(json);
		var request = new XMLHttpRequest();
		request.open('POST','/nuevoReg',false);
		request.send(serial);
		datos = JSON.parse(request.responseText);
		crearTablaInicial(datos);
		
	}

	
	 function crearTablaInicial(rifa)//(jugador, apostador, orden,n)
	 {
		var nApuesta = document.getElementById('nApuesta').textContent = 'Apuestas guardadas: '+rifa.length+'.';
		var tabla  = document.getElementById('tabla'); // creo la tabla
		tabla.innerHTML +=' <thead><th>Imagen.</th> <th>Nombre.</th><th>Fecha creación.</th> </tr>'; // inserto los titulos de la tabla
		
		var tamaño = rifa.length; // variables de manejo

		for(var i = 0; i < tamaño; i++)
		{
			var tr = tabla.insertRow(); // creo una fila
			
			tr.addEventListener("click",convertir);
			//tr.setAttribute("id",i);
			for(var j = 0; j < 3; j++) // tres columnas
			{
				
                var td = tr.insertCell(); // creo una columna
				switch(j)
				{
					case 0:
					td.innerHTML += '<img src=' +"../images/logPdf.png"+' >';
					td.setAttribute("id",i);
					
					break;
					case 1:
					td.appendChild(document.createTextNode(rifa[i].nombre));// asigno el participante
					
					break;
					case 2:
					td.appendChild(document.createTextNode(rifa[i].fechaCorta));// asigno el participante
					
					break;
				}
            }
        }
    
		return tabla; // retorno la tabla 
	}
	
	
	function convertir(ev, obj)
	{
		
		var elmto = ev.target.parentNode;
		var n = elmto.id;
		crearPdf(datos[n]);
		
	}
	
	
	function crearPdf(rifa) //(jugador, apostador, orden,n,input)
{
	 var pdf = new jsPDF('p', 'pt', 'ledger'); // crear la instancia del documento
	 var tabla = crearTabla(rifa)//(jugador, apostador, orden,n); // creo la tabla html 
	 pdf.setTextColor(204,0,0); // cambio el color a rojo para el titulo
	 pdf.text('Apuestas "EL MACHETICO".', 350, 50); // escribo el titulo

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
                    'elementHandlers' : specialElementHandlers,
					'text-align' : 'center'
                },

                function(dispose) { // genera el archivo pdf para descargar 
					pdf.text('Gracias por utilizar nuestros servicios', 250, 1200); // escibo un mensaje 
						var nombre =rifa.nombre+'.pdf'; 
						pdf.save(nombre); // un nombre para el archivo
					
                    
                }, margins);
	}
	
	
	  function crearTabla(rifa)//(jugador, apostador, orden,n)
	 {
		var tabla  = document.createElement('table'); // creo la tabla
		tabla.style.width  = '100px'; // tamaño
		tabla.style.border = '1px solid black'; // bordes
		tabla.style.textAlign= 'center'; // jusificacion de texto
		tabla.style.margin = '0 auto';
		tabla.innerHTML +=" <thead> <th style= text-align: 'center'; >Participante</th><th style= text-align: 'center';>Jugador</th> </tr>"; // inserto los titulos de la tabla
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
						td.style.textAlign = 'center';
						paso += 1;
						cuenta+= 1;
						entrada = false;
					}else
					{
						td.appendChild(document.createTextNode("  ")); // creo el espacio vacio
						td.style.textAlign = 'center';
						paso += 1;
					}
				}else
				{ 
					var aux = rifa.arregloAleatorio[i]; // capturar el numero aleatorio
					td.appendChild(document.createTextNode(rifa.arregloJugador[aux])); // asginar el jugador
					td.style.textAlign = 'center';
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
	
	