$list_editUrl = getPath()+"/projectm/menu/edit";//编辑及查看url
$list_addUrl = getPath()+"/projectm/menu/add";//新增url
$list_deleteUrl = getPath()+"/projectm/menu/delete";//删除url
$list_editWidth = "500px";
$list_editHeight = "320px";
$list_dataType = "菜单";//数据名称
 
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:250,allowLeftCollapse:true,allowLeftResize:true});
	/*$("#toolBar").ligerToolBar({
		items:[{id:'add',text:'新增二级菜单',click:addMenuL2,icon:'add'}]
		});*/
	$("#leftToolBar").ligerToolBar({
		items:[
		       {id:'addNode',text:'新增',click:addMenuL1,icon:'add'},
		       {id:'updateNode',text:'编辑',click:editMenuL1,icon:'modify'},
		       {id:'deleteNode',text:'删除',click:deleteMenuL1,icon:'delete'}
		       ]
		});
	initMenuData(1);
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '名称', name: 'name', align: 'left', width: 80},
            {display: '编码', name: 'number', align: 'left', width: 80},
            {display: '上级菜单', name: 'parent.name', align: 'left', width: 80},
            {display: '权限', name: 'permissionItem.name', align: 'left', width: 80},
            {display: '图标', name: '', align: 'center', width: 35,render:iconRender},
            {display: '描述', name: 'description', align: 'left', width: 350},
            {display: '操作', name: 'operate', align: 'center', width: 140,render:operateRender}
        ],
        url:getPath()+'/projectm/menu/listData',
        delayLoad:true
    }));
	searchData(); 
});
function iconRender(data,filterData){
		var imgDis =   '';
		if(data.largeIcon){
			imgDis = '<img width="20px" height="20px"  src="'+base+'/images/'+data.largeIcon+'"/>  ';
		}
		return imgDis;
}
function operateRender(data,filterData){
	var opeStr =  '<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a> |'
	+'<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>' ;
	if(data.enableFlag=="N"){
		opeStr+=' |<a href="javascript:updateEnableFlag(\''+data.id+'\',\'Y\');">启用</a>';
	}else{
		opeStr+=' |<a href="javascript:updateEnableFlag(\''+data.id+'\',\'N\');">禁用</a>';
	}
	
	return opeStr;
}

function updateEnableFlag(id,enableFlag){
 
	$.post(getPath()+"/projectm/menu/updateEnableFlag",{id:id,enableFlag:enableFlag},function(data){
	 
		searchData(); 
		 
	},'json');
	 
}

var parentMenuId = ""; 

function addMenuL2(){
	 
	if(!parentMenuId){
	 
	  art.dialog.tips("请选择父级菜单!");
	  return ;
	}
	addRow();
}

function getAddRowParam(){
	 
	if(parentMenuId){
		return {parent:parentMenuId};
	}else{
	 
	  art.dialog.tips("请选择父级菜单!");
		 
	}
	return null;
}

 
function searchData(){
	$list_dataParam['businessType'] = bustr;
	if(parentMenuId){
		 
		$list_dataParam['parent'] = parentMenuId;
		delete $list_dataParam['allChild']; 
	}else{
		$list_dataParam['allChild'] = "Y";
		delete $list_dataParam['parent'];
	}
	 
	resetList();
}


function pagGetMenuData(id){
	var page = parseInt($("#pagediv").attr("currPage"));//当前页
	var count = parseInt($("#pagediv").attr("total"));//总页数
	if(id=="prev"){
		 
		initMenuData(page-1);
		$("#next").show();
		if(page==2){
			 $("#prev").hide();
		}else{
			$("#prev").show();
		}
		
	}else{
		
		initMenuData(page+1);
		$("#prev").show();
		if(page==(count-1)){
			 $("#next").hide();
		}else{
			$("#next").show();
		}
	}
}

function selectMenu(obj){
	parentMenuId = $(obj).attr("id");
	$(obj).addClass("selectedTr").siblings("tr").removeClass("selectedTr");
	searchData();
}


function initMenuData(page){
	if(!page) page = 1;
	 
	var param = {};
	param.currentPage = page;
	var screenHeight = $(window).height();
	param.pageSize = Math.ceil((screenHeight-120)/25);
	$.post(getPath()+"/projectm/menu/listMenuL1",param,function(data){ 
		 
		$("#menuL1ListDiv").html('');
		if(data && data.items){
			var menuHtml = '<table style="border:sold 0;line-height: 25px;width:98%;">';
			menuHtml += ('<tr onclick="selectMenu(this)" class="selectedTr" style="cursor:pointer;" "><td> 全部： </td></tr>');
			for(var i=0;i<data.items.length;i++){
				var menu = data.items[i];
				var imgDis ='';
				if(menu.miniIcon){
					imgDis = '<img  src="'+base+'/images/'+menu.miniIcon+'"/>  ';
				}
				menuHtml += ('<tr onclick="selectMenu(this)" style="cursor:pointer;" id="'+menu.id+'"><td>'+imgDis+menu.name+'('+menu.number+') </td></tr>');
			}
			menuHtml += '</table>';
			var total = Math.floor(data.count%data.pageSize==0?data.count/data.pageSize:data.count/data.pageSize+1);
			$("#pagediv").attr("currPage",page);//当前页
			$("#pagediv").attr("total",total);//总页数
			if(total && total>1){
				$("#pagediv").show();
			}else{
				$("#pagediv").hide();
			}
			$("#menuL1ListDiv").html(menuHtml);
		}
		
	},'json');
}


function addMenuL1(){ 
	var $list_addUrl =  getPath()+"/projectm/menu/addMenuL1";
	var flag = true;
	var dlg = art.dialog.open($list_addUrl,
			{title:"新增一级菜单",
			 lock:true,
			 width:300||'auto',
			 height:220||'auto',
			 id:"一级菜单-ADD",
			 button:[{name:'确定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAdd){
						dlg.iframe.contentWindow.saveAdd(this);
					}
					return false;
				}},{name:'取消',callback:function(){
					flag = false;
					return true;
				}}],
			 close:function(){
				 initMenuData(1);
			 }
			});
}

function editMenuL1(){ 
	if(!parentMenuId){
		art.dialog.tips("请选择要修改的菜单!");
		return ;
	}
	var $list_addUrl =  getPath()+"/projectm/menu/editMenuL1?id="+parentMenuId;
	var flag = true;
	var dlg = art.dialog.open($list_addUrl,
			{title:"修改一级菜单",
			 lock:true,
			 width:300||'auto',
			 height:220||'auto',
			 id:"一级菜单-EDIT",
			 button:[{name:'确定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAdd){
						dlg.iframe.contentWindow.saveAdd(this);
					}
					return false;
				}},{name:'取消',callback:function(){
					flag = false;
					return true;
				}}],
			 close:function(){
				 if(flag){
					  
					 initMenuData(1);
				 }
			 }
			});
}

function deleteMenuL1(){
	if(!parentMenuId){
		art.dialog.tips("请选择要删除的菜单!");
		return ;
	} 
	if($list_deleteUrl && $list_deleteUrl!=''){
		art.dialog.confirm('确定删除该行数据?',function(){
			$.post($list_deleteUrl,{id:parentMenuId},function(res){
				art.dialog.tips(res.MSG);
				if(res.STATE=='SUCCESS'){
					initMenuData(1);
				}
			},'json');
			return true;
		},function(){
			return true;
		});
	}
}

 