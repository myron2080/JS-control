$list_addUrl = getPath()+"/lunch/usermanage/add";//新增url
$list_editUrl = getPath()+"/lunch/usermanage/edit";//编辑及查看url
$list_deleteUrl = getPath()+"/lunch/usermanage/delete";//删除url
$list_sentCouponsUrl = getPath()+"/lunch/usercoupons/list";

$list_editWidth = "875px";
$list_editHeight = "465px";
$list_dataType = "数据";//数据名称

$(document).ready(function() {
		//这个基本固定；
		$("#main").ligerLayout({});
		$(".system_tab li").click(function(){
			$(this).parent().find("li").removeClass("hover");
			$(this).addClass("hover");
		});
		//这里表示表格；
		$list_dataGrid = $("#tableContainer").ligerGrid(
				$.extend($list_defaultGridParam, {
					columns : [ {
						display : '操作',
						name : 'operate',
						align : 'center',
						width : 200,
						render : operateRender
					}, {
						display : '用户名',
						name : 'name',
						align : 'center',
						width : 80
					}, {
						display : '昵称',
						name : 'nickName',
						align : 'center',
						width : 80
					}, {
						display : '微信id',
						name : 'wxId',
						align : 'center',
						width : 100
					},{
						display : '头像',
						name : 'avatar',
						align : 'center',
						width : 200,
						rowHeight :200,
						render:function(data){
							var image="<div style='width:100%;height:100%;'><img  src='"+data.avatar+"' width='200px' height='120px'></div>";
							return image;
						}
					}, {
						display : '关注时间',
						name : 'attentionTime',
						align : 'center',
						width : 150
					},{
						display : '手机号码',
						name : 'phoneNumber',
						align : 'center',
						width : 100
					},{display: '性别', 
						name: 'sexEnum.name', 
						align: 'center', 
						width:130
					},{
						display : '是否配送员',
						name : 'isDeliveryStaff',
						align : 'center',
						width : 100,
						render:function(data){
							if(data.isDeliveryStaff==1){
								return "是";
							}else if(data.isDeliveryStaff==0){
								return "否";
							}else{
								return "否";
								console.info("数据异常");
							}
						}
					},{
						display : '默认柜点',
						name : 'defaultCounterPoint',
						align : 'center',
						width : 100
					},{
						display : '默认支付方式',
						name : 'defaultPayment',
						align : 'center',
						width : 100
					}],
					height:'100%',
					rowHeight:'100',
					url : getPath() + "/lunch/usermanage/listData"
				/*	,
					onDblClickRow:function(rowData,rowIndex,rowDomElement){
						
				    }*/
				}));

		// 回车事件
		$('#keyword').on('keyup', function(event) {
			if (event.keyCode == "13") {
				searchlist();
			}
		});
		
});


//操作
function operateRender(data) {
	// return '<a href="javascript:editRow({id:\''+data.id+'\'});">修改</a> | <a
	// href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
	var lianjie = '<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>';
	
	var isBlacklist = data.isBlacklist;
	if(isBlacklist == 0){
		var lianjie = '<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>';
		lianjie = lianjie + ' | ' + '<a href="javascript:pullblacklist(\''+data.id+'\',0);">拉入黑名</a>'
		lianjie+=' | ' + '<a href="javascript:sentCoupons(\''+data.id+'\');">赠送优惠券</a>'
	}else{
		var lianjie = '<a href="javascript:pullblacklist(\''+data.id+'\',1);">解除黑名</a>';
	}
	
	return lianjie;
}

//删除节点
function delnode(){
//	$(node).closest("span").remove();
	var msg=document.getElementById("nodetr");  
	msg.removeChild(msg.lastChild);
}

//添加数据
function addone(){
	
	var flag = false;
	var dlg = art.dialog
	.open($list_addUrl,
			{
				id : "addhomeData",
				title : '添加数据',
				background : '#333',
				width : 380,
				height : 300,
				lock : true,
				button:[{name:'确定',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
							dlg.iframe.contentWindow.saveEdit(dlg);
						}
						flag = true;
						return false;
					}},{name:'取消',callback:function(){
						flag = false;
						return true;
					}}],
				close:function(){
					resetList();
				}
			});	
}

//模糊查询
function searchlist(){
	var keyword = $("#keyword").val();
	if($("#isDeliveryStaff").attr('checked')==undefined){
		delete $list_dataParam['isDeliveryStaff'];
	}else{
		$list_dataParam['isDeliveryStaff'] = 1;
	}	
	if (keyword && ($('#key').attr("defvalue") != keyword) && keyword != "昵称/手机号码") {
		$list_dataParam['key'] = keyword;
	} else {
		delete $list_dataParam['key'];
	}
	resetList();
}

//拉入黑名单
function pullblacklist(id,isblack){
	if(isblack == 0){
		art.dialog.confirm('确认拉入黑名?', function() {
			$.post(getPath()+"/lunch/usermanage/pullblacklist",{id:id},function(data){
				if(data.STATE=='SUCCESS'){
					art.dialog.tips(data.MSG);
					resetList();
					
				}
			},'json');;
			return true;
		}, function() {
			return true;
		});
	}else if(isblack == 1){
		art.dialog.confirm('确认解除黑名?', function() {
			$.post(getPath()+"/lunch/usermanage/pullblacklist",{id:id},function(data){
				if(data.STATE=='SUCCESS'){
					art.dialog.tips(data.MSG);
					resetList();
					
				}
			},'json');
			return true;
		}, function() {
			return true;
		});
	}
}

//赠送优惠券
function sentCoupons(id){
	paramStr = '?userid='+id;
	var flag = false;
	var dlg = art.dialog
	.open($list_sentCouponsUrl+paramStr,
			{
				id : "sentCouponsData",
				title : '赠送优惠券',
				background : '#333',
				width : 875,
				height : 465,
				lock : true,
				button:[{name:'确定',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
							dlg.iframe.contentWindow.saveEdit(dlg);
						}
						flag = true;
						return false;
					}},{name:'取消',callback:function(){
						flag = false;
						return true;
					}}],
				close:function(){
					resetList();
				}
			});	
}

//清空
function onEmpty(){
	var demo = $("#keyword").attr("defvalue");
	$("#isDeliveryStaff").attr("checked",false)
	$("#keyword").attr("value", $("#keyword").attr("defvalue"));
	searchlist();
}

//查询全部的还是查黑名单的
function searchAllOrBlack(num){
	if(num == 1){
		delete $list_dataParam['isBlacklist'];
	}else if(num == 2){
		$list_dataParam['isBlacklist'] = 1;
	}
	resetList();
}
