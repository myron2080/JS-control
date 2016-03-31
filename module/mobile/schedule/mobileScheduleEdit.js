$(document).on("mobileinit", function() {
  $.mobile.selectmenu.prototype.options.nativeMenu = false;//select 弹出层选择
}).ready(function(){
	  $("#backBtn").bind("click",function(){
		  window.location.href = base+"/weixinapi/mobileinterflow/mobileschedule/list"+param_system;
	  });
	  
	  if($("#id").val()!=null&&$("#id").val()!=''){
		  var pressLevel=$("#pressLevel").val();
		  var importLevel=$("#importLevel").val();
		  var pressimport=pressLevel+importLevel;
		  $('input:radio[value="'+pressimport+'"]').attr("checked","checked");
		  var type=$("#type").val();
		  $('input:radio[value="'+type+'"]').attr("checked","checked");
	  }
	  //$("#mydate1").mobiscroll(opt_data);
      //$("#mydate2").mobiscroll(opt_datatime);
});


/**
 * 保存
 */
function saveSchedule(){
	if(checkForm()){
		loading();
		submitForm();
	}
}
function loading(){
	$.mobile.loading( 'show', {
		  text: "保存中...",
		  textVisible: true,
		  theme: "b",
		  textonly: false
		  });
}
function submitForm(){		
		$.post(base+'/weixinapi/mobileinterflow/mobileschedule/save',$('form').serialize(),function(res){
			if(res.STATE == "SUCCESS"){
				if(res.MSG){
//					msgDialog(res.MSG);
					setTimeout(function(){
							window.close();
							window.location.href = base+"/weixinapi/mobileinterflow/mobileschedule/list"+param_system;
					
					},2000);
				}else{
					//关闭
//					msgDialog(res.MSG);
					setTimeout(function(){
							window.close();
							window.location.href = base+"/weixinapi/mobileinterflow/mobileschedule/list"+param_system;
					},2000);
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
	$("#msgStr").text(txt);
	//$.mobile.changePage( "#systemMsg", { role: "dialog" } );
	 $( "#popupSystemMsg" ).popup( "open" );
	 setTimeout("$( '#popupSystemMsg' ).popup( 'close') ", 1000 )
}
function msgDialog(txt,second){
	$.mobile.loading( "hide" );
	$("#msgStr").text(txt);
	//$.mobile.changePage( "#systemMsg", { role: "dialog" } );
	 $( "#popupSystemMsg" ).popup( "open" );
	 var mm=1000;
	 if(second){
		 mm=second*1000;
	 }
	 setTimeout("$( '#popupSystemMsg' ).popup( 'close') ", mm )
}

function changeEvent(){	
 /*var val=$("#impType").val();
 $("#pressLevel").val(val.charAt(0));
 $("#importLevel").val(val.charAt(1));*/
}

/**
 * 校验
 */
function checkForm(){
	var flag =true;
	var title = $("input[name='name']").val();
	title = $.trim(title);
	if(''==title|| null==title ){
		msgDialog("请输入标题!");
		//msgDialog("请输入标题!",2)
		flag = false;
		return;
	}
	if($("#needsmschk").attr("checked")=='checked'){
		$("#needSms").val("1");
	}else{
		$("#needSms").val("0");
	}	
	 var val=$("#impType").val();
	 $("#pressLevel").val(val.charAt(0));
	 $("#importLevel").val(val.charAt(1));
	
	var t = $('input:radio[name="radiotype"]:checked').val();
	if(!t){
		msgDialog("请选择日程类型");
		flag = false;
	}else{
		$("#type").val(t);
	}
	var date=$("#scheDate").val();
	if(date==''){
		msgDialog("请选择日期!");
		flag = false;
		return;
	}
	if(!$("#aheadTime").val()){
		$("#aheadTime").val(0);
	}
	var content = $("#description").val();
	content = $.trim(content);
	if(null==content || ""==content){
		msgDialog("请输入内容!");
		flag = false;
		return;
	}else if(content.length>100){
		$('#preview').val(content.substr(0,100)+'...');	
	}else{
		$('#preview').val(content);	
	}
	/*if($("#dateyy").val()&&$("#datemm").val()){
		var dateyy = $("#dateyy").val();
		var datemm = $("#datemm").val();
		var datestr = dateyy + " "+datemm+":00";
		$("#scheDate").val(datestr);
	}*/
	
	return flag;
	
}