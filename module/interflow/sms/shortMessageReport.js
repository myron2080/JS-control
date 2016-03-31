$list_addUrl = getPath()+"/interflow/smsControl/viewShortMessage";//查看url
$list_editWidth = 450;
$list_editHeight = 140;

$list_dataType = "短信统计";//数据名称
 
$(document).ready(function(){
	 
	params ={};
	params.inputTitle = "发送时间";	
	MenuManager.common.create("DateRangeMenu","effectdate",params);
	$("#tableContainer").css("height",$(window).height()-10);
	bindEvent(); 
	//searchData();
	$("#headerDiv").css("width",$("#tableContainer").width()-17);
});

 

function bindEvent(){
	
 
	//查询
	$("#searchBtn").click(function(){
		searchData();
	});
	
	//清空
	$("#resetBtn").click(function(){
		MenuManager.menus["effectdate"].resetAll();
	});
	
}
//加载下级组织数据
function showLower(objId,number,longNumber,level){
	var type=$("#"+number).attr("keyType");//判断该行 是 展开 还是关闭
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["effectdate"]){
		queryStartDate = MenuManager.menus["effectdate"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["effectdate"].getValue().timeEndValue;
	}
	
	if(type == 'close'){// 关闭状态  即要进行展开操作
		$("#loadingDiv").show();
		$("#"+number).attr("keyType","open");
		$("#"+number).find("#imgSrc").attr("src",getPath()+"/default/style/images/performanceCenter/fold.png");
		$.post(base+'/interflow/smsControl/getSmsReport',{objId:objId,queryStartDate:queryStartDate,queryEndDate:queryEndDate},function(data){
			$("#loadingDiv").hide();
			if(null != data.smsReportList&&data.smsReportList.length>0){
				var tr="";
				for(var i=0;i<data.smsReportList.length;i++){
					var astr="";
					var obj=data.smsReportList[i];
					tr+="<tr id='"+obj.objNumber+"' keyType='close' key='"+obj.objLongNumber+"'>";
					tr+="<td><span style='margin-left:"+15*level+"px;'>";
					if(obj.objLongNumber.indexOf("_person") == -1){
						tr+="<a href='javascript:void(0);'; onclick=showLower('"+obj.objId+"','"+obj.objNumber+"','"+obj.objLongNumber+"','"+(parseInt(level)+1)+"');>";
						tr+="<img id='imgSrc' alt='展开' src='"+base+"/default/style/images/performanceCenter/unfold.png'></a>";
					}
					tr+=obj.objName+"</span></td>";
					tr+="<td>"+obj.totalSendAmount+"</td>";
					tr+="<td>"+obj.businessAmount+"</td>";
					tr+="<td>"+obj.adAmount+"</td>";
					tr+="<td>"+obj.totalChargeAmount+"</td>";
					tr+="</tr>";
				}
				$("#"+number).after(tr);
			}
		},'json');
	}else{
		$("#"+number).attr("keyType","close");
		$("#"+number).find("#imgSrc").attr("src",getPath()+"/default/style/images/performanceCenter/unfold.png");
		$("#shortMessageReportTbale tr").each(function(i,ob){
			if(i > 0){
				var key=$(ob).attr("key");
				if(key.indexOf(longNumber) != -1 && key != longNumber){
					$(ob).remove();
				}
			}
		});
	}
}
 
  
function searchData(){
	
	$("#loadingDiv").show();
	//录入时间
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["effectdate"]){
		queryStartDate = MenuManager.menus["effectdate"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["effectdate"].getValue().timeEndValue;
	}
	
	$.post(base + '/interflow/smsControl/initSmsReport',{queryStartDate:queryStartDate,queryEndDate:queryEndDate},function(data){
		$("#loadingDiv").hide();
		if(null != data.smsReportList&&data.smsReportList.length>0){
			var tr="";
			for(var i=0;i<data.smsReportList.length;i++){
				var astr="";
				var obj=data.smsReportList[i];
				tr+="<tr id='"+obj.objNumber+"' keyType='close' key='"+obj.objLongNumber+"'>";
				tr+="<td>";
				tr+="<a href='javascript:void(0);'; onclick=showLower('"+obj.objId+"','"+obj.objNumber+"','"+obj.objLongNumber+"','1');>";
				tr+="<img id='imgSrc' alt='展开' src='"+base+"/default/style/images/performanceCenter/unfold.png'></a>";
				tr+=obj.objName+"</span></td>";
				tr+="<td>"+obj.totalSendAmount+"</td>";
				tr+="<td>"+obj.businessAmount+"</td>";
				tr+="<td>"+obj.adAmount+"</td>";
				tr+="<td>"+obj.totalChargeAmount+"</td>";
				tr+="</tr>";
			}
			$("#shortMessageReportTbody").html(tr);
		}else{
			$("#shortMessageReportTbody").html("");
		}
		 
	},'json');
		
	 
}