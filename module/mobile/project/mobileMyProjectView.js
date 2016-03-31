$(document).ready(function(){
	$("#backBtn").bind("click",function(){
		  window.location.href = base+"/weixinapi/mobile/myProject/listView";
	});
	$("#share").bind("click",function(){
		shareTo()
	});
	$("#toMap").bind("click",function(){
		viewMap();
	});
	
});
function shareTo(){
	var title=$("#registerName").html();
	var content=$("#promoteOne").html();
	var url=window.location.href+"&dataCenter="+dataCenter+"&share=share&currentId="+currentId;
	var imgSrc=$("#showImage_firt").attr("src");
	window.shareUtil.baiduShare(title,content,url,imgSrc);
}
//显示加载器  
function showLoader() {  
    //显示加载器.for jQuery Mobile 1.2.0  
    $.mobile.loading('show', {  
        text: '加载中...', //加载器中显示的文字  
        textVisible: true, //是否显示文字  
        theme: 'b',        //加载器主题样式a-e  
        textonly: false,   //是否只显示文字  
        html: ""           //要显示的html内容，如图片等  
    });}

function viewMap(){
	//showLoader();
	setTimeout(function(){
	//$.mobile.loading( "hide" );
	 window.location.href = base+"/weixinapi/mobile/myProject/toMapMarker?id="+$("#dataId").val();
	},500);
}