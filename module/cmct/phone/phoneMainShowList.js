$list_deleteUrl = getPath()+"/cmct/phoneMainShow/delete";//删除url
$(document).ready(function(){
	params ={};
	params.inputTitle = "创建时间";	
	MenuManager.common.create("DateRangeMenu","createTime",params);
	
	$("#searchBtn").bind("click",function(){
		searchData();
	});
	
	$('#resetBtn').bind('click',function(){
		resetBtn();
	});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '主显号码', name: 'displayNbr', align: 'center', width: 100},
            {display: '计费号码', name: 'chargeNbr', align: 'center', width: 100},
            {display: '归属组织', name: 'org.name', align: 'center', width: 120},
            {display: '备注', name: 'description', align: 'center', width: 220},
            {display: '操作', name: 'operate', align: 'center', width: 80,render:operateRender}
        ],
        delayLoad:true,
        url:getPath()+'/cmct/phoneMainShow/listData',
        onAfterShowData:function(gridData){	
	    	loadPhoneEnable(gridData);
	    }
    }));
	
	$('#disPlayAdd').bind("click",function(){
		var disPlayAddUrl = getPath()+'/cmct/phoneMainShow/yunList';
		art.dialog.data("flag",false);
		art.dialog.open(disPlayAddUrl, {
			id : 'disPlayAdd',
			width : 530,
			title:"主显申请",
			height : 560,
			lock:true,
			cancelVal: '关闭',
		    cancel: true ,
		    close:function(){
		    	if(art.dialog.data("flag")){	    		
		    		resetList();
		    	}
		    }
		});		
	});
	searchData();
});

function loadPhoneEnable(gridData){
	if(gridData && gridData.items.length>0 ){
		$.post(getPath()+'/cmct/phoneMainShow/getAllYunMainShow',{},function(res){
			if(res.STATE=='SUCCESS' && res.data){
				var yunDatas=res.data;
				var localIds="";
				for(var i = 0 ; i < gridData.items.length ; i ++){
					var rowObj = gridData.items[i];
					var existsFlag = false;
					for(var k=0;k<yunDatas.length;k++){
						var resData=yunDatas[k];
						if($.trim(rowObj.matchId) == $.trim(resData.ID) && resData.STATE!='DELETE'){
							var existsFlag = true;
							break;
						}
					}
					if(!existsFlag){
						localIds += rowObj.id+";";
					}
				}
				if(localIds){
					localIds=localIds.substring(0,localIds.length-1);
					$.post(getPath()+'/cmct/phoneMainShow/deleteBatch',{ids:localIds},function(res){
						if(res.STATE=='SUCCESS'){
							resetList();
						}
					},'json');
				}
			}
		},'json');
	}
	
}

function operateRender(data,filterData){
	 return	'<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
}

$(document).keydown(function(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		$("#searchBtn").click();
     }
}); 

function searchData(){
	var sD = "";
	var eD = "";
	if(MenuManager.menus["createTime"]){//天
		sD = MenuManager.menus["createTime"].getValue().timeStartValue;
		eD = MenuManager.menus["createTime"].getValue().timeEndValue;
	}
	$list_dataParam['startDate']=sD;
	$list_dataParam['endDate']=eD;
	var key = $("#key").val();
	if(key!="" && key!=null && key!=$("#key").attr("dValue")){
		$list_dataParam['key'] = key;
	}else{
		delete $list_dataParam['key'];
	}
	resetList();
}

function resetBtn(){
	MenuManager.menus["createTime"].resetAll();
	$('#key').val($('#key').attr("dValue"));
}
