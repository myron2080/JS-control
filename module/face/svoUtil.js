function closeOutBorder($em,isclose){
	var offset=$em.offset();
	var em_left=offset.left;
	var em_top=offset.top;
	var em_width=$em.width();
	var em_height=$em.height();
	var em_bottom=em_top+em_height;
	var em_right=em_left+em_width;
	//$em.attr('show','no');
	var show=$em.attr('show');
	if(show!='yes') $em.attr('no');
	$('html').unbind('click').click(function(e){
		show=$em.attr('show');
		//alert(em_left+'-'+em_right+'-'+em_top+'-'+em_bottom+'*'+e.pageX+'*'+e.pageY+'-'+show);
		if(em_left>e.pageX||e.pageX>em_right||e.pageY<em_top||e.pageY>em_bottom){
			if(show=='no') {
				if(isclose=="" || isclose==undefined){
					$em.attr('show','yes');
					$em.hide();
					$('html').unbind('click');
				}
			}else{
				$em.attr('show','no');
				//alert(1+$em.attr('show'));
			}
		}else{
			$em.attr('show','no');
			//alert(2+$em.attr('show'));
		}
	});
}

function closeOutBorderByBlur($em){
	$em.attr('tabindex','0').focus().blur(function(){
		$(this).hide();
	});
}

function toTop($top,classStr){
	$top.unbind('click').click(function(){
		$('.'+classStr).unbind('animate').animate({scrollTop:0},500);
	})
	
	$top.unbind('mouseover').mouseover(function(){
		//$(this).css('background','url("'+ctx+'/themes/default/images/icons/top_on.gif") no-repeat');
		$(this).find('img').attr('src',ctx+'/themes/default/images/icons/top_out.gif');
		//alert($(this).attr('style'));
		//background: url("http://a.xnimg.cn/imgpro/arrow/btt.png") no-repeat scroll 8px -57px #666666;
	})
	$top.unbind('mouseout').mouseout(function(){
		$(this).find('img').attr('src',ctx+'/themes/default/images/icons/top_on.gif');
	});
}
//jQuery.fn.extend({  
//    propertychange: function(fn) {  
//        if (!+ [1, ] != true) {  
//            $(this).get(0).addEventListener("input", fn, false)  
//        }  
//        $(this).bind("propertychange", fn);  
//        return this  
//    }  
//});