var icon_count = 0;
var photo = $('<div id="zoomphoto" style="border:1px solid #555; padding:10px; background-color:#fff; -webkit-box-shadow:0px 0px 30px #666; display:none;"></div>');
photo.css('position', 'absolute');
photo.css('z-index', -100000);
$('body').append(photo);

var original_size = {width:0, height:0};
var padding = 10;
var loadingimage_class = "loadingimage";

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
	e.stopPropagation();
	var size_position = getPhotoSizePosition(e);
	if(photo.children().length == 0) {
		return;
	}else if(photo.children().length >= 1){
		showPhoto(size_position);
	}
	photo.css({'top': size_position.y , 'left': size_position.x});
	if(photo.find('.'+loadingimage_class).length >= 1) {
		photo.css({'width': '16px',
				'height': '16px'});
	} else {
		photo.css({'width': size_position.width , 
				'height': size_position.height});
	}
};


var showPhoto = function(pos_size) {
	if(photo.children().length == 0) return;
	if(photo.children().length > 1) photo.find('img:last-child').siblings().remove();
	photo.css('z-index', 100000);
	photo.css('display', 'block');
	photo.css('top', pos_size.y);
	photo.css('left', pos_size.x);
	photo.css('width', pos_size.width);
	photo.css('height', pos_size.height);
}

var zoomPhoto = function(e) {
	e.stopPropagation();
	if(photo.children().length >= 1) {
		return;
	}
	var pos = getMousePosition(e);
	var href = $(this).attr('href');
	photo.append('<img class="' + loadingimage_class + '" src="http://me2day.net/images/indicator_snake.gif">');
	showPhoto({x : pos.y, y : pos.y, width : '16px', height : '16px'});

	if(!href) {
		removePhoto(e);
		return;
	}

	$.get(href, function(data){
		var img = $(data).find('img:last');
		
		img.load(function(){
			photo.children().remove();
			photo.append(img);
			if(img.width() + img.height() == 0) {
				removePhoto(e);
				return;
			}

			original_size.width = img.width() + padding*2;
			original_size.height = img.height() + padding*2;

			photo.css({
				'width': original_size.width,
				'height': original_size.height
				});
			img.css({
				'width':'100%',
				'height': '100%'
				});

			var size_position = getPhotoSizePosition(e);
			showPhoto(size_position);
		});
	});
};

var removePhoto = function(e) {
	e.stopPropagation();
	photo.css('width', 0);
	photo.css('height', 0);
	photo.css('top', 0);
	photo.css('left', 0);
	photo.css('z-index', -100000);
	photo.css('display', 'none');
	photo.children().remove();
	original_size = {width:0, height:0};
};

var showNameText = function(e) {
	$(this).parent().find('.friend_text').show();
};

var hideNameText = function(e) {
	$(this).parent().find('.friend_text').hide();
};

var deleteProfile = function() {
	$('.sec_post:not(.arranged)')
	.addClass('arranged')
		.find('.post_section')
		.css({
			'margin-left' : '15px',
			'margin-top' : '12px'
		}).end()
		.find('.profile_master')
		.css({
			'margin-top' : '0px',
			'height' : '19px'
		})
			.find('.friend_text').siblings().remove();
};

var arrangeIcon = function(sec_post) {
	
};

var disableDiscoveryView = function() {
	$('.sec_post .discovery').removeClass('discovery');
}

var registryZoomEvent = function() {
	var iconlist = $('.icons_slt a.icons_link');
	photo.mousemove(movePhoto); 
	iconlist.live('mouseover',zoomPhoto)
			.live('mouseenter',zoomPhoto)
			.live('mousemove',movePhoto)
			.live('mouseleave',removePhoto)
			.live('mouseout',removePhoto); 
	$(document).mousemove(removePhoto);

	// 나중에 쓸꺼임
	//disableDiscoveryView();
	//deleteProfile();

	$('.profile_master .action_link, .image_box').live('mouseover', hideNameText)
					.live('mouseleave', showNameText);
};

var init = function() {
	registryZoomEvent();
}

init();
