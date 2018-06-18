(function() {
    
    var touchInicioX = 0;
    var touchFinalX  = 0;

    // Esta variable nos indica el index
    // del Array de fotos seleccionado.
    var indexActual;

    // Esta variable nos indica el último
    // index mostrado.
    var ultimoIndex;

    // La lista de fotos
    var fotos = ["fuji_go_ko.jpg", "matsumoto.jpg", "miyajima.jpg", "tokyo.jpg", "kyoto.jpg"];

    // Estos códigos corresponden
    // a las teclas felcha izquierda y
    // flecha derecha
    var FLECHA_IZQUIERDA = 37;
    var FLECHA_DERECHA   = 39;

    // En este método centralizamos el cambio
    // de imagen.
    function mostrarFotoPorIndex(index) {
      
        if(isNaN(index)) {
          index = 0;
        }
        
        // Si el index es el mismo,
        // no se producen cambios.
        if(ultimoIndex == index) {
          
            // Retorno temprano
            return
        }
        
        var foto     = "./fotos/" + fotos[index];
        var texto    = document.getElementById(index).innerHTML;
        imagen.src   = foto;
        imagen.alt   = texto;
        
        indexActual  = index;
        ultimoIndex  = index;
    }

    function escuchaDeClick(event) {
        convertToCrossEvent(event, true);

        target = event.target;

        index = Number(target.id);

        mostrarFotoPorIndex(index);
    }

    function detectarTecla(event) {
        // Al recibir el evento, lo normlizamos
        // y cancelamos el comportamiento por
        // defecto del evento eviando el parámetro true
        convertToCrossEvent(event, true);

        // Una vez obenido el evento,
        // obtenemos el código de la tecla
        var code = event.charCode || event.keyCode;
        
        if (code == FLECHA_DERECHA) {
            mostrarProxima();
        }

        if (code == FLECHA_IZQUIERDA) {
            mostrarPrevia();
        }
        
		console.log("keyCode: " + code);
    }

    function mostrarProxima() {
        indexActual ++;
        
        // Evitamos valores más
        // grandes que el largo del Array
        if (indexActual >= fotos.length) {
          // Reajustamos el valor del index
          indexActual = fotos.length - 1;
        }
        
        mostrarFotoPorIndex(indexActual);
    }

    function mostrarPrevia() {
        indexActual--;
        
        // Evitamos valores negativos
        if (indexActual < 0) {
          // Reajustamos el valor del index
          indexActual = 0;
        }
        
        mostrarFotoPorIndex(indexActual);
    }
    
    function onTouch(event) {
      // Normalizamos el evento y
      // prevenimos la acción por defecto.
      convertToCrossEvent(event, true);
            
      // Tomamos el nombre del evento.
      var type = event.type;
      
      switch(type){
        case "touchstart":
            // Solamente tenemos en cuenta el primer toque
            touchInicioX = event.touches[0].clientX;
            break;
        
        // Vamos guardando la última posición del 
        // primer punto de contacto sobre el elemento.
        case "touchmove":
            // Solamente tenemos en cuenta el primer toque
            touchFinalX = event.touches[0].clientX;
            break;
            
        // Al terminar el toque
        case "touchend":
            // Determinamos si se debe mostrar 
            // la foto previa o la próxima.
            var mostrar = touchFinalX >= touchInicioX ? 
                          mostrarProxima : mostrarPrevia;
            // Se ejecuta el método para mostrar la foto.
            mostrar(); 
            break;
      }
    }
    
    // Asignamos el escucha una vez que
    // se haya cargado la página.
    window.onload = function() {
        //Agregamos el escucha a la bajada de tecla
        addCrossListener(window, "keyup", detectarTecla, true);
        
        // Agregamos escucha a los botones
        var etiquetaNav = document.getElementById("navegacionPrincipal");
        addCrossListener(etiquetaNav, "click", 
                         escuchaDeClick, false);
        
        // Agregamos escuchas a los toques
        var foto = document.getElementById("foto");
        addCrossListener(foto, 'touchstart', onTouch);
        addCrossListener(foto, 'touchmove',  onTouch);
        addCrossListener(foto, 'touchend',   onTouch);
        
        logTag = document.getElementById("log");
        
        // Mostramos la primer foto
        mostrarFotoPorIndex();
    }
    
})();