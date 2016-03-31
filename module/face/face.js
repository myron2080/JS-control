function Face(id){
	this.ojb=$("#"+id);
	this.oid=id; 
	this.create()
}
//头像路径
var faceUrl=ctx+"/default/style/images/face/";
//定义头像数量
var faceNums=112;
Face.prototype.create =function(){
	var oid=this.oid;
	var my_face=$("body").find("[name=my_face_"+oid+"]");
	var msg="<style>.faceContent{width:392px; position:absolute;border:1px solid #aaa;border-top:none;display:;z-index:9999; text-align:center;padding:3px;padding-bottom:6px;background:#fff;} .faceContent a img{float:left;cursor:pointer;margin:1px 1px; border:#cacaca 1px solid}  .faceContent a:hover img{border:1px solid #f51d69}   #faceTitle{height:22px; width:36px; position:absolute; background:url("+faceUrl+"first.gif) no-repeat center center #fff;border:1px solid #aaa;border-bottom:none;'}</style>"
	msg+="<div show='yes' class='faceContent' id='faceContent_"+oid+"'></div>";
	if(my_face.length==0){
		var _div="<span name='my_face_"+oid+"'></span>";
		$("body").append($(_div).html(msg));
	}else{
		my_face.html(msg);
	}
	$("#faceContent_"+oid).html("");
	$("#faceContent_"+oid).hide();
	var _str="";
	for(var i=1;i<=faceNums;i++){
		var str=faceUrl+"F_"+i+".gif";
		_str+="<a href='javascript:void(0)'><img style='width:24px;height:24px' src="+str+" fn=[@F_"+i+"@] /></a>";
	}
	$("#faceContent_"+oid).html(_str);
}

Face.prototype.close=function(id){
	if(!id){
		$("#my_face_"+this.oid).html("");
	}else{
		$("#my_face_"+id).html("");
	}
}

function closeFaceCon(){
	
}

function findEmPosition($em){
	var offset=$em.offset();
	var em_left=offset.left;
	var em_top=offset.top;
	var em_width=$em.width();
	var em_height=$em.height();
	var em_bottom=em_top+em_height;
	var em_right=em_left+em_width;
	$('body').unbind('click').click(function(e){
		var show=$em.attr('show');
		//alert(em_left+'-'+em_right+'-'+em_top+'-'+em_bottom+'*'+e.pageX+'*'+e.pageY	);
		if(em_left>e.pageX||e.pageX>em_right||e.pageY<em_top||e.pageY>em_bottom){
			if(show=='no') {
				$em.attr('show','yes');
				$em.hide();
				//$('body').unbind('click');
			}else{
				$em.attr('show','no');
			}
		}
	})
}

function removeFace(id){
	$("#faceContent_"+id).hide();
	$("#my_face_"+id).html("");
}

//控制表情区位置
Face.prototype.show=function(){	
	var O=this.ojb;
	var oid=this.oid;
	var top=O.offset().top;
	var left=O.offset().left;
	var h=O.height();
	var ow=$(O).width();
	if(ow<403){
		left-=398-ow;
	}
	$("#faceContent_"+oid).css("top",(top+h)+"px").css("left",left+"px").show();
	$("#faceContent_"+oid+" img").unbind("click").bind("click",function(){
		var _v=O.val();
		_v+=$(this).attr("fn");
		O.val(_v);
		$("#faceContent_"+oid).hide();
	});
	closeOutBorder($("#faceContent_"+oid));
	return $("#faceContent_"+oid);
}
//重新显示
function reShow(id){
	var O=$("#"+id);
	var top=O.offset().top;
	var left=O.offset().left;
	var h=O.height();
	$("#faceContent_"+id).css("top",(top+h)+"px").css("left",left+"px");
}

//替换页面中的表情代码为图片
function convertImg(val){
	if(isNotNull(val)){
		return val.replace(/\[@/g, "<img src="+faceUrl+"").replace(/\@]/g, ".gif />");
	}
	return '';
}

var $obj=null;
function show(id){
	$obj=new Face(id).show();
	$('#user_list').hide();
	$('#user_list').attr('show','no');
}



function convert2face(_basePath,data){
	var face ={"[炸弹]":"<img src='"+_basePath+"/default/style/images/face/wechat_boom.png'/>",
			"[强]":"<img src='"+_basePath+"/default/style/images/face/wechat_qiang.png'/>",
			"[太阳]":"<img src='"+_basePath+"/default/style/images/face/wechat_sun.png'/>",
			"[闪电]":"<img src='"+_basePath+"/default/style/images/face/wechat_shandian.png'/>",
			"[飞机]":"<img src='"+_basePath+"/default/style/images/face/wechat_fj.png'/>",
			"[偷笑]":"<img src='"+_basePath+"/default/style/images/face/F_14.gif'/>",
			"[龇牙]":"<img src='"+_basePath+"/default/style/images/face/F_10.gif'/>",
			"[菜刀]":"<img src='"+_basePath+"/default/style/images/face/caidao.gif'/>",
			"[抱拳]":"<img src='"+_basePath+"/default/style/images/face/peifu.gif'/>",
			"[鼓掌]":"<img src='"+_basePath+"/default/style/images/face/F_25.gif'/>",
			"[色]":"<img src='"+_basePath+"/default/style/images/face/F_3.gif'/>",
			"[怄火]":"<img src='"+_basePath+"/default/style/images/face/F_9.gif'/>",
			"[勾引]":"<img src='"+_basePath+"/default/style/images/face/gouyin.gif'/>",
			"[喝彩]":"<img src='"+_basePath+"/default/style/images/face/wechat_hc.png'/>"
			
	}; 
	var reg = /\[.+?\]/g; 
	var str = data+''; //这里是获取到的文本域的value，简洁起见，直接使用了字符串。 
	str = str.replace(reg,function(a,b){ 
    var  _img = face[a];
    if(typeof(_img) == "undefined")
    return a;
    else
	return _img; 
	}); 
    return str;
}
