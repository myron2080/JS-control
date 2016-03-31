
function initNOTACCEPTData(){
	$("#tab li").click(function(){
		$("#tab li").removeClass("hover");
		$(this).addClass("hover");
		searchData();
	});
	$("#talk").hide();
	$(".ds_title").hide();
	params ={};
	params.inputTitle = "发言日期";
	MenuManager.common.create("DateRangeMenu","createtTime",params);
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
	    columns: [ 
                  {display: '发言日期', name: 'createTimeStr', align: 'center', width: 150,isSort: true},
	              {display: '发言人', name: 'sender.name', align: 'center', width: 100,isSort: false},
	              {display: '接收人', name: 'receiver.name', align: 'center', width: 100,isSort: false},
	              {display: '内容', name: 'content', align: 'center', width: 250,render:operateRender,isSort: false},               
	          ],
	    checkbox:false,
	    fixedCellHeight:false,
	    delayLoad:true,
	    enabledSort:true,
	    url:getPath()+'/basedata/cchat/getChatRecord'
			
	}));
	searchData();
}
function operateRender(data,filterData){
	return convertImg(data.content);
}

//查询
function searchData(){
	$list_dataParam['type'] = $("#type").val();
	var kw = $('#key').val();
	kw = kw.replace(/^\s+|\s+$/g,'');
	$('#key').val(kw);
	if(kw==$('#key').attr('defaultValue')){
		kw='';
	}
	if(kw==null || kw == ''){
		delete $list_dataParam['key'];
	}else{
		$list_dataParam['key'] = kw;
	}
	var senderId = $('input[id="senderId"]').val();
	if(senderId != null && senderId != ""){
		$list_dataParam['senderId'] = senderId;
	}else{
		delete $list_dataParam['senderId'];
	}
	var receiverId = $('input[id="receiverId"]').val();
	if(receiverId != null && receiverId != ""){
		$list_dataParam['receiverId'] = receiverId;
	}else{
		delete $list_dataParam['receiverId'];
	}
	if($("#type").val()=='TWO'&&(senderId==null||senderId==''||receiverId==null||receiverId=='')){
		art.dialog.tips("请先选择发言人与接收人!");
		return ;
	}
	var queryStartDate = "";
	var queryEndDate = "";
	var queryDate = "";
	if(MenuManager.menus["createtTime"]){
		queryStartDate = MenuManager.menus["createtTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["createtTime"].getValue().timeEndValue;
	}
	if(queryStartDate == queryEndDate && queryEndDate != ""){
		$list_dataParam['queryDate'] = queryStartDate;
	}else{
		//查询开始时间
		if(queryStartDate != ""){
			$list_dataParam['queryStartDate'] = queryStartDate;
		} else {
			delete $list_dataParam['queryStartDate'];
		}
		//查询结束时间
		if(queryEndDate != ""){
			$list_dataParam['queryEndDate'] = queryEndDate;
		} else {
			delete $list_dataParam['queryEndDate'];
		}
		delete $list_dataParam['queryDate'];
	}
	resetList();
}


function clearAll(){
	$("#key").val($("#key").attr("defaultValue"));
	$('input[id="receiverId"]').val("");
	$('input[id="receiverName"]').val($('input[id="receiverName"]').attr("defaultValue"));
	$('input[id="senderId"]').val("");
	$('input[id="senderName"]').val($('input[id="senderName"]').attr("defaultValue"));
	$('#type').find("option").first().attr("selected","true");
	MenuManager.common.resetAll();
}

function getHouseName(oldObj,newObj,doc){

}





