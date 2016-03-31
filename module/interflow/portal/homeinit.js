var scrheight = 0;
var scrtop = 0;
var lazyload = 0;
var funcobj = {};
$(document).ready(function(){
	var h = $(window).height();

	var keyDivObj = $("div[key]") ;
	var keyDivLen = keyDivObj == null ? 0 : keyDivObj.length ; 
	
	$.each(keyDivObj,function(n,dObj){
		if($(this).attr("key")){
			
		var fsize = $(this).attr("formatsize");	
		var divheight = $(window).height();
		if(fsize=='ONEXONE') divheight = divheight/2;
		else divheight += 5;
		$(this).css("height",divheight);
			
		if($(this).attr("layy")==1){		
			$(this).attr("laypos",parseInt($(this).attr("layy")));
		}else{
			$(this).attr("laypos",parseInt($(this).prev().attr("laypos"))+($(this).prev().attr("formatsize")=='ONEXONE'?1:2));
		}
		}
	});
	//$(window.document).find('body').css({overflow:"hidden"}); 
	$.each(keyDivObj,function(n,dObj){
		
		//if(window[$(this).attr("key")])
		//	window[$(this).attr("key")].initPage($(this),$("#"+$(this).attr("key")+"load"));
		//iframe生成方法
		if($(this).attr("key")&&$(this).attr("laypos")<=2){
			
			initiframe(this);
		}
		
		
	});

	$(document).scroll(function(){
		scrtop=$(this).scrollTop();//得到滚动条当前值，赋给top变量
		
		if(scrtop>0){
			if(lazyload==0){
				lazyload = 1;	
			$.each($("div[key]"),function(n,dObj){
							
				if($(this).attr("key")&&$(this).attr("laypos")>2){
					if(!$(obj).attr("isload"))
						initiframe(this);
					//$(this).find("div[innertab]").show();
				}
			});
			$(document).unbind("scroll");
			}
		}
	});
	
	/*setTimeout(function(){
		
		$.each($("div[key]"),function(n,dObj){
			
			if($(this).attr("key")&&$(this).attr("laypos")>2){
				if(!$(obj).attr("isload"))
					initiframe(this);
			}
		});
		showscroll();
	},500);*/
	
	
});

function initiframe(obj){
	$(obj).attr("isload",'yes');
	var fsize = $(obj).attr("formatsize");	
	var divheight = $(window).height();
	if(fsize=='ONEXONE') divheight = divheight/2;
	else divheight += 5;
	
	var c = $('<div innertab="' + $(obj).attr("key")
			+ '" style="display:none;height:100%;" class="tabContent"></div>');
	var loading = $("<div style='text-align:center; margin-top:100px; height:100px;width: 100%; display:block;'><img src='"+getPath()+"/default/style/images/common/blueloading.gif' /></div>")
			.appendTo(c);
	var f = $('<iframe id="'
			+ $(obj).attr("key")
			+ 'Iframe" name="Open'
			+ $(obj).attr("key")
			+ '" style="width:100%;height:'+divheight+'px;" frameborder="0" marginheight="0" marginwidth="0" scrolling="no"></iframe>');
	f.appendTo(c);
	c.appendTo($(obj));
	
	c.css("display","block");
	$("#" + $(obj).attr("key") + 'Iframe').attr('src', getPath()+"/"+$(obj).attr("url") );
	f.bind('load', function() {
		loading.hide();	
		
		$(obj).attr("loadfinish",'yes');
		
	});
	
}

function showscroll(){
	if($("div[key]").length==$("div[loadfinish]").length){
		$(window.document).find('body').css({overflow:"auto"}); 
	}else{
	setTimeout('showscroll()',500);
	}
}

