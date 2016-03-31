$(document).on("mobileinit", function() {
  $.mobile.selectmenu.prototype.options.nativeMenu = false;//select 弹出层选择
}).on("click", "#saveBtn", function() {
	  var $this = $( this ),
	  html = $this.jqmData( "html" ) || "";
	$.mobile.loading( 'show', {
	  text: "保存中...",
	  textVisible: true,
	  theme: "b",
	  textonly: false,
	  html: html
	  });
	saveCustomer();
}).ready(function(){
	  var id = $("#id").val();
	  if(id){
		 $("#winTitle").text("修改客户");
	  }
	  /*$("#backBtn").bind("click",function(){
		  window.location.href = base+"/mobilefastsale/intention/list";
	  });*/
});

 

/**
 * 客户保存
 */
function saveCustomer(){
	var customerName = $("#customerName").val();
	if(!customerName){
		msgDialog("客户名称不能为空！");
		return ;
	}
	var customerPhone = $("#customerPhone").val();
	if(!customerPhone){
		msgDialog("客户电话不能为空！");
		return ;
	}else{
		var reg =/^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/;
		if(!reg.test(customerPhone)){
			msgDialog("请输入正确的电话号码！");
			return;
		}
	}
	var customerSourceType = $("#customerSourceType_Id").val();
	if(!customerSourceType){
		msgDialog("请选择客户来源！");
		return ;
	}
	var project = $("#project_Id").val();
	if(!project){
		msgDialog("请选择意向项目！");
		return ;
	}
	submitForm();
}

function submitForm(){
		
		$.post($('form').attr('action'),$('form').serialize(),function(res){
			if(res.STATE == "SUCCESS"){
				if($("#saveBeSpeak").val()=="Y"){
					$("#customerId").val(res.id);
				}else{
				setTimeout(function(){
					var id=$("#id").val();
					window.location.href = base+"/mobile/infield/list?projectId="+res.PROJECTID;
				},1000);
				}
			}else{
				//错误信息
				msgDialog(res.MSG);
			}
	    },'json');
}
/**
 * 弹出 提示信息
 * @param txt
 */
function msgDialog(txt){
	$.mobile.loading( "hide" );
	$("#msgPopupStr").text(txt);
	//$.mobile.changePage( "#systemMsg", { role: "dialog" } );
	$("#popupSystemMsg").popup("open");
	setTimeout('$("#popupSystemMsg").popup("close")', 1000 );
}

/**
 * 弹出 提示信息
 * @param txt
 */
function msgPopup(txt){
	$.mobile.loading( "hide" );
	$("#popupMsgStr").text(txt);
	$( "#popupSystemMsg" ).popup( "open" );
	setTimeout("$('#popupSystemMsg').popup( 'close') ", 1000 );
}
function chooseFunc(obj){
	var _id = $(obj).attr("key");
	var _value = $(obj).attr("value");
	var _name=$(obj).attr("name");
	if(_id=='project')
	$("#"+_id).val(_name);
	$("#"+_id+"_Id").val(_value);
	$("#"+_id+"_Name").html(_name);
	$("#"+_id+"_Name").css('color','#2bb342');
	$.mobile.changePage( "#editPage", { role: "page" } );
}
function chooseSrc(obj){
	var id= $(obj).attr("key");
	var name = $(obj).attr("name");
	$("#customerSourceType_Id").val(id);
	$("#customerSourceType_Name").html(name+">>");
	$("#customerSourceTypeName").css('color','#2bb342');
	$.mobile.changePage( "#editPage", { role: "page" } );
}
function chooseProject(obj){
	var id= $(obj).attr("pid");
	var name = $(obj).attr("pname");
	$("#project_Id").val(id);
	$("#project").val(name);
	$("#project_Name").html(name+">>");
	$("#project_Name").css('color','#2bb342');
	$.mobile.changePage( "#editPage", { role: "page" } );
}
