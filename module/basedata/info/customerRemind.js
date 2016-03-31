$(document).ready(function(){
	Autocomplete.init({
		$em:$("#mateName"),
		$obj:$("#mateId"),
		url:getPath()+"/cmct/wechatCommunication/getPersons",
		maxRows:10,
		afterSelect: function(){
			addMate();
		}
	});
	$("#checkDiv").find("[name=fk]").each(function(){
		$(this).bind("click",function(){
			setVaule();
		});
	});
});

/**
 * 增加 同事号码  (修改为 增加 一个同事  不同步mateVal的值 最后保存时 统一赋值)
 */
function addMate(){
	var mateVal=getAllSpanMate();
	var mateId = $("#mateId").val().split(',')[0];
	var addr=mateId.split(",");
	var mateName=$("#mateName").val();
	if(mateVal.indexOf(addr[0])!=-1){
		$("#selectedSpan").show();
		setTimeout(function(){
			$("#selectedSpan").hide();
		},1500);
	}else{
		var li="<li id='"+addr[0]+"'>"
	        +mateName+"<a href='javascript:void(0)' onclick='deleteMate(this)'><img src='"+getPath()+"/default/style/images/fastsale/send_message.gif' style='vertical-align: top;' /></a>"
	        +"</li>";
	   $("#mateLi").append(li);
	   setSelectNum();
	}
	$("#mateName").val("");
	$("#mateId").val("");
	$("#remindjson").val($("#remindjson").val()+mateId+",");
}

function deleteMate(obj){
	$(obj).parent().remove();
	setSelectNum();
}

/**
 * 同步 选择 同事 数
 */
function setSelectNum(){
	var len=$("#mateLi li").length;
	$("#selectNum").html(len);
}

/**
 * 获取 已经选择的所有同事的 信息
 * @returns
 */
function getAllSpanMate(){
	var mateVal="";
	$("#mateLi li").each(function(){
		var oneVal=$(this).attr("id")+","+$(this).find("#customerPhone").val();
		mateVal=oneVal+";"+mateVal;
	});
	return mateVal;
}

function setVaule(){
	$("#checkDiv").find("[name=fk]").each(function(){
		if($(this).attr("checked") != ''){
			$("#"+$(this).attr("key")).val(1);
		}else{
			$("#"+$(this).attr("key")).val(0);
		}
	});
}

function saveEdit(dlg) {

	// 验证提醒
	if ($("#warn").attr("checked") == "checked") {
		var remindYY = $("#dateyy").val();
		var remindHH = $("#datemm").val();
		if(remindYY!='' && remindHH!=''){
			var remindTime = $("#dateyy").val()+" "+$("#datemm").val();
			$("#remindTime").val(remindTime);
		}else{
			art.dialog.tips("请选择提醒时间！");
			return;
		}
		var persons = $("input[name='manId']"); // 提醒人
		if (persons == null || persons.length == 0) {
			art.dialog.tips("请选择提醒人！");
			return;
		}
	}
	dealRemind($("#" + $("#formID").val())); // 处理提醒

	$("#" + $("#formID").val()).submit();
	
	
	
	
	dlg.button({
		name : "保存",
		disabled : true
	}, {
		name : "取消",
		disabled : true
	});
}

function submitForm() {
	$.post($("#" + $("#formID").val()).attr('action'), $(
			"#" + $("#formID").val()).serialize(), function(res) {
		if (res.STATE == "SUCCESS") {
			if (res.MSG) {
				art.dialog({
					icon : 'succeed',
					time : 1,
					content : res.MSG
				});
				setTimeout(function() {
					art.dialog.close();
				}, 1000);

			} else {
				art.dialog.close();
			}
		} else {
			if (currentDialog) {
				currentDialog.button({
					name : "取消",
					disabled : false
				});
				currentDialog.button({
					name : "保存",
					disabled : false
				});
			}
			art.dialog.tips(res.MSG);
		}
	}, 'json');
}

$.extend($.ligerDefaults.Form, {
	editorBulider : function(jinput) {
		var inputOptions = {};
		if (jinput.is("select")) {
			// jinput.ligerComboBox(inputOptions);
		} else if (jinput.is(":text") || jinput.is(":password")) {
			var ltype = jinput.attr("ltype");
			switch (ltype) {
			case "select":
			case "combobox":
				jinput.ligerComboBox(inputOptions);
				break;
			case "spinner":
				jinput.ligerSpinner(inputOptions);
				break;
			case "date":
				jinput.ligerDateEditor(inputOptions);
				break;
			case "float":
			case "number":
				inputOptions.number = true;
				jinput.ligerTextBox(inputOptions);
				break;
			case "int":
			case "digits":
				inputOptions.digits = true;
			default:
				jinput.ligerTextBox(inputOptions);
				break;
			}
		} else if (jinput.is(":radio")) {
			// jinput.ligerRadio(inputOptions);
		} else if (jinput.is(":checkbox")) {
			// jinput.ligerCheckBox(inputOptions);
		} else if (jinput.is("textarea")) {
			jinput.addClass("l-textarea");
		}
	}
});


/**
 * ************************** * 处理提醒 **************************
 */
function dealRemind(obj) {
	var lth = $("#checkDiv").find("input[type='checkbox']:checked").length;
	if(lth>1){
		$(obj).find("#type").val("ALL");
	}else{
		$(obj).find("#type").val($("#checkDiv").find("input[type='checkbox']:checked").attr("key"));
	}
	if (lth>0) {
		var remindYY = $("#dateyy").val();
		var remindHH = $("#datemm").val();
		if(remindYY!='' && remindHH!=''){
			var remindTime = $("#dateyy").val()+" "+$("#datemm").val();
			$("#remindTime").val(remindTime);
		}
		$(obj).find("#remindTimeStr").val($("#remindTime").val());
		$(obj).find("#remindDesc").val($("#remindDescArea").val())
	} else {
		$("input[name='remindTimeStr']").val("");
		$("input[name='remindjson']").val("");
	}
}

function submit(){
	dealRemind($('#dataForms'));
	$('#dataForms').submit();
	$("#remindTime").val("");
	$("#remindDescArea").val("");
	$("[key=system]").attr("checked","checked");
	$("[key=weixin]").removeAttr("checked");
	$("[key=sms]").removeAttr("checked");
	
}
