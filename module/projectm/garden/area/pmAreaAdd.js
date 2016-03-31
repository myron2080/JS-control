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

function saveArea(){
	if(!checkValidate()){
		return;
	}else{
		//var areaType = $("input[name='areaType']").val();
		var parentid = $("#parentid").val();
		if(isNotNull(parentid)){
			$("input[name='areaType']").val(2)
		}else{
			$("input[name='areaType']").val(1)
		}
		$.post(getPath()+"/basedata/area/addArea",$('form').serialize(),function(res){
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