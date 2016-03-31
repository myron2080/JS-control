/**
 * 调拨线路 编辑
 */
var fc_ligerComboBox,hc_ligerComboBox;
$(document).ready(function(){
	 /**
	  * 镇仓 选择插件
	  */
	 fc_ligerComboBox=$('#fcStorageInput').ligerComboBox({ isShowCheckBox: true, isMultiSelect: false,
	        data: [], valueFieldID: 'fcStorageValue',selectBoxWidth:180,selectBoxHeight:260,onSelected:function(){
	        	resetAllData();
	        }
	 });
//	 hc_ligerComboBox=$('#hcStorageInput').ligerComboBox({ isShowCheckBox: true, isMultiSelect: true,
//	        data: [], valueFieldID: 'hcStorageValue',selectBoxWidth:200,selectBoxHeight:260, onSelected:function(){
//	        	showSelectHcData();
//	        }
//	 });
	 
	 loadLigerComboBoxData();
});

function showSelectHcData(){
	$("#desc").val($('#hcStorageInput').val());
}

/**
 * 加载镇仓数据
 */
function loadLigerComboBoxData(){
	var url=getPath() + '/ebsite/outorderfollow/getTownStorageList?getTown=YES'
	$.post(url,{},function(res){
		if (res.storageList!=null){
			var dataList=[];
              for ( var int = 0; int < res.storageList.length; int++) {
				var one={};
				one.text=res.storageList[int].name;
				one.id=res.storageList[int].orgLongNumber;
				dataList.push(one);
			}
            fc_ligerComboBox.setData(dataList);
		}
	},'json');
}

/**
 * 进入选择合伙人仓库页面
 */
function toSelectHCStorage() {
	art.dialog.data("selectHCStorage",selectHCStorage);
	var dlg = art.dialog.open(getPath() + '/ebstorage/outorderline/selectHCStorage?fcStorageValue='+$("#fcStorageValue").val()+'&lineId='+$("#dataId").val(), {
		title : '选择合伙人仓库',
		lock : true,
		width : '400px',
		height : '500px',
		id : 'toSelectHCStorage',
		button : [{name : '确认', callback : function(){
			this.iframe.contentWindow.clickSureBtn();
			return true;
		}},{name : '关闭', callback : function(){
			return true;
		}}]
	});
}


function selectHCStorage(resList){
	$.each(resList,function(index,obj){
		addTrOne(obj);
	});
}

/**
 * 新加单个 tr
 * @param obj
 */
function addTrOne(obj){
	var flag=true;
	/**
	 * 验证是否已有 该 合仓id
	 */
	$(".scrollContent tr").each(function(index,cur){
		if(obj.id == $(cur).find("#hcStorageId").val()){
			flag=false;
			return false;
		}
	});
	if(!flag){
		return;
	}
	var tr="<tr>";
	tr+="<td>"+($(".scrollContent tr").length+1)+"</td>";
	tr+="<td>";
	tr+=obj.name;
	tr+="<input type='hidden' id='hcStorageId' name='hcStorageId' value='"+obj.id+"' />";
	tr+="</td>";
	tr+="<td>";
	tr+="<a href='javascript:void(0);' onclick='moveUp(this);'>上移</a>&nbsp;";
	tr+="<a href='javascript:void(0);' onclick='moveDown(this);'>下移</a>&nbsp;";
	tr+="<a href='javascript:void(0);' onclick='moveOut(this);'>删除</a>";
	tr+="</td>";
	$(".scrollContent").append(tr);
}

/**
 * 重新选择  镇分仓  清空已选中数据
 */
function resetAllData(){
	if($("#fcStorageIdTmp").val() != $("#fcStorageValue").val()){
		$(".scrollContent").html("");
	}
}

//上移  
function moveUp(obj) {  
    var current = $(obj).parents("tr");  
    var prev = current.prev();  
    if (current.index() > 0) {  
        current.insertBefore(prev);  
    }  
    refreshIndex();
}  
  
// 下移  
function moveDown(obj) {  
    var current = $(obj).parents("tr");  
    var next = current.next();  
    if (next) {  
        current.insertAfter(next);  
    }  
    refreshIndex();
}  

//移除
function moveOut(obj){
	$(obj).parents("tr").fadeOut(function(){
		$(this).remove();
		refreshIndex();
	});  
}

/**
 * 刷新 顺序
 */
function refreshIndex(){
	$(".scrollContent tr").each(function(index,obj){
		$(obj).find("td:first").text(index+1);
	});
}

/**
 * 按钮禁用
 * @param dlg dialog对象
 * @param flag 禁用or启用
 */
function dialogButton(dlg,flag){
	if(dlg){
		dlg.button({name:"取消",disabled:flag});
		dlg.button({name:"确定",disabled:flag});
	}
}

/**
 * 加载合仓数据
 */
function loadHCData(){
	var url=getPath() + '/ebsite/outorderfollow/getTownStorageList?storagelnValue='+$("#fcStorageValue").val()+'&outOrderLine=YES&lineId='+$("#dataId").val();
	$.post(url,{},function(res){
		if (res.storageList!=null){
			var dataList=[];
              for ( var int = 0; int < res.storageList.length; int++) {
				var one={};
				one.text=res.storageList[int].name;
				one.id=res.storageList[int].id;
				dataList.push(one);
			}
              hc_ligerComboBox.setData(dataList);
		}
	},'json');
}

function saveAdd(dlg){
	saveEdit(dlg);
}

function saveEdit(dlg){
	currentDialog=dlg;
	dialogButton(currentDialog,true);
	
	if(!isNotNull($("#name").val())){
		art.dialog.tips("请输入线路名称!");
		dialogButton(currentDialog,false);
		return false;
	}
	if(!isNotNull($("#driverId").val())){
		art.dialog.tips("请选择司机!");
		dialogButton(currentDialog,false);
		return false;
	}
	
	if(!isNotNull($("#carNo").val())){
		art.dialog.tips("请输入车牌号!");
		dialogButton(currentDialog,false);
		return false;
	}
	
	if(!isNotNull($("#fcStorageValue").val())){
		art.dialog.tips("请选择镇分仓!");
		dialogButton(currentDialog,false);
		return false;
	}
	var hcStorageValue='';
	$(".scrollContent tr").each(function(index,obj){
		hcStorageValue+=$(obj).find("#hcStorageId").val()+";";
	});
	
	if(!isNotNull(hcStorageValue)){
		art.dialog.tips("请选择合伙人仓库!");
		dialogButton(currentDialog,false);
		return false;
	}
	$("#hcStorageValue").val(hcStorageValue);
	$.post(getPath() + "/ebstorage/outorderline/saveData",$('form').serialize(),function(res){
		if(res.STATE == "SUCCESS"){
			if(res.MSG){
				art.dialog({
					content: res.MSG,
					time:1,
					close:function(){
						art.dialog.close();
					},
					width:200
				});
			}else{
				art.dialog.close();
			}
		}else{
			art.dialog.tips(res.MSG);
			dialogButton(currentDialog,false);
		}
    },'json');
	
}