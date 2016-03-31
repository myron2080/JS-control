/**
 * 
 */
jQuery(document).ready(function(){
	$("#selectParent").bind("click",function(){
		var areatype = $("#areaType").val();
		art.dialog.data("returnFunName","setGeographyArea");
		if(areatype==2){
			art.dialog.open(ctx+'/f7/index/getcityArea?fareatype=1',{title: '城市', lock: true,  skin: 'aero',padding:0,width:400,height:410});
		}
		if(areatype==1){
			art.dialog.tips("城市没有父区域！");
			return;
		}
		if(areatype>=3){
			art.dialog.open(ctx+'/f7/index/getValueParentArea?a.fareatype=2',{title: '区域', lock: true,  skin: 'aero',padding:0,width:400,height:410});
		}
	});
	$("#name").bind("change",function(){
		var name =$(this).val();
		$('#name').val(name);
		toPinyin($(this).val(),function(result){
			$('#simplePinyin').val(result.simple);
			$('#fullPinyin').val(result.full);
		});
	});
	art.dialog.data("saveArea",saveArea);
	
});

function saveArea(dlg){
	if(!checkValidate()){
		return;
	}else{
		//var areaType = $("input[name='areaType']").val();
//		var parentid = $("#parentAreaId").val();
		$("input[name='areaType']").val("REGION");//大片区
		$.post(getPath()+"/basedata/area/addArea",$('form').serialize(),function(res){
			if(res.STATE == "SUCCESS"){
				art.dialog.tips("操作成功");
				setTimeout(function(){art.dialog.close();},1000);
			}else{
				art.dialog.alert(res.MSG);
			}
	    },'json');
	}
}

function checkValidate(){
	if($("#number").val()==''){
		art.dialog.tips("编码不能为空！");
		return false;
	}
	if($("#name").val()==''){
		art.dialog.tips("名称不能为空！");
		return false;
	}
	return true;
	
}