/**
 * 楼盘详情
 */

$(document).ready(function(){
	art.dialog.data("addGarden",addGarden);
	art.dialog.data("updateGarden",updateGarden);
	$("#registerName").bind('change',function(){
		var name =$(this).val();
		$('#name').val(name);
		toPinyin($(this).val(),function(result){
			$('#simplePinyin').val(result.simple);
			$('#fullPinyin').val(result.full);
		});
	}); 
});

/**
 * 新增
 * */
function addGarden(dlg){
	$('form').attr('action',getPath()+"/projectm/pmGarden/addGarden");
	saveAdd(dlg);
	/*if(!checkValidate()){
		return;
	}else{
				dlg.button({name:"保存",disabled:true});
		$.post(getPath()+"/projectm/pmGarden/addGarden",$('form').serialize(),function(res){
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
					
				}
			}else{
				dlg.button({name:"保存",disabled:false});
			}
	    },'json');
	}*/
}
/**
 * 修改
 * */
function updateGarden(dlg){
	$('form').attr('action',getPath()+"/projectm/pmGarden/updateGarden");
	saveAdd(dlg);
	/*if(!checkValidate()){
		return;
	}
	dlg.button({name:"保存",disabled:true});
	$.post(getPath()+"/projectm/pmGarden/updateGarden",$('form').serialize(),function(res){
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
			dlg.button({name:"保存",disabled:true});
		}
    },'json');*/
}
/**
 * 校验
 */
function checkValidate(){
	/*if($("#number").val()==''){
		art.dialog.tips("楼盘编码不能为空！");
		return false;
	}
	if($("#geographyAreaId").val()==''){
		art.dialog.tips("地理片区不能为空！");
		return false;
	}
	if($("#registerName").val()==''){
		art.dialog.tips("楼盘登记名不能为空！");
		$("#registerName").focus();
		return false;
	}
	if($("#fullPinyin").val()==''){
		art.dialog.tips("楼盘全拼不能为空！");
		$("#fullPinyin").focus();
		return false;
	}
	if($("#name").val()==''){
		art.dialog.tips("楼盘推广名不能为空！");
		$("#name").focus();
		return false;
	}
	if($("#keyRoadId").val()==''){
		art.dialog.tips("关键路段不能为空！");
		return false;
	}
	if($("#address").val()==''){
		art.dialog.tips("楼盘地址不能为空！");
		$("#address").focus();
		return false;
	}
	if($("#simplePinyin").val()==''){
		art.dialog.tips("楼盘简拼不能为空！");
		$("#simplePinyin").focus();
		return false;
	}
	if($("#responseManId").val()==''){
		art.dialog.tips("责任人不能为空！");
		$("#responseManName").focus();
		return false;
	}
	if($("#gardenArea").val()!=''){
		if(isNaN($("#gardenArea").val())){
			art.dialog.tips("占地面积只能输入数字！");
			return false;
		}
	}
	if($("#greenRatio").val()!=''){
		if(isNaN($("#greenRatio").val())){
			art.dialog.tips("绿化率只能是数字！");
			return false;
		}
	}
	if($("#plotRatio").val()!=''){
		if(isNaN($("#plotRatio").val())){
			art.dialog.tips("容积率只能是数字！");
			return false;
		}
	}	
	if($("#buildingQuantity").val()!=''){
		if(isNaN($("#buildingQuantity").val())){
			art.dialog.tips("总栋数只能是数字！");
			return false;
		}
	}
	*/
	var qidong =$("#tempYT").find("input[name=propertyTypes]:checked").length; 
	if(qidong<=0){
		art.dialog.tips("必须有一个类型被选中！");
		return false;
	}
	/*
	var disposalDate = $("#disposalDate").val();
	var buildtime = $("#buildtime").val();
	if(disposalDate&&buildtime){
		if(disposalDate>buildtime){
			art.dialog.tips("建筑日期要大于批地日期！");
			return false;
		}
		
	}
	
	if($("#noCustom").attr("checked")=='checked'){
		$("#noCustom").val("true");
	}else{
		$("#noCustom").val("false");
	}
	*/
	return true;
} 

/**
 ***************************
 ** 选择物业类型
 ***************************
 */
/*function selectBox(obj,cb_val){
	var cb=$(obj).parents("#tempYT").find("input[key="+cb_val+"]");
	if(!cb.attr("checked")){
		cb.attr("checked",true);
	}else{
		cb.attr("checked",false);
	}
}*/


function setRespOrgId(oldvalue,newvalue,doc){
	
	$("#responseOrgId").val(newvalue.personPosition.position.belongOrg.id);
	
}
