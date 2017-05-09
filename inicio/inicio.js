

function ingresar()
{
	var entra = confirm("Si entra como invitado su apuesta no se guardará ¿desea continuar?");
	
	if(entra)
	{
	var valor = "invitado";
	localStorage.setItem('nombre',valor);
		location.href="../contenido/principal.html";
	}

}

function paso()
{
	var valor = "msg";
	localStorage.setItem('valor',valor);
	location.href="../perfil/perfil.html";
	
}





	
