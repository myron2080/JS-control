$list_addUrl = getPath()+"/lunch/dishes/add";//新增url
$list_editUrl = getPath()+"/lunch/dishes/edit";//编辑及查看url
$list_deleteUrl = getPath()+"/lunch/dishes/delete";//删除url
$list_Shelf = getPath()+"/lunch/dishes/shelf"; 
$list_editWidth = "500px";
$list_editHeight = "450px";
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
						width : 150,
						render : operateRender
					}, {
						display : '编码',
						name : 'encode',
						align : 'center',
						width : 50
					}, {
						display : '名称',
						name : 'name',
						align : 'center',
						width : 80
					}, {
						display : '状态',
						name : 'dishesStatusEnum.name',
						align : 'center',
						width : 60,
						render:function(data){
							if(data.dishesStatusEnum.value=="ALREADYSOLDOUT"){
								return "<span style='color:red'>"+data.dishesStatusEnum.name+"</span>";
							}else{
								return data.dishesStatusEnum.name;
							}
						}
					}, {
						display : '菜系',
						name : 'cuisineEnum.name',
						align : 'center',
						width : 50
					}, {
						display : '类型',
						name : 'dishesTypeEnum.name',
						align : 'center',
						width : 50
					}, {
						display : '标签',
						name : 'dishesLabelEnum.name',
						align : 'center',
						width : 50
					},{
						display : '建议售价',
						name : 'suggestPrice',
						align : 'center',
						width : 70
					},{
						display: '实际售价', 
						name: 'realPrice', 
						align: 'center', 
						width: 70
					},{
						display: '效果图', 
						name: 'effectChartUrl', 
						align: 'center', 
						width:130,
						height:100,
						render:function(data){
							if(data.effectChartUrl != "" && data.effectChartUrl != null){
								return "<img width='100px' height='70px' src="+getPath()+"/images/" + data.effectChartUrl.replace("size","150X100")+">";
							}
						}
					},{
						display: '描述', 
						name: 'description', 
						align: 'center', 
						width:130
					},{
						display: '录入人', 
						name: 'personName', 
						align: 'center', 
						width:60
					},{
						display: '录入时间', 
						name: 'enterTime', 
						align: 'center', 
						width:70
					},{
						display: '上架人', 
						name: 'putawayPersonName', 
						align: 'center', 
						width:60
					},{
						display: '上架时间', 
						name: 'putawayTime', 
						align: 'center', 
						width:70
					},{
						display: '下架人', 
						name: 'soldoutPersonName', 
						align: 'center', 
						width:60
					},{
						display: '下架时间', 
						name: 'soldoutTime', 
						align: 'center', 
						width:70
					},{
						display: '下架描述', 
						name: 'soldoutDesc', 
						align: 'center', 
						width:130
					},{
						display: '可售量', 
						name: 'limitSaleNum', 
						align: 'center', 
						width:80
					},{
						display: '序号', 
						name: 'sortNum', 
						align: 'center', 
						width:80
					}],
					height:'100%',
					rowHeight:'50',
					
					url : getPath() + "/lunch/dishes/listData"
				}));

		// 回车事件
		$('#keyword').on('keyup', function(event) {
			if (event.keyCode == "13") {
				searchlist();
			}
		});
		innitCount();
});

//操作
function operateRender(data) {
	// return '<a href="javascript:editRow({id:\''+data.id+'\'});">修改</a> | <a
	// href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
	var lianjie = '<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>';
	
	var dishesStatusEnum = data.dishesStatusEnum.value;
	if(dishesStatusEnum == 'ALREADYSOLDOUT'){
		var lianjie = '<a href="javascript:shelfOff(\''+data.id+'\',\'ALREADYPUTAWAY\');">上架</a>';
		lianjie = lianjie + ' | ' + '<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>';
	}else if(dishesStatusEnum == 'ALREADYPUTAWAY'){
		var lianjie = '<a href="javascript:shelfOff(\''+data.id+'\',\'ALREADYSOLDOUT\');">下架</a>';
	}else if(dishesStatusEnum == 'ALREADYENTER'){
		var lianjie = '<a href="javascript:shelfOff(\''+data.id+'\',\'ALREADYPUTAWAY\');">上架</a>';
		lianjie = lianjie + ' | ' + '<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>';
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
				width : 500,
				height : 450,
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
					innitCount();
				}
			});	
}

//模糊查询
function searchlist(){
	var keyword = $("#keyword").val();
	var cuisineEnum = $("#cuisineEnum").val();
	var dishesTypeEnum =$("#dishesTypeEnum").val();
	var dishesLabelEnum =$("#dishesLabelEnum").val();
	
	if(cuisineEnum != ""){
		$list_dataParam['cuisineEnum'] = cuisineEnum;
	}else{
		delete $list_dataParam['cuisineEnum'];
	}	
	if(dishesTypeEnum != ""){
		$list_dataParam['dishesTypeEnum'] = dishesTypeEnum;
	}else{
		delete $list_dataParam['dishesTypeEnum'];
	}
	if(dishesLabelEnum != ""){
		$list_dataParam['dishesLabelEnum'] = dishesLabelEnum;
	}else{
		delete $list_dataParam['dishesLabelEnum'];
	}
	if (keyword && ($('#keyword').attr("defvalue") != keyword) && keyword != "编码/名称") {
		$list_dataParam['keyword'] = keyword;
	} else {
		delete $list_dataParam['keyword'];
	}
	resetList();
	innitCount();
}

//上架，下架
function shelfOff(id,dishesStatusEnum){
	if(dishesStatusEnum=="ALREADYPUTAWAY"){
		art.dialog.confirm('确定上架?', function() {
			$.post(getPath()+"/lunch/dishes/shelfoff",{id:id,dishesStatusEnum:dishesStatusEnum},function(data){
				if(data.STATE=='SUCCESS'){
					art.dialog.tips(data.MSG);
					resetList();
					innitCount();
					
				}
			},'json');
			return true;
		}, function() {
			return true;
		});
	}else if(dishesStatusEnum=="ALREADYSOLDOUT"){
		paramStr = '?id='+id;
		var dlg = art.dialog
		.open($list_Shelf+paramStr,
				{
					id : "shelfoff",
					title : '下架',
					background : '#333',
					width : 400,
					height : 120,
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
						innitCount();
					}
				});
	}
	
}

//清空
function onEmpty(){
	$("#keyword").val("编码/名称");
	$("#cuisineEnum").val("");
	$("#dishesTypeEnum").val("");
	$("#dishesLabelEnum").val("");
	
	delete $list_dataParam['keyword'];
	delete $list_dataParam['cuisineEnum'];
	delete $list_dataParam['dishesTypeEnum'];
	delete $list_dataParam['dishesLabelEnum'];
	
	resetList();
	innitCount();
}

//查询全部的还是根据其他状态查的
function searchDishesStatus(num){
	if(num == 1){
		delete $list_dataParam['dishesStatusEnum'];
	}else if(num == 2){
		$list_dataParam['dishesStatusEnum'] = "ALREADYENTER";
	}
	else if(num == 3){
		$list_dataParam['dishesStatusEnum'] = "ALREADYPUTAWAY";
	}
	else if(num == 4){
		$list_dataParam['dishesStatusEnum'] = "ALREADYSOLDOUT";
	}
	
	resetList();
	innitCount();
}

//加载count数量
function innitCount(){
	$.post(base+'/lunch/dishes/counts',{},function(res){
	var obj =  res[0];
	var total = 0;
	for(var i in obj){
		$("#"+i).html("("+obj[i]+")");
		total+=parseInt(obj[i]);
	}
	$("#ALL").html("("+total+")");
	},'json');
}

