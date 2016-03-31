$(document).ready(function(){
	
	$('.Queryan1').bind("click",function(){
		searchData();
	})
	
	$('.Emptyan').bind("click",function(){
		$('#key').val($('#key').attr("dValue"));
	})
	
	$('.Options li').bind('click',function(){
		$(this).find("a").addClass("now");
		$(this).siblings().find("a").removeClass("now");
		searchData();
	});
	
	$('#currentPage').bind('blur',function(){
		currentPage=$(this).val();
		searchData(currentPage);
	});
	
	searchData();
});

function checkNan(obj){
	var val=$(obj).val();
	if(isNaN(val)){
		$(obj).val(1);
		return;
	}
	if(val>totalPage){
		$(obj).val(totalPage);
	}
}

var currentPage=1;
var pageSize=5;
var totalPage=1;
function searchData(index){
	if(!index){
		currentPage=1;
	}else if(index=='prev'){
		if(currentPage==1){
			currentPage=1;
		}else{
			currentPage--;
		}
	}else if(index=='next'){
		if(currentPage==totalPage){
			currentPage=currentPage;
		}else{
			currentPage++;
		}
	}else if(index=="first"){
		currentPage=1;
	}else if(index=="last"){
		currentPage=totalPage;
	}else{
		currentPage=index;
	}
	var param={};
	param.currentPage=currentPage;
	param.pageSize=pageSize;
	param.setType=$(".Options a[class='now']").attr("key");
	if($('#key').val()!=$('#key').attr("dValue")){
		param.keyWord=$('#key').val();
	}
	$.post(getPath()+"/fastsale/buyer/selectLineData",param,function(res){
		$('[member]').remove();
		totalPage = res.recordCount % res.pageSize == 0 ?(res.recordCount/res.pageSize): Math.floor(res.recordCount/res.pageSize)+1;
		if(totalPage==0){
			totalPage=1;
		}
		$('#totalPage').text('/'+totalPage);
		currentPage=res.currentPage;
		$('#currentPage').val(currentPage);
		$('#pageSize').text(pageSize);
		$('#recordCount').text(res.recordCount);
		if(res.items && res.items.length>0){
			var showList=res.items;
			for(var i=0;i<showList.length;i++){
					var personName="";
					if(showList[i].currentUser){
						personName=showList[i].currentUser.name;
					}
					var onlineTime="";
					if(showList[i].onlineTime){
						onlineTime=showList[i].onlineTime;
					}
					
					$('<tr member>'+
				        '<td bgcolor="#FFFFFF">'+accAdd(pageSize*(currentPage-1),accAdd(1,i))+'</td>' +
				        '<td bgcolor="#FFFFFF">'+showList[i].org.name+'</td>'+
				        '<td bgcolor="#FFFFFF">'+showList[i].showPhone+'</td>'+
				        '<td bgcolor="#FFFFFF">'+showList[i].alias+'</td>'+
				        '<td bgcolor="#FFFFFF">'+showList[i].setType.name+'</td>'+
				        '<td bgcolor="#FFFFFF">'+personName+'</td>'+
				        '<td bgcolor="#FFFFFF">'+onlineTime+'</td>'+
				        '<td bgcolor="#FFFFFF"><a href="javaScript:void(0);" onclick=saveSelect(\''+showList[i].id+'\',\''+showList[i].userId+'\',\''+showList[i].password+'\',\''+showList[i].orgInterfaceId+'\',\''+
						  showList[i].loginNumber+'\',\''+showList[i].alias+'\',\''+showList[i].showPhone+'\',\''+showList[i].defaultShowPhone+'\',\''+
					      showList[i].setType.value+'\',\''+showList[i].org.longNumber+'\',\''+showList[i].mac+'\',\''+showList[i].phoneType+'\',\''+
						  showList[i].httpUrl+'\',\''+showList[i].spid+'\',\''+showList[i].passWd+'\')>使用</a></td>'+
			 	     '</tr>').appendTo('#memberTable');
			}
		}
	},'json');
}

function saveSelect(lineId,userId,password,orgId,loginNumber,alias,showPhone,defaultShowPhone,setType,currUserOrgId,mac,phoneType,httpUrl,spid,passWd){
	var currOrgLongNumber = $("#currOrgLongNumber").val();
	var currMac = $("#currMac").val();
	if(currOrgLongNumber.indexOf(currUserOrgId)==-1){
		art.dialog.confirm("是否选择非本部门线路？",function(){
			art.dialog.data("selectLineAfter")(lineId,userId,password,orgId,loginNumber,alias,showPhone,defaultShowPhone,setType,currUserOrgId,mac,phoneType,httpUrl,spid,passWd,"YES");
			art.dialog.close();
		});
	}else if(currMac!=null && currMac!="" && mac!=null && mac!="" &&  currMac!=mac){
		art.dialog.confirm("该线路绑定的不是当前登录系统的电脑，是否使用？",function(){
			art.dialog.data("selectLineAfter")(lineId,userId,password,orgId,loginNumber,alias,showPhone,defaultShowPhone,setType,currUserOrgId,mac,phoneType,httpUrl,spid,passWd,"YES");
			art.dialog.close();
		});
	}else{
		art.dialog.data("selectLineAfter")(lineId,userId,password,orgId,loginNumber,alias,showPhone,defaultShowPhone,setType,currUserOrgId,mac,phoneType,httpUrl,spid,passWd,"YES");
		art.dialog.close();
	}
}