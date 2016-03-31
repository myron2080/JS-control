$list_editUrl = getPath() + "/ebbase/importgoods/edit";// 编辑及查看url
$list_addUrl = getPath() + "/ebbase/importgoods/add";// 新增url
$list_deleteUrl = getPath() + "/ebbase/importgoods/delete";// 删除url
$list_editWidth = "1010px";
$list_editHeight = "500px";
$list_dataType = "商品导入";// 数据名称
$(document).ready(
		
		function() {
			$list_dataGrid = $("#tableContainer").ligerGrid(
					$.extend($list_defaultGridParam, {
						columns : [
                        {
	                     display: '操作', 
	                     name: 'operate', 
	                     align: 'center',
	                     width: 140,
	                     render:operateRender},           
						{
							display : '导入号',
							name : 'number',
							align : 'center',
							width : 130,
							render:showGoods
						},{
							display : '供应商',
							name : 'provide.name',
							align : 'center',
							width : 60
						},{
							display : '商品数量',
							name : 'goodsCount',
							align : 'center',
							width : 60
						},{
							display : '导入人',
							name : 'creator.name',
							align : 'center',
							width : 130
						},{         
							display : '导入时间',
							name : 'createTime',
							align : 'center',
							width : 150
						},{
							display : '备注',
							name : 'description',
							align : 'center',
							width : 100
						}
						],
						delayLoad : true,
						url : getPath() + '/ebbase/importgoods/listData',
						onDblClickRow:function(rowData,rowIndex,rowDomElement){
						    	//viewRow(rowData);
						    }
					}));
			searchData();

			$("#searchBtn").click(function() {
				searchData();
			});
			initClearBtn();
			document.onkeydown =function(event){ enterSearch(event)};
		});



/**
 * 清空按钮
 */
function initClearBtn(){

	$("#addBtn").bind("click",function(){
		//addRow({});
		importData();
	});
	$("#uploads").bind("click",function(){
		//addRow({});
		importzip();
	});
	$("#resetBtn").bind("click",function(){
		$("#provideId").val("");
		$("#provideName").val("供应商");
		$("#key").val($("#key").attr("defaultValue"));
		searchData();
	});
}

function operateRender(data, filterData) {
		var str ="";
		str +='<a href="javascript:deleteRow({id:\''+ data.id + '\'});">删除</a>';
		
    return str;
}

function showGoods(data, filterData) {
	var str ="";
	str +='<a href="javascript:importGoodsList(\''+ data.id + '\');">'+data.number+'</a>';
	
return str;
}
function importGoodsList(id){
	var flag = false;
	var url= base+"/ebbase/importgoods/importGoodsList?importId="+id;
	var dlg = art.dialog.open(url,
			{title:"相关商品",
			 lock:true,
			 width:'735px',
			 height:'300px',
			 id:"goodsList",
			 button:[{name:'关闭',callback:function(){
					flag = false;
					return true;
				}}],
			 close:function(){
				 if(flag){
					 if(typeof(afterEditRow)=='function'){
						 afterEditRow();
					 }
					 refresh();
				 }
			 }
			});
}


function importzip(){
	var flag = false;
	art.dialog.data("searchData",searchData);
	art.dialog.data("loadClose",Loading.close);
	var url= base+"/ebbase/importgoods/importzip"
	var dlg = art.dialog.open(url,
			{title:"导入压缩包*.zip",
			 lock:true,
			 width:'535px',
			 height:'200px',
			 id:"importDataDialog",
			 button:[{name:"导入",callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveImportData){
						dlg.iframe.contentWindow.saveImportData(this);
					}
					return false;
				}},{name:'取消',callback:function(){
					flag = false;
					return true;
				}}],
			 close:function(){
				 if(flag){
					 if(typeof(afterEditRow)=='function'){
						 afterEditRow();
					 }
					 refresh();
				 }
			 }
			});
}

function importData(){
	var flag = false;
	art.dialog.data("searchData",searchData);
	art.dialog.data("loadClose",Loading.close);
	var url= base+"/ebbase/importgoods/importData"
	var dlg = art.dialog.open(url,
			{title:"商品导入",
			 lock:true,
			 width:'735px',
			 height:'260px',
			 id:"importDataDialog",
			 button:[{name:"导入",callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveImportData){
						dlg.iframe.contentWindow.saveImportData(this);
					}
					return false;
				}},{name:'取消',callback:function(){
					flag = false;
					return true;
				}}],
			 close:function(){
				 if(flag){
					 if(typeof(afterEditRow)=='function'){
						 afterEditRow();
					 }
					 refresh();
				 }
			 }
			});
}

function searchData() {
	//供应商
	var provideId = $("#provideId").val();
	if (provideId != "") {
		$list_dataParam['providerId'] = provideId;
	} else {
		delete $list_dataParam['providerId'];
	}
	// 关键字
	var keyWord = $("#key").val();
	if (keyWord != ""&& keyWord != $("#key").attr("defaultValue")) {
	$list_dataParam['key'] = keyWord;
	} else {
	delete $list_dataParam['key'];
	}
	resetList();
}

function enterSearch(e) {
	var charCode = ($.browser.msie) ? e.keyCode : e.which;
	if (charCode == 13) {
		searchData();
	}
}

/*// 增加行
function addRow(source) {
	if ($list_addUrl && $list_addUrl != '') {
		var paramStr = '';
		if ($list_addUrl.indexOf('?') > 0) {
			paramStr = '&VIEWSTATE=ADD';
		} else {
			paramStr = '?VIEWSTATE=ADD';
		}
		if (typeof (getAddRowParam) == "function") {
			var param = getAddRowParam();
			// 临时增加不满足则不打开窗口
			if (param == 'notValidate')
				return;
			if (param) {
				for ( var p in param) {
					paramStr = paramStr + '&' + p + '=' + param[p];
				}
			}
		}
		var flag = true;
		var dlg = art.dialog.open($list_addUrl + paramStr, {
			title : getTitle('ADD'),
			lock : true,
			width : $list_editWidth || 'auto',
			height : $list_editHeight || 'auto',
			id : $list_dataType + "-ADD",
			button : [ {
				name : '提交问题',
				callback : function() {
					if (dlg.iframe.contentWindow
							&& dlg.iframe.contentWindow.saveAdd) {
						dlg.iframe.contentWindow.saveAdd(this);
					}
					return false;
				}
			} ],
			close : function() {
				if (flag) {
					if (typeof (afterAddRow) == 'function') {
						afterAddRow();
					}
					resetList();
				}
			}
		});
	}
}*/

/*function editRow(rowData){
	if($list_editUrl && $list_editUrl!=''){
		var paramStr;
		if($list_editUrl.indexOf('?')>0){
			paramStr = '&VIEWSTATE=EDIT&id='+rowData.id;
		}else{
			paramStr = '?VIEWSTATE=EDIT&id='+rowData.id;
		}
		var flag = true;
		var dlg = art.dialog.open($list_editUrl+paramStr,
				{title:getTitle('EDIT'),
				 lock:true,
				 width:$list_editWidth||'auto',
				 height:$list_editHeight||'auto',
				 id:$list_dataType+"-EDIT",
				 button:[{name:'提交问题',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
							dlg.iframe.contentWindow.saveEdit(this);
						}
						return false;
					}}],
				 close:function(){
					
					 if(flag){
						 if(typeof(afterEditRow)=='function'){
							 afterEditRow();
						 }
						 refresh();
					 }
				 }
				});
	}
}
*/

