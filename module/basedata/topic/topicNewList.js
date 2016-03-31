$list_editUrl = getPath() + "/basedata/topicNewList/edit";// 编辑及查看url
$list_addUrl = getPath() + "/basedata/topicNewList/add";// 新增url
$list_deleteUrl = getPath() + "/basedata/topicNewList/delete";// 删除url
$list_editWidth = "730px";
$list_editHeight = "330px";
$list_dataType = "系统问题";// 数据名称
var statusComboBox = null;

$(document).ready(
		function() {

			$("#main").ligerLayout({});
			statusComboBox = $('#statusList').ligerComboBox({
				isShowCheckBox : true,
				isMultiSelect : true,
				width : 150,
				heigth : 100,
				initText : '--问题状态--',
				data : [  {
					text : '未处理',
					id : 'STATE_1'
				}, {
					text : '处理中',
					id : 'STATE_2'
				}, {
					text : '已解决',
					id : 'STATE_3'
				}, {
					text : '已采纳',
					id : 'STATE_4'
				}, {
					text : '谢谢你',
					id : 'STATE_5'
				}, {
					text : '金点子',
					id : 'STATE_6'
				} ],
				valueFieldID : 'status'
			});
			// $('#levelsList').ligerComboBox({ isShowCheckBox: true,
			// isMultiSelect: true,
			// data: [
			// { text: 'A类:严重错误', id: 'LEVEL_A' },
			// { text: 'B类:关键错误', id: 'LEVEL_B' },
			// { text: 'C类:轻微错误', id: 'LEVEL_C' },
			// { text: 'D类:需求意见或建议', id: 'LEVEL_D' }
			// ], valueFieldID: 'levels',selectBoxWidth:120
			// });
			// $('#topicTypeList').ligerComboBox({ isShowCheckBox: true,
			// isMultiSelect: true,
			// data: [
			// { text: '需求调整', id: 'DEMANDS' },
			// { text: '美工优化', id: 'UI' },
			// { text: '数据问题', id: 'DATA' },
			// { text: '程序报错', id: 'BUG' },
			// { text: '系统建议', id: 'PROPOSAL' }
			// ], valueFieldID: 'topicType'
			// });
			$list_dataGrid = $("#tableContainer").ligerGrid(
					$.extend($list_defaultGridParam, {
						columns : [
						           
									{
										display : '问题状态',
										name : 'status.label',
										align : 'left',
										width : 100,
										render:statusRender
									},           
						{
							display : '问题描述',
							name : 'descriptionNest',
							align : 'left',
							width : 300,
							render:descRender
						},
						// {display: '标题', name: 'name', align: 'left', width:
						// 150},

						{
							display : '所属系统',
							name : 'belongFunction.parent.name',
							align : 'left',
							width : 100
						}, {
							display : '所属模块',
							name : 'belongFunction.name',
							align : 'left',
							width : 100
						}, {
							display : '提交分行',
							name : 'org.name',
							align : 'left',
							width : 100
						}, {
							display : '提交人',
							name : 'creator.name',
							align : 'left',
							width : 100
						}, {
							display : '提交时间',
							name : 'createTime',
							align : 'left',
							width : 100
						},

						//            
						// {display: '类型', name: 'type.label', align: 'left',
						// width: 60},
						// {display: '级别', name: 'level.label', align: 'left',
						// width: 80},
						{
							display : '评论数',
							name : 'commentCount',
							align : 'left',
							width : 100
						},
	
						
						// {display: '处理人', name: 'dealPerson.name', align:
						// 'left', width: 60},
						// {display: '处理日期', name: 'dealTime', align: 'left',
						// width: 100},
						//            
						// {display: '未处理天数', name: 'dateCount', align: 'left',
						// width: 80,render:getNoDealDate},
						// {display: '提交人', name: 'creator.name', align: 'left',
						// width: 60},
						// {display: '关闭日期', name: 'closeTime', align: 'left',
						// width: 100},
						 {display: '操作', name: 'operate', align: 'center',
						 width: 140,render:operateRender}

						],
						delayLoad : true,
						url : getPath() + '/basedata/topicNewList/listData'
					}));
			searchData();
			params = {};
			params.inputTitle = "提交时间";
			MenuManager.common.create("DateRangeMenu", "createTime", params);
			// 状态下拉框绑定事件
			$("#status").bind("change", function() {
				if (($(this).val() != "") && ($(this).val() != null)) {
					$("#hasNotDealed").attr("checked", null);
				}
			});

			$('#module').bind(
					'change',
					function() {
						$('#function').html(
								'<option value="">--所属模块--</option>');
						$.post(getPath() + '/basedata/topicNewList/childMenu', {
							parent : $(this).val()
						}, function(res) {
							if (res && res.length > 0) {
								for ( var i = 0; i < res.length; i++) {
									$(
											'<option value="' + res[i].id
													+ '">' + res[i].name
													+ '</option>').appendTo(
											$('#function'));
								}
							}
						}, 'json');
					});

			$("#searchBtn").click(function() {
				searchData();
			});
			
			$("#tab").find("li").click(function(){
				$(this).addClass("hover");
				$(this).siblings("li").removeClass("hover");
				searchData();
			});
			
			
			initClearBtn();

		});



/**
 * 清空按钮
 */
function initClearBtn(){
	$("#resetBtn").bind("click",function(){
		MenuManager.common.resetAll();
		$("#module").find("option").first().attr("selected","selected");
		$("#function").find("option").first().attr("selected","selected");
		$("#searchKeyWord").val($("#searchKeyWord").attr("defaultValue"));
		statusComboBox.updateStyle() ;
	});
}


function descRender(data){
	var desc = data.description.length>20?data.description.substr(0,20)+"...":data.description;
	if(data.hasPhoto){
		return "<div title='问题描述："+data.description+"'>"+desc+"<img src='"+getPath()+"/default/style/images/hasphoto.png'/></div>";
	}
	return "<div title='问题描述："+data.description+"'>"+desc+"</div>";
}

function getNoDealDate(data) {
	if (data.status.value == "STATE_B" || data.status.value == "STATE_W"
			|| data.status.value == "STATE_T") {
		var diff = dateDiff(formatDate(new Date(), 'yyyy-MM-dd'),
				data.createTime);
		diff = diff == 0 ? "0" : diff;
		return diff;
	} else {
		return "0";
	}
}

// 计算天数差的函数，通用
function dateDiff(sDate1, sDate2) { // sDate1和sDate2是2006-12-18格式
	var aDate, oDate1, oDate2, iDays
	aDate = sDate1.split("-")
	oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]); // 转换为12-18-2006格式
	aDate = sDate2.split("-");
	oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
	iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24); // 把相差的毫秒数转换为天数
	return iDays;
}

function operateRender(data, filterData) {
	if(data.status=='STATE_1'){
		var u = $('#currentUser').val();
		var str = (getFieldFromData(data, 'creator.id') == loginUserId ? ('<a href="javascript:editRow({id:\''
				+ data.id + '\'});">编辑</a>|<a href="javascript:deleteRow({id:\''
				+ data.id + '\'});">删除</a>')
				: '');
		return str;
	}else{
		return "";
	}
}

// 查看
function viewRow(rowData) {
	dealTopic(rowData);
}

function dealTopic(data) {
	var dlg = art.dialog.open(getPath() + "/basedata/topicNewList/deal?id=" + data.id,
			{
				title : "问题查看[提交分行:"+data.org.name+"，提交人:"+data.creator.name+"]",
				lock : true,
				width : '800px',
				height : '450px',
				id : "dealTopic",
				close : function() {

					refresh();
				}
			});
}

function searchData() {
	if($("#tab").find("li.hover").attr("key") !=""){
		$list_dataParam['tabkey']= $("#tab").find("li.hover").attr("key");
	}else{
		delete $list_dataParam['tabkey'];
	}
	
	// 问题状态
	var status = statusComboBox.getValue();
	if (status != "") {
		$list_dataParam['status'] = status;
	} else {
		delete $list_dataParam['status'];
	}
	// 提交日期
	var queryStartDate = "";
	var queryEndDate = "";
	if (MenuManager.menus["createTime"]) {
		queryStartDate = MenuManager.menus["createTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["createTime"].getValue().timeEndValue;
	}
	if (queryStartDate) {
		queryStartDate = queryStartDate.replace(/\//g, "-");
		$list_dataParam['queryStartDate'] = queryStartDate;
	} else {
		delete $list_dataParam['queryStartDate'];
	}
	if (queryEndDate) {
		queryEndDate = queryEndDate.replace(/\//g, "-");
		$list_dataParam['queryEndDate'] = queryEndDate;
	} else {
		delete $list_dataParam['queryEndDate'];
	}
	// 所属系统
	var modules = $("#module").val();
	if (modules != "") {
		$list_dataParam['modules'] = modules;
	} else {
		delete $list_dataParam['modules'];
	}
	// 所属模块
	var functions = $("#function").val();
	if (functions != "") {
		$list_dataParam['functions'] = functions;
	} else {
		delete $list_dataParam['functions'];
	}
	// 万能查询
	var searchKeyWord = $("#searchKeyWord").val();
	if (searchKeyWord != ""
			&& searchKeyWord != $("#searchKeyWord").attr("defaultValue")) {
		$list_dataParam['searchKeyWord'] = searchKeyWord;
	} else {
		delete $list_dataParam['searchKeyWord'];
	}
	resetList();
}

function enterSearch(e) {

	var charCode = ($.browser.msie) ? e.keyCode : e.which;
	if (charCode == 13) {
		searchData();
	}
}

// 增加行
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
}

function editRow(rowData){
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


function statusRender(data){
	return  data.status.label+"  "+"<img src='"+getPath()+"/default/style/images/"+data.status.value+".png'/>";
}
