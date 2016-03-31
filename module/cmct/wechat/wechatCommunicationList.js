
$(document).ready(function(){
	$("#searchBtn").bind("click",function(){
		searchData();
	});
	
	params ={};
	params.width = 260;
	params.inputTitle = "发送日期";
	MenuManager.common.create("DateRangeMenu","createDate",params);
	
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '发送人', name: 'sendPerson.name', align: 'left', width: 70,hide:isShowpn},
            {display: '发送时间', name: 'sendTime', align: 'center', width: 150},
            {display: '接收人', name: 'receivePerson.name', align: 'left', width: 70},
            {display: '类型', name: 'type.name', align: 'center', width: 80},
            {display: '标题', name: 'title', align: 'center', width: 120},
            {display: '内容', name: 'content', align: 'center', width: 180},
            {display: '图片', name: '', align: 'center', width: 80,render:viewPic},
            {display: '操作', name: '', align: 'center', width: 80,render:renderTurnSend}
        ],
        delayLoad:true,
        url:getPath()+'/cmct/wechatCommunication/listData',
    }));
	searchData();
});

function renderTurnSend(data){
	return '<a href=javascript:turnSend({id:\''+data.id+'\'});>转发</a>';
}

function turnSend(data){
	art.dialog(
		{
			content:$('#turnPersonDiv')[0],
			title:'转发',
			id:'tuenSend',
			button:[{name:'确定',callback:function(){
				var personId=$('#personId').val();
				if(!personId){
					art.dialog.tips("预览人不能为空");
					return false;
				}
				turnWxMessage(data.id,personId,this);
				return false;
			}},{name:'取消',callback:function(){
				return true;
			}}]
		}
	);
}

function turnWxMessage(dataId,personId,currentDialog){
    var bottuns;
    if(currentDialog){
	   bottuns=currentDialog.config.button;
	   $(bottuns).each(function(){
		  var name=this.name; 
		  currentDialog.button({name:name,disabled:true});
	   });
	}
	$.post(getPath()+"/cmct/wechatCommunication/turnSend",{id:dataId,personId:personId},function(res){
		if(res.STATE=='SUCCESS'){
			art.dialog.alert("发送成功",function(){
				window.location.reload(); 
			});
		}else{
			$(bottuns).each(function(){
				  var name=this.name; 
				  currentDialog.button({name:name,disabled:false});
			});
			art.dialog.alert(res.MSG);
		}
	},'json');
}

function onEmpty(){
	MenuManager.menus["createDate"].resetAll();
	$("#key").val($("#key").attr("dValue"));
	clearDataPicker('person');
	$('#creatorName').val('发送人');
}

function viewPic(data){
	var str="";
	if(data.type && data.type.value=='PICT'){		
		str += '<a href=javascript:viewPicDetail({id:\''+data.id+'\',picUrl:\''+data.picUrl+'\'});>查看</a>';
	}
	return str;
}

function viewPicDetail(data){
	$('#bphoto02').attr("enlarger",imgBase+"/"+data.picUrl.replace("size","origin"));
	$('#bphoto02 img').attr("src",imgBase+"/"+data.picUrl.replace("size","origin"));
	EnlargerImg.init();
	art.dialog({
		content:$(".photo")[0],
		title:'图片查看',
		id:'viewPicDetail',
		button:[{name:'取消',callback:function(){
			return true;
		}}]
	});
}

$(document).keydown(function(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		$("#searchBtn").click();
     }
}); 

function searchData(){
	var sD = "";
	var eD = "";
	if(MenuManager.menus["createDate"]){//天
		sD = MenuManager.menus["createDate"].getValue().timeStartValue;
		eD = MenuManager.menus["createDate"].getValue().timeEndValue;
	}
	$list_dataParam['sendPersonId']=$("#personId").val();
	$list_dataParam['startDate']=sD;
	$list_dataParam['endDate']=eD;
	var key = $("#key").val();
	if(key!="" && key!=null && key!=$("#key").attr("dValue")){
		$list_dataParam['key'] = key;
	}else{
		delete $list_dataParam['key'];
	}
	$list_dataParam['personFlag']=personFlag;
	resetList();
}
 
 
 