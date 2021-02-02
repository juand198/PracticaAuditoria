$(document).ready(function () {
    cargarTareas(); 
    cargarAuditadas();  
    let select_empresasAuditadas = document.getElementById('empresas-auditadas');
    select_empresasAuditadas.addEventListener('change',function(e){
        let selectedOption = this.options[select_empresasAuditadas.selectedIndex];
        console.log(selectedOption.value + ': ' + selectedOption.text);
        $("#ejecutor-info").css("display", "flex");
    });
});

/**
 * 
 * Variables 
 * 
 */
var password_visible = false; //Define que se vea los inputs en tipo password, cuando se clica pasa a ser true.
const URLSERVIDOR = "http://localhost/dwes/Auditoria/";//url del servidor para el backend
var edicion = (localStorage.getItem('edicion')== 0)?'display:none':''
var creacion = (localStorage.getItem('insercion')== 0)?'display:none':''
//Cuando es administrador, puede decidir para que trabajador y para que auditora pone la tarea
nuevaTarea_auditoria = (localStorage.getItem('categoria')!=="super-administrador")?'display:none':'' 
//1 = true 0= false ---- Permisos-----

/**
 * Esta función borra el almacenamiento del navegador para cuando salgas de la pantalla no se guarden tus credenciales. Ahora mismo solo lo llamo
 * en el body onload del login pero deberia de ser llamada en el logout
 * 
 * USO: pantalla de LOGIN
 */
function deleteStorage(){
    localStorage.removeItem("usuario");
    localStorage.removeItem("categoria");
    $.ajax({
        type: "POST",
        url: "http://localhost/dwes/Auditoria/cerrarSesion.php",
    })
}

function consultaAjax(metodo,url,datos){
    $.ajax({
        type: metodo,
        url: url,
        data: datos
    }).done(function(msg){
        return msg;
    });
}

/**
 * Alterna entre una pantalla dandole visibilidad (o cualquier css que entre) y otra en función de que botón sea clicado,
 * el cual entra en el evento. Lugar determina desde donde esta siendo llamado, ya que esta funcion la llamo en el login y en el main y cada uno
 * tiene sus clases para ser llamadas
 * 
 * @param event evento que lo acciona
 * @param css css que se añade 
 * @param lugar desde que pagina le llamo
 * 
 * USO: LOGIN, MAIN
 */
function addClassCSS(event,css,lugar){
    let activos = document.getElementsByClassName("active");
    for (var i = 0; i<activos.length; i++) {
        activos[i].classList.remove("active");
    }
    let id = event.target.id;
    document.getElementById(id).className += " " + css;
    switch (lugar) {
        case 'login':
            var cajas = document.getElementsByClassName("card-body");
            for (let i = 0; i < cajas.length; i++) {
                if(cajas[i].classList[1] !== 'invisible'){
                    cajas[i].className += " invisible"
                }                
            }   
            var contenido= document.getElementById("acceso_"+id);    
            contenido.classList.remove("invisible");
            break;
        case 'main':
            var cajas = document.getElementsByClassName("page");

            for (let i = 0; i < cajas.length; i++) {
                if(cajas[i].classList[0] !== 'invisible'){
                    cajas[i].className += " invisible"
                }                
            }   
            var contenido= document.getElementById("visor-" + id);
            contenido.classList.remove("invisible");
            break;
        case 'tareas':
            var cajas = document.getElementsByClassName("gestor-vistas");
            for (let i = 0; i < cajas.length; i++) {
                if(cajas[i].classList[1] !== 'invisible'){
                    cajas[i].className += " invisible"
                }                
            }   
            var contenido= document.getElementById("acceso_"+id);    
            contenido.classList.remove("invisible");
            break;
        default:
            break;
    }
    

}

/**
 * 
 * Verifica que el usuario introducido es correcto y pasa a la pantalla de inicio de la web. Ademas crea una sesion con el usuario y el tipo 
 * de usuario que es para despues determinar si tiene acceso a unas propiedades u otras.
 * 
 * USO:LOGIN
 */
function loginUser(){
    let user = document.getElementById('acceso_usuario_user').value;
    let pass = document.getElementById('acceso_usuario_password_value').value;

    $.ajax({
        type: "POST",
        url: URLSERVIDOR+ "obtenerUsuario.php",
        data:{
            nombre: user
        }
    }).done(function(msg){
        if(msg[0].estado === 1){
            if(msg[0].mensaje[0].nombre === user && msg[0].mensaje[0].pass === pass){
                $.ajax({
                    type: "POST",
                    url: URLSERVIDOR + "crearSesion.php",
                    data: {
                        nombre: user,
                        categoria: msg[0].mensaje[0].categoria,
                        idauditora: msg[0].mensaje[0].idauditora
                    }
                }).done(function(msg2){
                    if(msg2 === "OK"){
                        localStorage.setItem("usuario",user);
                        localStorage.setItem("categoria",msg[0].mensaje[0].categoria);    
                        localStorage.setItem("idauditora",msg[0].mensaje[0].idauditora);      
                        localStorage.setItem("edicion",msg[0].mensaje[0].edicion);      
                        localStorage.setItem("insercion",msg[0].mensaje[0].insercion);      
                        localStorage.setItem("visualizacion",msg[0].mensaje[0].visualizacion);   
                        document.location.href = "./../screens/main.html";
                    }
                })
            }
        }
    });
}

/**
 * 
 * Comprueba si la pantalla main debe cargarse, a esta funcion la llamo en el onload del main.html para que compruebe que tipo de usuario es
 * ademas, si no es ningun usuario vuelve al login, ya que no se ha accedido al main desde la pagina de login
 * 
 * USO:MAIN
 */
function comprobarAcceso(){
    if(localStorage.getItem('categoria')==="super-administrador"){        
        
    }else if(localStorage.getItem('categoria')=== "Auditor" || localStorage.getItem('categoria') === "Interventor"){
        document.getElementById("add-users").className += " " + "invisible";
        
    }else if(localStorage.getItem('categoria')=== "Usuario" ){
        document.getElementById("add-users").className += " " + "invisible";
        document.getElementById("ejecutor").className += " " + "invisible";
        
    }else{
        alert("No eres nadie... fuera de aqui")
        document.location.href = "./../screens/login.html"
    }
    document.getElementById("welcome").innerHTML  = "Bienvenido " + localStorage.getItem('usuario') + " eres " + localStorage.getItem('categoria');
    
}

/**
 * 
 * Abre el menu desplegable para crear usuarios. recorre las clases de menucategorias que es el que tiene que mostrarse y si tiene
 * un show se lo quita y si no lo tiene se lo pone.
 * 
 */
function abrirMenuCategorias() {
    var andar = true;
    var clases =  document.getElementById("menu-categorias");
    
    for (let i = 0; i < clases.classList.length && andar; i++) {
        if(clases.classList[1]==="show"){
            clases.classList.remove("show");
        }else{
            clases.className += " show";
            andar = false;
        }
        
    }
}

/**
 * 
 * Cambia el nombre en el menu desplegable cuando se escoge un elemento del desplegable.
 * 
 * USO:MAIN
 */
function cambiarMenuCategorias(event){
    document.getElementById("menu-desplegable").innerHTML = event.target.name;
    abrirMenuCategorias();
}

/**
 * 
 * Crea un usuario en la base de datos cuando coinciden todos los parametros, que el nombre no esté vacio, que las contraseña sea mayor de ocho
 * caracteres y que coincidan y que haya seleccionado un tipo de usuario, si todo se cumple se crea el usuario
 * 
 */
function crearUsuario() {
    let nombre = document.getElementById('user_value').value;
    let pssw = document.getElementById('password_value').value;
    let pssw2 = document.getElementById('password2_value').value;
    let menu_value = document.getElementById("menu-desplegable").innerHTML;
    if (nombre.length!==0){
        if(pssw.length < 8 || pssw2.length < 8){
            alerta(" alert-danger",4000,"La contraseña debe de ser mayor de 8","display:block;")
        }else{
            if(pssw !== pssw2){
                alerta(" alert-danger",4000,"Las contraseñas deben coincidir","display:block;")
            }else{                
                if(menu_value === "Tipo usuario"){
                    alerta(" alert-danger",4000,"Debes seleccionar un tipo de usuario","display:block;")
                }else{
                    $.ajax({
                            type: "POST",
                            url: URLSERVIDOR+"registrarUsuario.php",
                            data:{
                                nombre: nombre, 
                                pass: pssw,
                                categoria: menu_value,
                                idauditora: $('input:radio[name=empresa]:checked').val()
                            }
                        }).done(function(msg){
                            if(msg[0].estado === 1){
                                alert("Usuario " + nombre + " creado correctamente.")
                                location.reload();
                            }else{
                                alert("Error en la base de datos.")
                            }
                        });
                }
            }
        }
    }else{
        alerta(" alert-danger",4000,"El nombre no puede estar vacio","display:block;")
    }
}

/**
 * Crea una alerta 
 * @param {*String} tipo tipo de alerta que quiero que sea, danger,info etc
 * @param {*Int} tiempo duracion de la alerta 
 * @param {*String} texto Texto que pondrá la alerta
 * @param {*String} style Estilo que le va a poner, que se vea, centrado etc
 */
function alerta(tipo,tiempo,texto,style) {
    var alerta = document.getElementById("alerta")
    for (let i = 2; i < alerta.classList.length; i++) {
        alerta.classList.remove(alerta.classList[i]);        
    }
    alerta.className += tipo;
    alerta.style = style;        
    document.getElementById('text-error').innerHTML = texto;
        setTimeout(function(){
                document.getElementById('alerta').style.display = "none"; 
            }, tiempo);
}

/**
 * Cambia el icono del ojo en la contraseña y cambia de tipo texto a tipo contraseña... para poder ver la contraseña
 * 
 * @param {*Evento} event 
 */
function activePassword(event) {
    var clic = event.target
    if(password_visible){
        password_visible = !password_visible;
        clic.innerHTML = "<i class='fas fa-eye-slash'></i>"
        document.getElementById(event.target.id + "_value").type = "text"
        clic.classList += " boton_pass_marcado"
    }else{
        password_visible = !password_visible;
        clic.innerHTML = "<i class='far fa-eye'></i>"
        document.getElementById(event.target.id + "_value").type = "password"
        clic.classList.remove('boton_pass_marcado')
    }
}

function llenarAuditorias() {
    $.ajax({
        type: "POST",
        url: URLSERVIDOR+"obtenerTodasAuditoras.php"
    }).done(function (msg) {
        if(msg[0].estado === 1){
            let auditoras = msg[0].mensaje;
            for (let i = 0; i < auditoras.length; i++) {
                $('#auditoras').append('<div><span >'+ auditoras[i].nombre +'</span><input style="margin-right: 10%;" type="radio" name="empresa" id=empresa'+ i +' value="'+ auditoras[i].nombre +'"></div>');              
                $('#empresa0').prop("checked", true)
            }
        }
    }).fail(function(msg){
        console.log("error");
    });
    $('menu-auditorias').append('<a class="dropdown-item" name="Usuario" onclick="cambiarMenuCategorias(event)">Usuario</a>');
}

function cargarTareas(){
    
    $("#creartarea").attr('style', creacion);
    if(localStorage.getItem('categoria')=='super-administrador'){
        //var respuesta = consultaAjax("POST",URLSERVIDOR+"obtenerTodasTareas.php",{datos:'algo'}); no consigo un return de msg en la funcion ajax
        $.ajax({
            type: "POST",
            url: URLSERVIDOR+"obtenerTodasTareas.php"
        }).done(function(msg){
            $("#todasTareas").empty();
            $("#todasTareas").append("<h3 style='text-align: center;'>Todas las tareas</h3>")
            for (let i = 0; i < msg[0].mensaje.length; i++) {
                if(msg[0].estado === 1){
                    $("#todasTareas").append("<div><span><b>Nombre:</b> "+ msg[0].mensaje[i].nombre +"</span><span><b> Descripcion:</b> "+ msg[0].mensaje[i].descripcion +"</span><span><b> Código:</b> "+ msg[0].mensaje[i].codigo +"</span></div><div><button type='button' value='"+msg[0].mensaje[i].codigo+" "+msg[0].mensaje[i].nombre+"' onclick='sacarTramites(event)' id='"+ msg[0].mensaje[i].id +"' class='btn btn-outline-primary'>Ver tarea</button><button style='"+ edicion +"' type='button' value='"+msg[0].mensaje[i].codigo+" "+msg[0].mensaje[i].nombre+"' onclick='borrarTarea(event)' id='"+ msg[0].mensaje[i].id +"' class='btn btn-outline-primary'>Borrar tarea</button><button style='"+edicion+"' type='button' value='"+msg[0].mensaje[i].codigo+" "+msg[0].mensaje[i].nombre+"' onclick='mostarPopUpUpdateTarea(event)' id='"+ msg[0].mensaje[i].id +"' class='btn btn-outline-primary'>Modificar tarea</button></div>")
                }
            }
            $("#todasTareas").append("<button style='margin: 10px auto;width: inherit;"+ creacion +"' class='btn btn-primary' onclick='mostrarPopUpTarea()' type='submit'>Crear tarea</button>");
        });
    }else{
        $.ajax({
            type: "POST",
            url: URLSERVIDOR +"obtenerTareasAuditora.php",
            data:{
                idauditora: localStorage.getItem('idauditora')
            }
        }).done(function(msg){
            $("#todasTareas").empty();
            $("#todasTareas").append("<h3 style='text-align: center;'>Todas las tareas</h3>")
            for (let i = 0; i < msg[0].mensaje.length; i++) {
                if(msg[0].estado === 1){
                    $("#todasTareas").append("<div><span><b>Nombre:</b> "+ msg[0].mensaje[i].nombre +"</span><span><b> Descripcion:</b> "+ msg[0].mensaje[i].descripcion +"</span><span><b> Código:</b> "+ msg[0].mensaje[i].codigo +"</span></div><div><button type='button' value='"+msg[0].mensaje[i].codigo+" "+msg[0].mensaje[i].nombre+"' onclick='sacarTramites(event)' id='"+ msg[0].mensaje[i].id +"' class='btn btn-outline-primary'>Ver tarea</button><button style='"+ edicion +"' type='button' value='"+msg[0].mensaje[i].codigo+" "+msg[0].mensaje[i].nombre+"' onclick='borrarTarea(event)' id='"+ msg[0].mensaje[i].id +"' class='btn btn-outline-primary'>Borrar tarea</button><button style='"+edicion+"' type='button' value='"+msg[0].mensaje[i].codigo+" "+msg[0].mensaje[i].nombre+"' onclick='modificiarTarea(event)' id='"+ msg[0].mensaje[i].id +"' class='btn btn-outline-primary'>Modificar tarea</button></div>")
                }            
            }
            $("#todasTareas").append("<button style='margin: auto;width: inherit;"+ creacion +"' class='btn btn-primary' onclick='mostrarPopUpTarea()' type='submit'>Crear tarea</button>");
        });
    }
}
/**
 * Crea los tramites.... los id de los tramites representan el id que usa en la bd y el id del boton de crear tramite tiene el id de la tarea en la bd
 * @param {evento} event 
 */
function sacarTramites(event) {
    var data = {}
    switch (event.target.innerHTML) {
        case "Borrar tramite":
            data ={
                idtarea: event.target.name
            }
            break;
        case "Guardar":
            data={
                idtarea: event.target.value
            }
            break;
        default:
            data ={
                idtarea: event.target.id
            }
            break;
    }
    $.ajax({
        type: "POST",
        url: URLSERVIDOR + "obtenerTramitesIdTarea.php",
        data:data
    }).done(function(msg){
        if(event.target.innerHTML === "Ver tarea"){
            $("#visualizador-gestor").empty();
            $("#visualizador-gestor-titulo").empty();
            $("#visualizador-gestor-titulo").append("<h3 style='text-align: center;'>"+ event.target.value +"</h3>")        
        }
        $("#visualizador-gestor").empty();
        for (let i = 0; i < msg[0].mensaje.length; i++) {
            if(msg[0].estado === 1){
                $("#visualizador-gestor").append("<button name='"+ event.target.id +"' type='button' value='"+msg[0].mensaje[i].nombre+"' id='"+ msg[0].mensaje[i].id+"' onclick='sacarDatos(event)' class='btn btn-outline-primary btn_js'>"+  msg[0].mensaje[i].nombre+"</button>")
            }            
        }
        $("#visualizador-gestor").append("<button id='"+ event.target.id +"' style='margin-top:5px;"+ creacion +"' onclick='mostrarPopUpTramite(event)' type='button' class='btn btn-primary'>Crear tramite</button>")        
    });
}
/**
 * Muesta todos los datos del tramite 
 */
function sacarDatos(event) {
    let codigoSubirArchivo = "<div style='"+ creacion +"'><h4 style='text-align:center;'>Nuevo documento</h4><form id='formuploadajax' method='post' enctype='multipart/form-data'><div style='display: flex;flex-direction: column;'><span>Nombre:</span><input id='nombreArchivo' name='nombre' type='text'><span>Descripción:</span><textarea id='descripcionArchivo' name='descripcion rows='10 cols='30'></textarea></div><input style='margin:10px 0px 10px 0px;' onchange='comprobarSubir()' id='subidor' type='file' name='filename' multiple></form></div>"
    $.ajax({
        type: "POST",
        url: URLSERVIDOR+"obtenerTramiteId.php",
        data:{
            id: event.target.id
        }
    }).done(function(msg){
        $("#info-visualizador-gestor").empty();
        $("#info-visualizador-gestor").append("<h3 id='verDatosTituloNombre' style='text-align: center;'>"+ event.target.value +"</h3>")
        if(msg[0].estado === 1){
            $("#info-visualizador-gestor").append("<div style='display: flex;flex-direction:column'><div style='display: flex;'><h5 style='margin: 10px 0px;'>Nombre:</h5><p class='"+msg[0].mensaje[0].id+ " " +event.target.name +"' ondblclick='dblClickUpdate(event)' id='nombreDatosTramite' style='margin: auto 10px;'>"+ msg[0].mensaje[0].nombre +"</p></div><div style='display: flex;'><h5 style='margin: 10px 0px;'>Descripcion:</h5><p class='"+msg[0].mensaje[0].id+ " " +event.target.name +"' ondblclick='dblClickUpdate(event)' id='descripcionDatosTramite' name='"+ event.target.name +"' style='margin: auto 10px;'>"+ msg[0].mensaje[0].descripcion +"</p></div></div><div>"+codigoSubirArchivo+"</div><div style='display: flex;justify-content: center;'><button style='margin:5px' id='"+ msg[0].mensaje[0].id +"' onclick='verDocumentos(event)' type='button' class='btn btn-outline-primary verDoc'>Ver Documentos</button><button style='margin:5px;"+ creacion +"' id='"+ msg[0].mensaje[0].id +"' onclick='subirDocumentos(event)' disabled='disabled' type='button' class='btn btn-outline-primary subirDoc'>Subir documento</button><button style='margin:5px;"+ edicion +"'name='"+ event.target.name +"' id='"+ msg[0].mensaje[0].id +"' onclick='borrarTramite(event)' type='button' class='btn btn-outline-primary'>Borrar tramite</button></div></div>")
        }    
    });
}

/**
 * Abre una ventana pasando el id en la url para luego recuperarlos, lo uso en el boton de ver documentos
 * @param {evento} event 
 */
function verDocumentos(event) {
    window.open('./../screens/documentos.html?id='+event.target.id, 'windowOpenTab', 'scrollbars=1,resizable=1,width=1000,height=250,left=0, top=4000');
}
/**
 * Lo uso en la ventana de documentos que es emergente para que en el onload carge todos los documentos
 */
function verDocumentos2(){
    var parametros = window.location.search.split("=");
    $.ajax({
        type: "POST",
        url: URLSERVIDOR+"obtenerDocumentosIdTramite.php",
        data: {
            idtramite: parametros[1]
        },
    }).done(function(msg){
        if(msg[0].mensaje.length>0){
            for (let i = 0; i < msg[0].mensaje.length; i++) {
                if(msg[0].estado === 1){
                    var nombre = msg[0].mensaje[i].ruta.split("/")[2]
                    $("#info-visualizador-gestor-documentos").append("<div><span><b>Nombre:</b> "+msg[0].mensaje[i].nombre+"</span><span><b> Descripción:</b> "+msg[0].mensaje[i].descripcion+"</span><a href='"+URLSERVIDOR +"files/descargarDocumento.php?nombre="+nombre+"' type='button' value='"+nombre+"' id='"+ msg[0].mensaje[i].id+"' class='btn btn-outline-primary btn_js'>Descargar</a><button style='"+ edicion +"' type='button' value='"+nombre+"' id='"+ msg[0].mensaje[i].id+"' onclick='borrarDocumento(event)' class='btn btn-outline-primary btn_js'>Borrar</button><!--<button style='"+ edicion +"' type='button' value='"+nombre+"' id='"+ msg[0].mensaje[i].id+"' onclick='modificarDocumento()' class='btn btn-outline-primary btn_js'>Modificiar</button>--></div>")
                }            
            }
        }else{
            $("#info-visualizador-gestor-documentos").append("<h3>No hay documentos para este tramite</h3>")
        }

    });
}
/**
 * Comprueba que se haya escogido algo para subir
 */
function comprobarSubir(){
    if($("#subidor").val()){
        $(".subirDoc").prop("disabled", false);        
    }else{
        $(".subirDoc").prop("disabled", true); 
    }

}
/**
 * Sube un archivo al servidor, obtiene el formData para pasarlo al php de subirdocumento, si se sube correctamente al servidor manda un msg
 * de ok y lo agrega a la bd, si todo sale bien manda un alert y resetea el input y deshabilita el boton de subir
 * @param {evento} event 
 */
function subirDocumentos(event) {
    var nombre = $("#nombreArchivo").val();
    var descripcion = $("#descripcionArchivo").val()
    if(nombre && descripcion){
        var formData = new FormData(document.getElementById("formuploadajax"));
        $.ajax({
            url: URLSERVIDOR +"files/subirDocumento.php",
            type: "post",
            dataType: "html",
            data: formData,
            cache: false,
            contentType: false,
            processData: false
        }).done(function(msg){
            let ruta = "./files/"+msg
            if(msg!==null){
                $.ajax({
                    type: "POST",
                    url: "http://localhost/dwes/Auditoria/registrarDocumento.php",
                    data: {
                        idtramite: event.target.id,
                        ruta: ruta,
                        nombre : nombre,
                        descripcion: descripcion
                    }
                }).done(function(msg){
                    if(msg[0].estado === 1){
                        alert("Documento subido correctamente");
                        $(".subirDoc").prop("disabled", 1);
                        $("#subidor").val("")
                        $("#nombreArchivo").val("")
                        $("#descripcionArchivo").val("")
                    }
                });
            }
        });

    }else{
        alert("Debes de escribir nombre y descripcion");
    }
}
/**
 * Crea una nueva tarea recogiendo los valores que se introducen en el popup. Controla que no falte ninguno
 */
function crearTarea(){
    var codigo = $("#cod_nuevaTarea option:selected").val();
    var nombre = $("#nuevaTarea_nombre").val();
    var descripcion = $("#nuevaTarea_descripcion").val();
    var idauditora = $("#idauditora_nuevaTarea option:selected").val();
    var idusuario = $("#usuario_nuevaTarea option:selected").val()
    if(localStorage.getItem('categoria')!=='super-administrador'){
        idauditora = localStorage.getItem('idauditora')
    }
    if(codigo !== 0 && nombre.length!== 0 && descripcion.length !== 0 && idauditora !== "" && idusuario !== ""){
        $.ajax({
            type: "POST",
            url: URLSERVIDOR + "registrarTarea.php",
            data: {
                codigo: codigo,
                nombre: nombre,
                descripcion: descripcion,
                idauditora: idauditora,
                idusuarioasig: idusuario
            }
        }).done(function (msg) {
            if(msg[0].mensaje === "OK"){
                cerrarPopUpTarea();
                cargarTareas()
                alert("La tarea " + nombre + " ha sido registrada correctamente")
            }
        });
    }else{
        alert("Ningun campo puede quedar vacío")
    }
}
/**
 * Elimina un documento del servidor, el entra un evento para coger el id del boton que lo ha pulsado, todos los botones llevan el id de la tabla 
 * a la que representan
 * @param {Evento} event 
 */
function borrarDocumento(event){
   $.ajax({
                type: "POST",
                url: URLSERVIDOR+"eliminarDocumentoId.php",
                data: {
                    id: event.target.id
                }
    }).done(function (msg) {
        if(msg[0].mensaje === "OK"){
            $.ajax({
                type: "POST",
                url: URLSERVIDOR+"borrarFicheros.php",
                data: {
                    ruta: "./files/"+event.target.value
                }
            }).done(function (msg3) {  
                //me gustaria comprobar aqui si lo ha borrado todo del servidor pero bueno... no encuentro la forma...
                window.location.reload();
            });
        }
    });
}
/**
 * Elimina un tramite con el id del boton que ha sido pulsado
 */
function borrarTramite(event) { 
    $.ajax({
        type: "POST",
        url: URLSERVIDOR+"obtenerDocumentosIdTramite.php",
        data: {
            idtramite:event.target.id
        }
    }).done(function (msg) {
        var numeroDocs = msg[0].mensaje.length;
        var nombreTitulo = $("#verDatosTituloNombre").text();
        var opcion = confirm("Desea eliminar el tramite " + nombreTitulo + ", tiene " + numeroDocs + " documentos asociados")
        
        if (opcion == true) {
            $.ajax({
                type: "POST",
                url: URLSERVIDOR+"eliminarTramiteId.php",
                data: {
                    id: event.target.id
                }
            }).done(function (msg2) {
                if(msg2[0].mensaje === "OK"){
                    for (let i = 0; i < msg[0].mensaje.length; i++) {
                        $.ajax({
                            type: "POST",
                            url: URLSERVIDOR+"borrarFicheros.php",
                            data: {
                                ruta: msg[0].mensaje[i].ruta
                            }
                        }).done(function (msg3) {  
                            //me gustaria comprobar aqui si lo ha borrado todo del servidor pero bueno... no encuentro la forma...
                        });                        
                    }
                }
            });
            alert("Se han borrado los " + numeroDocs + " documentos asociados al tramite " + nombreTitulo + " y el tramite")
            sacarTramites(event);
        }
        
    });
}
/**
 * Crea un tramite y refresca los tramite para que aparezca en pantalla
 */
function crearTramite(event){
    var nombre = $("#nuevoTramite_nombre").val();
    var descripcion = $("#nuevoTramite_descripcion").val();
    $.ajax({
        type: "POST",
        url: URLSERVIDOR+"registrarTramite.php",
        data: {
            idtarea: event.target.id,
            nombre: nombre,
            descripcion: descripcion
        }
    }).done(function (msg) {
        if(msg[0].mensaje === "OK"){
            sacarTramites(event);
            cerrarPopUpTarea();
        }
    });
}
/**
 * Elimina una tarea pero antes te pregunta y te informa de cuantos tramites hay en esa tarea, para ello obtengo primero los tramites, despues
 * los documentos y elimina uno a uno los documentos de todos los tramites y despues elimina la tarea que al estar puesta en cascade ya elimina 
 * todo lo vincula de la bd
 */
function borrarTarea(event) {
    var nombreTarea = $("#"+event.target.id).val();    
    $.ajax({
        type: "POST",
        url: URLSERVIDOR+"obtenerTramitesIdTarea.php",
        data: {
            idtarea: event.target.id
        }
    }).done(function (msg) {  
        var numTra = msg[0].mensaje.length

        console.log(numTra)
        var opcion = confirm("¿Desea eliminar la tarea, " + nombreTarea + ((numTra===0)?(" no hay tramites asociados"): (" hay " + numTra + " tramites asociados y sus correspondientes documentos, todo sera borrado de forma IRREVERSIBLE")))
        if(msg[0].estado === 1){
            if(opcion){                         
                for (let i = 0; i < msg[0].mensaje.length; i++) {
                    $.ajax({
                        type: "POST",
                        url: URLSERVIDOR+"obtenerDocumentosIdTramite.php",
                        data: {
                            idtramite:msg[0].mensaje[i].id
                        }
                    }).done(function (msg2) {  
                        if(msg2[0].estado==1){
                            for (let j = 0; j < msg2[0].mensaje.length; j++) {
                                $.ajax({
                                    type: "POST",
                                    url: URLSERVIDOR+"borrarFicheros.php",
                                    data: {
                                        ruta:msg2[0].mensaje[j].ruta
                                    }
                                })                                    
                            }                                                  
                        }
                    });
                }
                $.ajax({
                    type: "POST",
                    url: URLSERVIDOR+"eliminarTareaId.php",
                    data: {
                        id:event.target.id
                    }
                });
                alert("Se ha borrado la tarea " + nombreTarea)
            }
            cargarTareas();
        }
    });

    
}
/**
 * Modifica una tarea cogiendo el id por el boton que se pulsa
 */
function modificiarTarea(event){
    var codigo = $("#cod_nuevaTarea option:selected").val();
    var nombre = $("#nuevaTarea_nombre").val();
    var descripcion = $("#nuevaTarea_descripcion").val();
    var idauditora = $("#idauditora_nuevaTarea option:selected").val();
    var idusuario = $("#usuario_nuevaTarea option:selected").val()
    if(localStorage.getItem('categoria')!=='super-administrador'){
        idauditora = localStorage.getItem('idauditora')
    }
    if(codigo !== 0 && nombre.length!== 0 && descripcion.length !== 0 && idauditora !== "" && idusuario !== ""){
        $.ajax({
            type: "POST",
            url: URLSERVIDOR + "uptadteTareaId.php",
            data: {
                id:event.target.id,
                codigo: codigo,
                nombre: nombre,
                descripcion: descripcion,
                idauditora: idauditora,
                idusuarioasig: idusuario
            }
        }).done(function (msg) {
            if(msg[0].mensaje === "OK"){
                cerrarPopUpTarea();
                cargarTareas()
                alert("La tarea " + nombre + " ha sido actualizada correctamente")
            }
        });
    }else{
        alert("Ningun campo puede quedar vacío")
    }
}
/**
 * Muestra un pop up emergente para crear una nueva tarea, llamamos a los metodos cargarAuditorasPopUp y cargarUsuariosPopUp para el desplegable
 * que se pueda escoger
 */
function mostrarPopUpTarea(){
    $("#pop-up_NuevaTarea").append('<div style="display: block; padding-right: 16px;" class="modal fade show" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true"><div  class="modal-dialog modal-dialog-centered" role="document"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="exampleModalCenterTitle">Nueva tarea</h5><button type="button" onclick="cerrarPopUpTarea(event)" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body"><div style="display: flex;flex-direction: column;"><select onchange="changePopUpCode()" name="codigo" id="cod_nuevaTarea"><option value="0">Código de Tarea</option><option value="XNEM">XNEM</option><option value="XCER">XCER</option><option value="XCA">XCA</option><option value="XIP">XIP</option><option value="XAL">XAL</option><option value="XID">XID</option><option value="XIR">XIR</option><option value="XCOM">XCOM</option><option value="XCOME">XCOME</option></select><span>Nombre: </span><input type="text" value="" name="nombre" id="nuevaTarea_nombre"><span>Descripción: </span><input type="text" value="" name="descripcion" id="nuevaTarea_descripcion"><select style="margin-top:10px;'+ nuevaTarea_auditoria +'" name="auditoras" id="idauditora_nuevaTarea"><option value="">Empresa Auditora</option></select><select style="margin-top:10px;" name="usuarios" id="usuario_nuevaTarea"><option value="">Elige usuario</option></select></div></div><div class="modal-footer"><button onclick="cerrarPopUpTarea()" type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button><button onclick="crearTarea(event)" type="button" class="btn btn-primary">Añadir tarea</button></div></div></div></div>');
    cargarAuditorasPopUp()
    cargarUsuariosPopUp()
}
/**
 * Carga todas las empresas auditoras y las añade al desplegable de idauditora_nuevaTarea
 */
function cargarAuditorasPopUp(){    
    $.ajax({
        type: "POST",
        url: URLSERVIDOR + "obtenerTodasAuditoras.php"
    }).done(function (msg){
        for (let i = 0; i < msg[0].mensaje.length; i++) {
            $("#idauditora_nuevaTarea").append("<option value='"+ msg[0].mensaje[i].id +"'>"+ msg[0].mensaje[i].nombre +"</option>");            
        }
    });
}
/**
 * Cuando el desplegable Codigo del popup cambia, esta funcion cambia el nombre y la descripcion por la que deberia de aparecer segun el codigo
 * Permite la posibilidad de modificar el nombre y la descripcion
 */
function changePopUpCode(){
        var nombre = ""
        var descripcion = ""   

        switch ($("#cod_nuevaTarea option:selected").text()) {
            case "XNEM":
                nombre = "Memorandum"
                descripcion = "Memorandum"
                break;
            case "XCER":
                nombre = "Certificados"
                descripcion ="Certificados"
                break;
            case "XCA":
                nombre = "Cuentas Anuales"
                descripcion ="Cuentas anuales"
                break;
            case "XIP":
                nombre = "Informe provisional"
                descripcion = "Informe provisional"
                break;
            case "XAL":
                nombre = "Alegaciones"
                descripcion = "Alegaciones"
                break;
            case "XID":
                nombre = "Informe definitivo"
                descripcion = "Informe definitivo"
                break;
            case "XIR":
                nombre = "Informe resumen"
                descripcion = "Informe resumen"
                break;
            case "XCOM":
                nombre = "Comunicaciones a Empresa Auditora"
                descripcion = "Comunicaciones a Empresa Auditora"
                break;
            case "XCOME":
                nombre = "Comunicaciones a Entidad Pública"
                descripcion = "Comunicaciones a Entidad Pública"
                break;
        }
        $("#nuevaTarea_nombre").val(nombre)
        $("#nuevaTarea_descripcion").val(descripcion)
}
/**
 * Carga la lista de usuarios en el desplegable usuarios del pop up
 */
function cargarUsuariosPopUp(param) {  
    //aqui deberia de mostrar los usuarios de la auditora que yo escoja cuando soy super administrador, en usuarios normales va bien
    $.ajax({
        type: "POST",
        url: URLSERVIDOR + "obtenerUsuarioIdAuditora.php",
        data: {
            idauditora: localStorage.getItem("idauditora")
        }
    }).done(function (msg) {  
        for (let i = 0; i < msg[0].mensaje.length; i++) {
            $("#usuario_nuevaTarea").append("<option value='"+ msg[0].mensaje[i].id +"'>"+ msg[0].mensaje[i].nombre +"</option>");               
        }
    });
}
/**
 * Cierra el pop up
 */
function cerrarPopUpTarea(event){
    $("#pop-up_NuevaTarea").empty();
}
/**
 * Muesta un pop up para crear un nuevo tramite
 */
function mostrarPopUpTramite(event){
    $("#pop-up_NuevaTarea").append('<div style="display: block; padding-right: 16px;" class="modal fade show" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true"><div  class="modal-dialog modal-dialog-centered" role="document"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="exampleModalCenterTitle">Nuevo tramite</h5><button type="button" onclick="cerrarPopUpTarea(event)" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body"><div style="display: flex;flex-direction: column;"><span>Nombre: </span><input type="text" value="" name="nombre" id="nuevoTramite_nombre"><span>Descripción: </span><input type="text" value="" name="descripcion" id="nuevoTramite_descripcion"></div></div><div class="modal-footer"><button onclick="cerrarPopUpTarea()" type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button><button id='+event.target.id+' onclick="crearTramite(event)" type="button" class="btn btn-primary">Añadir tramite</button></div></div></div></div>');
}
/**
 * Permite que al hacer doble clic en el nombre o descripcion de los datos de un tramite estos se transformen en un input text para poder 
 * modificarlos
 * 
 * @param {Evento} event 
 */
function dblClickUpdate(event){
    var idtarea = event.target.classList[1]
    $("#"+event.target.id).replaceWith("<div style='margin: auto 0px;'  id='nuevo"+event.target.id+"'><input id='nuevo"+event.target.id+"Datos' placeholder='Nuevo nombre'  type='text'/> <button name='"+ event.target.id +"' id='"+ event.target.classList[0] +"' onclick='actualizarDatosTramite(event)' value='"+ idtarea +"'>Guardar</button></div>"); 
}
/**
 * Cuando el boton de guardar se clica, vuelve a ser un <p> y actualiza la bd con el nuevo nombre y descripcion, esta funcion según el boton
 * que la invoque se comporta de una manear o de otra, si lo llama el boton nombre, cogera el nombre nuevo y la descripcion antigual y si lo llama
 * Descipcion cogera la descripcion nueva y el nombre antiguo. actualiza los datos del tramite y recarga los tramites
 */
function actualizarDatosTramite(event){
    var texto = $("#nuevo"+event.target.name+"Datos").val();
    if(texto !== ""){
        $("#nuevo"+event.target.name).replaceWith("<p ondblclick='dblClickUpdate(event)' id='"+event.target.name+"' style='margin: auto 10px;'>"+ texto +"</p>"); 
        var data = {id:event.target.id,nombre:"",descripcion:""}
        if(event.target.name.split("D")[0] === "nombre"){
            data = {id:event.target.id,nombre:texto,descripcion:$("#descripcionDatosTramite").text()}
        }else{
            data = {id:event.target.id,nombre:$("#nombreDatosTramite").text(),descripcion:texto}
        }
        $.ajax({
            type: "POST",
            url: URLSERVIDOR+"updateTramiteId.php",
            data: data
        }).done(function (msg) {
            sacarTramites(event)
        });
        
    }else{
        alert("Estos campos no pueden estar vacíos");
    }
}
/**
 * Muesta un pop up para modificar la tarea, funciona igual que el de crear tarea.
 */
function mostarPopUpUpdateTarea(event){
    $("#pop-up_NuevaTarea").append('<div style="display: block; padding-right: 16px;" class="modal fade show" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true"><div  class="modal-dialog modal-dialog-centered" role="document"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="exampleModalCenterTitle">Modificar tarea</h5><button type="button" onclick="cerrarPopUpTarea(event)" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body"><div style="display: flex;flex-direction: column;"><select onchange="changePopUpCode()" name="codigo" id="cod_nuevaTarea"><option value="0">Código de Tarea</option><option value="XNEM">XNEM</option><option value="XCER">XCER</option><option value="XCA">XCA</option><option value="XIP">XIP</option><option value="XAL">XAL</option><option value="XID">XID</option><option value="XIR">XIR</option><option value="XCOM">XCOM</option><option value="XCOME">XCOME</option></select><span>Nombre: </span><input type="text" value="" name="nombre" id="nuevaTarea_nombre"><span>Descripción: </span><input type="text" value="" name="descripcion" id="nuevaTarea_descripcion"><select style="margin-top:10px;'+ nuevaTarea_auditoria +'" name="auditoras" id="idauditora_nuevaTarea"><option value="">Empresa Auditora</option></select><select style="margin-top:10px;" name="usuarios" id="usuario_nuevaTarea"><option value="">Elige usuario</option></select></div></div><div class="modal-footer"><button onclick="cerrarPopUpTarea()" type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button><button id="'+ event.target.id +'" onclick="modificiarTarea(event)" type="button" class="btn btn-primary">Modificar tarea</button></div></div></div></div>');
    cargarAuditorasPopUp()
    cargarUsuariosPopUp()
}

/**
 * Carga todas las empresas auditadas por una determinada empresa auditora.
 */
function cargarAuditadas() {
    $.ajax({
        type: "POST",
        url: URLSERVIDOR + "obtenerEmpresasAuditadaAuditora.php",
        data: {
            "idauditora": localStorage.getItem("idauditora")
        }
    }).done(function (msg){
        for (let i = 0; i < msg[0].mensaje.length; i++) {
            $("#empresas-auditadas").append("<option value='"+msg[0].mensaje[0].id+"'>"+msg[0].mensaje[0].nombre+"</option>")            
        }
    
        
    });
}



