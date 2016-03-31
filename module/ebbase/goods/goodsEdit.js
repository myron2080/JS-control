$(document).ready(function(){
	$('#name').bind('change',function(){
		toPinyin($(this).val(),function(result){
			$('#simplePinyin').val(result.simple);
		});
		$('#promoteDesc1').val($(this).val());
	});
	$('#specifications').bind('change',function(){
		$('#promoteDesc1').val($('#promoteDesc1').val()+$(this).val());
	});
	
	
	if($("#goodsCategorId").val()!=null&&$("#goodsCategorId").val()!=""){
	initAttrValue($("#goodsCategorId").val());
	}
	
	$.validator.addMethod("isPrice", function(value,element) { 
		var length = value.length; 
		var  intReg = /^[0-9]*[1-9][0-9]*$/;
		var floteReg = /^\d+(\.\d+)?$/
		return this.optional(element) || (floteReg.test(value))|| (intReg.test(value)); 
		}, "请正确填写数字"); 
	//EnlargerImg.init();	//放大图片
	
	//同步
	$.ajaxSetup({  
	    async : false  
	});
	$.validator.addMethod("isbarCode", function(value,element) {
		var msg = false;
		$.post("barCode",{barCode:value,id:$("#dataId").val()},function(data){
			if(data.MSG == '当前条形码已存在'){
				msg = false;
			} else if(data.MSG == "SUCCESS"){
				msg = true;
			}
			
		},"json");
		return this.optional(element) || msg;
	},"当前条形码已存在");
});
//制保留2位小数，如：2，会在2后面补上00.即2.00    
function toDecimal2(x) {    
    var f = parseFloat(x);    
    if (isNaN(f)) {    
        return false;    
    }    
    var f = Math.round(x*100)/100;    
    var s = f.toString();    
    var rs = s.indexOf('.');    
    if (rs < 0) {    
        rs = s.length;    
        s += '.';    
    }    
    while (s.length <= rs + 2) {    
        s += '0';    
    }  
    return s;    
}    
function beforesave(dlg){
/*	$("#factoryPrice").val(toDecimal2($("#factoryPrice").val()));
	$("#salePrice").val(toDecimal2($("#salePrice").val()));
	$("#favorablePrice").val(toDecimal2($("#favorablePrice").val()));*/
    $("#leftNav li:first").addClass("now").siblings().removeClass("now");
	$("#right_first").show().siblings().hide();
	$("#pic4goodsJson").val(putJsonData("PIC4GOODS"));
	$("#pic4activityJson").val(putJsonData("PIC4ACTIVITY"));
	$("#attrValJson").val(putAttrValJsonData());
	if($("#extParameter").val()==$("#extParameter").attr("defaultValue"))$("#extParameter").val("");
	return false;
};

function initAttrVal(){
	if($("#attrValueDiv").html()!=null&&$("#attrValueDiv").html()!="")
		$("#attrValueDiv").find("input").each(function(){
			var attrId  =  $(this).attr("attrId");
			var attrValId  =  $(this).attr("attrValId");
			$("#"+attrId).val(attrValId);
		});
}
//json格式化
function putJsonData(type){
	var jsonData="[";
	$("input[key='"+type+"']").each(function(i){
		
		jsonData+="{";
		jsonData+="'path':'"+$(this).val()+"'";
		jsonData+=",'indexNum':'"+i+"'";
		jsonData+=",'type':'"+type+"'";
		jsonData+="},";
	});
	if (jsonData.indexOf(",") != -1) {
		jsonData = jsonData.substring(0, jsonData.length - 1)+"]";
	}else{
		jsonData="";
	}
	return jsonData;
}

function putAttrValJsonData(){
	var jsonData="[";
	$("select[key='categoryAttrVal']").each(function(){
		jsonData+="{";
		jsonData+="'attrId':'"+$(this).attr("id")+"'";
		jsonData+=",attrValId:'"+$(this).val()+"'";
		jsonData+="},";
	});
	if (jsonData.indexOf(",") != -1) {
		jsonData = jsonData.substring(0, jsonData.length - 1)+"]";
	}else{
		jsonData="";
	}
	return jsonData;
}

function gcTrigger(oldValue,newValue,doc){
	var gcId = newValue.id;
	$("select[key='categoryAttrVal']").each(function(){
		$(this).parent().parent().remove();
	});
	if(gcId!=null && gcId!=""){
	initAttrValue(gcId);
	}
}
function initAttrValue(id){
	$.post(base+"/ebbase/categoryAttrVal/getAttrByGcId",{gcId:id},function(res){
		
		var data =  res[0];
		if(data.STATE=="SUCCESS"){
			var dataList =  data.cattegoryAttrList;
		    var html = '';
			if(dataList!=null&&dataList.length>0){
				
				for(var i=0;i<dataList.length;i++){
					var obj =  dataList[i];
					if(i==0)
					html+='<tr>'; 
					
					html+='<td class="c_left">'+obj.name+'：</td>'; 
					html+=' <td>'; 
					html+=' <select key="categoryAttrVal" name="'+obj.id+'" id="'+obj.id+'">'; 
					html+='<option value="" ></option>'; 
					var valueList = obj.cattegoryAttrValueList;
					for(var j=0;j<valueList.length;j++ ){
						var attrValue = valueList[j];
						if(obj.categoryAttributeEnum=="AREAS"){
						html+='<option value="'+attrValue.id+'" >'+attrValue.name+'</option>'; 
						}else{
						html+='<option value="'+attrValue.id+'" >'+attrValue.name+'</option>'; 	
						}
					}
                    html+=' </select>';                        
                    html+=' </td>'; 
                    if(((i+1)%3==0)||((i+1)>dataList.length)) html+='</tr>'; 
				}
				$("#attrTable").append(html);
				initAttrVal();
			}
		}
		
	},'json');
}
