$list_editUrl = getPath() + "/ebbase/goodskoudianconf/edit";// 编辑及查看url
$list_addUrl = getPath() + "/ebbase/goodskoudianconf/add";// 新增url
$list_deleteUrl = getPath() + "/ebbase/goods/delete";// 删除url
$list_editWidth = (window.screen.width  * 40 /100) +"px" ;
$list_editHeight =(window.screen.height * 53 /100)+"px";
$list_dataType = "商品列表";// 数据名称
$(document).ready(
		function() {
			$list_dataGrid = $("#tableContainer").ligerGrid(
					$.extend($list_defaultGridParam, {
						columns : [
						   {
							display : '方案名称',
							name : 'koudianConf.name',
							align : 'center',
							width : 130
						},{
							display : '编码',
							name : 'koudianConf.number',
							align : 'center',
							width : 130
						},{
							display : '策略行数',
							name : 'koudianConf.rownum',
							align : 'center',
							width : 130
						},{
							display : '制定人',
							name : '',
							align : 'center',
							width : 130,
							render:function(data){
								if(data.koudianConf!=null  && data.koudianConf.creator!=null ){
									return data.koudianConf.creator.oldName;
								}
	                            return 	"";
							}
						},{
							display : '最后更新人',
							name : '',
							align : 'center',
							width : 130,
							render:function(data){
								if(data.koudianConf!=null  && data.koudianConf.updator!=null ){
									return data.koudianConf.updator.oldName;
								}
	                            return 	"";
							}
						},{
							display : '制定时间',
							name : 'koudianConf.createTimeStr',
							align : 'center',
							width : 160,
							dateFormat:"yyyy-MM-dd HH:mm:ss",formatters:"date"
						},{
							display : '最后更新时间',
							name : 'koudianConf.lastUpdateTimeStr',
							align : 'center',
							width : 160,
							dateFormat:"yyyy-MM-dd HH:mm:ss",formatters:"date"
						},{
							display : '状态',
							name : '',
							align : 'center',
							width : 160,
							render:function(data){
								if(data.koudianConf.start!=null
										&& data.koudianConf.start!="" ){
									if(data.koudianConf.start==1){

			                            return "启用";
									}
								}

                            return "禁用";
							}
						},{
							display : '操作',
							name : 'koudianConf.name',
							align : 'center',
							width : 230,
							render:operateRender
						}
						],
				         checkbox:true,
						url : getPath() + '/ebbase/goodskoudianconf/listData',
				        onDblClickRow:function(rowData,rowIndex,rowDomElement){
				        	showdataDetail(rowData);
				        }
					}));
			var params ={};
			params.width = 260;
			params.inputTitle = "录入时间";	
			MenuManager.common.create("DateRangeMenu","createdate",params);
			
			var param ={};
			param.width = 260;
			param.inputTitle = "上架时间";	
			MenuManager.common.create("DateRangeMenu","shelvesdate",param);

			searchData();

			$("#searchBtn").click(function() {
				searchData();
			});
			

			var params ={};
			params.width = 260;
			params.inputTitle = "制定时间";	
			MenuManager.common.create("DateRangeMenu","startdate",params);
			initClearBtn();
		});



function showdataDetail(date){
	//可个性化实现
	if($list_editUrl && $list_editUrl!=''){
		var paramStr;
		if($list_editUrl.indexOf('?')>0){
			paramStr = '&VIEWSTATE=VIEW&id='+date.koudianConf.id;
		}else{
			paramStr = '?VIEWSTATE=VIEW&id='+date.koudianConf.id;
		}
		art.dialog.open($list_editUrl+paramStr,
				{title:getTitle('VIEW'),
				lock:true,
				width:$list_editWidth||'auto',
				height:$list_editHeight||'auto',
				id:$list_dataType+'-VIEW',
				button:[{name:'关闭'}]}
		);
	}
	
}

function editGoodsKoudianconf(id){
	var title = "商品扣点新增";
	var url = base + "/ebbase/goodskoudianconf/add";
	var flag = true;
	var dlg = art.dialog.open(url,{
		 title: title,
		 lock:true,
		 width:$list_editWidth,
		 height:$list_editHeight,
		 id:"editInStorage",
		 button:[{name:'保存',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
					dlg.iframe.contentWindow.saveEdit(dlg);
				}
				return false;
			}},{name:'取消',callback:function(){
				flag = false;
				return true;
			}}],
		 close:function(){
			 if(flag){
				 refresh();
			 }
		 }
	});
}
function operateRender(data,filterData){
	var e = (data.koudianConf.start=='1'?'0':'1');
	var t = (data.koudianConf.start=='0'?'启用':'禁用');
	var str="";
	str += '<a href="javascript:editRow({id:\''+data.koudianConf.id+'\'});">编辑</a>|'
	str	+= '<a href="javascript:disable({id:\''+data.koudianConf.id+'\',start:\''+e+'\'},'+e+');">'+t+'</a>|';
	if(goodconf=="Y"){
		str += '<a href="javascript:viewPermission({id:\''+data.koudianConf.id+'\'});">商品设置</a>';
	}
	if(e==1){
		str += '<a href="javascript:viewClear({id:\''+data.koudianConf.id+'\'});">|清空</a>';
	}
	return str;
}
function viewClear(data){
	art.dialog.confirm("是否清空",function(){
		$.post(getPath() + '/ebbase/goodskoudianconf/updateClear',data,function(res){
			//art.dialog.tips(res.MSG);
			if(res.STATE=='SUCCESS'){
				var num=1;
				var w=100;
				var h=20;
				art.dialog({
					content: res.MSG,
					time:num,
					close:function(){
						art.dialog.close();
					},
					width:w,
					height:h
				});
				refresh();
			}
		},'json');
	},function(){
		return true;
	});
}
function disable(data,e){
	var t = (e=='1'?'启用':'禁用');
	art.dialog.confirm("是否"+t,function(){
		$.post(getPath() + '/ebbase/goodskoudianconf/updateStatus',data,function(res){
			//art.dialog.tips(res.MSG);
			if(res.STATE=='SUCCESS'){
				var num=1;
				var w=100;
				var h=20;
				if(res.MSG.length>10){
	
					num=8;
					w=500;
					h=300;
				}
				art.dialog({
					content: res.MSG,
					time:num,
					close:function(){
						art.dialog.close();
					},
					width:w,
					height:h
				});
				refresh();
			}
		},'json');
	},function(){
		return true;
	});
}
function viewPermission(data){
	art.dialog.open(getPath()+'/ebbase/goodskoudianconf/goodsKoudianconfEdit?koudianid='+data.id,{
		 title:"商品设置",
		 lock:true,
		 width:"1070px",
		 height:($(window).height()-200),
		 id:"goodsKoudianconfEdit",
		 button:[{name:'确定',callback:function(){
			 	refresh();
				flag = false;
				return true;
			}}]
	});
}
/**
 * 清空按钮
 */
function initClearBtn(){
	
	$("#addBtn").bind("click",function(){
		addRow({});
	});
	
	$("#importMannager").bind("click",function(){
		importMannager();
	});
	$("#printBarCode").bind("click",function(){
		printBarCode();
	});
	$("#resetBtn").bind("click",function(){
		$("#searchKeyWord").val($("#searchKeyWord").attr("defaultValue"));
		MenuManager.menus["startdate"].resetAll();
		searchData();
	});
	/*inputEnterSearch("searchKeyWord",searchData);
	inputEnterSearch("importNumber",searchData);*/
	document.onkeydown =function(event){ enterSearch(event)};
}




function searchData() {

	//制定时间
	var outTime_begin = "";
	var outTime_end = "";
	if(MenuManager.menus["startdate"]){
		outTime_begin = MenuManager.menus["startdate"].getValue().timeStartValue;
		outTime_end = MenuManager.menus["startdate"].getValue().timeEndValue;
	}

	if(outTime_begin != ""){
		$list_dataParam['outTime_begin'] = outTime_begin;
	} else {
		delete $list_dataParam['outTime_begin'];
	}
	if(outTime_end != ""){
		$list_dataParam['outTime_end'] = outTime_end;
	} else {
		delete $list_dataParam['outTime_end'];
	}
	// 关键字
	var keyWord = $("#searchKeyWord").val();
	if (keyWord != ""&& keyWord != $("#searchKeyWord").attr("defaultValue")) {
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