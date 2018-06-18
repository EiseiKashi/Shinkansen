// Copyright (c) 2013 Admotion

function setButtonHandlers(){
	$('.adButton').click(function () {
		HTMLCreative.clickThrough();
	});
	$(".collapser").click(function () {
		doRemove(true);
	});	
}

function reDraw(){
	
}

$(document).on('adm_initializeAd', function(){
	setButtonHandlers();
	document.getElementById("ExpandedState_Container").style.position = "relative"; 
	
	ADMCamera.setViewPortX(800);
	ADMCamera.setViewPortY(600);
	ADMCamera.setOffsetX(400);
	ADMCamera.setOffsetY(300);
	var fracc        = 100;
	var topX         = -fracc * 4;
	var totalColumns = 5;
	var totalRows    = 2;
	var rows         = 0;
	var columns      = 0;
	var index        = 0;
	while(columns < totalColumns) {
		rows = 0;
		while (rows < totalRows) {
			view                = document.getElementById("imagen" + index);
			view.style.position = "absolute";
			view.style.top      = rows * fracc;
			view.style.left     = topX;
			view.style.width    = "100px";
			view.style.height   = "100px";
			ADMCamera.addItem(view, topX, 0, rows * fracc);
			index++
			rows ++;
		}
		topX += fracc;
		columns++;
	}
	ADMCamera.setCameraX(-300);
	ADMCamera.setCameraY(65);
	ADMCamera.setCameraZ(-150);
	ADMCamera.setRadian(0.1);
});

$(document).on('adm_resize', function(){
	reDraw();
});