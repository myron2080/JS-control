$(function(){
	//$("#name").blur(function(){
	//	$.get("pingyin",{name:$("#name").val()},function(data){
	//		$("#simplePinyin").attr("value",data.value);
	//	},"json");
	//});
	
	//名字输入完之后自动带出简写
	 setSimplePinyinValue($("#name"),$("#simplePinyin"));
});

//仓库名称显示
function storageBackFun(data,sourceObj){
	$.each(data.attributes,function(i,ele){
		if(ele.name == "name" ){
			$(sourceObj).val(ele.value);
		}
	});
}

function afterFilterStr(){
	var storageId=$('#storageId').val();
	if(!storageId || storageId == ''){
		return false;
	}else{
		return true;
	}
}

function parentStorageSpace(data,sourceObj){
	$.each(data.attributes,function(i,ele){
		if(ele.name == "name" ){
			$(sourceObj).val(ele.value);
		}
	});
}

function initForm() {
	// $.metadata.setType("attr", "validate");
	var v = $("form").validate({
		rules : {
			number : {
				required : true,
				isRightfulString : true,
				rangelength : [ 3, 20 ],
				remote : {
					type : 'POST',
					url : getPath() + '/storage/storagespace/encodeIsExist',
					data : {
						id : function() {
							return $("#dataId").val();
						},
						number : function() {
							return $("#number").val();
						}
					}
				}
			},
			storageName : {
				required : true,
				rangelength : [ 1, 20 ]
			},
			name : {
				required : true,
				rangelength : [ 1, 20 ]
			},
			simplePinyin : {
				required : true
			},
			goodsCategoryName : {
				required : true
			}
			
		},
		messages : {
			number : {
				required : "编码不能为空",
				rangelength : "长度3-20之间",
				remote : "编码已经存在"
			},
			storageName :{
				required : "仓库不能为空",
			},
			name : {
				required : "名称不能为空",
				rangelength : "长度1-20之间"
			},
			simplePinyin : {
				required : "简拼不能为空"
			},
			goodsCategoryName : {
				required : "类目不能为空"
			}
		},
		// 调试状态，不会提交数据的
		debug : true,
		onkeyup : false,
		errorPlacement : function(lable, element) {
			if (element.is("textarea")) {
				element.addClass("l-textarea-invalid");
			} else if (element.is("input")) {
				element.parent().addClass("l-text-invalid");
			}
			$(element).attr("title", lable.html());
			$(element).poshytip();

		},
		success : function(lable) {
			var element = $("#" + lable.attr("for"));
			if (element.hasClass("l-textarea")) {
				element.removeClass("l-textarea-invalid");
			} else if (element.hasClass("l-text-field")) {
				element.parent().removeClass("l-text-invalid");
			}
			// $(element).removeAttr("title").ligerHideTip();
			$(element).poshytip("destroy");
			$(element).removeAttr("title");
		},
		submitHandler : function() {
			submitForm();
		}
	});
	$("form:not(.noLiger)").ligerForm();
}