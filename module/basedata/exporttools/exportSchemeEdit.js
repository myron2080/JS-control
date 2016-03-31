var columnEditGrid = null;
var filterEditGrid = null;
var $list_dataGrid;
var $list_defaultGridParam = {//默认表格设置
		allowUnSelectRow:true,
		width: '100%', 
	    height: '100%', 
	    checkbox: false,
	    rownumbers:true,
	    enabledSort:false,
	    pageSize:20,
	    //以下用于兼容后台的pagination
	    pageParmName:'currentPage',
	    pagesizeParmName:'pageSize',
	    root:'items',
	    record:'recordCount',
	    pageSize:30,
	    pageSizeOptions:[20,30,40,60,100],
	    showtime:true,
	    onSuccess:function(data,grid){
	    	$list_currentPageData = data;
	    	if(this.options.showtime){
	    		isAppendTime(data);
	    	}
	    	
	    },
	    onBeforeShowData:function(data){
	    	//用于支持多级取值方式绑定如name:'data.aa.dd.bcc'的方式
	    	function updateColumnData(column,grid){
	    		var name = column.columnname;
	    		if(name && name.indexOf('.')>0){
	    			if(data.items){
		       			 for(var i = 0; i < data.items.length; i++){
		       				updateColumnValueByName(data.items[i],column,grid.options.tree);
		       			 }
	    			}
	    		}
	    		if(column.columns && column.columns.length > 0){
	    			for(var i = 0; i < column.columns.length;i++){
	    				updateColumnData(column.columns[i],grid);
	    			}
	    		}
	    	}
	    	if(this.columns){
	    		for(var i = 0; i < this.columns.length;i++){
	    			updateColumnData(this.columns[i],this);
	    		}
	    	}
	    	return true;
	    },
	    onDblClickRow:function(rowData,rowIndex,rowDomElement){
	    	viewRow(rowData);
	    }
	};
$(document).ready(function(){
	$('#main').ligerLayout({});
	filterEditGrid = $('#filterEditGrid').ligerGrid($.extend({},$edit_defaultGridParam,{
		toolbar:{
			items:[
			    {name:'add',text:'增加',click:function(){
			    	filterEditGrid.addRow({});
				},icon:'add'},
				{name:'delete',text:'删除',click:function(){
					filterEditGrid.deleteSelectedRow();
				},icon:'delete'},
				{name:'fup',text:'上移',click:function(){
					var row = filterEditGrid.getSelectedRow();
					if(row){
						filterEditGrid.up(row);
					}
				},icon:'up02'},
				{name:'fdown',text:'下移',click:function(){
					var row = filterEditGrid.getSelectedRow();
					if(row){
						filterEditGrid.down(row);
					}
				},icon:'down02'}
			]
		},
		columns:[
			{display: '条件名', name: 'name', align: 'left', width: 80,editor:{type:'string'}},
			{display: '属性名', name: 'number', align: 'left', width: 80,editor:{type:'string'}},
			{display: '类型', name: 'filterType', align: 'left', width: 120,editor:{
				type:'combobox',
				valueColumnName:'name',
				dataValueField:'name',
				dataDisplayField:'text',
				data:[{name:'DATAPICKER',text:'数据'},
				  	{name:'STRING',text:'字符串'},
					{name:'DATE',text:'日期'},
					{name:'DATETIME',text:'时间'},
					{name:'INT',text:'整数'},
					{name:'FLOAT',text:'浮点数'}]
				},
			render:function(data){
				if(data['filterType']){
					switch(data['filterType']){
					case 'DATAPICKER':return "数据";
					case 'STRING':return "字符串";
					case 'DATE':return "日期";
					case 'DATETIME':return "时间";
					case 'INT':return "整数";
					case 'FLOAT':return "浮点数";
					default:return '';
					}
				}
			}},
			{display: 'URL("数据"类型有效)', name: 'dataPicker', align: 'left', width: 180,editor:{type:'string'}},
		],
		rownumbers:true,
		height:160,
		delayLoad:true,
		enabledEdit:($edit_viewstate != 'VIEW'),
		url:getPath()+"/exporttools/exportFilter/listData"
	}));
	columnEditGrid = $('#columnEditGrid').ligerGrid($.extend({},$edit_defaultGridParam,{
		toolbar:{
			items:[
			    {name:'add',text:'增加',click:function(){
					columnEditGrid.addRow({});
				},icon:'add'},
				{name:'delete',text:'删除',click:function(){
					columnEditGrid.deleteSelectedRow();
				},icon:'delete'},
				{name:'fup',text:'上移',click:function(){
					var row = columnEditGrid.getSelectedRow();
					if(row){
						columnEditGrid.up(row);
					}
				},icon:'up02'},
				{name:'fdown',text:'下移',click:function(){
					var row = columnEditGrid.getSelectedRow();
					if(row){
						columnEditGrid.down(row);
					}
				},icon:'down02'}
			]
		},
		columns:[
			{display: '列名', name: 'name', align: 'left', width: 180,editor:{type:'string'}},
			{display: '属性', name: 'field', align: 'left', width: 200,editor:{type:'string'}}
		],
		rownumbers:true,
		height:160,
		delayLoad:true,
		enabledEdit:($edit_viewstate != 'VIEW'),
		url:getPath()+"/exporttools/exportColumn/listData"
	}));
	var dataId = $('#dataId').val();
	var param = {};
	if(dataId){
		param['scheme'] = dataId;
	}else{
		param['scheme'] = 'nodata';
	}
	columnEditGrid.setOptions({
		parms:param
	});
	columnEditGrid.loadData();
	filterEditGrid.setOptions({
		parms:param
	});
	filterEditGrid.loadData();
});
function saveEdit(dlg){
	currentDialog = dlg;
	var datas = columnEditGrid.getData();
	if(!datas || datas.length == 0){
		art.dialog.tips('没有列定义,不能保存');
		return false;
	}
	var json = "[";
	var data;
	var names = {};
	var fields = {};
	for(var i = 0; i < datas.length; i++){
		data = datas[i];
		if(data[columnEditGrid.options.statusName] != 'delete'){
			if(data.name && data.field){
				json += "{";
				if(data.id){
					json += "id:'" + data.id + "',";
				}
				if(names[data.name]){
					art.dialog.tips("列名重复:"+data.name);
					return;
				}
				names[data.name] = 1;
				json += "name:'" + data.name + "',";
				if(fields[data.field] ){
					art.dialog.tips("列属性重复:"+data.field);
					return;
				}
				fields[data.field] = 1;
				json += "field:'" + data.field + "'},";
			}else{
				art.dialog.tips('列定义不完整');
				return;
			}
		}
	}
	if(json.length != 1){
		json = json.substring(0,json.length-1);
	}
	json += ']';
	$('#columnJson').val(json);
	datas = filterEditGrid.getData();
	json = "[";
	names = {};
	fields = {};
	for(var i = 0; i < datas.length; i++){
		data = datas[i];
		if(data[filterEditGrid.options.statusName] != 'delete'){
			json += "{";
			if(data.id){
				json += "id:'" + data.id + "',";
			}
			if(data.name && data.number && data.filterType){
				if(names[data.name]){
					art.dialog.tips("条件名重复:"+data.name);
					return;
				}
				names[data.name] = 1;
				json += "name:'" + data.name + "',";
				if(fields[data.number] ){
					art.dialog.tips("属性名:"+data.number);
					return;
				}
				fields[data.number] = 1;
				json += "number:'" + data.number + "',";
				json += "filterType:'" + data.filterType + "',";
				if(data.filterType=='dataPicker' && (data.dataPicker == null && data.dataPicker == '')){
					art.dialog.tips('"数据类型"必须定义数据源URL');
					return ;
				}
				if(!data.dataPicker){
					data.dataPicker = '';
				}
				json += "dataPicker:'" + data.dataPicker + "'},";
			}else{
				art.dialog.tips('过滤条件定义不完整');
				return ;
			}
		}
	}
	if(json.length != 1){
		json = json.substring(0,json.length-1);
	}
	json += ']';
	$('#filterJson').val(json);
	$('form').submit();
	return false;
}

function previewtable(dlg){
	var sql = $("#sql").val();
	dlg.button({name:'预览',disabled:true});
	$.post(base+'/basedata/dbeSql/excuteSqlNew',{sql:sql,pageSize:100},function(data){
		if(data.items){
			var columndatas = columnEditGrid.getData();
			var columnobj = {};
			for(var i = 0; i < columndatas.length; i++){
				var cdata = columndatas[i];
				if(cdata[columnEditGrid.options.statusName] != 'delete'){
					if(cdata.name && cdata.field){					
						columnobj[cdata.field] = cdata.name;
					}else{
						continue;
					}
				}
			}
			
			var columnsParam=[];
			var row=data.items[0];
			var idx=0;
			for(var key in row){
				columnsParam[idx]={display: (typeof columnobj[key] == "undefined"?key:columnobj[key]), name:key , align: 'center', width: 80, isSort:false,hide:(typeof columnobj[key] == "undefined")};
				idx++;
			}
			$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		        columns: columnsParam,
		        width:"99%",
		        usePager:true,
		        enabledSort:true,
		        pageSize:100
		    }));
		$list_dataGrid.loadData(data);
		$("#griddiv").css("margin-top","0px");
		art.dialog({
			title : '预览',
			content:$("#griddiv")[0],
			width:900,
			height : 400,
			lock : true,
			ok:function(){		
				dlg.button({name:'预览',disabled:false});
				//$("#griddiv").hide();
				$("#griddiv").css("margin-top","300px");
			},
			cancel:function(){
				dlg.button({name:'预览',disabled:false});
				//$("#griddiv").hide();
				$("#griddiv").css("margin-top","300px");
			}
		});
		
		}
	},'json');
}