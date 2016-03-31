jQuery(document).ready(function(){
	art.dialog.data("saveStation",saveStation);
	$("#name").bind('change',function(){
		var name =$(this).val();
		$('#name').val(name);
		toPinyin($(this).val(),function(result){
			$('#simplePinyin').val(result.simple);
			$('#fullPinyin').val(result.full);
		});
	});
	$("#lineId").bind('change',function(){
		lineChange();
	});
	lineChange();
});

function lineChange(){
	var key =$("#lineId option:selected").attr("key");
	if(key != 'SCHOOL'){
		$("tr[group='school']").hide();
		$("#areaId ").get(0).selectedIndex=0;
		$("#schoolLevel ").get(0).selectedIndex=0;
		$("#schoolType ").get(0).selectedIndex=0;
		$("input[name='learnType']").each(function(i, ele){
			ele.checked = false;
		});
//		art.dialog.list[0].size(10,10);
//		art.dialog.list["OpenaddUpdateStation"].size(10,10);
//		$(document.getElementsByName('OpenaddUpdateStation')).parent().parent().css("height","100px;");
	}else{
		$("tr[group='school']").show();
	}
	
}

function saveStation(){
	if(!checkValidate()){
		return;
		
	}else{
		var learnTypeArr =[];
		$("input[name='learnType']").each(function(i, ele){
			if(ele.checked){
				learnTypeArr[learnTypeArr.length] = $(ele).val();
			}
		});
		$("#learnTypeStr").val(learnTypeArr.toString());
		$.post(getPath()+"/projectm/pmStation/addStation",$("#saveStation").serialize(),function(res){
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
		});
	}
	return "1";
}


function checkValidate(){
	if($("#lineId").val()==''){
		art.dialog.tips("所属配套类型不能为空！");
		return false;
	}
	if($("#name").val()==''){
		art.dialog.tips("名称不能为空！");
		return false;
	}
	if(!isNotNull($("#number").val())){
		art.dialog.tips("序号不能为空！");
		return false;
	}
	
	return true;
	
}