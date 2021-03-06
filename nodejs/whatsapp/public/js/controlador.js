$(document).ready(function(){
	$.ajax({
		url:"/usuarios",
		method:"GET",
		data:"",
		dataType:"json", //En que formato se recibira la informacion.
		success:function(respuesta){
			//alert("Esto es lo que retorna el archivo PHP: " + respuesta);
			for (var i = 0; i < respuesta.length; i++) {
				$("#slc-usuario").append('<option value="'+respuesta[i].codigo+'">'+respuesta[i].nombre+"</option>");	
				$("#div-contactos").append(
						'<div class="row sideBar-body" onclick="seleccionarContacto('+respuesta[i].codigo+',\''+respuesta[i].nombre+'\',\''+respuesta[i].imagen+'\');">'+//,\''+respuesta[i].imagen+'\'
						'  <div class="col-sm-3 col-xs-3 sideBar-avatar">'+
						'    <div class="avatar-icon">'+
						'      <img src="'+respuesta[i].imagen+'">'+
						'    </div>'+
						'  </div>'+
						'  <div class="col-sm-9 col-xs-9 sideBar-main">'+
						'    <div class="row">'+
						'      <div class="col-sm-8 col-xs-8 sideBar-name">'+
						'        <span class="name-meta">'+respuesta[i].nombre+
						'      </span>'+
						'      </div>'+
						'      <div class="col-sm-4 col-xs-4 pull-right sideBar-time">'+
						'        <span class="time-meta pull-right">18:18'+
						'      </span>'+
						'      </div>'+
						'    </div>'+
						'  </div>'+
						'</div>'	
				);
			}
			
			//$("#slc-usuario").html(respuesta);
			//document.getElementById("slc-usuario").innerHTML = respuesta;
		},
		error:function(e){
			alert("Ocurrio un error");
		}
	});
});

$("#slc-usuario").change(function(){
	//alert("USUARIO seleccionado: " + $("#slc-usuario").val());
});

function seleccionarContacto(codigoContacto, nombreContacto, imagen){
	//Asignar el codigo del receptor o contacto a un input oculto
	$("#txt-receptor").val(codigoContacto);
	$("#nombre-contacto").html(nombreContacto);
	$("#img-contacto").attr("src",imagen);//img-contacto

	cargarMensajes();
}

function cargarMensajes(){
	console.log("Obteniendo mensajes");
	var codigoContacto = $("#txt-receptor").val();
	var parametros = 	"emisor="+$("#slc-usuario").val()+"&"+
						"receptor="+codigoContacto;
	
	
	$.ajax({
		url:"/mensajes",
		//Tambien se puede utilizar el siguiente patron:
		//url:"/mensajes/"+$("#slc-usuario").val()+"/"+codigoContacto,
		data:parametros,
		method:"POST",
		dataType:"json",
		success:function(respuesta){
			var cssClass="";
			$("#div-conversacion").html("");
			for(var i=0;i<respuesta.length;i++){
				if (respuesta[i].codigo == codigoContacto)
					cssClass = "receiver";
				else
					cssClass = "sender";
						
				$("#div-conversacion").append(
					'<div class="row message-body">'+
					'  <div class="col-sm-12 message-main-'+cssClass+'">'+
					'    <div class="'+cssClass+'">'+
					'      <div class="message-text">'+
								respuesta[i].mensaje+
					'      </div>'+
					'      <span class="message-time pull-right">'+
								respuesta[i].hora+
					'      </span>'+
					'    </div>'+
					'  </div>'+
					'</div>'
					);
			}
		},
		error:function(e){
			alert("Error: " + JSON.stringify(e));
		}
	});
}

$("#btn-enviar").click(function(){	
	var parametros = 	"mensaje=" + $("#txta-mensaje").val()+"&"+
						"emisor=" + $("#slc-usuario").val()+"&" + 
						"receptor=" + $("#txt-receptor").val();
	//alert(parametros);
	$.ajax({
		url:"/enviar-mensaje",
		method:"POST",
		data:parametros,
		dataType:"json",
		success:function(respuesta){
			console.log(respuesta);
			if (respuesta.affectedRows == 1){
				$("#div-conversacion").append(
				'<div class="row message-body">'+
				'  <div class="col-sm-12 message-main-sender">'+
				'    <div class="sender">'+
				'      <div class="message-text">'+
				$("#txta-mensaje").val()+
				'      </div>'+
				'      <span class="message-time pull-right">'+
				respuesta.hora+
				'      </span>'+
				'    </div>'+
				'  </div>'+
				'</div>'
				);
				$("#txta-mensaje").val("");	
			}
			else{
				alert("Mensaje no enviado");
			}
		},
		error:function(){

		}
	});

});

$("#btn-eliminar").click(function(){	
	var parametros = 	"emisor=" + $("#slc-usuario").val()+"&" + 
						"receptor=" + $("#txt-receptor").val();

	$.ajax({
		url:"/eliminar-conversacion",
		method:"POST",
		data:parametros,
		dataType:"json",
		success:function(respuesta){
			console.log(respuesta);
			if (respuesta.affectedRows>0)
				$("#div-conversacion").html("");
		}
	});
});