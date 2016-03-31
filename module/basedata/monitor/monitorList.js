$list_editUrl = getPath()+"/basedata/monitor/edit";//编辑及查看url
$list_addUrl = getPath()+"/basedata/monitor/add";//新增url
$list_deleteUrl = getPath()+"/basedata/monitor/delete";//删除url
$list_dataType='应用';
$list_editWidth = "350px";
$list_editHeight = "150px";
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:250,allowLeftCollapse:true,allowLeftResize:true});
	//显示列表
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '操作', name: 'operate', align: 'center', width: 120,render:operateRender},
            {display: '系统', name: 'osName', align: 'center', width: 60},
            {display: '应用名称', name: 'tomcatName', align: 'center', width: 100},
            {display: '端口号', name: 'port', align: 'center', width: 60},
            {display: '应用路径', name: 'tomcatPath', align: 'left', width: 200},
            {display: '用户数', name: 'totalUser', align: 'left', width: 150,render:function(data){
            	if(data.runRedis){
            		$("#online").text(data.totalUser);
            		$("#online_pc").text(data.pcOnline);
            		$("#online_mobile").text(data.mobileOnline);
            		$("#onlineBox").show();
            		return 'redis' ;
            	}
            	return data.totalUser + '（pc:'+ data.pcOnline +',mobile:'+data.mobileOnline+'）' ;
            }},
            {display: '最大内存（M）', name: 'maxMemory', align: 'center', width: 80,render:function(data){
            	if(data.maxMemory!=null && data.maxMemory > 0){
            		return Math.round(data.maxMemory / 1024) ;
            	}
            	return '0' ;
            }},
            {display: '使用内存（M）', name: 'totalMemory', align: 'center', width: 80,render:function(data){
            	if(data.totalMemory!=null && data.totalMemory > 0){
            		return Math.round(data.totalMemory / 1024) ;
            	}
            	return '0' ;
            }},
            {display: '空闲内存（M）', name: 'freeMemory', align: 'center', width: 80,render:function(data){
            	if(data.maxMemory!=null && data.maxMemory > 0 && data.totalMemory!=null && data.totalMemory > 0 ){
            		var maxM = data.maxMemory / 1024 ;
            		var totalM = data.totalMemory / 1024 ;
            		return Math.round(maxM) - Math.round(totalM) ;
            	}
            	return '0' ;
            }}
        ],
        delayLoad:true,
        url:getPath()+'/basedata/monitor/getData'
    }));
	bandEnter('searchKeyWord');
	searchData();
	$(document).keydown(function(e){
		var charCode= ($.browser.msie)?e.keyCode:e.which;  
		if(charCode==13){  
			$("#searchBtn").click();
	    }});
});

function operateRender(data){
	return '<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a> | '
	+'<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
}
/**
 * 加载右边的数据
 */
function searchData(){
	//标签名
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
	resetList();
}
/**
 * 清空
 */
function cleanData(){
	$("#searchKeyWord").val($('#searchKeyWord').attr('defaultValue'));//清空关键字
}
/**
 * 绑定回车查询
 * @param id
 */
function bandEnter(id){
	$('#'+id).bind('keypress',function(event){
        if(event.keyCode == "13")    
        {
        	searchData();
        }
    });
}
