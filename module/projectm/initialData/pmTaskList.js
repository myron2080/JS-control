$list_editUrl = getPath()+"/projectm/newTask/edit";//编辑及查看url
$list_addUrl = getPath()+"/projectm/newTask/add?isValid=1";//新增url
$list_deleteUrl = getPath()+"/projectm/newTask/delete";//删除url
$list_editWidth = "580px";
$list_editHeight = "320px";
$list_dataType = "任务";//数据名称
$(document).ready(function(){
	$("#main").ligerLayout({});
	$("#toolBar").ligerToolBar({
//		items:[{id:'add',text:'新增',click:addRow,icon:'add'}
//		       {id:'queryLog',text:'全部日志',click:function(){
//		    	   window.top.addTabItem('taskLog',getPath()+'/projectm/newTask/taskLogPage','定时任务日志');
//		       }},
		       
//		       {id:'sd',text:'查询',click:function(){
//		    	   searchData();
//		       }}
//		]
		});
	
	$("#toolBar").append(
			 '<li class="k01" id ="effectTime" style="width:200px;text-align:left;float:left;margin: 0 0 0 5px;">生效日期：不限<div class="k01_right"></div></li>'
	);
	
	$("#toolBar").append(
			'<div style="float:left;display:inline;margin-left:5px;">任务类型：'+
			'<select id="type" style="width: 90px;">'
			+'<option value="">全部</option>'
			+'<option value="CYCLE">循环任务</option>'
			+'<option value="ONCE">单次任务</option>'
			+'</select>'
			+'</div>'
	);
	
	$("#toolBar").append(
			'<div style="float:left;display:inline;margin-left:5px;">'
			 +'		<input style="float:none;" type="text" name="searchKeyWord" onfocus="if(this.value==this.defaultValue){this.value=\'\';}" onblur="if(this.value==\'\'){this.value=this.defaultValue;}" title="名称/说明" defaultValue="名称/说明" value="名称/说明" id="searchKeyWord" class="input"/>'
			+'</div>'
	);

	$("#toolBar").append(
			'<div style="float:left;display:inline;">'
	    	+'	<form onsubmit="searchData();return false;">'	
		    +'		<li class="bluebtn btn"><a href="javascript:void(0)"><span onclick="searchData();return false;" id="searchBtn"><img src='+getPath()+'/default/style/images/common/common_search.png />查询</span></a></li>'
		    +'		<li class="orangebtn btn"><a href="javascript:void(0)"><span onclick="addRow();return false;"><img src='+getPath()+'/default/style/images/common/common_plus.png />新增</span></a></li>'
	    	+'	</form>'
	    	+'</div>'
	);
	
	params ={};
	params.inputTitle = "生效日期";	
	MenuManager.common.create("DateRangeMenu","effectTime",params);
	
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend({},$list_defaultGridParam,{
        columns: [ 
            {display: '任务名称', name: 'name', align: 'left', width: 120},
            {display: '任务类型',name:'type.label',align:'center',width:70},
            {display: '生效日期',name:'effectDate',align:'right',width:80},
            {display: '任务说明',name:'description',align:'left',width:220},
            {display: '创建日期',name:'createTime',align:'right',width:80},
            {display: '任务操作', name: '', align: 'center', width: 150,render:oprator},
//            {display: '最后执行日期',name:'lastRunTime',align:'center',width:80},
//            {display: '最后执行状态', name: 'lastRunMsg', align: 'left', width: 120},
//            {display: '己执行次数',name:'times',align:'right',width:60},
//            {display: '执行时间',name:'time.label',align:'center',width:70},
//            {display: '当前状态', name: 'status.label', align: 'center', width: 70},
//            {display: '执行操作', name: '', align: 'center', width: 160,render:performOperator}
        ],
        url:getPath()+'/projectm/newTask/listData'
    }));
	$(document).keydown(function(e){
		var charCode= ($.browser.msie)?e.keyCode:e.which;  
		if(charCode==13){  
			$("#searchBtn").click();
	    }});
});

function performOperator(data){
	return '<a href="javascript:run({status:\''+data.status.name+'\',id:\''+data.id+'\'});">立即执行</a> | '+
	'<a href="javascript:lookLog({id:\''+data.id+'\',name:\''+data.name+'\'});">执行日志</a>';
}

function lookLog(data){
	window.top.addTabItem(data.id,getPath()+'/projectm/newTask/taskLogPage?taskId='+data.id+'&taskName='+data.name,data.name+"日志");
}

function run(row){
	if(row.status=='WAIT'){
	   art.dialog.confirm("确定立即执行任务?",function(){
		   $.post(getPath()+"/projectm/newTask/runTask",{id:row.id},function(res){
			   if(res.STATE=='SUCCESS'){
				   refresh();
			   }else{
				   art.dialog.tips(res.MSG);
			   }
		   },'json');
	   });
   }else{
	   art.dialog.tips("只能执行等待中的任务");
   }
}

function oprator(data){
	var statusStr = "";
	if(data.isValid == 1){
		statusStr = '<a id="'+data.id+'" href="javascript:setStatus({id:\''+data.id+'\'});">禁用</a>';
	}else{
		statusStr = '<a id="'+data.id+'" href="javascript:setStatus({id:\''+data.id+'\'});">启用</a>'
	}
	return '<a href="javascript:editRow({id:\''+data.id+'\'});">修改</a> | '+
	'<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a> | '+statusStr;
}

function setStatus(data){
	var url = getPath()+"/projectm/newTask/setStatus";
	if($("#"+data.id).text() != '禁用'){
		$.post(url,{id:data.id},function(res){
			var statusStr = "";
			if($("#"+data.id).text() == '禁用'){
				$("#"+data.id).html("启用");
			}else{
				$("#"+data.id).html("禁用");
			}
		},"json");
	}else{
		art.dialog.confirm('确定禁用该任务?',function(){
			$.post(url,{id:data.id},function(res){
				var statusStr = "";
				if($("#"+data.id).text() == '禁用'){
					$("#"+data.id).html("启用");
				}else{
					$("#"+data.id).html("禁用");
				}
			},"json");
		});
	}
	
	
}


function searchData(){
	//
	var kw = $('#searchKeyWord').val();
	kw = kw.replace(/^\s+|\s+$/g,'');
	$('#searchKeyWord').val(kw);
	if(kw==$('#searchKeyWord').attr('defaultValue')){
		kw='';
	}
	if(kw==null || kw == ''){
		delete $list_dataParam['key'];
	}else{
		$list_dataParam['key'] = kw;
	}
	
	//生效时间
	var queryStartDate = "";
	var queryEndDate = "";
	var queryDate = "";
	if(MenuManager.menus["effectTime"]){
		queryStartDate = MenuManager.menus["effectTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["effectTime"].getValue().timeEndValue;
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
	
	var status=$('#status').val();
	if(status==null || status == ''){
		delete $list_dataParam['status'];
	}else{
		$list_dataParam['status'] = status;
	}
	
	var type=$('#type').val();
	if(type==null || type == ''){
		delete $list_dataParam['type'];
	}else{
		$list_dataParam['type'] = type;
	}
	
	resetList();
}
