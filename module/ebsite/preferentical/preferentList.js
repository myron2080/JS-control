$list_editUrl = getPath() + "/ebsite/preferentical/edit";// 编辑及查看url
$list_addUrl = getPath() + "/ebsite/preferentical/add";// 新增url
$list_deleteUrl = getPath() + "/ebsite/preferentical/delete";// 删除url
$list_editWidth = "640px";
$list_editHeight = "200px";
$list_dataType = "优惠规则";//数据名称
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
							display : '最大金额(元)',
							name : 'maxMoney',
							align : 'center',
							width : 200
						}, {
							display : '优惠金额',
							name : 'preferentMoney',
							align : 'center',
							width : 200							
						}, {
							display : '所属商品',
							name : 'goods.name',
							align : 'center',
							width : 200							
						},{
							display : '所属类目',
							name : 'goodsCategory.name',
							align : 'center',
							width : 200							
						},{
							display : '状态',
							name : 'preferentStateEnums.name',
							align : 'center',
							width : 150
						} ],
					
						url : getPath() + '/ebsite/preferentical/listData',
						
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
	var promoteTitle = $('#keyWord').val();
	promoteTitle = promoteTitle.replace(/^\s+|\s+$/g,'');
	$('#keyWord').val(promoteTitle);
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
          if (data.preferentStateEnums.value=='NO') {
        	  str +='|<a href="javascript:editStateOn({id:\''+ data.id + '\',status:\'YES\'});">启用</a>';
		}else{
			 str +='|<a href="javascript:editStateOff({id:\''+ data.id + '\',status:\'NO\'});">禁用</a>';
		}
		
return str;
}

function editStateOn(data) {
		art.dialog.confirm('确定启用操作吗?', function() {
			$.post(getPath() + '/ebsite/preferentical/changeState', {
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
			$.post(getPath() + '/ebsite/preferentical/changeState', {
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
	$("#keyWord").val($('#keyWord').attr('defaultValue'));
	searchData();
	document.onkeydown =function(event){ enterSearch(event)};
}


