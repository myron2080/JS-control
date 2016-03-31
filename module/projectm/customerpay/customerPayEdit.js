$(function() {
	var customerId = $("#customerId").val();
	if ($("#edit_viewStatus").val() != 'VIEW' && (customerId == "" || typeof(customerId) == "undefined" || "65a19487-c95e-44b1-859a-7cfa41aaa04a" == customerId)) {
		//将余额选项禁用
		$("#balance").attr("disabled","disabled");
		$("#balance").attr("value","请先选择客户");
		
		//将收付日期禁用
		$(":text[name='payDate']").attr("disabled","disabled");
		$(":text[name='payDate']").attr("value","请先选择客户");
		//将备注禁用
		$("#payDesc").attr("disabled","disabled");
		$("#payDesc").attr("value","请先选择客户");
	}
});

function validataPay() {
	//获取当前选择客户的id
	var customerId = $("#customerId").val();
	var balance =  $("#balance").val();
	if (balance == "" || typeof(balance) == "undefined") {
		return ;
	}
	//消费时，ajax验证余额是否足够
	$.ajax({
         type: "GET",
         url: getPath() + "/projectm/customerpay/getCurrentBalance",
         data: {customerId:customerId,balance:balance},
         dataType: "json",
         success: function(data){
        	  if(data.STATE=='FAIL'){
//         			art.dialog.tips(data.MSG);
         			$("#saveState").val("NOSAVE");
         			return ;
     			} else if (data.STATE=='SUCCESS') {
     				$("#saveState").val("SAVE");
     				return ;
     			} 
             }
     }); 
}


function changeCustomer() {
	$("#balance").removeAttr("disabled"); 
	$("#balance").removeAttr("value");
	$(":text[name='payDate']").removeAttr("disabled"); 
	$(":text[name='payDate']").removeAttr("value");
	$("#payDesc").removeAttr("disabled"); 
	$("#payDesc").val("");
	var customerId = $("#customerId").val();
	if (customerId != null && customerId != "") {
		$.post(getPath() + "/projectm/customerpay/getCurrentBalance",{customerId:customerId},function(data){
			$("#showCurrentBalance").html("当前客户余额为：<font color='red'>" + data.currentBalance + "</font>");
			$("li[key='payDateLi']").html("");
			var newInputComp = '<div class="l-text" style="width: 128px;"><input name="payDate" id="intentionDateStr" style="width: 124px;" type="text" validate="{required:true}" onclick="WdatePicker('+(null == data.payDate ? '{}':'{minDate:\''+data.payDate+'\'}')+')" class="Wdate l-text-field valid"/><div class="l-text-l"></div><div class="l-text-r"></div></div>';
			$("li[key='payDateLi']").append(newInputComp);
		},'json');
	}
}
