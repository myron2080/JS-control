$(document).ready(function(){
	//访客分配组织 自动补全
	Autocomplete.init({
		$em:$( "#orgName" ),
		$obj:$('#orgId'),
		type:'post',
		url:base+"/ebhouse/member/autoComplateOrg?random=" +  Math.round(Math.random()*100),
		maxRows:6,
		afterSelect:afterSelect
	});
	
	var orgId = $("#orgId").val();
	if(isNotNull(orgId)){
		afterSelect(orgId);
	}
});

//组织分配后回调方法
function afterSelect(orgId){
	var person_Id = $("#person_Id").val();
	if(!isNotNull(person_Id)){
		$('#personId').empty();
	}
	$.post(base+"/ebhouse/member/autoComplatePerson?random=" +  Math.round(Math.random()*100),{orgId:orgId,maxRows: 100},function(data){
		if(data.count>0){
			var html = "";
			var len = data.items ;
			$.each(data.items,function(i,ele){
				if(!isNotNull(person_Id)){
					if(person_Id == ele.id){
						$('#personId').append("<option value='"+ele.id+"' selected='selected'>" + ele.name + "(" + ele.personPosition.position.name + ")</option>");
					}else{
						$('#personId').append("<option value='"+ele.id+"'>"+ele.name+"(" + ele.personPosition.position.name + ")</option>");
					}
				}
				if(i == 0 ){
					html+='<ul >';
				}
				if(i!=0 && i % 3 == 0){
					html+='</ul><ul>';
					html+='<li onclick=selectLi(this,"'+ele.id+'");>'+ ele.personPosition.position.belongOrg.name + '--' + ele.name + ' ：<span key="' + ele.id + '">0</span></li>';
				}else{
					html+='<li onclick=selectLi(this,"'+ele.id+'");>'+ ele.personPosition.position.belongOrg.name + '--' + ele.name + ' ：<span key="' + ele.id + '">0</span></li>';
				}
				if(i == len && i%3 !=0 ){
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
		$.post(base+"/ebhouse/visitor/getAllotByOrgId?random=" +  Math.round(Math.random()*100),{orgId:orgId},function(data){
			$.each(data, function(i, ele){
				$("#allotPersons").find("span[key='"+ ele.personId +"']").html(ele.allotCount);
			});
		},'json');
	},500);
}

function selectLi(obj,id){
	var person_Id = $("#person_Id").val();
	if(person_Id == null || person_Id == ''){
		$('#personId').val(id);
		$("#allotPersons li").removeClass("selli");
		$(obj).addClass("selli");
	}
}

function saveBatchAllot(dlg){
	var personName = $("#personId").find('option:selected').text();
	var personId = $("#personId").val();
	if(!isNotNull(personId)){
		art.dialog.tips("请选择分配组织和分配人");
	}else{
		$("#personName").val(personName);
		$.post(getPath()+"/ebhouse/visitorOfPhone/saveBatchAllot",$('form').serialize(),function(res){
			if(res.STATE == "SUCC"){
				if(res.MSG){
					art.dialog.tips(res.MSG);
					art.dialog.data("reloadSearch")();
					setTimeout(function(){art.dialog.close();},1000);
				}else{
					art.dialog.close();
				}
			}else{
				art.dialog.tips(res.MSG);
			}
	    },'json');
	}
	

}