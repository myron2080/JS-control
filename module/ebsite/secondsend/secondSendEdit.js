$(document).ready(function(){
	var len=$(".wareHouseDiv").length;
	if(len == 0){
		addEvent();
	}
	$(".btn_submit").click(function(){
		addEvent();
	});
});

function addEvent(){
	var div='<div class="wareHouseDiv" key="goods" index="1">'
		    	+'<div class="divLabel">'
		    	+'	<p class="w_left"><span>*</span>商品编码：</p>'
		    	+'<input id="goodsId" name="goodsId" type="hidden" value="">'
		    	+'   	<input autocomp="{id:\'autoInventoryGoods\',type:1,width:\'145px\',tagId:\'autoId[id]\',backFun:\'autoGoods\'}">'
		    	+'</div>'
		    	+'<div class="divLabel">'
		    	+'<p class="w_left"><span>*</span>商品名称：</p>'
		    	+'<input type="text" class="txt2 txtdisabled"  readonly="readonly" name="goodsName" id="goodsName" value="">'
		    	+'</div>'
		    	+' <div class="divLabel">'
		    	+'<p class="w_left">规格型号：</p>'
		    	+'<input type="text" class="txt7 txtdisabled" readonly="readonly" name="specifications" id="specifications" value="">'
		    	+'</div>'
		    	+'<div class="divLabel">'
		    	+'<p class="w_left">计量单位：</p>'
		    	+'<input type="text" class="txt7 txtdisabled" readonly="readonly" name="unit" id="unit" value="">'
		    	+'</div>'
		    	+'<div class="divLabel">'
		    	+'<p class="w_left"><span>*</span>单价：</p>'
		    	+'<input type="text" onkeyup="onlyPutNum(this);caclTotal(this)" class="txt7" name="price" id="price" value="">'
		    	+'</div> '
		    	+'<div class="divLabel">'
		    	+'<p class="w_left"><span>*</span>调拨数量：</p>'
		    	+'<input type="text" onkeyup="onlyPutNum(this);caclTotal(this)" class="txt7" name="outCount" id="outCount" value="">'
		    	+'</div>'
		    	+'<div class="divLabel">'
		    	+'<p class="w_left"><span>*</span>实收数量：</p>'
		    	+'<input type="text" onkeyup="onlyPutNum(this);caclTotal(this)" class="txt7" name="getCount" id="getCount" value="">'
		    	+'</div>'
		    	+'<div class="divLabel">'
		    	+'<p class="w_left"><span>*</span>损坏率：</p>'
		    	+'<input type="text" readonly="readonly" class="txt7 " name="faultRate" id="faultRate" value="" />'
		    	+'</div>'
		    	+'<div class="divLabel">'
		    	+'<p class="w_left">描述：</p>'
		    	+'<input type="text" class="txt2" name="faultDesc" id="faultDesc" value="">'
		    	+'</div>'
		    	+'<div class="divLabel">'
		    	+'<p class="w_left">总价：</p>'
		    	+'<p class="w_left" style="text-align:left;"><span id="total">0</span>元</p>'
		    	+'</div>'
		    	+'		        <span class="delBtn">'
		    	+'<a href="javascript:void(0)" onclick="closeEvent(this);">'
		    	+'  	<img src="'+base+'/default/style/images/eb_back/icon_close.png">'
		    	+'  </a>'
		    	+'</span>'
		    	+'</div>';
	$("#goodsList").append(div);
	AutoComp.init();
}

//关闭事件
function closeEvent(obj){
	if($(".wareHouseDiv").length == 1)
		return;
	var cur=$(obj).parent().parent();
	cur.fadeOut(function(){
		cur.remove();
	});
}

/**
 * 选择商品 回调函数
 * @param data
 */
function autoGoods(data,sourceObj){
	var parent=$(sourceObj).parents(".wareHouseDiv");
	parent.find("input[name='goodsId']").val(data.id);
    var len=$("#goodsList").find("input[value='"+data.id+"']").length;
    if(len > 1){//已选择 该 商品
    	art.dialog.tips("该商品已选择!",2);
    	$(sourceObj).val("");
    	parent.find("input[name='goodsId']").val("");
    	parent.find("input[name='goodsName']").val("");
    	parent.find("input[name='specifications']").val("");
    	parent.find("input[name='unit']").val("");
    	return;
    }
	$.each(data.attributes,function(i,ele){
		if(ele["nodeName"] == "name" ){
			parent.find("input[name='goodsName']").val(ele.value);
		}else if(ele["nodeName"] == "specifications" ){
			parent.find("input[name='specifications']").val(ele.value);
		}else if(ele["nodeName"] == "unit" ){
			parent.find("input[name='unit']").val(ele.value);
		}
	});
}

/**
 * 保存
 */
function saveEdit(dlg){
	currentDialog = dlg;
	var jsonStr = "[";
	var flag = true;
	
	if(!isNotNull($("#outTime").val())){
		art.dialog.tips('请选择调拨日期！');
		flag = false;
		return false;
	}
	
	if(!isNotNull($("#storageId").val())){
		art.dialog.tips('请选择收货分店！');
		flag = false;
		return false;
	}
	
	if(!isNotNull($("#personId").val())){
		art.dialog.tips('请选择收货人！');
		flag = false;
		return false;
	}
	var allTotal = 0;
	$('form').find('div[key="goods"]').each(function(index,doc){
		var goodsId = $(doc).find('input[name="goodsId"]').val();
		var goodsName=$(doc).find('input[name="goodsName"]').val();//商品名称
		var unit=$(doc).find('input[name="unit"]').val();
		var price = parseInt($(doc).find('input[name="price"]').val());
		var outCount = parseInt($(doc).find('input[name="outCount"]').val());
		var getCount = parseInt($(doc).find('input[name="getCount"]').val());
		var totalPrice = parseInt($(doc).find('span[id="total"]').text());
		var faultRate=$(doc).find('input[name="faultRate"]').val();
		var faultDesc =$(doc).find('input[name="faultDesc"]').val();
		
		
		if(!isNotNull(goodsId)){
			art.dialog.tips('请选择商品！');
			flag = false;
			return false;
		}
		if(!price || price <= 0){
			art.dialog.tips('请填写商品单价！');
			flag = false;
			return false;
		}
		
		if(!outCount || outCount <= 0){
			art.dialog.tips('请填写调拨数量！');
			flag = false;
			return false;
		}
		
		if(!getCount || getCount <= 0){
			art.dialog.tips('请填写实收数量！');
			flag = false;
			return false;
		}
		
		
		allTotal = allTotal + total;

		jsonStr+="{";
		jsonStr+="\"goods\":{\"id\":\""+goodsId+"\",";
		jsonStr+="\"name\":\""+goodsName+"\",";
		jsonStr+="\"unit\":\""+unit+"\"},";
		jsonStr+="\"price\":\""+price+"\",";
		jsonStr+="\"outCount\":\""+outCount+"\",";
		jsonStr+="\"getCount\":\""+getCount+"\",";
		jsonStr+="\"totalPrice\":\""+totalPrice+"\",";
		jsonStr+="\"faultRate\":\""+faultRate+"\",";
		jsonStr+="\"faultDesc\":\""+faultDesc+"\",";
		jsonStr +="},";
	});
	if(jsonStr.indexOf(",")!=-1){
		jsonStr=jsonStr.substring(0,jsonStr.length-1);
	}
	jsonStr+="]";
	jsonStr.replace("undefined","");
	if(flag){
		$('#goodsDetailStr').val(jsonStr);
		$('#total').val(allTotal);
		$.post(base + "/ebstorage/out/save",$('form').serialize(),function(res){
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
	}else{
		return false;
	}
	if(currentDialog){
		currentDialog.button({name:"取消",disabled:true});
		currentDialog.button({name:"保存",disabled:true});
	}
	return false;
}

/*function caclTotal(obj){
	var parent=$(obj).parents(".wareHouseDiv");
	var outCount=parseFloat(parent.find("input[name='outCount']").val());//调拨数量
	var getCount = parseFloat(parent.find("input[name='getCount']").val());//实收数量
	var price = parseFloat(parent.find("input[name='price']").val());//单价

	if(outCount && getCount){
		if(getCount>outCount){//实际数量大于调拨数量
			getCount=outCount;
			parent.find("input[name='getCount']").val(outCount);
			parent.find("#faultRate").val("0%");
		}else{//计算损坏率
			parent.find("#faultRate").val((((outCount-getCount)/outCount)*100).toFixed(2)+"%");
		}
	}
	
	if(getCount && getCount>0 && price && price >0){
		parent.find("#total").html(getCount * price.toFixed(2));
	}else{
		parent.find("#total").html(0);
	}
}*/

