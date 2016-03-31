$(function(){
	var param =parseInt($("#param").val());
	if(param>0)sumTotal();

});


function selectDishes(oldValue,newValue,doc){
	/**
	 * 判断不允许 薪酬项目
	 */
	$(doc).find("input[key='DishesIdId']").val("");//先清空当前f7内容
	$(doc).find("input[key='DishesIdName']").val("");//先清空当前f7内容
	//var jsonData=putJsonData();
	/*if(jsonData.indexOf(newValue.id) != -1){
		art.dialog.tips("该菜品已选择!",1.5);
	}else{
	}*/
	$(doc).find("input[key='DishesIdId']").val(newValue.id);
	$(doc).find("input[key='DishesIdName']").val(newValue.name);
	$(doc).find("input[key='singePrice']").val(newValue.suggestPrice);
	//$(doc).parent().parent().find("input[key='amount']").val(newValue.suggestPrice);
	
}
/*function changeJob(oldValue,newValue,doc){
		var id = '';
		if(newValue){
			id = newValue.id;
			$.post(getPath()+'/hr/salaryStandard/jobLevel',{job:id},function(res){
				$("#jobLevelId").html("");
				$('<option value=""></option>').appendTo("#jobLevelId");
				if(res && res.length > 0){
					for(var i = 0; i < res.length; i++){
						$('<option value="'+res[i].id+'">'+res[i].name+'</option>').appendTo("#jobLevelId");
					}
				}
			},'json');
		}
	}
/**
 * 新增 项目
 */
function addAssets(){
	var param=parseInt($("#param").val(),10)+1;
	$("#param").val(param);
	var div="<ul>";
	div+="<li style='width:63px;text-align:right;'>菜品：</li>";
	div+="<li style='width:135px;text-align:left;'>";//onchange='selectAssets'
	div+="<div class='f7'  onchange='selectDishes' id='Dishes_"+param+"' dataPickerUrl='"+getPath()+"/framework/dataPicker/list?query=Dishes&dishesStatusEnum=ALREADYPUTAWAY' width='290px' height='400px' title='菜品'>";
	div+="<input type='hidden' key='singePrice' value='' />";
	div+="<input style='height:19px;' dataPicker='value' value='' key='DishesId' name='DishesId_"+param+"' id='DishesId_"+param+"' type='hidden' readOnly='readOnly' />";
	div+="<div class='l-text l-text-disabled' style='width: 135px;'>";
	div+="<input validate='{required:true}' style='height:19px; width:135px;line-height:18px;' dataPicker='name' key='DishesName' value='' name='DishesName_"+param+"' id='DishesName_"+param+"' class='l-text-field' " +
			"ligeruiid='Dishes_"+param+"' type='text' readOnly='readOnly' onclick=\"openDataPicker('Dishes_"+param+"')\"/>";
	div+="<div class='l-text-l'><div class='l-text-r'></div></div></div>";
	div+="<strong onclick=clearDataPicker('Dishes_"+param+"')></strong>";
	div+="<span class='p_hov' onclick=openDataPicker('Dishes_"+param+"')></span></div></li>";
	
	div+="<li style='width:60px;text-align:right;margin-left: 20px;'>份数：</li>";
	div+="<li style='width:80px;text-align:left;'><div class='l-text' style='width: 60px;'>";
	div+="<input key='num' id='num_"+param+"' name='num_"+param+"' label='' onkeyup=\"this.value=this.value.replace(/\D/g,'');singleTotal(this);sumTotal();\"; onafterpaste=\"this.value=this.value.replace(/\\D/g,'');\"; validate='{required:true,maxlength:30}' style='width: 56px;height:18px;' ligeruiid='num"+param+"' class='l-text-field'  type='text' value=''/>";
			
	
	div+="<li style='width:60px;text-align:right;margin-left: 20px;'>金额(元)：</li>";
	div+="<li style='width:80px;text-align:left;'><div class='l-text' style='width: 60px;'>";
	div+="<input key='amount' id='amount_"+param+"' readOnly='readOnly' name='amount_"+param+"'  onafterpaste=\"this.value=this.value.replace(/\\D/g,'');\"; validate='{required:true,maxlength:30}' style='width: 56px;height:18px;' ligeruiid='amount_"+param+"' class='l-text-field'  type='text' value=''/>" 
	div+="<li  style='width:60px;text-align:left;'>";
	div+="<div class='tab_box_close' style='width:12px;'><a class='delete' href='javascript:void(0);' onclick='deleteRow(this);'></a></div>";
	div+="</li></ul>";
	$("#DishesDiv").append(div);
}
function singleTotal(obj){
	var _this =  $(obj);
	var copies = Number(_this.val());
	var singlePrice =  Number(_this.parent().parent().parent().find("input[key='singePrice']").val());
	if(isNaN(copies)||isNaN(singlePrice)) return;
	 _this.parent().parent().parent().find("input[key='amount']").val(copies*singlePrice);
}
function sumTotal(){
	var total = 0;
    var itemAmount =0;
	$("#DishesDiv ul").each(function(){
		var numObj = $(this).find("input[key='num']");
		var num = $(numObj).val();
		if(isNaN(num)){
			art.dialog.tips("请输入有效数字",1.5);	
			$(numObj).val("");
			$(numObj).focus();
			return ;
		}
		var  priceObj =  $(this).find("input[key='amount']");
		var price = Number($(priceObj).val());
		if(isNaN(price)){
			art.dialog.tips("请输入有效价格",1.5);
			$(priceObj).val("");
			$(priceObj).focus();
			return;
		}
		total+=price;
	});
	$("#total").val(total);
}
function deleteRow(obj){
	$(obj).parent().parent().parent().remove();
	sumTotal();
}
function saveEdit(dlg){
	currentDialog = dlg;
    $("#detailJson").val(putJsonData());
    $("form").submit();
	return false;
}
/**
 * 拼接json数据
 */
function putJsonData(){
	var jsonData="[";
	$("#DishesDiv ul").each(function(){
		jsonData+="{'id':'"+$(this).find("input[key='DishesId']").val()+"',";
		jsonData+="'num':'"+$(this).find("input[key='num']").val()+"',";
		jsonData+="'amount':'"+$(this).find("input[key='amount']").val()+"'},";
	});
	if (jsonData.indexOf(",") != -1) {
		jsonData = jsonData.substring(0, jsonData.length - 1)+"]";
	}else{
		jsonData="";
	}
	return jsonData;
}