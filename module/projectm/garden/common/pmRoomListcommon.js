/*$(document).ready(function(){
	
	Autocomplete.init({
		$em:$( "#orgName" ),
		$obj:$('#orgId'),
		//select:selectRos,
		//response:responseRos,
		url:getPath()+"/basedata/org/orgList",
		maxRows:4,
		afterSelect:afterSelect
	});
});*/
var roomListcommon={
	init:function(o){
		Autocomplete.init({
			$em:$( "#garden" ),
			$obj:$('#gardenId'),
			select:selectRos,
			response:responseRos,
			url:getPath()+"/broker/garden/getGardensByKey"
		});
	}
}


/*function afterSelect(id){
	$.post(base+'/basedata/person/selectPersonByOrg',{orgId:id},function(data){
		$.each(data,function(n,o){
			$('#dealPersonId').append("<option value='"+o.id+"'>"+o.name+"</option>");
		});
	},'json');
}*/

function responseRos(data,response){
	var propertyTypeNames = eval(data.propertyTypeName);  
	response( $.map( data.items, function( item ) {
		var propertyTypes = item.propertyTypes.split("#");
		var pdata = new Array();
		$.each(propertyTypes,function(index,temp){
			$.each(propertyTypeNames,function(nameIndex,nameTemp){
				 if(temp == nameTemp.id){
					 pdata.push(nameTemp);
				 }
			}) 
		});
		return {
			propertyTypeList:pdata, 
			name:item.name,
			label: item.name + (item.registerName ? ", " + item.registerName : "") + " (" + (item.geographyArea ? item.geographyArea.name : "")+")",
			value: item.id
		}
	}));
}

function selectRos(event,ui,em,obj){
	if($('#gardenId').val()!=ui.item.value){
		getBuildingInfo(ui.item.value);
		initRoomInfo();
	}
	getGardenInfo(ui.item,em,obj);
	return false;
}

function getGardenInfo(it,em,obj){
	/*var htmlStr = "";
	$.each(it.propertyTypeList,function(index,item){
		htmlStr+="<option value='"+item.id+"'>"+item.name+"</option>"
	})
	alert(htmlStr);
	$("#propertyType").html(htmlStr);*/
	$( "#garden" ).val( it.name); 
	$( "#gardenId" ).val( it.value );
}
function getBuildingInfo(id,buildId){
	if(id){
		$.post(getPath()+"/broker/building/getBuildingByGardenId",{gardenId:id,type:"UNIT"},function(result){
			//var resultData = jQuery.parseJSON(result);
			var tempHtmlStr = "<option value=''></option>";
			$.each(result.items,function(index,item){
				tempHtmlStr+="<option value='"+item.id+"'"+(index==0?"selected":"")+">"+item.name+item.unitName+"</option>"
			})
			$("#building").html(tempHtmlStr);
			$('option[value="'+buildId+'"]').attr('selected','selected');
			$("#building").change(function(){
				initRoomInfo();
			});
		},'json')
	}
}

function initRoomInfo(){
	$('#room_td input').val('');
	$('#room_td .ts').html('选择');
}

function viewRoomlisting(){
	var buildingid = $("#building").val(); 
	if(buildingid){
		var dlg =art.dialog.open(getPath() +"/broker/room/viewRoomlisting?buildingId="+buildingid,
		{
			id : "viewRoomlisting",
			title : '选择房间',
			background : '#333',
			width : 830,
			height : 380,
			lock : true,
			button : [ {
				className : 'aui_state_highlight',
				name : '确定',
				callback : function() {
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.pickRoom){
						dlg.iframe.contentWindow.pickRoom();
					}
					return false;
				}
			} , {
				name : '取消',
				callback : function() {
				}
			}]	
		});			
	}else{
		art.artDialog.alert("请选择一个楼盘楼栋"); 
	}
}

(function(){
	document.write('<link rel="stylesheet" href="'+base+'/default/js/control/jquery-ui-1.9.0/themes/base/jquery.ui.all.css"/> ');
	document.write('<script type="text/javascript" src="'+base+'/default/js/control/jquery-ui-1.9.0/ui/jquery.ui.core.js"></script>');
	document.write('<script type="text/javascript" src="'+base+'/default/js/control/jquery-ui-1.9.0/ui/jquery.ui.widget.js"></script> ');
	document.write('<script  type="text/javascript" src="'+base+'/default/js/control/jquery-ui-1.9.0/ui/jquery.ui.position.js"></script>');
	document.write('<script  type="text/javascript" src="'+base+'/default/js/control/jquery-ui-1.9.0/ui/jquery.ui.menu.js"></script>');
	document.write('<script type="text/javascript" src="'+base+'/default/js/control/jquery-ui-1.9.0/ui/jquery.ui.autocomplete.js"></script>');
	document.write(' <script src="'+base+'/default/js/common/Autocomplete.js" type="text/javascript"></script>');
})();

//<link rel="stylesheet" href="${base}/default/js/control/jquery-ui-1.9.0/themes/base/jquery.ui.all.css"/> 
//<script type="text/javascript" src="${base}/default/js/control/jquery-ui-1.9.0/ui/jquery.ui.core.js"></script> 
//<script type="text/javascript" src="${base}/default/js/control/jquery-ui-1.9.0/ui/jquery.ui.widget.js"></script> 	
//<script  type="text/javascript" src="${base}/default/js/control/jquery-ui-1.9.0/ui/jquery.ui.position.js"></script>
//<script  type="text/javascript" src="${base}/default/js/control/jquery-ui-1.9.0/ui/jquery.ui.menu.js"></script>
//<script type="text/javascript" src="${base}/default/js/control/jquery-ui-1.9.0/ui/jquery.ui.autocomplete.js"></script> 
// <script src="${base }/default/js/common/Autocomplete.js" type="text/javascript"></script>
