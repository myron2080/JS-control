$(document).ready(function(){
	addInStorageGoods();
});

var nf=0;
function saveAdd(dlg){
	currentDialog = dlg;
	var jsonStr = "[";
	var flag = true;
	$('form').find('div[key="vipGoods"]').each(function(index,doc){
		var goodsId = $(doc).find('input[name*="goodsId"]').val();
		var title = $(doc).find('input[name*="title"]').val();
		var limitCount = parseInt($(doc).find('input[name*="limitCount"]').val());
		var vipPrice = parseFloat($(doc).find('input[name*="vipPrice"]').val());
		var vipType = $(doc).find('select[name*="vipType"]').val();
		
		if(!isNotNull(goodsId)){
			art.dialog.tips('请选择商品！');
			flag = false;
			return;
		}
		if(!isNotNull(title)){
			art.dialog.tips('请填写特卖商品标题！');
			flag = false;
			return;
		}
		
		if(!vipPrice || vipPrice <= 0){
			art.dialog.tips('请填写特卖商品单价！');
			flag = false;
			return;
		}
		jsonStr+="{";
		jsonStr+="\"goods\":{\"id\":\""+goodsId+"\"},";
		jsonStr+="\"title\":\""+title+"\",";
		jsonStr+="\"limitCount\":\""+limitCount+"\",";
		jsonStr+="\"vipPrice\":\""+vipPrice+"\",";
		jsonStr+="\"vipType\":\""+vipType+"\",";
		jsonStr +="},";
	});
	if(jsonStr.indexOf(",")!=-1){
		jsonStr=jsonStr.substring(0,jsonStr.length-1);
	}
	jsonStr+="]";
	jsonStr.replace("","undefined");
	if(flag){
		if(nf==0){
			nf++;
		$('#vipGoodsDetailStr').val(jsonStr);
		$.post(base + "/ebbase/vipgoods/save",$('form').serialize(),function(res){
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
					art.dialog.close();
				}
			}else{
				art.dialog.tips(res.MSG);
			}
	    },'json');
	 }
	}
	if(currentDialog && flag){
//		currentDialog.button({name:"取消",disabled:true});
//		currentDialog.button({name:"确定",disabled:true});
	}
	return false;
}

function autoGoods(data,sourceObj){
	var parent=$(sourceObj).parents(".wareHouseDiv");
	var idx = parent.attr("index");
	var len = $("input[value='" + data.id + "']").length;
	if(len > 1){
		$(sourceObj).val("");
		$("input[name='goodsId" + idx + "']").val("");
		art.dialog.tips('同一种商品不可以重复！');
		return;
	}else{
			$("input[name='goodsName" + idx + "']").val($(data).attr("name"));
			$("input[name='goodsNumber" + idx + "']").val($(data).attr("number"));
			$("input[name='specifications" + idx + "']").val($(data).attr("specifications"));
			$("input[name='unit" + idx + "']").val($(data).attr("unit"));
		}
}

function addInStorageGoods(){
	var index = 0;
	$('#vipGoodsList').find("div[key='vipGoods']").each(function(i,ele){
		var tempIdx = $(ele).attr("index");
		if(tempIdx > index){
			index = tempIdx;
		}
	});
	index = parseInt(index)+1;
	
	var vipType = $("#vipType").html();
	$('<div class="wareHouseDiv" key="vipGoods" index="' + index + '">'
	+'<div class="divLabel">'
	+'	<p class="w_left"><span>*</span>商品编码：</p>'
	+'	<input id="goodsId'+index+'" name="goodsId'+index+'" type="hidden" idx="' + index + '">'
	+'   	<input id="goodsNumber'+index+'" name="goodsNumber'+index+'" autocomp="{id:\'goodsAuto\',type:1,width:\'145px\',tagId:\'goodsId'+index+'[id]\',backFun:\'autoGoods\'}">'
	+'	</div>'
	+'	<div class="divLabel">'
	+'		<p class="w_left"><span>*</span>货物名称：</p>'
	+'		<input type="text" class="txt2 txtdisabled" readonly="readonly" name="goodsName'+index+'" id="goodsName'+index+'">'
	+'	</div>'
	+'	<div class="divLabel">'
	+'		<p class="w_left">规格型号：</p>'
	+'		<input type="text" class="txt7 txtdisabled" readonly="readonly" name="specifications'+index+'" id="specifications'+index+'">'
	+'	</div>'
	+'	<div class="divLabel">'
	+'		<p class="w_left"><span>*</span>计量单位：</p>'
	+'		<input type="text" class="txt7 txtdisabled" readonly="readonly" name="unit'+index+'" id="unit'+index+'">'
	+'	</div>'
	+'	<div class="divLabel">'
	+'		<p class="w_left"><span>*</span>特卖标题：</p>'
	+'		<input type="text" name="title'+index+'" id="title'+index+'">'
	+'	</div>'
	+'	<div class="divLabel">'
	+'		<p class="w_left" style="width:80px;">份额限制：</p>'
	+'		<input type="text" onkeyup="onlyPutNum(this)" class="txt7" name="limitCount'+index+'" id="limitCount'+index+'">'
	+'	</div>'
	+'	<div class="divLabel">'
	+'		<p class="w_left" style="width:80px;"><span>*</span>特卖价格：</p>'
	+'		<input type="text" onkeyup="onlyPutNum(this);" class="txt7" name="vipPrice'+index+'" id="vipPrice'+index+'"> 元'
	+'	</div>'
	+'	<div class="divLabel">'
	+'		<p class="w_left"><span>*</span>特卖类型：</p>'
	+'		<select id="vipType'+index+'" name="vipType'+index+'" style="width:100px;">' + vipType
	+'		</select>'
	+'	</div>'
	+'  <span class="delBtn" id="delBtn'+index+'" onclick="deleteInstorage(' + index + ')">'
	+'  	<a href="javascript:void(0)">'
	+'  		<img src="' + base + '/default/style/images/eb_back/icon_close.png">'
	+'  	</a>'
	+'  </span>'
	+'	</div>').appendTo('#vipGoodsList');
	AutoComp.init();
}

function deleteInstorage(index){
	var len = $('#vipGoodsList').find("div[key='vipGoods']").length;
	if(!len || len <= 1){
		art.dialog.tips('至少填写一种特卖商品信息！');
		flag = false;
		return;
	}
	$('div[index="'+index+'"]').remove();
}


