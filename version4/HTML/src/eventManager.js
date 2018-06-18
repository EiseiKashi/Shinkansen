var addCrossListener;
var removeCrossListener;

    
if (typeof window.addEventListener === 'function') {
  
    // Para versiones soportadas por W3C
    this.addCrossListener = function (element, type, listener, isCapture) {
                                isCapture === undefined ? false : isCapture;
                                element.addEventListener(type, listener, isCapture);
                            };
    
    this.removeCrossListener = function (element, type, listener, isCapture) {
                                  isCapture === undefined ? false : isCapture;
                                  element.removeEventListener(type, listener, isCapture);
                              };

} else if (typeof document.attachEvent === 'function') {
  
    // Para versiones anteriores a IE 9
    this.addCrossListener = function (element, type, listener) {
                                element.attachEvent('on' + type, listener, isCapture);
                            };

    this.removeCrossListener = function (element, type, listener) {
                                element.detachEvent('on' + type, listener, isCapture);
                            };

} else { 
  
    // Como último recurso
    this.addCrossListener = function (element, type, listener) {
                                element['on' + type] = listener;
                            };

    this.removeCrossListener = function (element, type, listener) {
                                element['on' + type] = null;
                            };
}

function convertToCrossEvent(event, isPrevenDefault, isCancel) {
    // Obtenemos la referencia al evento
    event  = event        || window.event;
    
    // Obtenemos la referencia a la referencia y
    // sobrescribimos la propiedad target en el evento
    target = event.target || evt.srcElement;
    event.target = target.nodeType == 3 ? target.parentNode : target;
    
    // Creamos el método preventDefault en caso que no exista
    if (undefined === event.preventDefault) {
        event.preventDefault = function() {
            this.returnValue = false;
        }
    }
    
    // Creamos el método cancelBubble en caso que no exista
    if (undefined === event.stopPropagation) {
         event.stopPropagation = function() {
            // Para versiones menores a IE 9
            this.cancelBubble = true;
         }
    }
    
    if (isPrevenDefault) {
      event.preventDefault();
    }
    
    if (isCancel) {
      event.stopPropagation();
    }
    
}