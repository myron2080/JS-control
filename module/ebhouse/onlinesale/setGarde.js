var moreOperate;
$(document).ready(function(){
	//购物
	var initIndex = $("div[key='SHOPPING']").find("div[key='dataDetail']").length;
	moreOperate = new MoreOperate({
		id : "Operate",
		count : 100,
		initCount : 1,
		index : initIndex 
	},"SHOPPING");
	
	initIndex = $("div[key='FOOD']").find("div[key='dataDetail']").length;
	moreOperate1 = new MoreOperate1({
		id : "Operate",
		count : 100,
		initCount : 1,
		index : initIndex 
	},"FOOD");
	
	initIndex = $("div[key='TRAFFIC']").find("div[key='dataDetail']").length;
	moreOperate2 = new MoreOperate2({
		id : "Operate",
		count : 100,
		initCount : 1,
		index : initIndex 
	},"TRAFFIC");
	
	initIndex = $("div[key='OTHERS']").find("div[key='dataDetail']").length;
	moreOperate3 = new MoreOperate3({
		id : "Operate",
		count : 100,
		initCount : 1,
		index : initIndex 
	},"OTHERS");
	
	setTimeout(function(){
		var SHOPPING = $("#Operate").find("div[key='SHOPPING']");
		 SHOPPING.find("div[key='dataDetail']").each(function(idx,ele){
			 if(isNotNull($("#addImage_SHOPPING" + (idx + 1)).attr("id"))){
				 initUploadImage("addImage_SHOPPING" + (idx + 1),"SHOPPING","many","append_SHOPPING" + (idx + 1));
			 }
		 });
		 
		 var FOOD = $("#Operate").find("div[key='FOOD']");
		 FOOD.find("div[key='dataDetail']").each(function(idx,ele){
			 if(isNotNull($("#addImage_FOOD" + (idx + 1)).attr("id"))){ 
				 initUploadImage("addImage_FOOD" + (idx + 1),"FOOD","many","append_" + "FOOD" + (idx + 1));
			 }
		 });
		 
		 var TRAFFIC = $("#Operate").find("div[key='TRAFFIC']");
		 TRAFFIC.find("div[key='dataDetail']").each(function(idx,ele){
			 if(isNotNull($("#addImage_TRAFFIC" + (idx + 1)).attr("id"))){ 
				 initUploadImage("addImage_TRAFFIC" + (idx + 1),"TRAFFIC","many","append_" + "TRAFFIC" + (idx + 1));
			 }
		 });
		 
		 var OTHERS = $("#Operate").find("div[key='OTHERS']");
		 OTHERS.find("div[key='dataDetail']").each(function(idx,ele){
			 if(isNotNull($("#addImage_OTHERS" + (idx + 1)).attr("id"))){ 
				 initUploadImage("addImage_OTHERS" + (idx + 1),"OTHERS","many","append_" + "OTHERS" + (idx + 1));
			 }
		 });
	},1500);
	 $("#Operate").find("a[key='delOperate']").bind("click",function(){
		 var dataDetial = $(this).parent().parent().parent().parent();
		 $(this).parent().parent().parent().remove();
		 dataDetial.find("div[key='mark_pic']").remove();
		 dataDetial.hide();
		 dataDetial.attr("key","remove_dataDetial")
		 var id = $(this).attr("id");
		 if(isNotNull(id)){
			 $.post(getPath()+"/ebhouse/onlinesale/delGardeType",{id:id},'json');
		 }
//		 dataDetial.remove();
	 });
	 
	 $("a[key='mark-pic-del']").bind("click", function(){
		 $(this).parent().parent().remove();
	 });
});


function MoreOperate(config,gardeType){
	this.config = config;
	var operateObj = $("#" + config.id);
	var template = operateObj.find("div[key='template']");
	var content = operateObj.find("div[key='" + gardeType + "']");
	var idx = content.find("div[key='dataDetail']").length;
	// 添加内容
	_addContent = function() {
		var tempHtml = template.html();
		var templateObj = $(tempHtml).clone();
		// 绑定删除事件
		templateObj.find("a[key='delOperate']").click(function() {
			_removeContent($(this));
		});
		config.index ++;
		idx++;
		templateObj.find("input[name='desc_gardeType']").attr("name" ,"desc_" + gardeType + idx);
		templateObj.find("input[idx='append_gardeType']").attr("idx" ,"append_" + gardeType + idx);
		templateObj.find("div[id='gardeTypeTxt']").html("类别：");
		templateObj.find("div[id='gardeTypeTxt']").attr("id" ,"gardeTypeTxt" + idx);
		templateObj.find("input[name='gardeImage']").attr("name" ,"gardeImage_" + gardeType + idx).attr("idx", idx);
		templateObj.find("div[id='addImage_']").attr("id" ,"addImage_" + gardeType + idx);
		templateObj.find("div[key='append_div']").attr("id" ,"append_" + gardeType + idx);
		content.append(templateObj);
		initUploadImage("addImage_" + gardeType + idx,gardeType,"many","append_" + gardeType + idx);
	}
	// 删除内容
	_removeContent = function(obj) {
		var size = content.find("div[key='detail']").length;
		 var dataDetial = obj.parent().parent().parent().parent();
		 obj.parent().parent().parent().remove();
		 dataDetial.find("div[key='mark_pic']").remove();
		 dataDetial.hide();
		 dataDetial.attr("key","remove_dataDetial")
	}
	$("a[key='addType_" + gardeType + "']").bind("click", function() {
		var size = content.find("div[key='dataDetail']").length;
		if (config.count > size) {
			_addContent();
		} else {
			art.dialog.tips("最多只能添加 " + config.count + " 个!");
		}
	});
	if (config.initCount && config.initCount > 0) {
		var size = content.find("div[key='dataDetail']").length;
		for ( var i = size; i < config.initCount; i++) {
			_addContent();
		}
	}
}

function MoreOperate1(config,gardeType){
	this.config = config;
	var operateObj = $("#" + config.id);
	var template = operateObj.find("div[key='template']");
	var content = operateObj.find("div[key='" + gardeType + "']");
	var idx = content.find("div[key='dataDetail']").length;
	// 添加内容
	_addContent1 = function() {
		var tempHtml = template.html();
		var templateObj = $(tempHtml).clone();
		// 绑定删除事件
		templateObj.find("a[key='delOperate']").click(function() {
			_removeContent1($(this));
		});
		config.index ++;
		idx++;
		templateObj.find("input[name='desc_gardeType']").attr("name" ,"desc_" + gardeType + idx);
		templateObj.find("input[idx='append_gardeType']").attr("idx" ,"append_" + gardeType + idx);
		templateObj.find("div[id='gardeTypeTxt']").attr("id" ,"gardeTypeTxt" + idx);
		templateObj.find("div[id='gardeTypeTxt']").text("类别：")
		templateObj.find("input[name='gardeImage']").attr("name" ,"gardeImage_" + gardeType + idx).attr("idx", idx);
		templateObj.find("div[id='addImage_']").attr("id" ,"addImage_" + gardeType + idx);
		templateObj.find("div[key='append_div']").attr("id" ,"append_" + gardeType + idx);
		content.append(templateObj);
		initUploadImage("addImage_" + gardeType + idx,gardeType,"many","append_" + gardeType + idx);
	}
	// 删除内容
	_removeContent1 = function(obj) {
		var size = content.find("div[key='dataDetail']").length;
		 var dataDetial = obj.parent().parent().parent().parent();
		 obj.parent().parent().parent().remove();
		 dataDetial.find("div[key='mark_pic']").remove();
		 dataDetial.hide();
		 dataDetial.attr("key","remove_dataDetial")
	}
	$("a[key='addType_" + gardeType + "']").bind("click", function() {
		var size = content.find("div[key='dataDetail']").length;
		if (config.count > size) {
			_addContent1();
		} else {
			art.dialog.tips("最多只能添加 " + config.count + " 个!");
		}
	});
	if (config.initCount && config.initCount > 0) {
		var size = content.find("div[key='dataDetail']").length;
		for ( var i = size; i < config.initCount; i++) {
			_addContent1();
		}
	}
}

function MoreOperate2(config,gardeType){
	this.config = config;
	var operateObj = $("#" + config.id);
	var template = operateObj.find("div[key='template']");
	var content = operateObj.find("div[key='" + gardeType + "']");
	var idx = content.find("div[key='dataDetail']").length;
	// 添加内容
	_addContent2 = function() {
		var tempHtml = template.html();
		var templateObj = $(tempHtml).clone();
		// 绑定删除事件
		templateObj.find("a[key='delOperate']").click(function() {
			_removeContent2($(this));
		});
		config.index ++;
		idx++;
		templateObj.find("input[name='desc_gardeType']").attr("name" ,"desc_" + gardeType + idx);
		templateObj.find("input[idx='append_gardeType']").attr("idx" ,"append_" + gardeType + idx);
		templateObj.find("div[id='gardeTypeTxt']").attr("id" ,"gardeTypeTxt" + idx);
		templateObj.find("div[id='gardeTypeTxt']").text("类别：")
		templateObj.find("input[name='gardeImage']").attr("name" ,"gardeImage_" + gardeType + idx).attr("idx", idx);
		templateObj.find("div[id='addImage_']").attr("id" ,"addImage_" + gardeType + idx);
		templateObj.find("div[key='append_div']").attr("id" ,"append_" + gardeType + idx);
		content.append(templateObj);
		initUploadImage("addImage_" + gardeType + idx,gardeType,"many","append_" + gardeType + idx);
	}
	// 删除内容
	_removeContent2 = function(obj) {
		var size = content.find("div[key='dataDetail']").length;
		 var dataDetial = obj.parent().parent().parent().parent();
		 obj.parent().parent().parent().remove();
		 dataDetial.find("div[key='mark_pic']").remove();
		 dataDetial.hide();
		 dataDetial.attr("key","remove_dataDetial")
	}
	$("a[key='addType_" + gardeType + "']").bind("click", function() {
		var size = content.find("div[key='dataDetail']").length;
		if (config.count > size) {
			_addContent2();
		} else {
			art.dialog.tips("最多只能添加 " + config.count + " 个!");
		}
	});
	if (config.initCount && config.initCount > 0) {
		var size = content.find("div[key='dataDetail']").length;
		for ( var i = size; i < config.initCount; i++) {
			_addContent2();
		}
	}
}

function MoreOperate3(config,gardeType){
	this.config = config;
	var operateObj = $("#" + config.id);
	var template = operateObj.find("div[key='template']");
	var content = operateObj.find("div[key='" + gardeType + "']");
	var idx = content.find("div[key='dataDetail']").length;
	// 添加内容
	_addContent3 = function() {
		var tempHtml = template.html();
		var templateObj = $(tempHtml).clone();
		// 绑定删除事件
		templateObj.find("a[key='delOperate']").click(function() {
			_removeContent3($(this));
		});
		config.index ++;
		idx++;
		templateObj.find("input[name='desc_gardeType']").attr("name" ,"desc_" + gardeType + idx);
		templateObj.find("input[idx='append_gardeType']").attr("idx" ,"append_" + gardeType + idx);
		templateObj.find("div[id='gardeTypeTxt']").html("类别：");
		templateObj.find("div[id='gardeTypeTxt']").attr("id" ,"gardeTypeTxt" + idx);
		templateObj.find("input[name='gardeImage']").attr("name" ,"gardeImage_" + gardeType + idx).attr("idx", idx);
		templateObj.find("div[id='addImage_']").attr("id" ,"addImage_" + gardeType + idx);
		templateObj.find("div[key='append_div']").attr("id" ,"append_" + gardeType + idx);
		content.append(templateObj);
		initUploadImage("addImage_" + gardeType + idx,gardeType,"many","append_" + gardeType + idx);
	}
	// 删除内容
	_removeContent3 = function(obj) {
		var size = content.find("div[key='dataDetail']").length;
		 var dataDetial = obj.parent().parent().parent().parent();
		 obj.parent().parent().parent().remove();
		 dataDetial.find("div[key='mark_pic']").remove();
		 dataDetial.hide();
		 dataDetial.attr("key","remove_dataDetial")
	}
	$("a[key='addType_" + gardeType + "']").bind("click", function() {
		var size = content.find("div[key='dataDetail']").length;
		if (config.count > size) {
			_addContent3();
		} else {
			art.dialog.tips("最多只能添加 " + config.count + " 个!");
		}
	});
	if (config.initCount && config.initCount > 0) {
		var size = content.find("div[key='dataDetail']").length;
		for ( var i = size; i < config.initCount; i++) {
			_addContent3();
		}
	}
}

function saveSetGarde(currentDialog){
 	if(!checkValidate()){
		return;
	}else{
		var shopGardeTypeJson = getShopGardeTypeJson();
		$("#shopGardeTypeJson").val(shopGardeTypeJson);
		$("#shopImgJson").val(jsonsShopImgStr);
		
		var foodGardeTypeJson = getFoodGardeTypeJson();
		$("#foodGardeTypeJson").val(foodGardeTypeJson);
		$("#foodImgJson").val(jsonsFoodImgStr);
		
		var trafficGardeTypeJson = getTrafficGardeTypeJson();
		$("#trafficGardeTypeJson").val(trafficGardeTypeJson);
		$("#trafficImgJson").val(jsonsTrafficImgStr);
		
		var othersGardeTypeJson = getOthersGardeTypeJson();
		$("#othersGardeTypeJson").val(othersGardeTypeJson);
		$("#othersImgJson").val(jsonsOthersImgStr);
		$.post(getPath()+"/ebhouse/onlinesale/saveSetGarde",$('form').serialize(),function(res){
			if(res.STATE == "SUCCESS"){
				if(res.MSG){
					art.dialog({
						content: res.MSG,
						time:1,
						close:function(){
							art.dialog.close();
						},
						width:200
					});
					
				}else{
//					art.dialog.close();
				}
			}else{
				art.dialog.tips(res.MSG);
			}
	    },'json');
	}
	if(currentDialog){
		currentDialog.button({name:"取消",disabled:true});
		currentDialog.button({name:"保存",disabled:true});
	}
}


function checkValidate(){
	var shoppingResults = $("input[name='shoppingResults']").val();
	var foodResults = $("input[name='foodResults']").val();
	var trafficResults = $("input[name='trafficResults']").val();
	var othersResults = $("input[name='othersResults']").val();
	if(isNotNull(shoppingResults) && shoppingResults > 10){
		art.dialog.tips("购物评分设置不可大于10分!");
		$("input[name='shoppingResults']").select();
		return false;
	}
	
	if(isNotNull(foodResults) && foodResults > 10){
		art.dialog.tips("美食评分设置不可大于10分!");
		$("input[name='foodResults']").select();
		return false;
	}
	
	if(isNotNull(trafficResults) && trafficResults > 10){
		art.dialog.tips("交通评分设置不可大于10分!");
		$("input[name='trafficResults']").select();
		return false;
	}
	
	if(isNotNull(othersResults) && othersResults > 10){
		art.dialog.tips("其它评分设置不可大于10分!");
		$("input[name='othersResults']").select();
		return false;
	}
	return true;
}



var jsonsShopImgStr="[";
function getShopGardeTypeJson(){
	 var onlineSaleId = $("#onlineSaleId").val();
	 var houseProjectId = $("#houseProjectId").val();
	 var content = $("#Operate").find("div[key='SHOPPING']");
	 jsonsShopImgStr="[";
	 var jsonsStr="[";
	 content.find("div[key='dataDetail']").each(function(i,ele){
		 jsonsStr+="{";
			var gardeId = $("input[key='dataId_SHOPPING']").val();
			var desc_SHOPPING = $(ele).find("input[name^='desc_SHOPPING']").val();
			var idx_SHOPPING = $(ele).find("input[name^='desc_SHOPPING']").attr("idx");
			jsonsStr+="\"houseProject\":{\"id\":\""+houseProjectId+"\"},";
			jsonsStr+="\"garde\":{\"id\":\""+gardeId+"\"},";
			jsonsStr+="\"gardeType\":\"" + idx_SHOPPING + "\",";
			jsonsStr+="\"description\":\"" + desc_SHOPPING + "\",";
			jsonsStr+="},";
			if(jsonsShopImgStr.length > 2){
				jsonsShopImgStr+=",";
			}
			$(this).find("div[key='mark_pic']").each(function(){
				jsonsShopImgStr+="{";
				var imgUrl = $(this).find("img").attr("key");
				var desc = $(this).find("input[name^='imgDesc_SHOPPING_']").val();
				var type = $(this).parent().attr("id");
				jsonsShopImgStr+="\"path\":\""+imgUrl+"\",";
				jsonsShopImgStr+="\"description\":\""+desc+"\",";
				jsonsShopImgStr+="\"objId\":\""+gardeId+"\",";
				jsonsShopImgStr+="\"type\":\""+type+"\",";
				if(jsonsShopImgStr.indexOf(",")!=-1){
					jsonsShopImgStr=jsonsShopImgStr.substring(0,jsonsShopImgStr.length-1);
				}
				jsonsShopImgStr+="},";
			});
	 });
	 if(jsonsShopImgStr.indexOf(",")!=-1){
		 jsonsShopImgStr=jsonsShopImgStr.substring(0,jsonsShopImgStr.length-1);
	 }
	 jsonsShopImgStr+="]";
	 if(jsonsStr.indexOf(",")!=-1){
		 jsonsStr=jsonsStr.substring(0,jsonsStr.length-1);
	 }
	 jsonsStr+="]";
	 jsonsStr.replace("undefined","");
	return jsonsStr;
}


var jsonsFoodImgStr="[";
function getFoodGardeTypeJson(){
	 var onlineSaleId = $("#onlineSaleId").val();
	 var houseProjectId = $("#houseProjectId").val();
	 var content = $("#Operate").find("div[key='FOOD']");
	 jsonsFoodImgStr="[";
	 var jsonsStr="[";
	 content.find("div[key='dataDetail']").each(function(i,ele){
		 jsonsStr+="{";
			var gardeId = $("input[key='dataId_FOOD']").val();
			var desc_FOOD = $(ele).find("input[name^='desc_FOOD']").val();
			var idx_FOOD = $(ele).find("input[name^='desc_FOOD']").attr("idx");
			jsonsStr+="\"houseProject\":{\"id\":\""+houseProjectId+"\"},";
			jsonsStr+="\"garde\":{\"id\":\""+gardeId+"\"},";
			jsonsStr+="\"gardeType\":\"" + idx_FOOD + "\",";
			jsonsStr+="\"description\":\"" + desc_FOOD + "\",";
			jsonsStr+="},";
			if(jsonsFoodImgStr.length > 2){
				jsonsFoodImgStr+=",";
			}
			$(this).find("div[key='mark_pic']").each(function(){
				jsonsFoodImgStr+="{";
				var imgUrl = $(this).find("img").attr("key");
				var desc = $(this).find("input[name^='imgDesc_FOOD_']").val();
				var type = $(this).parent().attr("id");
				jsonsFoodImgStr+="\"path\":\""+imgUrl+"\",";
				jsonsFoodImgStr+="\"description\":\""+desc+"\",";
				jsonsFoodImgStr+="\"objId\":\""+gardeId+"\",";
				jsonsFoodImgStr+="\"type\":\""+type+"\",";
				if(jsonsFoodImgStr.indexOf(",")!=-1){
					jsonsFoodImgStr=jsonsFoodImgStr.substring(0,jsonsFoodImgStr.length-1);
				}
				jsonsFoodImgStr+="},";
			});
	 });
	 if(jsonsFoodImgStr.indexOf(",")!=-1){
		 jsonsFoodImgStr=jsonsFoodImgStr.substring(0,jsonsFoodImgStr.length-1);
	 }
	jsonsFoodImgStr+="]";
	 if(jsonsStr.indexOf(",")!=-1){
		 jsonsStr=jsonsStr.substring(0,jsonsStr.length-1);
		}
	 jsonsStr+="]";
	 jsonsStr.replace("undefined","");
	return jsonsStr;
}



var jsonsTrafficImgStr="[";
function getTrafficGardeTypeJson(){
	 var onlineSaleId = $("#onlineSaleId").val();
	 var houseProjectId = $("#houseProjectId").val();
	 var content = $("#Operate").find("div[key='TRAFFIC']");
	 jsonsTrafficImgStr="[";
	 var jsonsStr="[";
	 content.find("div[key='dataDetail']").each(function(i,ele){
		 jsonsStr+="{";
			var gardeId = $("input[key='dataId_TRAFFIC']").val();
			var desc_TRAFFIC = $(ele).find("input[name^='desc_TRAFFIC']").val();
			var idx_TRAFFIC = $(ele).find("input[name^='desc_TRAFFIC']").attr("idx");
			jsonsStr+="\"houseProject\":{\"id\":\""+houseProjectId+"\"},";
			jsonsStr+="\"garde\":{\"id\":\""+gardeId+"\"},";
			jsonsStr+="\"gardeType\":\"" + idx_TRAFFIC + "\",";
			jsonsStr+="\"description\":\"" + desc_TRAFFIC + "\",";
			jsonsStr+="},";
			if(jsonsTrafficImgStr.length > 2){
				jsonsTrafficImgStr+=",";
			}
			$(this).find("div[key='mark_pic']").each(function(){
				jsonsTrafficImgStr+="{";
				var imgUrl = $(this).find("img").attr("key");
				var desc = $(this).find("input[name^='imgDesc_TRAFFIC_']").val();
				var type = $(this).parent().attr("id");
				jsonsTrafficImgStr+="\"path\":\""+imgUrl+"\",";
				jsonsTrafficImgStr+="\"description\":\""+desc+"\",";
				jsonsTrafficImgStr+="\"objId\":\""+gardeId+"\",";
				jsonsTrafficImgStr+="\"type\":\""+type+"\",";
				if(jsonsTrafficImgStr.indexOf(",")!=-1){
					jsonsTrafficImgStr=jsonsTrafficImgStr.substring(0,jsonsTrafficImgStr.length-1);
				}
				jsonsTrafficImgStr+="},";
			});
	 });
	 if(jsonsTrafficImgStr.indexOf(",")!=-1){
		 jsonsTrafficImgStr=jsonsTrafficImgStr.substring(0,jsonsTrafficImgStr.length-1);
	 }
	 jsonsTrafficImgStr+="]";
	 if(jsonsStr.indexOf(",")!=-1){
		 jsonsStr=jsonsStr.substring(0,jsonsStr.length-1);
	 }
	 jsonsStr+="]";
	 jsonsStr.replace("undefined","");
	return jsonsStr;
}



var jsonsOthersImgStr="[";
function getOthersGardeTypeJson(){
	 var onlineSaleId = $("#onlineSaleId").val();
	 var houseProjectId = $("#houseProjectId").val();
	 var content = $("#Operate").find("div[key='OTHERS']");
	 jsonsOthersImgStr="[";
	 var jsonsStr="[";
	 content.find("div[key='dataDetail']").each(function(i,ele){
		 jsonsStr+="{";
			var gardeId = $("input[key='dataId_OTHERS']").val();
			var desc_OTHERS = $(ele).find("input[name^='desc_OTHERS']").val();
			var idx_OTHERS = $(ele).find("input[name^='desc_OTHERS']").attr("idx");
			jsonsStr+="\"houseProject\":{\"id\":\""+houseProjectId+"\"},";
			jsonsStr+="\"garde\":{\"id\":\""+gardeId+"\"},";
			jsonsStr+="\"gardeType\":\"" + idx_OTHERS + "\",";
			jsonsStr+="\"description\":\"" + desc_OTHERS + "\",";
			jsonsStr+="},";
			if(jsonsOthersImgStr.length > 2){
				jsonsOthersImgStr+=",";
			}
			$(this).find("div[key='mark_pic']").each(function(){
				jsonsOthersImgStr+="{";
				var imgUrl = $(this).find("img").attr("key");
				var desc = $(this).find("input[name^='imgDesc_OTHERS_']").val();
				var type = $(this).parent().attr("id");
				jsonsOthersImgStr+="\"path\":\""+imgUrl+"\",";
				jsonsOthersImgStr+="\"description\":\""+desc+"\",";
				jsonsOthersImgStr+="\"objId\":\""+gardeId+"\",";
				jsonsOthersImgStr+="\"type\":\""+type+"\",";
				if(jsonsOthersImgStr.indexOf(",")!=-1){
					jsonsOthersImgStr=jsonsOthersImgStr.substring(0,jsonsOthersImgStr.length-1);
				}
				jsonsOthersImgStr+="},";
		});
		if(jsonsOthersImgStr.indexOf(",")!=-1){
			jsonsOthersImgStr=jsonsOthersImgStr.substring(0,jsonsOthersImgStr.length-1);
	 	}
	 });
	 jsonsOthersImgStr+="]";
	 if(jsonsStr.indexOf(",")!=-1){
		 jsonsStr=jsonsStr.substring(0,jsonsStr.length-1);
		}
	 jsonsStr+="]";
	 jsonsStr.replace("undefined","");
	return jsonsStr;
}


