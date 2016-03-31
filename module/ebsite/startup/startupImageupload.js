
var upload;
var uploadImages = {};
var gardenId="";
$(document).ready(function(){
	//initUploadImage("logoPathBtn","logPath");
	
	//实现多图上传功能
	 //initUploadImage("BTN_PIC4GOODS","PIC4GOODS");
	 //initUploadImage("BTN_PIC4ACTIVITY","PIC4ACTIVITY");
});

function deletePhoto(obj){
	$(obj).parent().remove();
	/*art.dialog.confirm('确定删除?',function(){
		$.post(getPath() + '/ebbase/goods/deleteImageByPath',{id:id},function(res){
			if(res.STATE=="SUCCESS"){
				$('#'+id).remove();
				art.dialog.tips("删除成功!",null,"succeed");
			}else if(res.STATE=="ERROR"){
				art.dialog.tips("图已经被设置,不能删除!");
			}else{
				art.dialog.tips("删除失败!");
			}
		},'json');
	});*/
}

/*function deletePhoto(id,uploadType){
	art.dialog.confirm('确定删除?',function(){
		$.post(getPath() + '/lunch/dishes/deleteProjectImage',{id:id},function(res){
			if(res.STATE=="SUCCESS"){
				$('#'+id).remove();
				art.dialog.tips("删除成功!",null,"succeed");
			}else if(res.STATE=="ERROR"){
				art.dialog.tips("图已经被设置,不能删除!");
			}else{
				art.dialog.tips("删除失败!");
			}
		},'json');
	});
}*/

//显示图片详细信息
function showImgInfo(obj){
	$("#showInfoDiv").html("");
	//图片的上方距离
	var X = $(obj).offset().top;
	//图片的左方距离
	var Y = $(obj).offset().left;
	var width_div=$(window).width();
	var height_div=$(window).height();
	//div的宽度
	var imgInfo_width=$("#showInfoDiv").width();
	//div的高度
	var imgInfo_height=$("#showInfoDiv").height();
	var y_width=0;
	var x_height=0;
	var imgSrc=$(obj).attr("src");
	//图片加上显示图片详细信息层的宽度大于当前弹出层的宽度
	if((Y+imgInfo_width)>width_div){
		y_width=Y-70;
	}else{
		y_width=Y;
	}
	//图片加上显示图片详细信息层的宽度大于当前弹出层的高度
	/*if((X+imgInfo_height)>height_div){
		x_height=X-150;
	}else{
		x_height=X;
	}*/
	var id=$(obj).attr("id");
	//alert($(window).height());
	$("#showInfoDiv").css({left:y_width,top:X+100});
	$.post(getPath() + '/broker/room/showImageInfo',{id:id},function(res){
		var imgInfoStr="";
		$("#showInfoDiv").html("");
		if(res.imageInfo){
			imgInfoStr+="<span>"+res.imageInfo.name+"</span><br>";
			if(res.imageInfo.upLoadPerson.userName&&res.imageInfo.upLoadPerson.phone&&res.upLoadTime){
				imgInfoStr+="<span>上传人:"+res.imageInfo.upLoadPerson.userName+"</span>&nbsp;&nbsp;<span>电话:"+res.imageInfo.upLoadPerson.phone+"</span>"+"<br><span>上传时间:"+res.upLoadTime+"</span>"
			}
			$("#showInfoDiv").html(imgInfoStr);
			$("#showInfoDiv").show();
		}
	},'json');
}
//隐藏div
function hideImgDiv(){
	$("#showInfoDiv").hide();
}
//显示原图
function viewLargePhoto(path){
	window.open(path,'_blank','top=0,left=0,scrollbars=yes,resizable=true,toolbar=no,location=no');//,height='+screen.height+',width='+screen.width);
}

function getFormatPercent(value){
	value += "";
	var re = /([0-9]+\.[0-9]{2})[0-9]*/;
	return value.replace(re,"$1");
}

//上传组件

function uploadImage(button_id,type){
	new AjaxUpload($("#"+button_id), {
    	action:getPath() + '/ebsite/startup/compressUpload?direct=ebsite/images',
        autoSubmit: true,
        name: "image",
        responseType: "json",
        onSubmit: function(file, extension){
            if (extension && /^(jpg|png|gif)$/.test(extension)) {
            }
            else {
                alert("只允许上传jpg|png|gif图片");
                return false;
            }
        },
        onComplete: function(file, res){   
			if(res.STATE == "SUCCESS"){
				var showPath = base+'/images/'+res.PATH.replace("size","120X119");
				var width=res.WIDTH;
				var height=res.HEIGHT;
				var deviceSize=$("#"+button_id).parent().parent().prev().find("input").attr("value");
				var size=res.SIZE;
				//当前获取图片的宽度
				//uploadimagewidth
				//uploadimageheight
				//alert($("#"+type).parent().parent().next().html());
				$("#"+type).parent().parent().next().find("#uploadimagewidth").attr("value",width);
				$("#"+type).parent().parent().next().find("#uploadimageheight").attr("value",height);
				$("#uploadimagewidth").attr("value",width);
				$("#uploadimageheight").attr("value",height);
				
				$("#"+type).parent().find("input").attr("value",base+'/images/'+res.PATH.replace("size","origin"));
				//var deviceSize=$("#"+button_id).parent().parent().prev().attr("value");
				if(deviceSize==null || deviceSize==""){
					alert("请选择机型！");
					return;
				}
				var px=deviceSize.split("*");
				var pageWidth=px[0];
				var pageHight=px[1];
				if(width!= pageWidth){
					alert("当前图片尺寸："+width+"*"+height+",不符合规格！");
					return ;
				}else if(height!= pageHight){
					alert("当前图片尺寸："+width+"*"+height+",不符合规格！");
					return ;
				}
				//判定大小
				var currentSize=$("#"+type).parent().find("#deviceSizeFont").attr("value");
				if(size >= currentSize){
					alert("图片最大容量上限是："+currentSize+",请重新上传！");
					return ;
				}
				$("#"+type).attr("src",showPath);
			} else {
				art.dialog.alert(res.MSG);
			}
        }
	 });

}