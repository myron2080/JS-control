var uploadType = 1;
$(function(){	
	initUpload();
});
function initUpload(){
	var id = $("#id").val();
	new AjaxUpload($("#uploadButton"), {
    	action: getPath()+'/ebsite/luckDraw/upload?direct=Lucky/luckDraw&uploadType=' + uploadType + "&id=" + id,   
        autoSubmit: true,
        name: "image",
        responseType: "json",
        onSubmit: function(file, extension){
            if (extension && /^(jpg|png|gif)$/.test(extension)) {
            }
            else {
            	art.dialog.alert ("只允许上传jpg|png|gif图片");
                return false;
            }
        },
        onComplete: function(file, json){
        	$("#image_size").val(json.IMAGE_SIZE);
        	if(json.error){
        		art.dialog.alert('图片要求宽大于320，或者高大于240');
        		return;
        	}
        	var url=json.path;
			if(json.STATE == "SUCCESS"){
				$('#shareIcon').val(url);
            	$('#personPhoto').attr('src',getPath() + '/images/' + url.replace('size','100X75'));
			} else {
				art.dialog.alert("<br>上传失败:" +"<br><br>&nbsp;"+ json.MSG);
			}
        }
	 });
}

/*$(function() {
	console.info('lunchCityEdit js is be inject...');
});*/
function initForm() {
	/*$.metadata.setType("attr", "validate");*/
	var v = $("form").validate({
		rules : {
			name : {                    
				required : true,
				rangelength : [ 3, 50 ]
			},
			startTime : {             
				required : true
			},
			endTime : {                
				required : true
			},
			activityUrl : {           
				required : true,
				rangelength : [ 3, 50 ]
			},
			activityRule : {        
				required : true,
				rangelength : [ 3, 200 ]
			},
			prizeRule : {          
				required : true,
				rangelength : [ 3, 250 ]
			},
			shareDesc : {          
				required : true,
				rangelength : [ 3, 50 ]
			}
		},
		messages : {
			name : {
				required : "活动名称不能为空",
				rangelength : "长度3-50之间"
			},
			startTime : {
				required : "开始时间不能为空"
			},
			endTime : {
				required : "结束时间不能为空"
			},
			activityUrl : {
				required : "活动链接不能为空",
			    rangelength : "长度3-50之间"
			},
			activityRule : {
				required : "活动规则不能为空",
				rangelength : "长度3-200之间"
			},
			prizeRule : {
				required : "奖品领取不能为空",
				rangelength : "长度3-250之间"
			},
			shareDesc : {
				required : "分享描述不能为空",
				rangelength : "长度3-50之间"
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
			var content=$.trim(contentActivityRule.getContentTxt());			
			if(!contentActivityRule.hasContents()){
				$("#contentStr").show();
				$("#contentStr").text("活动规则不能为空");
				return ;
			}else if(content.length>250){
//				$("#contentStr").show();
//				$("#contentStr").text("活动规则不能超过250字!");
//				return ;
			}else{
				$("#contentStr").hide();
			}			
			
			var content2 = $.trim(contentPrizeRule.getContentTxt());
			if(!contentPrizeRule.hasContents()){
				$("#contentStr").show();  //contentStr2
				$("#contentStr").text("奖品领取不能为空");
				return ;
			}else if(content2.length>250){
//				$("#contentStr").show();
//				$("#contentStr").text("奖品领取不能超过250字!");
//				return;
			}else{
				$("#contentStr").hide();
			}			
			
			submitForm();
		}
	});
	$("form:not(.noLiger)").ligerForm();
}

