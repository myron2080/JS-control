$list_addUrl = getPath()+'/ebsite/message/add';
$list_editUrl = getPath()+'/ebsite/message/edit';
$list_deleteUrl = getPath()+'/ebsite/message/delete';

$list_editWidth = "500px";
$list_editHeight = "450px";
$(function(){
	//数据列表
	$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '操作', name: 'operate', align: 'center', width: 130,render:operateRender},
            {display: '标题', name: 'url', align: 'center', width:200},
			{display: '内容', name: 'content', align: 'center', width:80},
			{display: '消息类型', name: 'messageSet.name', align: 'center', width:130},
			{display: '是否阅读', name: 'status.name', align: 'center', width:150},
			{display: '发送日期', name: 'createTime', align: 'center', width:150},
			{display: '接收人', name: 'receiver.userName', align: 'center', width:150}
        ],
        url: getPath()+"/ebsite/message/listData"
    }));
	
	//回车事件
	$('#keyWord').on('keyup', function(event) {
        if (event.keyCode == "13") {
        	searchData();
        }
    });
});

//操作
function operateRender(data){
	var src = "";
	if(edit == "Y"){
		src+= '<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>';
	}
	if(del == "Y" && edit == "Y"){
		src+= '|<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
	} else if(del == "Y"){
		src+= '<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
	}
   return src;
	
}

//查询
function searchData(){
	var msgType =   $("#msgType").val();
	if(msgType){
		$list_dataParam['msgType'] = msgType;
	} else{
		delete $list_dataParam['msgType'];
	}
	var status =   $("#status").val();
	if(status){
		$list_dataParam['status'] = status;
	} else{
		delete $list_dataParam['status'];
	}
	var keyWord= $("#keyWord").val().trim();
	if(keyWord && ($('#keyWord').attr("defaultValue") != keyWord)){
		$list_dataParam['keyWord'] = keyWord;
	} else{
		delete $list_dataParam['keyWord'];
	}
	resetList();
}
//清空
function onEmpty(){
	delete $list_dataParam['keyWord'];
	delete $list_dataParam['msgType'];
	delete $list_dataParam['status'];
	$("#msgType").val('');
	$("#status").val('');
	$("#keyWord").attr("value", $("#keyWord").attr("defaultValue"));
	searchData();
}
//增加行
function addRow(source){
	if($list_addUrl && $list_addUrl!=''){
		var paramStr = '';
		if($list_addUrl.indexOf('?')>0){
			paramStr = '&VIEWSTATE=ADD';
		}else{
			paramStr = '?VIEWSTATE=ADD';
		}
		if(typeof(getAddRowParam) == "function"){
			var param = getAddRowParam();
			//临时增加不满足则不打开窗口
			if(param=='notValidate') return;
			if(param){
				for(var p in param){
					paramStr = paramStr + '&' + p + '=' + param[p];
				}
			}
		}
		var flag = true;
		var dlg = art.dialog.open($list_addUrl+paramStr,
				{title:getTitle('ADD'),
				 lock:true,
				 width:$list_editWidth||'auto',
				 height:$list_editHeight||'auto',
				 id:$list_dataType+"-ADD",
				 title:'消息新增',
				 button:[{
						name:"保存",callback:function(){
							var url=this.iframe.contentWindow.$("#url").val().trim();
							var mobilePhone=this.iframe.contentWindow.$("#mobilePhone").val().trim();
							var all = this.iframe.contentWindow.$("#all").attr("checked");
							var msgType = this.iframe.contentWindow.$("#msgType").val();
							if(url==""){
								art.dialog.tips('标题不能为空');
								return false;
							}
							if(msgType==null){
								art.dialog.tips('消息类型不能为空');
								return false;
							}
							var content=this.iframe.contentWindow.$("#content").val();
							if(content==""){
								art.dialog.tips('消息内容不能为空');
								return false;
							} else if(content.length > 200){
								art.dialog.tips('消息内容不能大于200个字');
								return false;
							}
							if(mobilePhone=="" && all != "checked"){
								art.dialog.tips('接收人不能为空');
								return false;
							}
							$.post(getPath()+"/ebsite/message/save",{receiverId:this.iframe.contentWindow.$("#receiverId").val(),url:this.iframe.contentWindow.$("#url").val(),msgType:this.iframe.contentWindow.$("#msgType").val(),content:this.iframe.contentWindow.$("#content").val(),all:this.iframe.contentWindow.$("#all").attr("checked")},function(data){
								if(data.MSG == "保存成功"){
									art.dialog.data(data.flag);
									art.dialog.tips("保存成功", null, "succeed");
								} else{
									art.dialog.tips("保存失败");
								}
							},"json");
						}
					},{
						name:"关闭",callback:function(){
							flag = false;
						}
					}]
				});
	}
}
