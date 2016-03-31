var scrheight = 0;
var scrtop = 0;
var lazyload = 0;
var funcobj = {};
var iframeary = [];
var iframeobj = {};
$(document).ready(function(){
	var h = $(window).height();

	var keyDivObj = $("div[key]") ;
	var keyDivLen = keyDivObj == null ? 0 : keyDivObj.length ; 
	
	$.each(keyDivObj,function(n,dObj){
		if($(this).attr("key")){
			
		var divheight = $(window).height();
		
		//初始化第一个	
		//if($(this).attr("layy")==1){					
			initiframe(this);
		//}
		
		}
	});	
	
	//window.bind("scroll",loadinit);
	//window.bind("resize",loadinit);
	//loadinit();
});

function initiframe(obj){
	$(obj).attr("isload",'yes');
	
	var c = $('<div innertab="' + $(obj).attr("key")
			+ '" style="display:none;height:100%;" class="tabContent"></div>');
	
	var contentdiv = $("<div key='content'></div>").appendTo(c);
	c.appendTo($(obj));
	
	c.css("display","block");
	
		
	c.find("div[key='content']").load(getPath()+"/"+$(obj).attr("url"),{},function(){
		$(this).attr("loadheight",$(this).height());
	});
		

	
}

function loadinit(){
	//下拉条当前位置
	var iScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	//窗口高度
	var iClientHeight = document.documentElement.clientHeight + iScrollTop;
	var i = 0;
	var aParent = [];
	//li元素
	var oParent = null;
	var iTop = 0;
	var iBottom = 0;
	//获得尚未加载的
	var aNotLoaded = this.loaded(0);
	
	//当前加载和总加载
	if(loaded(1).length != $("div[key]").length) {
		for(i = 0; i < aNotLoaded.length; i++) {
			oParent = aNotLoaded[i].parentElement || aNotLoaded[i].parentNode;
			iTop = fgm.pageY(oParent);
			iBottom = iTop + oParent.offsetHeight;
			//判断位置是否需要更新src
			if((iTop > iScrollTop && iTop < iClientHeight) || (iBottom > iScrollTop && iBottom < iClientHeight)) {
				initiframe(aNotLoaded[i]);
			}
			
		}
	}
}

function loaded(status){
	var keyDivObj = $("div[key]") ;
	var array = [];
	$.each(keyDivObj,function(i,item){
		if(status==1&&$(item).attr("isload")=="yes"){
			array.push(item);
		}
		if(status==0&&(!$(item).attr("isload"))){
			array.push(item);
		}
	});
	return array;
}

var fgm = {
		on: function(element, type, handler) {
			return element.addEventListener ? element.addEventListener(type, handler, false) : element.attachEvent("on" + type, handler)
		},
		bind: function(object, handler) {
			return function() {
				return handler.apply(object, arguments)	
			}
		},
		pageX: function(element) {
			return element.offsetLeft + (element.offsetParent ? arguments.callee(element.offsetParent) : 0)
		},
		pageY: function(element) {
			return element.offsetTop + (element.offsetParent ? arguments.callee(element.offsetParent) : 0)	
		},
		hasClass: function(element, className) {
			return new RegExp("(^|\\s)" + className + "(\\s|$)").test(element.className)
		},
		attr: function(element, attr, value) {
			if(arguments.length == 2) {
				return element.attributes[attr] ? element.attributes[attr].nodeValue : undefined
			}
			else if(arguments.length == 3) {
				element.setAttribute(attr, value)
			}
		}
	};