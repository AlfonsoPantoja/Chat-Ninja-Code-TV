var express = require('express'),http = require('http');
var app = express();
var server = http.createServer(app);
app.set('views',__dirname + '/views');
app.configure(function(){
	app.use(express.static(__dirname));
});
app.get('/',function(req,res){
	res.render('index.jade');
	//res.render('index.html',{layout:false});
});
server.listen(8080);

var io = require("socket.io").listen(server);
//JSON para controlar que no se repitan nombres
var usuariosConectados = {};
io.sockets.on("connection",function(socket)
	{
		//Recibimos el nombre
		socket.on("enviarNombre",function(dato)
		{
			//Verificamos que ese nombre no existe
			if(usuariosConectados[dato])
			{
				socket.emit("errorName");
			}
			else
			{
				//Lo asignamos a la socket y lo agregamos
				socket.nickname = dato;
				usuariosConectados[dato] = socket.nickname;
				console.log(socket.nickname);
			}
			data = [dato,usuariosConectados];
			//Enviamos los datos de regreso a las sockets
			io.sockets.emit("mensaje",data);
		});	
		//Recibimos un nuevo msj y lo mandamos a todas las sockets
		socket.on("enviarMensaje",function(mensaje)
		{
			var startTime = new Date().getTime();
			mensaje = links(mensaje);
			mensaje = memes(mensaje);
			mensaje = mensaje + "<small> - ("+ hour() +")</small>";
			var data = [socket.nickname, mensaje];
			io.sockets.emit("newMessage",data);
		});
		//Se dispara cuando una socket se desconecta
		socket.on('disconnect', function () 
		{
			//Eliminamos al usuario de lso conectados
			delete usuariosConectados[socket.nickname];
			//Creamos un arreglo con los usuarios y el que se eliminó
			data = [usuariosConectados,socket.nickname];
			console.log(data);
			//Mandamos la información a las Sockets
			io.sockets.emit("usuarioDesconectado",data);
		});
	});

function links(mensaje){
	var exp = /(\b(https?|ftp|file):\/\/([-A-Z0-9+&@#%?=~_|!:,.;]*)([-A-Z0-9+&@#%?\/=~_|!:,.;]*)[-A-Z0-9+&@#\/%=~_|])/ig;
	while (mensaje = mensaje.replace(exp,'&nbsp-No URLs-&nbsp'))
		//mensaje = mensaje.replace(exp,'&nbsp-No URLs-&nbsp');
	return mensaje;
}

function memes(text){
	while (text.toString().indexOf('#yaoming') != -1)
		text = text.toString().replace('#yaoming','<img src="/images/memes/yaoming.jpg" />');

	while (text.toString().indexOf('#lol') != -1)
		text = text.toString().replace('#lol','<img src="/images/memes/lol.jpg" />');

	while (text.toString().indexOf('#megusta') != -1)
		text = text.toString().replace('#megusta','<img src="/images/memes/megusta.jpg" />');

	while (text.toString().indexOf('#troll') != -1)
		text = text.toString().replace('#troll','<img src="/images/memes/troll.jpg" />');

	while (text.toString().indexOf('#spiderman') != -1)
		text = text.toString().replace('#spiderman','<img src="/images/memes/spiderman.jpg" />');

	while (text.toString().indexOf('#ternura') != -1)
		text = text.toString().replace('#ternura','<img src="/images/memes/ternura.jpg" />');

	while (text.toString().indexOf('#foreveralone') != -1)
		text = text.toString().replace('#foreveralone','<img src="/images/memes/foreveralone.jpg" />');

	while (text.toString().indexOf('#challenge') != -1)
		text = text.toString().replace('#challenge','<img src="/images/memes/challenge.jpg" />');

	while (text.toString().indexOf('#no') != -1)
		text = text.toString().replace('#no','<img src="/images/memes/no.jpg" />');

	while (text.toString().indexOf('#friki') != -1)
		text = text.toString().replace('#friki','<img src="/images/memes/friki.jpg" />');

	return text;
}

function hour(){
	Stamp = new Date();
	var Hours;
	var Mins;
	var Time;
	Hours = Stamp.getHours();
	if (Hours >= 12) {
	Time = " P.M.";
	}
	else {
	Time = " A.M.";
	}
	if (Hours > 12) {
	Hours -= 12;
	}
	if (Hours == 0) {
	Hours = 12;
	}
	Mins = Stamp.getMinutes();
	if (Mins < 10) {
	Mins = "0" + Mins;
	}
	return Hours + ":" + Mins + Time;
}