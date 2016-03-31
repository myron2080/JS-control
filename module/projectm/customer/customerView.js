$(document).ready(function(){
	$('#editData').bind('click',function(){
		$list_editUrl = getPath()+"/projectm/customer/edit";
		editRow({id:$('#dataId').val()});
	});
});

function saveCustomerFollow(obj){
	var content=$('#content').val();
	if(!content){
		art.dialog.tips('跟进内容不能为空');
		return false;
	}
	if(content.length>500){
		art.dialog.tips('跟进内容不能500个字符');
		return false;
	}
	
	var insertFollowUrl=getPath()+"/projectm/customer/saveFollow?customerId="+$('#dataId').val()+"&content="+content;
	$.post(insertFollowUrl,{},function(data){
		$('#content').val('');
		art.dialog.tips('成功跟进...');
		$data=$(data);
		$('[noCustomer]').hide();
		$('#cmrShow').prepend($data);
	});
}

var currPage=1;
var pageSize=5;
function viewMore(){
	currPage+=1;
	var customerId=$('#dataId').val();
	$.post(getPath()+"/projectm/customer/viewMore",{customerId:customerId,currPage:currPage,pageSize:pageSize},function(data){		
		$data=$(data);		
		var length=$data[0].value;
		if(length>0){
			$('#viewMore').show();
			$('#moreLength').html(length);
		}else{
			$('#viewMore').hide();
		}
		$('#cmrShow').append($data);
	});
}

$list_editWidth = "700px";
$list_editHeight = "480px";

function afterEditRow(){
	 window.location.reload();
}



