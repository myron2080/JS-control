var loadingDataFlag = true;	//加载数据标识 勿删  用于剔除重复加载数据用的
$list_editWidth = 450;
$list_editHeight = 140;
var currentPage = 1;
$(document).ready(function(){
	queryCallReport(1);
	registerScrollFun($('#tableContainer'));
});

var param = {};
function loadmoreData(){
	queryCallReport(currentPage + 1);
}

function getCurrentContextHeight(comp){
	return $("#show_table").height();
}
function scrollLoadBackFun(){
	if(loadingDataFlag){
		loadingDataFlag = false;
		loadmoreData();
	}
}

function queryCallReport(page){
	$("#moreData_a").hide();
//	showload("moreData");
	param.pageSize = 20 ;
	param.currentPage = page||1 ;
	currentPage= page;
	$('#loadingDiv').show();
	$.post(base+"/interflow/callReport/getCallReport",param,function(res){
		$('#loadingDiv').hide();
		var data = res.items;
		for(var i = 0;i<data.length;i++){
			loadingDataFlag = true;
			var THE_SUCC = data[i].callSuccCumulative;
			var COST_TIME = data[i].durationCumulative;
			var day = parseInt(COST_TIME/(60*60*24));
			var hh = parseInt((COST_TIME - (day*(60*60*24)))/3600);
			var mm = parseInt((COST_TIME - (day*(60*60*24)) - (hh*(60*60)))/60);
			var LV_NAME = "状元";
			var LV = "LV.8";
			if(THE_SUCC <= 500){
				LV_NAME = "小混混";
				LV = "LV.1";
			}else if(THE_SUCC <= 1200 && THE_SUCC>500){
				LV_NAME = "学渣";
				LV = "LV.2";
			}else if(THE_SUCC <= 2000 && THE_SUCC>1200){
				LV_NAME = "学徒";
				LV = "LV.3";
			}else if(THE_SUCC <= 3000 && THE_SUCC>2000){
				LV_NAME = "学霸";
				LV = "LV.4";
			}else if(THE_SUCC <= 5000 && THE_SUCC>3000){
				LV_NAME = "助教";
				LV = "LV.5";
			}else if(THE_SUCC <= 8000 && THE_SUCC>5000){
				LV_NAME = "讲师";
				LV = "LV.6";
			}else if(THE_SUCC <= 12000 && THE_SUCC>8000){
				LV_NAME = "导师";
				LV = "LV.7";
			}else if(THE_SUCC <= 20000 && THE_SUCC>12000){
				LV_NAME = "叫兽";
				LV = "LV.8";
			}else if(THE_SUCC <= 30000 && THE_SUCC>20000){
				LV_NAME = "院长";
				LV = "LV.9";
			}else if(THE_SUCC <= 50000 && THE_SUCC>30000){
				LV_NAME = "砖家";
				LV = "LV.10";
			}else {
				LV_NAME = "唐僧";
				LV = "LV.11";
			}
			var orgName="";
			if(data[i].org){
				orgName=data[i].org.name;
			}
			$('<tr>' + 
				    '<td width="14%" height="28" align="center" bgcolor="#FFFFFF">' + LV_NAME + '</td>' +
				    '<td width="10%" height="28" align="center" bgcolor="#FFFFFF">' + LV + '</td>' +
				    '<td width="15%" height="28" align="center" bgcolor="#FFFFFF">' + data[i].person.name + '</td>' +
				    '<td width="21%" height="28" align="center" bgcolor="#FFFFFF">' + orgName+ '</td>' +
				    '<td width="17%" height="28" align="center" bgcolor="#FFFFFF">' + data[i].callSuccCumulative + '</td>' +
				    '<td width="17%" height="28" align="center" bgcolor="#FFFFFF">' + day + '天' + hh + '个小时' + mm + '分</td>' +
				  '</tr>').appendTo("#show_table");
		}
//		hideload();
		if(res.pageCount <= currentPage){
			$("#moreData_a").remove();
		}else{
			$("#moreData_a").show();
		}
	},'json');
}
