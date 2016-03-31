$(document).ready(function(){
	 
	//账号客户自动补全
	Autocomplete.init({
		$em:$( "#p2puserName" ),
		$obj:$('#p2puserId'),
		type:'POST',
		url:base+"/p2p/user/autoComplateUser?random=" +  Math.round(Math.random()*100),
		maxRows:12,
		param:{}
	});
	
	changeBank();
});

function saveAdd(){
	var p2puserId = $("#p2puserId").val();
	var cardNo = $("#cardNo").val();
	var bankId = $("#bankId").val();
	var branchId = $("#branchId").val();
	var flag = true;
	if(!isNotNull(p2puserId)){
		alert("客户名称不能为空.");
		$("#p2puserId").select();
		flag = false;
	}
	
	if(flag && !isNotNull(cardNo)){
		alert("账号不能为空.");
		$("#cardNo").select();
		flag = false;
	}
	
	if(flag && !isNotNull(bankId)){
		alert("请选择所属银行.");
		$("#bankId").select();
		flag = false;
	}
	
	if(flag && !isNotNull(branchId)){
		alert("请选择所属支行.");
		$("#branchId").select();
		flag = false;
	}
	if(flag){
		$("form").submit();
	}
}

function changeBank(){
	var bankId = $("#bankId").val();
	var dataBranchId = $("#dataBranchId").val();
	$("#branchId").empty();
	$.post(base+"/trade/branch/branchDataTree?random=" +  Math.round(Math.random()*100),{bankId:bankId,maxRows: 100},function(data){
		$("#branchId").append("<option value=''>---请选择支行---</option>");
		if(data.length>0){
			$.each(data,function(i,ele){
				if(dataBranchId == ele.id){
					$('#branchId').append("<option value='"+ele.id+"' selected='selected'>" + ele.name + "</option>");
				}else{
					$('#branchId').append("<option value='"+ele.id+"'>"+ele.name+"</option>");
				}
			});
		}
	},'json');
}


