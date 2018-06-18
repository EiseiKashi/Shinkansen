// Copyright (c) 2013 Admotion

var collapseTimeoutId, expandTimeoutId;

var config = {};

var setConfig = function(param, defaultValue){
	config[param] = (typeof(adConfig) !== "undefined" && typeof(adConfig[param]) !== "undefined") ? adConfig[param] : defaultValue;
};

setConfig("expandedWidth", "100%");
setConfig("expandedHeight", "100%");
setConfig("autoScale", true);


//LoaderFix
(function (){
	$("#LoadingSection").css("width",config.collapsedWidth);
	$("#LoadingSection").css("height", config.collapsedHeight);
})();

/**
* This method it's called by HTMLCreative when it is ready.
**/
window.admReady = function() {
 	$('#LoadingSection').hide();
	$('#ExpandedState').show();
	$('#InpageSection').show();

	makeUnselectable($('#ExpandedState'));

	$(document).trigger('adm_initializeAd');

	setFormatSize();
	doResize();
};

/**
* Initiates the ad's size propieties.
**/
function setFormatSize (){
	$('#ExpandedState').css("width",config.expandedWidth);
	$('#ExpandedState').css("height", config.expandedHeight);
}

/**
* Initiates the ad's contraction.
**/
function doRemove(isInteractive) {
	HTMLCreative.remove();

    if(isInteractive){
        HTMLCreative.reportCloseOnUserInitiated();
    }else{
        HTMLCreative.reportAutomaticClose();
    }
}

/**
* Resize
**/
function doResize(){
	var fContainerWidth  = parseInt($('#ExpandedState_Container').outerWidth());
	var fContainerHeight = parseInt($('#ExpandedState_Container').outerHeight());
	var wWidth  = $(window).width();
	var wHeight = $(window).height();
	var ratio   = wWidth / wHeight;
	var adRatio = fContainerWidth/fContainerHeight;
	var percent = ratio >= adRatio  ? (wHeight / fContainerHeight) : (wWidth / fContainerWidth);
		percent = config.autoScale ? percent : 1;


		$("#InpageSection").width(wWidth);
		$("#InpageSection").height(wHeight);
		$("#ExpandedState").width(wWidth);
		$("#ExpandedState").height(wHeight);

        $('#ExpandedState_Container').css({
            position: 'absolute',
            transform: 'scale(' + percent + ',' + percent + ')',
            left: (wWidth - fContainerWidth) / 2,
            top: (wHeight - fContainerHeight) / 2
        });

	$(document).trigger('adm_resize');
}

$(window).resize(function() {
	doResize();
});

/**
*
**/
function makeUnselectable ( $target ) {
	$target
		.addClass( 'unselectable' ) // All these attributes are inheritable
		.attr( 'unselectable', 'on' ) // For IE9 - This property is not inherited, needs to be placed onto everything
		.attr( 'draggable', 'false' ) // For moz and webkit, although Firefox 16 ignores this when -moz-user-select: none; is set, it's like these properties are mutually exclusive, seems to be a bug.
		.on( 'dragstart', function() { return false; } );  // Needed since Firefox 16 seems to ingore the 'draggable' attribute we just applied above when '-moz-user-select: none' is applied to the CSS 

	$target // Apply non-inheritable properties to the child elements
		.find( '*' )
		.attr( 'draggable', 'false' )
		.attr( 'unselectable', 'on' ); 
};

