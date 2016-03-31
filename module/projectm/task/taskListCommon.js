var statusSelectTag = '<select id="overflag" name="overflag"><option value="">-全部-</option><option value="NO" selected="selected">开发未完成</option><option value="YES">开发已完成</option><option value="NOTVALIDATED">验证未完成</option><option value="VALIDATED">验证已完成</option></select>';


function overflagSelectChangeFun(){
	$("#overflag").change(function(){
		var selectedVal = $(this).find("option:selected").val()
		if('NO' == selectedVal){
			$("#queryStartDate").val('');
			$("#queryEndDate").val('');
		} else {
			$("#queryStartDate").val($("#queryStartDateStr").val());
			$("#queryEndDate").val($("#queryEndDateStr").val());
		}
	});
}

function modifyTempo(progressId,flag){
	if($list_editUrl && $list_editUrl!=''){
		var paramStr;
		if($list_editUrl.indexOf('?')>0){
			paramStr = '&VIEWSTATE=VIEW&id='+progressId+"&flag="+flag;
		}else{
			paramStr = '?VIEWSTATE=VIEW&id='+progressId+"&flag="+flag;
		}
		var dlg = art.dialog.open($list_editUrl+paramStr,
				{title:getTitle('VIEW'),
				lock:true,
				width:$list_editWidth||'auto',
				height:$list_editHeight||'auto',
				id:$list_dataType+'-VIEW',
				button:[{name:"确定",callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveTempo){
						dlg.iframe.contentWindow.saveTempo(this,flag);
					}
			    	return false;
			    }},{name:"取消"}
			    ],close:function(){
			    	searchData();
			    }});
	}
}

function tempoRender(data){
//	return ((data.tempo == '' || data.tempo == null) ? 0+ "%<a onclick='javascript:modifyProgress(\""+data.id+"\");'>修改进度</a>":(data.tempo >= 100 ? data.tempo+"%" : data.tempo+ "%<a onclick='javascript:modifyProgress(\""+data.id+"\");'>修改进度</a>"));
	if(null == $("#view").val() || '' == $("#view").val() || (null != $("#self").val() && '' != $("#self").val())){
		return "<a style='cursor:pointer;' onclick='javascript:modifyTempo(\""+data.id+"\",\"tempo\");'>"+((data.tempo == '' || data.tempo == null) ? 0 : data.tempo)+ "%</a>";
	} 
	return ((data.tempo == '' || data.tempo == null) ? 0 : data.tempo)+ "%";
}


function operateRender(data,filterData){
	var e = (data.status=='ENABLE'?'DISABLED':'ENABLE');
	var t = (data.status=='ENABLE'?'禁用':'启用');
	
		return '<a href="javascript:editRow({id:\''+data.id+'&copyAddFlag=true'+'\'});">复制新增</a>|' 
		  +'<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>|'
			+'<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>'
			;
}