$(document).ready(function(){
	var ft = 1;
	var pname = "";
	var pid = "";
	var dataId = $("#dataId").val();
	if(ft==1){
		pname = $("#parentName").val();;
		pid = $('input[type="hidden"][name="parent.id"]').val();
		ft = ft+1;
	}
	$('#orgType').bind('change',function(){
		var v = $(this).val();
		if(v=='GROUP' || v=='COMPANY'|| v=='SON_GROUP' || v=='NDEPENDENT_COMPANY'){
			$('#businessTypeList').hide();
		}else{
			$('#businessTypeList').show();
		}
		if(v=='GROUP'){
			$("#parentName").val("");
			$("#parentName").removeAttr("ondblclick");
			$('input[type="hidden"][name="parent.id"]').val("");
			$('#parent strong').css("display","none");
			$('#parent span').css("display","none");
			
		}else{
			$("#parentName").val(pname);
			$("#parentName").attr("ondblclick","openDataPicker('parent')");
			$('input[type="hidden"][name="parent.id"]').val(pid);
			$('#parent strong').css("display","");
			$('#parent span').css("display","");
		}
		if(v=='GROUP'||v=='SON_GROUP'||v=='COMPANY'||v=='BRANCH_COMPANY'){
			$('#areacontrol').show();
			
		}else{
			$("#controlcity div").remove();
			$('#areacontrol').hide();
			
		}
	});
	$('#orgType').trigger('change');
	
	//名字输入完之后自动带出简写
	$('#name').bind('change',function(){
		toPinyin($(this).val(),function(result){
			$('#simplePinyin').val(result.simple);
		});
		toPinyin($(this).val(),function(result){
			$('#fullPinyin').val(result.full);
		});
	});
	//组织迁移
	if(editState=="MOVE"){
		$("#parentName").removeAttr("disabled");
	}else{
		$("#parentName").attr({"disabled":"disabled"});
	}
	if(dataType=="copyAdd"){//如果是复制新增的,清除id
		$('#dataId').val('');
	}
	
});


function saveEdit(){
	submitData();
}

function submitData(){
	var flag = false;
	
	var remarkFlag=false;
	 var _items =$('input[type="checkbox"][name="businessType"]:checked');
	 if(_items.length>0){
		 flag=true;
		 var businessTypesName="";
		 $('input[type="checkbox"]:checked').each(function(){
			    businessTypesName+=$(this).attr("key")+";"
			  });
		 $("#businessTypesName").val(businessTypesName);
	 }else{
		 var ot = $('#orgType').val()
		 if(ot=='COMPANY' || ot=='GROUP' || ot=='NDEPENDENT_COMPANY'){
			 flag = true;
		 }else{
			 art.dialog.tips('请选择至少一项业务类型');
			 flag=false;
		 }
	 }
	 var remark=$("textarea[name='description']").val();

	 if(remark.length>500){
			art.dialog.tips("字符数量不能超过500个!");
			remarkFlag=false;
	 }else{
		 remarkFlag = true;
	 }
		var citys = $(".citys");
		var len = citys.length;
		var info="";
		$.each(citys,function(index,callback){
			if(index<(len-1)){
			info= info+citys.get(index).value+","
			}else{
			info= info+citys.get(index).value	
			}
		});
		if(info!=null&&info!=""){
			$("#cityIds").val(info);
		}
	 if(flag&&remarkFlag){
		 $("form").submit();
	 }
	 
}

function addCity(){
  var name = $("#cityname").val();
  var id = $("#cityid").val();
  var tr = "<div style=\"float: left;margin-top: 5px;margin-left: 10px\">"
	  +"<input class=\"citys\"  type=\"hidden\" value=\""+ id +"\"/>"
	  +"<b style=\"font-size:12px;font-family:宋体\">"+name+"</b>"
	  +"<b style=\"color: red;cursor: pointer;\" onclick=\"delBp(this)\" title=\"删除\"><img style=\"padding:3px 0 0 0;\" src=\""+baseurl+"/default/style/images/photo03.gif\"/></b>"
	  +"</div>";
  $("#addbtn").before(tr);
}

function delBp(obj){
	var $obj = $(obj);
	art.dialog.confirm("确定删除该城市吗？",function(){
		$obj.parent().remove();
	});
	
}

