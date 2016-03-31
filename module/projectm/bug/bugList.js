$list_editUrl = getPath()+"/projectm/bugList/edit";//编辑及查看url
$list_addUrl = getPath()+"/projectm/bugList/add";//新增url
$list_deleteUrl = getPath()+"/projectm/bugList/delete";//删除url
$list_editWidth = "730px";
$list_editHeight = "530px";
$list_dataType = "系统问题";//数据名称
var $bugList_url = getPath()+"/projectm/modulesList/list";

function addModule(){
	top.WorkBench.openPage("addModule",$bugList_url,"模块功能管理");
}

$(document).ready(function(){
	
	$("#main").ligerLayout({});
	$("#toolBar").ligerToolBar({
//		items:[{id:'add',text:'新增',click:addRow,icon:'add'}]
		});
	
	$("#toolBar").append($('#filter').html());
	$('#filter').html('');
	$('#statusList').ligerComboBox({ isShowCheckBox: true, isMultiSelect: true,
        data: [
               { text: '待处理', id: 'STATE_PENDING' },
               { text: '己处理', id: 'STATE_PROCESSED' },
               { text: '己关闭', id: 'STATE_CLOSE' }
           ], valueFieldID: 'status'
     }); 
	$('#levelsList').ligerComboBox({ isShowCheckBox: true, isMultiSelect: true,
        data: [
               { text: 'A类:严重错误', id: 'LEVEL_SERIOUS' },
               { text: 'B类:关键错误', id: 'LEVEL_CRUX' },
               { text: 'C类:轻微错误', id: 'LEVEL_SLIGHT' },
               { text: 'D类:需求意见或建议', id: 'LEVEL_ADVICE' }
           ], valueFieldID: 'levels',selectBoxWidth:120  
     }); 
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '标题', name: 'name', align: 'left', width: 150},
            {display: '创建日期', name: 'createTime', align: 'left', width: 80},
//            {display: '模块', name: '', align: 'left', width: 80},
//            {display: '功能点', name: '', align: 'left', width: 80},
            {display: '类型', name: 'type.label', align: 'left', width: 60},
            {display: '级别', name: 'level.label', align: 'left', width: 80},
            {display: '状态', name: 'status.label', align: 'left', width: 80},
            {display: '处理人', name: 'dealPerson.name', align: 'left', width: 60},
            {display: '处理日期', name: 'dealTime', align: 'left', width: 100},
            {display: '描述', name: 'description', align: 'left', width: 80},
            {display: '未处理天数', name: 'dateCount', align: 'left', width: 80,render:getNoDealDate},
            {display: '提交人', name: 'creator.name', align: 'left', width: 60},
            {display: '关闭日期', name: 'closeTime', align: 'left', width: 100},
            {display: '操作', name: 'operate', align: 'center', width: 140,render:operateRender}
            
        ],
        delayLoad:true,
        url:getPath()+'/projectm/bugList/listData'
    }));
	
	$("#tab").find("li").click(function(){
		$(this).addClass("hover");
		$(this).siblings("li").removeClass("hover");
		searchData();
	});
	
	searchData();
	params ={};
	params.inputTitle = "创建时间";	
	MenuManager.common.create("DateRangeMenu","createTime",params);
	//状态下拉框绑定事件
	$("#status").bind("change",function(){
		if(($(this).val() != "") && ($(this).val() != null)){
			$("#hasNotDealed").attr("checked",null);
		}
	});
	

	if(null != $("#from").val()  && '' != $("#from").val()){
		setTimeout(function(){
			$("div[toolbarid='add']").click();
		},200);
	}
});

function getNoDealDate(data){
	if(data.status.value=="STATE_PENDING"){
		var diff = dateDiff(formatDate(new Date(),'yyyy-MM-dd'),data.createTime);
		diff = diff==0?"0":diff;
		return diff;
	}else{
		return "0";
	}
}

//计算天数差的函数
function  dateDiff(sDate1,  sDate2){
    s1 = sDate1.replace(/-/g, "/");
    s2 = sDate2.replace(/-/g, "/");
    s1 = new Date(s1);
    s2 = new Date(s2);

    var days= s1.getTime() - s2.getTime();
    var time = parseInt(days / (1000 * 60 * 60 * 24));
    
    return  time;
}    

function operateRender(data,filterData){
	var u = $('#currentUser').val();
	
	var str = (getFieldFromData(data,'creator.id') == loginUserId?('<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>'):'');
	return str;
		//+'<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
}

//查看
function viewRow(rowData){
	dealBug(rowData);
}

function dealBug(data){
	var dlg = art.dialog.open(getPath()+"/projectm/bugList/deal?id=" + data.id,
	{title:"问题处理",
	 lock:true,
	 width:'800px',
	 height:'450px',
	 id:"dealBug",
	 close:function(){
		
		refresh();
	 }
	});
}

function searchData(){
	var kw = $('#searchKeyWord').val();
	kw = kw.replace(/^\s+|\s+$/g,'');
	$('#searchKeyWord').val(kw);
	if(kw==$('#searchKeyWord').attr('defaultValue')){
		kw='';
	}
	if(kw==null || kw == ''){
		delete $list_dataParam['key'];
	}else{
		$list_dataParam['key'] = kw;
	}
	var dealPerson = $('#dealPerson\\.id').val();
	if(dealPerson){
		$list_dataParam['dealPerson'] = dealPerson;
	}else{
		delete $list_dataParam['dealPerson'];
	}
	
	var status = $('#status').val();
	if(status){
		$list_dataParam['status'] = status;
	}else{
		delete $list_dataParam['status'];
	}
	var levels = $('#levels').val();
	//alert(levels+"==="+status);
	if(levels){
		$list_dataParam['levels'] = levels;
	}else{
		delete $list_dataParam['levels'];
	}
	var bugType = $('#bugType').val();
	if(bugType){
		$list_dataParam['bugType'] = bugType;
	}else{
		delete $list_dataParam['bugType'];
	}
	
	var hasNotDealed = $("#hasNotDealed").is(":checked");
	if(hasNotDealed){
		$list_dataParam['hasNotDealed'] = hasNotDealed;
	} else {
		delete $list_dataParam['hasNotDealed'];
	}
	
	var createPerson = $('#createPerson\\.id').val();
	if(createPerson){
		$list_dataParam['createPerson'] = createPerson;
	}else{
		delete $list_dataParam['createPerson'];
	}
	
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["createTime"]){
		queryStartDate = MenuManager.menus["createTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["createTime"].getValue().timeEndValue;
	}
	if(queryStartDate){
		queryStartDate = queryStartDate.replace(/\//g,"-");
		$list_dataParam['queryStartDate'] = queryStartDate;
	}else{
		delete $list_dataParam['queryStartDate'];
	}
	if(queryEndDate){
		queryEndDate = queryEndDate.replace(/\//g,"-");
		$list_dataParam['queryEndDate'] = queryEndDate;
	}else{
		delete $list_dataParam['queryEndDate'];
	}
	resetList();
}

function enterSearch(e){
	 
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		searchData();
    }  
}


