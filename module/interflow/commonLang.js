/**
 * 常用语js,得到常用语
 * 
**/
var clary = new Array();
var typeNumber = 'zbcyy';
$.post(getPath()+"/basedata/basic/basicSupply/listData",{pageSize:50,currentPage:1,enableflag:1,typenumber:typeNumber},function(data){
	data = eval(data);
	for(var i=0;i<data.items.length;i++){
		clary.push(data.items[i].description);
	}
},"json");

function generateCY(){
	var s = "";
	for(var i=0;i<clary.length;i++){
		s += "<a href='javascript:void(0)' >"+clary[i]+"</a>";
		if(i<clary.length-1) s += "<br>";
	}
	return s;
}


function offenLang(obj,depcom,index,leftpos){
	if($("#creDiv").get(0)==null){
	$("<div id='creDiv' style='border:1px solid #aebdcd;background:#DBEEFF;width:400px; padding-left:5px; padding-bottom:5px;'>" +
			"<span style='color:red; float:right; border:1px solid #70a4d2; position:absolute; right:-22px; top:-1px; font-family:Arial; color:#ff0000; font-size:16px; cursor:pointer; background:#9cc4e8; width:20px; text-align:center' onclick=removeDiv('creDiv')>X</span>"+
			generateCY()+"</div>").appendTo($(obj).parent());
	$("#creDiv").focus();
	$("#creDiv").css("zIndex","1999");
	
	$("#creDiv").css("top",obj.offsetTop);
	$("#creDiv").css("left",obj.offsetLeft-leftpos);
	$("#creDiv").css("position","absolute");
	$("#creDiv").bind("blur",function(){
		//$("#creDiv").remove();
	}).bind("mouseup",function(){
		//$("#creDiv").remove();
	});
	
	$("#creDiv").find("a").each(function(i){
		$("#"+depcom+index).val("");
		$(this).bind("click",function(){
			$("#"+depcom+index).val($(this).html());
			$("#creDiv").remove();
		});
	});
	}
}


removeDiv = function(obj){
	$("#"+obj).remove();
}