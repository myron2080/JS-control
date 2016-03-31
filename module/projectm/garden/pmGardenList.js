/**
 * 楼盘列表
 */
$list_viewUrl = getPath()+'/projectm/pmGarden/showView';
$list_editUrl = getPath()+'/projectm/pmGarden/updateView';
$list_addUrl = '/shihua-surety/scheme/initEdit';
$list_deleteUrl = getPath()+'/projectm/pmGarden/deleteGarden';
$list_buildingUrl = getPath()+'/projectm/pmBuilding/getList';
$list_buildlistUrl =base+'/projectm/pmBuilding/buildList' //旧版：getPath()+'/projectm/pmBuilding/getList';
$list_imageUrl = getPath()+'/projectm/pmGarden/deleteGarden';
$list_modelUrl = getPath()+'/projectm/pmRoom/modelManager';
$(document).ready(function(){
	$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '操作', name: 'operate', align: 'center', width: 220,render:operateRender,isSort: false},
            {display: '楼盘编码', name: 'number', align: 'left', width:120,render:showMapRender,isSort: true},
			{display: '楼盘名称', name: 'registerName', align: 'left', width:120,render:showMapRender1,isSort: true},
			{display: '宣传名称', name: 'name', align: 'left', width:120,isSort: false },
			{display: '片区', name: 'geographyArea.name', align: 'left', width: 120,isSort: true },
			{display: '楼栋单元数', name: 'buildNum', align: 'left', width: 80,isSort: true },
			{display: '房间数', name: 'roomNum', align: 'left', width: 80,isSort: true },
			/*{display: '商圈', name: 'businessArea.name', align: 'left', width:120 },*/
			{display: '包含用途', name: 'propertyTypesName', align: 'left', width: 100,isSort: false},
			//{display: '图片', name: 'ddd', align: 'left', width: 40,render:selectImageRender},
			//{display: '楼栋', name: 'clienteleagent', align: 'left', width: 40,render:selectBuildingRender},
			/*{display: '建模', name: 'owneragent', align: 'left', width:40,render:selectModelRender},*/
			{display: '创建日期', name: 'createTime', align: 'center', width: 80,isSort: true},
			{display: '创建人', name: 'creator.name', align: 'center', width:80,isSort: false}
        ],
        delayLoad:true,
        url:getPath()+"/projectm/pmGarden/getListData",
        enabledSort :true,
        onDblClickRow : ViewGarden,
        fixedCellHeight:false
    }));
	selectList();
	//绑定事件
	$("#selectData").click(function(){
		selectList();
	});
	//新增楼盘
	$("#addGarden").click(function(){
		var flag = false;
		var dlg = art.dialog.open(getPath()+"/projectm/pmGarden/addView", {
			id : 'addGardenWindow',
			width : 800,
			title:"新增楼盘",
			height : 500,
			lock:true,
			button : [ {
				className : 'aui_state_highlight',
				name : '保存',
				 callback: function () {
					 flag = true;
				 	if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.addGarden){
				 		dlg.iframe.contentWindow.addGarden(dlg);
					}
					return false;
				 }
			} ],
			close:function(){
				if(flag)
					selectList();
			}
		
		});
	});
	$("#areaManage").click(function(){
		art.dialog.open(getPath()+"/projectm/pmArea/getList"
				, {
			init : function() {
			},
			id : 'areaManage',
			width :"70%",
			title:"片区管理",
			height : 500,
			lock:true
		});
	});
	
	$("#lineManage").click(function(){
		art.dialog.open(getPath()+"/projectm/pmLine/getList"
			, {
			id : 'lineManage',
			width :960,
			title:"配套设施管理",
			height : 500,
			lock:true
		});
	});
	
	$('#diffGaredn').click(function(){
		art.dialog.open(getPath()+"/broker/gardenDiff/list"
				, {
				id : 'diffGaredn',
				width :"90%",
				title:"楼盘差异",
				height : 600,
				lock:true
			});
	});
	
	$("#City").bind("change",function(){
		$.post(getPath()+"/projectm/pmArea/getListData",{cityId:$(this).val(),areaType:"REGION"},function(data){
			addOption(data.items,"area","区域");
		},"json");
		$("#geographyArea option").remove();
		$("#geographyArea").append("<option value=''>片区</option>");
	});
	
	$("#area").bind("change",function(){
		$.post(getPath()+"/projectm/pmArea/getListData",{parentId:$(this).val(),areaType:"GEOGRAPHY"},function(data){
			addOption(data.items,"geographyArea","片区");
		},"json");
	});
	
	
	//清除
	$("#clearData").click(function(){
		delete $list_dataParam['geographyAreaId'];
		delete $list_dataParam['areaId'];
		delete $list_dataParam['cityId'];
		delete $list_dataParam['gardenName'];	
		$("#City").val("");
		$("#area").val("");
		$("#geographyArea").val("");
		$("#gardenId").attr("value", "");
		$("#gardenName").attr("value", "名称/推广名/责任人");
		$("#sumSelect").attr("value", "智能查询（楼盘编码等）");
	});
	$('#City').trigger('change');
});

function addOption(areaList,parentdiv,headesc){
	var optionStr = '<option value=\'\'>'+headesc+'</option>';
	$("#"+parentdiv+" option").remove();
	for(var i=0;i<areaList.length;i++){
		optionStr+="<option value='"+areaList[i].id+"'>"+areaList[i].name+"</option>";
	}
	$("#"+parentdiv).append(optionStr);
}

/************************
 * 根据条件查询数据
 * **********************
 */

function selectList(){
	$list_dataParam['geographyAreaId'] = $("#geographyArea").val();
	$list_dataParam['areaId'] = $("#area").val();
	var city=$("#City").val();
	if(!city){
		art.dialog.tips('必须选择城市');
		return false;
	}
	$list_dataParam['cityId'] = $("#City").val();
	$list_dataParam['gardenName'] = '';
//	$list_dataParam['gardenIds'] = $("#gardenId").val();
	
	if($("#gardenName").val()!=='名称/宣传名'){
		$list_dataParam['gardenName'] = $("#gardenName").val();	
	}
	resetList();
}

/**
 * **************************************
 * 渲染操作项
 * **************************************
 * */
function operateRender(data,filterData){
	return '<a href="javascript:selectBuilding(\''+data.id+'&list\');">楼栋设置</a> | <a href="javascript:selectModel(\''+data.id+'\',\''+data.name+'\');">建模设置</a> | '+
	'<a href="javascript:updateGarden(\''+data.id+'\');">修改</a> | '+
//	'  |  <a href="javascript:updateGarden(\''+data.id+'\');">修改</a> | <a href="javascript:deleteGarden(\''+data.id+'\');">删除</a> | '+
//	'<a href="javascript:gardenMapMark(\''+data.id+'\');">地图标点</a>  | <a href="javascript:uploadGardenImage(\''+data.id+'\',\'xq\');">楼盘相册</a>'+
//	 ' | <a href="javascript:uploadGardenImage(\''+data.id+'\',\'hx\');">户型图</a>'+
//	 ' | <a href="javascript:toImgPunctuation(\''+data.id+'\');">图片标点</a>'+
	 '<div class="smore" ><div class="menu2" onmouseover=this.className="menu1" onmouseout=this.className="menu2">' +
	 '<a href="#">更多</a>' +
	 '<div class="smore-box" style="z-index:9999">' +
	 '<b><a href="javascript:deleteGarden(\''+data.id+'\');">删除</a></b>  '+
	 '<b><a href="javascript:uploadGardenImage(\''+data.id+'\',\'xq\');">楼盘相册维护</a></b>  '+
	 '<b><a href="javascript:uploadGardenImage(\''+data.id+'\',\'hx\');">户型图维护</a></b>  ' +
	 '<b><a href="javascript:toImgPunctuation(\''+data.id+'\');">楼栋分布图</a></b>  '+
	 '<b><a href="javascript:gardenMapMark(\''+data.id+'\');">地图设置</a></b>'+
	 '</div></div></div>';
}
function toOper() { 
	$("#oper").style.display="block";
}

function modelRender(data,filterData){
	return '<a href="javascript:selectBuilding(\''+data.id+'&list\');">楼栋设置</a> |  <a href="javascript:selectModel(\''+data.id+'\',\''+data.name+'\');">建模设置</a>';
}
function selectBuildingRender(data,index,cdata){
	return '<a href="javascript:selectBuilding(\''+data.id+'\');">查看</a>';
}
function selectImageRender(data,index,cdata){
	return '<a href="javascript:selectImage(\''+data.id+'\');">查看</a>';
}

function showMapRender(data,index,cdata){
	var zoom = data.zoom;
	var trstr=data.number;
	if(zoom>0){
		trstr+="  <img style='height:15px;' src='" + getPath()+"/default/style/images/marker_red.png'/>";
	}
	return trstr;
}
function showMapRender1(data,index,cdata){
	var zoom = data.zoom;
	var trstr;
	if(data.planIssue!=""){
		trstr=data.registerName+"("+data.planIssue+")";
	}else{
		trstr=data.registerName;
	}
	if(data.carparknum>0){
		trstr+="   <img  src='" + getPath()+"/default/style/images/home/gardenIM.png'/>";
	}
	return trstr;
}
function selectModelRender(data,index,cdata){
	return '<a href="javascript:selectModel(\''+data.id+'\',\''+data.name+'\');">设置</a>';
}
function createtimeRender(data,index,cdata){	
	var d=new Date(data.createTime);
	return  d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
}

function isinnerorderRender(data,index,cdata){
	if(cdata==0){
		return "外单";
	}
	return "内单"; 
}
function fixedrateRender(data,index,cdata){
	//return data.garden.name+data.building.name+data.room.name;
}

function ViewGarden(data,index){	
	var id=data.id;
	art.dialog.open($list_viewUrl+"?gardenId="+id+"&cityId="+$('#City').val(), {
		init : function() {
		},
		id : 'showGardenWindow',
		width : 800,
		title:"查看楼盘",
		height : 500,
		lock:true,
		cancelVal: '关闭',
	    cancel: true 
	});			
}

/**
 * *************************************
 * 地图标点
 * *************************************
 * */
function gardenMapMark(id){
	art.dialog.data("flag",false);
	art.dialog.open(getPath()+'/projectm/pmGarden/toMapMark?fid=' + id+"&cityId="+$('#City').val(),
	{
		lock : true,
		id : "toMapMark",
		title : "楼盘地图标点",
		width:1082,
		height:590,
		close:function(){
			if(art.dialog.data("flag")){
				selectList();
				art.dialog.tips("保存成功",null,"succeed");
			}
		}
	});
}


/**
 * *************************************
 * 图片标点
 * *************************************
 * */
function toImgPunctuation(id){
	
	var flag;
	$.post(getPath()+"/projectm/pmGarden/queryBuilding",{fid:id,cityId:$('#City').val()},function(data){
		flag = data.count;
		if(flag == 0){
			art.dialog.tips("没有可标点的单元！");
			return false;
		}else{
			art.dialog.data("flag",false);
			art.dialog.open(getPath()+'/projectm/pmGarden/toImgPunctuation?fid=' + id+"&cityId="+$('#City').val(),
			{
				lock : true,
				id : "toImgPunctuation",
				title : "楼盘图片标点",
				width:865,
				height:550,
				close:function(){
					if(art.dialog.data("flag")){
						selectList();
						art.dialog.tips("保存成功",null,"succeed");
					}
				}
			});
		}
	},"json");
}

/**
 * 小区相册
 */
function uploadGardenImage(gardenId,type){
	var url = getPath()+'/projectm/pmRoom/uploadImageView?gardenId='+gardenId+"&cityId="+$("#City").val();
	if(type!=''){
		url = getPath()+'/projectm/pmRoom/uploadImageView?gardenId='+gardenId+'&type='+type+"&cityId="+$("#City").val();
	}
	art.dialog.open(url ,{
		    title:"小区相册",
			width:740,
			height:515,
			id: 'uploadGardenImage',
   			cancelVal: '关闭',
   		    cancel: true 
	});
}


/**
 * *************************************
 * 修改
 * *************************************
 * */
function updateGarden(id){
	var flag = false;
	var dlg = art.dialog.open($list_editUrl+"?gardenId="+id+"&cityId="+$("#City").val()
			, {
		init : function() {
		},
		id : 'addGardenWindow',
		width : 800,
		title:"修改楼盘",
		height : 500,
		lock:true,
		button : [ {
			className : 'aui_state_highlight',
			name : '保存',
			 callback: function () {
				 if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.updateGarden){
						dlg.iframe.contentWindow.updateGarden(dlg);
						flag = true;
					}
				return false;
			 }
		} ],
		close:function(){
			if(flag)
				selectList();
		}
	});
}

/**
 * *************************************
 * 删除
 * *************************************
 * */
function deleteGarden(id){
	art.dialog.confirm("你确定要删除该楼盘？",function(){
		$.post($list_deleteUrl,{gardenId:id,cityId:$("#City").val()},function(res){ 
			if(res!=null){
				if(res.STATE=="1"){
					art.dialog.tips(res.MSG,null,"succeed");
					
				}else{
					art.dialog.alert(res.MSG);
				}
			}
			selectList();
		},'json');
	});
}
function selectImage(id){
	art.dialog.open($list_buildingUrl+"?gardenId="+id
			, {
		init : function() {
		},
		id : 'selectImageWindow',
		width : 700,
		title:"楼盘字典",
		height : 500,
		lock:true,
		button : [ {
			className : 'aui_state_highlight',
			name : '保存',
			 callback: function () {
				 art.dialog.data("updateGarden")();
				 return false;
			 }
		}, {
			name : '取消',
			callback : function() {
			}   
		} ]
	});
}
function selectBuilding(id){
	var isList = false;
	if(id.indexOf('&list')>0){
		isList = true;
		id = id.split('$list')[0];
	}
	art.dialog.data("result",null);//$list_buildingUrl  $list_buildlistUrl
	var dlg = art.dialog.open($list_buildlistUrl+"?gardenId="+id+"&cityId="+$("#City").val()
			, {
		init : function() {
		},
		id : 'selectBuildingWindow',
		width : 680,
		title:"楼栋设置",
		height : 500,
		lock:true,
		button : [  {
			name : '关闭',
			callback : function() {
			}   
		} ],
		close:function(){	
			/*if(art.dialog.data("result")!=null && art.dialog.data("result")=="success"){
				art.dialog.tips("修改成功！",null,"succeed");
				loadTree(0);
			}*/
			if(isList){
				resetList();
			}else{
				loadBuidTree('/projectm/pmGarden/getRoomList');
			}
		},
		lock:true
	});
}
function selectModel(id,name){
/*	art.dialog.open($list_modelUrl+"?gardenId="+id
			, {
		init : function() {
		},
		id : 'selectModelWindow',
		width : 1000,
		title:"建模",
		height :600,
		lock:true
		
	});*/
	window.top.addTabItem(id,$list_modelUrl+"?gardenId="+id+"&cityId="+$("#City").val(),name+'设置');
}

function showMenu() {
	$.post(getPath()+"/projectm/pmGarden/getGardensByKey",{term:$("#gardenName").val(),cityId:$("#City").val()},function(data){
		if(data){
			var result=data.treeData;
			var zNodes =eval(result);
			$.fn.zTree.init($("#treeDemo"), setting, zNodes);
			var cityObj = $("#gardenName");
			var cityOffset = $("#gardenName").offset();
			$("#menuContent").css({left:cityOffset.left + "px", top:cityOffset.top + cityObj.outerHeight() + "px"}).slideDown("fast");
			$("body").bind("mousedown", onBodyDown);
		}
	},"json");
}
function hideMenu() {
	$("#menuContent").fadeOut("fast");
	$("body").unbind("mousedown", onBodyDown);
}
function onBodyDown(event) {
	if (!(event.target.id == "menuBtn" || event.target.id == "gardenName" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
		hideMenu();
	}
}
function beforeClick(treeId, treeNode) {
	var zTree = $.fn.zTree.getZTreeObj("treeDemo");
	zTree.checkNode(treeNode, !treeNode.checked, null, true);
	return false;
}

function onCheck(e, treeId, treeNode) {
	var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
	nodes = zTree.getCheckedNodes(true),
	v = "";
	id= "";
	for (var i=0, l=nodes.length; i<l; i++) {
		v += nodes[i].name + ",";
		id += nodes[i].id + ",";
	}
	if (v.length > 0 ) v = v.substring(0, v.length-1);
	var gardenObj = $("#gardenName");
	gardenObj.attr("value", v);
	var gardenId = $("#gardenId");
	gardenId.attr("value",id);
	
	$("#cityName").val("");
	$("#cityName").val("");
}

var setting = {
		check: {
			enable: true,
			chkboxType: {"Y":"", "N":""}
		},
		view: {
			dblClickExpand: false
		},
		data: {
			simpleData: {
				enable: true
			}
		},
		callback: {
			beforeClick: beforeClick,
			onCheck: onCheck
		}
	};
var zNodes;

/**
 ***************************
 ** 回车查询
 ***************************
 */
function enterSearch(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		selectList();
    }  
}

