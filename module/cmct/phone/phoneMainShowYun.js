var $list_editUrl=getPath()+"/cmct/phoneMainShow/edit";
var $list_addUrl=getPath()+"/cmct/phoneMainShow/add";
var $list_editWidth="428px";
var $list_editHeight="200px";
var $list_deleteUrl=getPath()+"/cmct/phoneMainShow/delete";
var parentWechatId="";
$(document).ready(function(){
	$("#searchBtn").bind("click",function(){
		searchData();
	});
	
	$('#resetBtn').bind('click',function(){
		resetBtn();
	});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '主显号码', name: 'SHOWNUMBER', align: 'center', width: 120},
            {display: '计费号码', name: 'USERID', align: 'center', width: 120},
            {display: '备注', name: 'MARK', align: 'center', width: 220}
        ],
        delayLoad:true,
        checkbox:true,
        url:getPath()+'/cmct/phoneMainShow/yunData',
    }));
	$(".ds_title li").click(function(){
		$(this).addClass("hover").siblings("li").removeClass("hover");
		if($(this).attr("key")=='NOTAUDIT'){
			$('#batchMatch').hide();
//			$list_dataGrid.set('checkbox',false);
		}else{
//			$list_dataGrid.set('checkbox',true);
			$('#batchMatch').show();
		}
		searchData();
	});
	
	$('#batchMatch').bind('click',function(){
		var recordes = $list_dataGrid.getSelectedRows();
		if(recordes.length==0){
			art.dialog.tips("请勾选数据！",2);
			return false;
		}
		var ids="";
		$.each(recordes,function(i,obj){
			ids+=obj.ID+",";
		})
		ids=ids.substring(0,ids.length-1);
//		art.dialog.confirm('确定分配吗?',function(){
		var currentDialog=art.dialog({
			content:$("#matchPhone")[0],
			title:'分配',
			id:'matchPhone',
			button:[{name:'确定',callback:function(){
				$.post(getPath()+"/cmct/phoneMainShow/batchMatch",{ids:ids,orgId:$('#orgId').val()},function(res){
					if(res.STATE=='SUCCESS'){
						art.dialog.data("flag",true);
						art.dialog.tips('分配成功');
						currentDialog.close();
						resetList();
					}else{
						art.dialog.alert(res.MSG);
					}
				},'json');		
				return false;
			}},{name:'取消',callback:function(){
				$('#orgId').val('');
				$('#orgName').val('');
				return true;
			}}]
		});
//		});
	});
	
	searchData();
});

$(document).keydown(function(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		$("#searchBtn").click();
     }
}); 

function searchData(){
	var key = $("#key").val();
	if(key!="" && key!=null && key!=$("#key").attr("dValue")){
		$list_dataParam['key'] = key;
	}else{
		delete $list_dataParam['key'];
	}
	$list_dataParam['state']=$(".ds_title li[class='hover']").attr("key");
	resetList();
}