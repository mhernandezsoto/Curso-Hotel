var pos = 0;
var intv;
var flippedElement;
var opcionesHoteles = [{opciones:[{opcion:'Cuarto individual'},{opcion:'Alberca privada'},
					{opcion:'Tina de hidromasajes'}], costo:'USD300', paquete:'Bronze Pack'},{opciones:[{opcion:'Cuarto individual'},
					{opcion:'Alberca privada'},
					{opcion:'Jacuzzi con burbujas'}], costo:'USD500', paquete:'Silver Pack'},{opciones:[{opcion:'Cuarto individual'},
					{opcion:'Alberca privada'},{opcion:'Jacuzzi'}], costo:'USD1000', paquete:'Gold Pack'}];
$(document).on('ready',function(){
	init();
});
$(window).on('resize', init);
window.addEventListener('orientationchange', init);
function init(){
	if($('html').width() >900){
		$.stellar({
			'horizontalScrolling': false,
			hideDistantElements: false
		});	
	}
	
	var sc = $.scrollorama({blocks:'.fullScreen', enablePin: false});
	sc.animate('.mensajePrincipal',{delay:650,duration:1100,property:'top',end:650});
	sc.animate('.mensajePrincipal',{delay:1100,duration:1650,property:'opacity',end:0});
	sc.animate('.precio',{delay:110,duration:660,property:'zoom',start:0.5,end:1});
	sc.animate('.centerCircle',{delay:110,duration:990,property:'opacity',start:0,end:1});
	sc.animate('#google_canvas',{delay:330,duration:660,property:'opacity',start:0,end:1});
	$('#navegacionPrincipal').localScroll();
	$('.slider_controls li').on('click',handleClick);
	var width = $('.slider_container').width();

	$('.slide').each(function(i,e){
		addBackground(e,width,true);
	});
	$('.image_food').on('click',changeViewport);
	$('.image_food').each(function(i,e){
		addBackground(e,false);
		if($(e).hasClass('viewport')) return true;
		$(e).data('top',((i)*100));
		$(e).css({
			'top': $(e).data('top')+'px'
		});
	});
	$(document).on('click','.ver-mas',flipElement);

	intv = setInterval(handleClick,10000);
}
google.maps.event.addDomListener(window, 'load', drawMap);
function drawMap(){
	var mapa;
	var opcionesMapa = {
		zoom: 15,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	mapa = new google.maps.Map(document.getElementById('google_canvas'), opcionesMapa);
	navigator.geolocation.getCurrentPosition(function(posicion) {
		var geolocalizacion = new google.maps.LatLng(posicion.coords.latitude, posicion.coords.longitude);

		mapa.setCenter(geolocalizacion);
	});
}
function changeViewport(){
	var e = $('.viewport');
	e.css('top',$(e).data('top'));
	e.removeClass('viewport');
	$(this).addClass('viewport');
	$(this).css('top',0);
}
function addBackground(element,width,setSize){
	if(width) width = $('html').width();
	if(setSize){
		$(element).css({
			'width': width,
			'height': $('html').height()
		})
	}
	var imagen = $(element).data('background');
	if($('html').width() < 900) imagen = imagen+'-movil.jpg';
	else imagen = imagen+'.jpg';
	$(element).css('background-image',"url("+(imagen)+")");
	if($(element).height() > $(element).width()) $(element).css('background-size', 'auto 100%');
}
function flipElement(){
	if(flippedElement != null){$(flippedElement).revertFlip();flippedElement=null;}
	$(flippedElement).remove();
	var p = $(this).parent();
	flippedElement = p;
	$("#precioTemplate").template("CompiledTemplate");
	$(p).flip({
		direction:'rl',
		speed:500,
		content: $("#precioTemplate").tmpl(opcionesHoteles[$(this).data('number')]).html(),
		color:'#f7f7f7',
		onEnd:function(){
			$('#regresar-ventana').on('click',function(){$(flippedElement).revertFlip();flippedElement=null;});

		}
	});		
}
function handleClick(){
	var slide_target = 0;
	if($(this).parent().hasClass('slider_controls')){
		slide_target = $(this).index();
		pos = slide_target;
		clearInterval(intv);
		intv = setInterval(handleClick,10000);
	}
	else{
		pos++;
		if(pos>=$('.slide').length){
			pos = 0;
		}
		slide_target = pos;
	}
	$('.slideContainer').fadeOut('slow',function(){
		$(this).animate({
			'margin-left':-(slide_target * $('.slider_container').width())+'px'
		},'slow',function(){
			$(this).fadeIn();
		});
	});
}