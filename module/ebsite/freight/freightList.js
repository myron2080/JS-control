$list_editUrl = getPath() + "/ebsite/freight/edit";// 编辑及查看url
$list_addUrl = getPath() + "/ebsite/freight/add";// 新增url
$list_deleteUrl = getPath() + "/ebsite/freight/delete";// 删除url
$list_editWidth = "640px";
$list_editHeight = "200px";
$list_dataType = "运费";//数据名称
$(document).ready(function() {
			$("#main").ligerLayout({});
			$list_dataGrid = $("#tableContainer").ligerGrid(
					$.extend($list_defaultGridParam, {
						columns : [ {
							display : '业务操作',
							name : 'operate',
							align : 'center',
							width : 200,
							render:operateRender
						}, {
							display : '推广标题',
							name : 'promoteTitle',
							align : 'center',
							width : 200
						}, {
							display : '最小金额(元)',
							name : 'minMoney',
							align : 'center',
							width : 200
						}, {
							display : '配送费',
							name : 'chargeValue',
							align : 'center',
							width : 200
						}, {
							display : '免除配送费金额',
							name : 'freightMoney',
							align : 'center',
							width : 200							
						}, {
							display : '状态',
							name : 'freightStateEnums.name',
							align : 'center',
							width : 150
						} ],
					
						url : getPath() + '/ebsite/freight/listData',
						
					}));
			$("#serchBtn").click(function(){
				searchData();
				});  
			// 回车事件
			$('#keyWord').on('keyup', function(event) {
				if (event.keyCode == "13") {
					searchData();
				}
			});
		});
function searchData() {
	var promoteTitle = $('#keyWord').val().trim();
	/*promoteTitle = promoteTitle.replace(/^\s+|\s+$/g,'');
	$('#keyWord').val(promoteTitle);*/
	if(promoteTitle==$('#keyWord').attr('defaultValue')){
		promoteTitle='';
	}
	if(promoteTitle==null || promoteTitle == ''){
		 $list_dataParam['promoteTitle']='';
	}else{
		$list_dataParam['promoteTitle'] = promoteTitle;
	}
	resetList();
}

function operateRender(data, filterData) {
	    var str ="";
	    str +='<a href="javascript:editRow({id:\''+ data.id + '\'});">编辑</a>|';
		str +='<a href="javascript:deleteRow({id:\''+ data.id + '\'});">删除</a>';
          if (data.freightStateEnums.value=='NO') {
        	  str +='|<a href="javascript:editStateOn({id:\''+ data.id + '\',status:\'YES\'});">启用</a>';
		}else{
			 str +='|<a href="javascript:editStateOff({id:\''+ data.id + '\',status:\'NO\'});">禁用</a>';
		}
		
return str;
}

function editStateOn(data) {
		art.dialog.confirm('确定启用操作吗?', function() {
			$.post(getPath() + '/ebsite/freight/changeFreightState', {
				id : data.id,
				status :"YES"
			}, function(res) {
				art.dialog.tips(res.MSG);
				if (res.STATE == 'SUCCESS') {
					refresh();
				}
			}, 'json');
			return true;
		}, function() {
			return true;
		});
	}

function editStateOff(data){
		art.dialog.confirm('确定禁用操作吗?', function() {
			$.post(getPath() + '/ebsite/freight/changeFreightState', {
				id : data.id,
    			status :"NO"
			}, function(res) {
				art.dialog.tips(res.MSG);
				if (res.STATE == 'SUCCESS') {
					refresh();
				}
			}, 'json');
			return true;
		}, function() {
			return true;
		});
	}

/**
 * 清空按钮
 */
function onEmpty(){
	$("#keyWord").val("推广标题");
	searchData();
	/*document.onkeydown =function(event){ enterSearch(event)};*/
}


