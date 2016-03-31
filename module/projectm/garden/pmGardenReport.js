$(document).ready(function(){
	//查询
	$("#query").bind("click",function(){
		//检查参数
		queryData();
	});	
	queryData();
	$(".yeji_table").height($(document.body).height()-70);
});

/**
 * 查询
 */
function queryData(){
	var city = $("#City").val();
	if(!city){
		art.dialog.tips('城市不能为空');
		$("#loading").hide();
		return false;
	}
	var types = $("#tempYT").find("input[name=propertyTypes]:checked");
	var typeStr = "";
	for(var i=0;i<types.length;i++){
		if(i==types.length-1){
			typeStr += types[i].value;
		}else{
			typeStr += types[i].value+',';
		}
	}
	$("#loading").show();
	init(city,typeStr);
}

/**
 * 初始化列表
 */
function init(cityId,types){
	$.post(base + '/projectm/pmGarden/gardenReportData',{cityId:cityId,types:types,areaType:'REGION'},function(data){
		
		var area = data.area;
		var divStr='';
		divStr+="<tr id='"+area.areaId+"' keyType='open' key='"+area.areaNumber+"'>";
		divStr+="<td>";
		divStr+="<a href='javascript:void(0)' onclick=\"showLower('"+area.areaId+"','"+area.areaId+"','"+area.areaNumber+"','','','CITY')\">";
		divStr+="<img id='imgSrc' src='"+base+"/default/style/images/performanceCenter/fold.png'>";
		divStr+="</a>";
		divStr+=area.areaName+"</td>";
		divStr+="<td>"+area.ALLCOUNT+"</td>";
		divStr+="<td>"+area.BUILDCOUNT+"</td>";
		divStr+="<td>"+area.IMAGECOUNT+"</td>";
		divStr+="<td>"+area.HAVECOUNT+"</td>";
		divStr+="<td>"+area.ROOMCOUNT+"</td>";
		divStr+="</tr>";
		$("#performanceTbody").html(divStr);
		
		if(data.dataList!=null&&data.dataList.length>0){
//			divStr="";
			for(var i=0;i<data.dataList.length;i++){
				var area=data.dataList[i];
				divStr+="<tr id='"+area.areaId+"' keyType='close' key='"+area.areaNumber+"'>";
				divStr+="<td><span style='margin-left:15px;'>";
				if(area.areaType == "CITY" || area.areaType == "REGION"){
					divStr+="<a href='javascript:void(0)' onclick=\"showLower('"+area.areaId+"','"+area.areaId+"','"+area.areaNumber+"','','','GEOGRAPHY')\">";
					divStr+="<img id='imgSrc' src='"+base+"/default/style/images/performanceCenter/unfold.png'>";
					divStr+="</a>";
				}
				divStr+=area.areaName+"</td>";
				divStr+="<td>"+area.ALLCOUNT+"</td>";
				divStr+="<td>"+area.BUILDCOUNT+"</td>";
				divStr+="<td>"+area.IMAGECOUNT+"</td>";
				divStr+="<td>"+area.HAVECOUNT+"</td>";
				divStr+="<td>"+area.ROOMCOUNT+"</td>";
				divStr+="</tr>";
			}
			$("#performanceTbody").html(divStr);
		}else{
			$("#performanceTbody").html("");
		}
		var type=data.showType;
		$("#loading").hide(); 
//		changeTable();
	},'json');
	
}

//加载下级组织数据
function showLower(areaId,number,longNumber,bigDate,endDate,level){
	var types = $("#tempYT").find("input[name=propertyTypes]:checked");
	var typeStr = "";
	for(var i=0;i<types.length;i++){
		if(i==types.length-1){
			typeStr += types[i].value;
		}else{
			typeStr += types[i].value+',';
		}
	}
	var type=$(document.getElementById(number)).attr("keyType");//判断该行 是 展开 还是关闭
	if(areaId==$("#City").val()){
		queryData();
		return;
	}
	if(type == 'close'){// 关闭状态  即要进行展开操作
		$("#"+number).attr("keyType","open");
		$("#"+number).find("#imgSrc").attr("src",getPath()+"/default/style/images/performanceCenter/fold.png");
		$.post(base+'/projectm/pmGarden/gardenReportData',{cityId:$("#City").val(),types:typeStr,parentId:areaId,areaType:level},function(data){
			if(null != data.dataList&&data.dataList.length>0){
				var tr="";
				for(var i=0;i<data.dataList.length;i++){
					var astr="";
					var obj=data.dataList[i];
					var area=data.dataList[i];
					tr+="<tr id='"+obj.areaId+"' keyType='close' key='"+obj.areaNumber+"'>";
					tr+="<td><span style='margin-left:"+15*2+"px;'>";
					if(area.areaType == "CITY" || area.areaType == "REGION"){
						tr+="<a href='javascript:void(0)'; onclick=showLower('"+obj.areaId+"','"+obj.number+"','"+obj.longNumber+"','','','"+area.areaType+"');>";
						tr+="<img id='imgSrc'  src='"+base+"/default/style/images/performanceCenter/unfold.png'></a>";
					}
					tr+=obj.areaName+"</span></td>";
					tr+="<td>"+obj.ALLCOUNT+"</td>";
					tr+="<td>"+obj.BUILDCOUNT+"</td>";
					tr+="<td>"+obj.IMAGECOUNT+"</td>";
					tr+="<td>"+obj.HAVECOUNT+"</td>";
					tr+="<td>"+obj.ROOMCOUNT+"</td>";
					tr+="</tr>";
				}
				$("#"+number).after(tr);
//				changeTable();
			}
		},'json');
	}else{
		$("#"+number).attr("keyType","close");
		$("#"+number).find("#imgSrc").attr("src",getPath()+"/default/style/images/performanceCenter/unfold.png");
		$("#performanceTbale tr").each(function(i,ob){
			if(i > 0){
				var key=$(ob).attr("key");
				if(key.indexOf(longNumber) != -1 && key != longNumber){
					$(ob).remove();
				}
			}
		});
	}
}

