$list_editWidth = "550px";
$list_editHeight = "180px";
var partnersName={TTEN:'铁通',HW:'华为',CAAS:'电信CAAS'};
$(document).ready(function(){
	$list_defaultGridParam.pageSize=60;
	 $list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		 columns: [ 
		            {display: '操作', name: '', align: 'center', width: 100,render:operateRender},
		            {display: '固话号码', name: 'showNumber', align: 'left', width: 100,height:40},
		            {display: '运营商', name: '', align: 'left', width: 60,height:40,render:getPartners},
		            {display: '套餐', name: 'comboName', align: 'left', width: 100,height:40},
		            {display: '权限', name: 'permissions', align: 'center', width: 250,height:40,render:getPermiss}
		        ],
	    parms:{state:state,customerId:customerId},
        delayLoad:false,
        checkbox:true,
       /* onBeforeCheckRow:function(){
        	return false;
        }, */  
        url:getPath()+'/cmct/phoneUnmatch/listData'
    }));
});

function getPartners(data){
	return partnersName[data.partners];
}

function operateRender(data,filterData){
	var match='matchOne';
	var range=data.range;
	var rangeId="";
	if(range){
		rangeId=data.range.id;
	}
	return '<a href="javascript:matchRow({matchType:\''+match+'\',id:\''+data.id+'\',showNumber:\''+data.showNumber+'\',alias:\''+data.alias+'\',regNumber:\''+data.regNumber+'\',userId:\''+data.userId+'\',orgInterfaceId:\''+data.config.orgId+'\',userKey:\''+data.userKey+'\',rangeId:\''+rangeId+'\',phoneType:\''+data.partners+'\',httpUrl:\''+data.config.addUrl+'\',spid:\''+data.config.modifyUrl+'\',passWord:\''+data.config.orgKey+'\',isAllot:\''+data.isCostNumber+'\',newPhone:\''+data.costNumber+'\',remark:\''+data.remark+'\'});">分配</a>';
}


function matchRow(data){
	var configArr = [];
	if(data.matchType=='matchOne'){
		$('[indexMatch]').show();
		$('#setType').attr('disabled',false);
		$('#showPhone').val(data.showNumber);
		$('#alias').val(data.alias);
		$('#description').val(data.remark);
		configArr.push(data);
		matchPhone(configArr,data.type);
	}else{
		$('[indexMatch]').hide();
		$('#setType').attr('disabled','disabled');
		var recordes = $list_dataGrid.getSelectedRows();
		if(recordes.length==0){
			art.dialog.tips("请选择数据！",2);
			return false;
		}
		$.each(recordes,function(i,obj){
			var config = {} ;
			config.id=obj.id;
			config.showNumber=obj.showNumber;
			config.alias=obj.alias;
			config.regNumber=obj.regNumber;
			config.userId=obj.userId;
			config.orgInterfaceId=obj.config.orgId;
			config.userKey=obj.userKey;
			if(obj.range){
				config.rangeId=obj.range.id;
			}else{
				config.rangeId='';
			}
			config.phoneType=obj.partners;
			config.httpUrl=obj.config.addUrl;
			config.spid=obj.config.modifyUrl;
			config.passWord=obj.config.orgKey;
			config.isAllot=obj.isCostNumber;
			config.newPhone=obj.costNumber;
			config.remark=obj.remark;	
			config.matchType='more';
			configArr.push(config);
		});
		matchPhone(configArr,type);
	}
}

var currentDialog;
function matchPhone(configArr,type){
	/**
	 * 批量分配时,目前先去掉.14.3.14
	 */
	/*if(type=='matchOne'){
		$('#matchMore td :eq(0)').html('<span style="color:red">*</span>使用组织：');
		//$('#matchMore div').find('#orgId').attr("name",'org.id');
		$('#matchOne').show();
	}else{
		$('#matchMore td :eq(0)').html('<span style="color:red">*</span>分配组织：');
		//$('#matchMore div').find('#orgId').attr("name",'allotOrgId.id');
		$('#matchOne').hide();
	}*/
	
	$('#pmJson').val(JSON.stringify(configArr));

	currentDialog=art.dialog({
		content:$("#matchPhone")[0],
		title:'分配',
		id:'matchPhone',
		button:[{name:'确定',callback:function(){
			updateMatchPhone(JSON.stringify(configArr),type);
			return false;
		}},{name:'取消',callback:function(){
			window.location.reload(); 
			return true;
		}}]
	});
}


function updateMatchPhone(configArr,type){
	if(type=='matchOne'){
		if(!($("#mac").val()==null || $("#mac").val()=='')){
			var mac=$("#mac").val();
			var checkMacUrl=getPath()+'/cmct/phoneUnmatch/checkMac'
			$.post(checkMacUrl,{mac:mac},function(res){
				res=eval("("+res+")");
				if(res.STATE=='SUCCESS'){
					submitForm(configArr,type);
				}else{
					art.dialog.alert('该绑定地址已经绑定 '+res.MSG);
				}
			});
		}else{
			var setType=$('#setType option:selected').val();
			if(setType!='SHAR'){
				if($("#onlyUserId").val() == null || $("#onlyUserId").val()==''){
					art.dialog.alert("选择专用时,专用人不能为空");
					return false ;
				}else{
					submitForm(configArr,type);
				}
			}else{
				submitForm(configArr,type);
			}
		}
	}else{
		if(!$('#orgName').val()){
			art.dialog.alert('组织不能为空');
			 return false ;
		}else{
			submitForm(configArr,type);
		}
	}
}

function submitForm(configArr,type){
	currentDialog.button({name:'确定',disabled:true});
	$.ajax({
		url:$('form').attr('action'),
		dataType: "json",
		type:"POST",
		data: $('form').serialize(),
		success: function(res) {
			if(res.STATE == "SUCCESS"){
				art.dialog.alert("分配成功",function(){
					window.location.reload(); 
				});
			}else{
				art.dialog.alert(res.MSG);
			}
		}
	});
}



function getPermiss(data){
	if(data.range!=null){
		return map(data.range);
	}
}
function map(range){
	var str="";
	if(range.localMob==1){
		str+="手机";
	}
	if(range.localFixed==1){
		str+=" 本地固话";
	}
	if(range.domestic==1){
		str+=" 国内长途";
	}
	if(range.hide==1){
		str+=" 隐藏呼出"
	}if(range.black){
		str+="黑名单"
	}
	return str;
}

function changeSetType(){
	var setType=$('#setType option:selected').val();
	if(setType=='SHAR'){
		$('#matchOne td :eq(2)').hide();
		$('#matchOne td :eq(3)').hide();
	}else{
		$('#matchOne td :eq(2)').show();
		$('#matchOne td :eq(3)').show();
	}
}
