$list_editWidth = "830px";
$list_editHeight = "380px";
$list_dataType = "客户";//数据名称

$(document).ready(function(){
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '名称', name: 'registerName', align: 'center', width: 80},
            {display: '推广名', name: 'name', align: 'center', width: 80},
            {display: '总建筑面积', name: 'allCoveredArea', align: 'center', width: 80},
            {display: '单元数', name: 'unitNum', align: 'center', width: 80,render:unitNumRender},
            {display: '操作', name: 'operate', align: 'center', width: 130,render:operateRender}
            ],
        parms:{gardenId:gardenId,cityId:cityId},
        url:getPath() + '/projectm/pmBuilding/listData',
        onDblClickRow : function (data, rowindex, rowobj) {
    		showInfo(data.tradeStatus,data.id);
        },
        toolbar:{
        	items:[{id:'add',text:'新增楼栋',click:buildAddUpdate,icon:'add'},
        			{id:'sort',text:'顺序调整',click:sort,icon:'modify'}
        			]
        }
    }));
	$("#tableContainer").css("width","97%");
	
});

function sort(){
	var sortUrl = getPath()+'/projectm/pmBuilding/sort?gardenId='+gardenId+"&cityId="+cityId;
	art.dialog.data("flag",false);
	var sortDlg=art.dialog.open(sortUrl, {
		id : 'sort',
		width : 350,
		title:"顺序调整",
		height : 400,
		lock:true,
		cancelVal: '关闭',
	    cancel: true ,
	    button:[{name:'确定',callback:function(){
			if(sortDlg.iframe.contentWindow && sortDlg.iframe.contentWindow.saveData){
				sortDlg.iframe.contentWindow.saveData(sortDlg);
			}
			return false;
		}}],
	    close:function(){
	    	if(art.dialog.data("flag")){	    		
	    		searchData();
	    	}
	    }
	});		
}

function deleteById(id){
	art.dialog.confirm("删除楼栋会同时删除该楼栋的单元，确定要删除吗？",function(){
		$.post(base+'/projectm/pmBuilding/deleteByID',{id:id,cityId:cityId,gardenId:gardenId},function(date){
			if(date.STATE=='SUCCESS'){
				art.dialog.tips('删除成功',null,"succeed");
				refresh();
			}else{
				art.dialog.tips('删除失败，请稍候再试');
			}
		},'json');
	});
}


function migrate(id,flag){
	var dlg=art.dialog.open(base+'/projectm/pmBuilding/toMigrate?id='+id+'&flag='+flag+"&cityId="+cityId+"&gardenId="+gardenId,{
		id:'migrate',
		title : "迁移楼栋",
		width : 300,
		height : 250,
		lock : true,
		button : [ {
			className : 'aui_state_highlight',
			name : '确定',
			callback : function() {
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAdd){
					dlg.iframe.contentWindow.saveAdd(dlg);
//					$("#dataForm").submit();
				}
				return false;
			}
		} , {
			name : '取消',
			callback : function() {
			}   
		}],
		close:function(){					
			refresh();
		 }
	});
}
function buildAddUpdate(obj){
	var type=typeof(obj);
	var id='';
	if(type=='string'){
		id=obj;
	}
	var title=(id==""?'新增楼栋':'修改楼栋')
	var dlg =art.dialog.open(base +"/projectm/pmBuilding/buildAddUpdate?id="+id+'&gardenId='+gardenId+"&cityId="+cityId,
		{
			id : "addBuilding",
			title : title,
			background : '#333',
			width : 900,
			height : 450,
			lock : true,
			button : [ {
				className : 'aui_state_highlight',
				name : '确定',
				callback : function() {
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveBuild){
						dlg.iframe.contentWindow.saveBuild(dlg);
					}
					//art.dialog.list['addIntention'].size(10,10);
					return false;
				}
			} , {
				name : '取消',
				callback : function() {
				}   
			}],
			close:function(){					
				searchData();
			 }
		});			
}

function buildCopy(id,name){
	art.dialog.data('buildParm','({id:"'+id+'",name:"'+name+'",cityId:"'+cityId+'"})');
	dlg=art.dialog.open(base+'/projectm/pmBuilding/toBuildCopy',{
		id:'buildCopy',
		title : "复制楼栋",
		width : 400,
		height : 450,
		lock : true,
		button : [ {
			className : 'aui_state_highlight',
			name : '确定',
			callback : function() {
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveData){
					dlg.iframe.contentWindow.saveData(dlg);
				}
				return false;
			}
		} , {
			name : '取消',
			callback : function() {
			}   
		}],
		close:function(){					
			refresh();
		 }
	});
}

function unitNumRender(data){
	var str=data.unitNum;
	if(data.unitName == '' && data.unitNum == 1){
		str = "无";
	}
	return str;
}


function operateRender(data,filterData){
	var opStr='';
	opStr+='<a href="javascript:buildAddUpdate(\''+data.id+'\');">编辑</a>';
	opStr+='|<a href="javascript:deleteById(\''+data.id+'\');">删除</a>';
	opStr+='|<a href="javascript:buildCopy(\''+data.id+'\',\''+data.registerName+'\');">复制</a>';
	
	var flag = unitNumRender(data);
	opStr+='|<a href="javascript:migrate(\''+data.id+'\',\''+flag+'\');">迁移</a>';
	return opStr;
}

function searchData(){
/*	var param = {};
	$('form').find('input,select').each(function(){
	  var v = $(this).val();
	  if(v){
		  if(!($(this).attr('id')=='key' && v==keyVal)){
			  param[$(this).attr('name')] = $(this).val();
		  }
	   }
	  });*/
	var params = {gardenId:gardenId,cityId:cityId};
	jQuery.extend($list_dataParam,params)
	resetList();
}


