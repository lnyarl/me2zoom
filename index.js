icon_count = 0;
var photo = $('<div id="zoomphoto" style="border:1px solid #555; padding:10px; background-color:#fff; -webkit-box-shadow:0px 0px 30px #666; display:none;"></div>');
photo.css('position', 'absolute');
photo.css('z-index', -100000);
$('body').append(photo);

original_size = {width:0, height:0};
padding = 10;
loadingimage_class = "loadingimage";

var getMousePosition = function(e) {
	var posx = 0;
	var posy = 0;
	if (e.pageX || e.pageY) 	{
		posx = e.pageX;
		posy = e.pageY;
	} else if (e.clientX || e.clientY) 	{
		posx = e.clientX + document.body.scrollLeft
			+ document.documentElement.scrollLeft;
		posy = e.clientY + document.body.scrollTop
			+ document.documentElement.scrollTop;
	}

	return {x : posx, y: posy};
}

var getPhotoSizePosition = function(e) {
	var pos = getMousePosition(e);
	var width = original_size.width, height = original_size.height;
	var x = pos.x, y = pos.y;
	var ratio = 1;
	if( width + padding*4 > $(window).width() - x ) {
		width = $(window).width() - e.clientX - padding*4;
		ratio = width / original_size.width;
		height = original_size.height * ratio;
	}
	if( height + padding*4 > $(window).height() ) {
		height = $(window).height() - padding*4;
		ratio = height / original_size.height;
		width = original_size.width * ratio;
	}
	y = y - height/2;
	x = x + padding;
	if( document.body.scrollTop > y - padding ) {
		y = document.body.scrollTop + padding;
	}
	if( document.body.scrollTop + $(window).height() < y + height + padding*3 ) {
		y = document.body.scrollTop + $(window).height() - height - padding*3;
	} 

	return {x:x ,y:y, width:width, height:height};
};

var movePhoto = function(e){
	var size_position = getPhotoSizePosition(e);
	photo.css({'top': size_position.y , 'left': size_position.x});
	if(photo.find('.'+loadingimage_class).length >= 1) {
		photo.css({'width': '16px',
				'height': '16px'});
	} else {
		photo.css({'width': size_position.width , 
				'height': size_position.height});
	}
};

var zoomPhoto = function(e) {
	console.log(e);
	if(photo.children().length >= 1) return;
	var pos = getMousePosition(e);
	var href = $(this).attr('href');
	photo.append('<img class="' + loadingimage_class + '" src="http://me2day.net/images/indicator_snake.gif">');
	photo.css('top', pos.y);
	photo.css('left', pos.x);
	photo.css('width', '16px');
	photo.css('height', '16px');
	photo.css('z-index', 100000);
	photo.css('display', 'block');
	$.get(href, function(data){
		//var innerhref = $(data).find('div a').attr('href');
		//if(!innerhref || innerhref == "") return;
		var img = $(data).find('div a img');//$('<img />');
		//img.attr('src', innerhref);

		img.load(function(){
			photo.children().remove();
			photo.append(img);
			original_size.width = img.width() + padding*2;
			original_size.height = img.height() + padding*2;
			photo.css('width', original_size.width);
			photo.css('height', original_size.height);
			img.css('width', '100%');
			img.css('height', '100%');
			var size_position = getPhotoSizePosition(e);
			photo.css({'top': size_position.y, 
					'left': size_position.x});
			photo.css({'width': size_position.width,
					'height': size_position.height});
		});
	});
};

var removePhoto = function(e) {
	photo.css('width', 0);
	photo.css('height', 0);
	photo.css('top', 0);
	photo.css('left', 0);
	photo.css('z-index', -100000);
	photo.css('display', 'none');
	photo.children().remove();
	original_size = {width:0, height:0};
};

hideNameText = function(e) {
	$(this).parent().find('.friend_text').hide();
};

showNameText = function(e) {
	$(this).parent().find('.friend_text').show();
};

var registryZoomEvent = function(){
	var iconlist = $('.icons_slt a.icons_link:has(.me2photo)');
	photo.mousemove(movePhoto); 
	iconlist.live('mouseover',zoomPhoto)
			.live('mousemove',movePhoto)
			.live('mouseleave',removePhoto); 
	$(document).mouseenter(removePhoto); 

	$('.profile_master .action_link').live('mouseover', hideNameText)
					.live('mouseleave', showNameText);
	$('.profile_master .image_box').live('mouseover', hideNameText)
					.live('mouseleave', showNameText);
}

var checkIconIncreasement = function(iconlist) {
	if(iconlist.length != icon_count) {
		icon_count = iconlist.length;
		return true;
	} else {
		return false;
	}
}

var init = function() {
	registryZoomEvent();

	var get_mystream_link = $("#get_mystream_link");
	get_mystream_link.click(function(){
		//registryZoomEvent();
		return false;
	});
}

init();
