var nombre,pswd,ip;
var arrayNames = {};
var websocket = io.connect();

$(document).on("ready",iniciar);

function iniciar()
{
	$("#formname").on("submit",function(e){
		//Cuando enviamos el nombre
		e.preventDefault();
		var bandera = 0;
		//Verificamos que el nombre no esté ocupado
		for (var i = arrayNames.length - 1; i >= 0; i--) {
			if($("#name").val() == arrayNames)
			{
				bandera = 1;
			}
		};
		if(bandera == 0)
			sendName()
		else
			alert("Ese nombre ya existe");
	});
	//Formulario para enviar un nuevo mensaje
	$("#formmsg").on("submit",function(e){
		e.preventDefault();
		sendMessage();
	});
	//Cerramos sesión
	$('#logout').on("click",function(){
		localStorage.removeItem("nombreChatUsuario");
		location.reload(true);
	});	
	//Manejamos lo que el servidor nos manda
	websocket.on("mensaje",procesarUsuario);
	websocket.on("newMessage",procesarMensaje);
	websocket.on("usuarioDesconectado",procesarUsuarios);
	websocket.on("errorName",repetirNombre);
}
//Enviamos nuestro nombre
function sendName()
{
	nombre = $("#name").val();
	$('#signup').fadeOut();
	//Guardamos el nombre en localStorage
	if (localStorage)
	{
		localStorage.nombreChatUsuario = nombre;
	}
	websocket.emit("enviarNombre",nombre);
}
//Enviar el mensaje
function sendMessage()
{
	var msg = $("#msg").val();
	//Verificamos que no tenga scripts
	if((msg.indexOf("<") != -1))
	{
		alert("Mensaje incorrecto");
	}
	else if((msg.indexOf(">") != -1))
	{
		alert("Mensaje incorrecto");	
	}
	else if((msg.indexOf(";") != -1))
	{
		alert("Mensaje incorrecto");
	}
	else
	{
		//Limpiamos la caja del formulario		
		$("#msg").val("");
		//Enviamos un mensaje
		websocket.emit("enviarMensaje",msg);	
	}
	
}
function procesarUsuario(mensaje)
{
	//Esta función se ejecuta cuando el servidor nos avisa
	//que alguien se conectó
	//Limpiamos el div de usuarios
	$('#users').html(""); 
	//Colocamos de nuevo los usuarios
	for (i in mensaje[1])
  	{
  		$('#users').append($('<li>').html('<img src="/images/user.png" width="20" height"20" />&nbsp' + mensaje[1][i]));
  		arrayNames[i] = mensaje[1][i];
  	}
}
//Esta función procesa los msjs
function procesarMensaje(data)
{
	$('#message').append($('<li>').append($('<p>').html('<strong>'+ data[0] + " dice:</strong> " + data[1])));
	$('#message').animate({scrollTop: $("#message").height()}, 800);
}

function procesarUsuarios(data)
{
	//Esta función se ejecuta cuando el servidor nos
	//avisa que alguien se desconectó
	$('#users').html("");
	for (i in data[0])
  	{
  		$('#users').append($('<li>').html('<img src="/images/user.png" width="20" height"20" />&nbsp' + data[0][i]));
  		arrayNames[i] = data[0][i];
  	}
}
function repetirNombre()
{
	localStorage.removeItem("nombreChatUsuario");
	alert("¡Lastima, ese nombre ya está ocupado!");
	location.reload(true);	
}