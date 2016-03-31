$(document).ready(function(){
	//成交分行自动补全
	Autocomplete.init({
		$em:$( "#orgName" ),
		$obj:$('#orgId'),
		type:'POST',
		url:base+"/ebhouse/member/autoComplateOrg?random=" +  Math.round(Math.random()*100),
		maxRows:6,
//		param:{saleType: $("input[name='saleType']").val()},
		afterSelect:afterSelect
	});
	
	var orgId = $("#orgId").val();
	if(isNotNull(orgId)){
		afterSelect(orgId);
	}
});

//成交组织回调方法
function afterSelect(orgId){
	var person_Id = $("#person_Id").val();
	if(!isNotNull(person_Id)){
		$('#personId').empty();
	}
	$.post(base+"/ebhouse/member/autoComplatePerson?random=" +  Math.round(Math.random()*100),{orgId:orgId,maxRows: 100},function(data){
		if(data.count>0){
			var html = "";
			$.each(data.items,function(i,ele){
				if(!isNotNull(person_Id)){
					if(person_Id == ele.id){
						$('#personId').append("<option value='"+ele.id+"' selected='selected'>" + ele.name + "(" + ele.personPosition.position.name + ")</option>");
					}else{
						$('#personId').append("<option value='"+ele.id+"'>"+ele.name+"(" + ele.personPosition.position.name + ")</option>");
					}
				}
				var j=0
				if(i%3 == 0){
					html+='<ul class="map-markall-ul">';
					html+='<li class="w150">'+ ele.personPosition.position.belongOrg.name + '--' + ele.name + ':<span key="' + ele.name + '(' + ele.personPosition.position.name + ')">0</span></li>';
					j = i;
				}else{
					html+='<li class="w150">'+ ele.personPosition.position.belongOrg.name + '--' + ele.name + ':<span key="' + ele.name + '(' + ele.personPosition.position.name + ')">0</span></li>';
				}
				if(i%3 == 0 && j!=i){
					html+='</ul>';
				}
			});
			$("#allotPersons").html("");
			$(html).appendTo("#allotPersons");
		}else{
			$("#personId").append("<option value=''>请选择</option>");
		}
		
	},'json');
	
	setTimeout(function(){
		$.post(base+"/ebhouse/member/getUserByOrgId?random=" +  Math.round(Math.random()*100),{orgId:orgId},function(data){
			$.each(data, function(i, ele){
				$("#allotPersons").find("span[key='"+ ele.personName +"']").html(ele.allotCount);
			});
		},'json');
	},500);
}
var saveCount = 0;
function save(dlg){
	var personName = $("#personId").find('option:selected').text();
	if(!isNotNull($("#personId").find('option:selected').val())){
		art.dialog.tips("请选择分配组织和分配人.");
	}else if(saveCount==0){
		saveCount=1;
		$("#personName").val(personName);
		$.post(getPath()+"/ebhouse/member/allotPotential",$('form').serialize(),function(res){
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
			saveCount=0;
	    },'json');
	}else{
		art.dialog.tips("正在保存……");
	}
	

}