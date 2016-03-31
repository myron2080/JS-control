$(document).on("mobileinit", function() {
  $.mobile.selectmenu.prototype.options.nativeMenu = false;//select 弹出层选择
}).ready(function(){
	  var id = $("#id").val();
	  if(id){
		 $("#winTitle").text("修改客户");
	  }
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
		if(! /^\d{11}$/.test(customerPhone)){
			msgDialog('客户电话不符合规范');
			return ;
		}
	}
	
	//数据维护
	var customerSource = $("#pageTwoVal").val();
	if(!customerSource){
		msgDialog("请选择客户来源");return;
	}
	
	var intentionDesc = $("input[name=intentionDesc]").val();
	if(!intentionDesc){
		$("input[name=intentionDesc]").val(intentionDesc+"-有意向");
	}
	//$("input[name=intentionDesc]").val(intentionDesc+"-有意向");
	
	
	
	var now = $("#tabs span.icon-svg25.Greenico").parent().attr('value');
	if(!now){
		msgDialog("请选择客户类型");
		return;
	}
	$("#customerLevel").val(now);
	
	submitForm();
}

function submitForm(){
		
		$.post($('form').attr('action'),$('form').serialize(),function(res){
			if(res.STATE == "SUCCESS"){
				if($("#saveBeSpeak").val()=="Y"){
					$("#customerId").val(res.id);
					saveBeSpeak_Ajax();
				}else{
				setTimeout(function(){
					var id=$("#id").val();
					window.location.href = base+"/mobilefastsale/intention/list";
				},1000);
				}
			}else{
				//错误信息
				msgDialog(res.MSG);
			}
	    },'json');
}

function saveBeSpeak(){ 
	$("#saveBeSpeak").val("Y");
	$("#beSpeakOpDiv" ).popup( "close" );
}
function saveBeSpeak_Ajax(){ 
	$.post($('#beSpeakForm').attr('action'),$('#beSpeakForm').serialize(),function(res){
		if(res.STATE == "SUCCESS"){
			alert(res.STATE);
			setTimeout(function(){
				var id=$("#id").val();
				window.location.href = base+"/mobilefastsale/intention/list";
			},1000);
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
 

function saveFun(obj){
	var $this = $(obj);
	html = $this.jqmData( "html" ) || "";
	$.mobile.loading( 'show', {
		  text: "保存中...",
		  textVisible: true,
		  theme: "b",
		  textonly: false,
		  html: html
		  });
	saveCustomer();
}

$(function(){
	$("#tabs td").click(function(){
		var o = $(this).find('span');
		var now = $("#tabs span.icon-svg25.Greenico");
		if(!o.hasClass('icon-svg25')){
			now.removeClass('icon-svg25').removeClass('Greenico').addClass('Ashico').parent().removeClass('now');
			o.removeClass('Ashico').addClass('icon-svg25').addClass('Greenico').parent().addClass('now');
		}
	})
})


function chooseone(obj){
	var o = $(obj);
	var kVal = o.attr('kVal');
	var kShow = o.attr('kShow');
	var kFor = o.attr('kFor');
	
	$("#"+kFor+"Show").html(kShow+">>").css('color','#2bb342');
	$("#"+kFor+"Val").val(kVal);
	
	window.location.href='#editPage';
}