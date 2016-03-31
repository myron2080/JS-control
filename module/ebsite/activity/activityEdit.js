var uploadType = 1;
$(function(){
	$("#showType").change(function(){
		if($("#showType option:selected").text() == "首页弹窗") {
			$("#note1").text("注：图片大小，100KB以内");
			$("#note2").text("注：图片大小，100KB以内");
			uploadType = 2;
			$("#pageType").val(2)
			initButton();
			initUpload();
			initUpload1();
		} else {
			$("#note1").text("注：图片大小，50KB以内");
			$("#note2").text("注：图片大小，50KB以内");
			uploadType = 1;
			$("#pageType").val(1)
			initButton();
			initUpload();
			initUpload1();
		}
	});
	
	if($("#showType").find("option:selected").text() == "首页弹窗") {
		$("#note1").text("注：图片大小，100KB以内");
		$("#note2").text("注：图片大小，100KB以内");
		uploadType = 2;
		$("#pageType").val(2)
	}
	initButton();
	initUpload();
	initUpload1();
});
function initUpload(){
	var id = $("#id").val();
	new AjaxUpload($("#uploadButton"), {
    	action: getPath()+'/ebsite/activity/upload?direct=ebsite/activity&uploadType=' + uploadType + "&id=" + id,
        autoSubmit: true,
        name: "image",
        responseType: "json",
        onSubmit: function(file, extension){
            if (extension && /^(jpg|png|gif)$/.test(extension)) {
            }
            else {
            	art.dialog.alert("只允许上传jpg|png|gif图片");
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
				$('#photoPath').val(url);
            	$('#personPhoto').attr('src',getPath() + '/images/' + url.replace('size','100X75'));
			} else {
				art.dialog.alert("<br>上传失败:" +"<br><br>&nbsp;"+ json.MSG);
			}
        }
	 });
}
function initUpload1(){
	var id = $("#id").val();
	new AjaxUpload($("#uploadButton1"), {
    	action: getPath()+'/ebsite/activity/upload?direct=ebsite/activity&uploadType=' + uploadType + "&id=" + id,
        autoSubmit: true,
        name: "image",
        responseType: "json",
        onSubmit: function(file, extension){
            if (extension && /^(jpg|png|gif)$/.test(extension)) {
            }
            else {
                alert("只允许上传jpg|png|gif图片");
                return false;
            }
        },
        onComplete: function(file, json){
        	alert(json.STATE)
        	if(json.error){
        		alert('图片要求宽大于320，或者高大于240');
        		return;
        	}
        	var url=json.path;
			if(json.STATE == "SUCCESS"){
				$('#photoPath1').val(url);
            	$('#personPhoto1').attr('src',getPath() + '/images/' + url.replace('size','100X75'));
			} else {
				art.dialog.alert(json.MSG);
			}
        }
	 });
}

function cToGoods(){
	$("#ssspHtml")[0].innerHTML="<span class=\"red\">*</span>活动商品：";
	$("#sssp").append(
			"<div title=\"商品\" height=\"500px\" width=\"550px\" datapickerurl=\""+base+"/ebsite/coupon/goodsDataPicker\" id=\"personF9\" style=\"float: left\" class=\"f7\">"
			+"<input type=\"hidden\" readonly=\"readonly\"  value=\"\"  validate=\"{required:true,maxlength:100}\" id=\"value\" name=\"value\" datapicker=\"value\">"
			+"<div class=\"l-text\" style=\"width: 150px;\">"
			+"	<input readonly=\"readonly\" style=\"border:none;height:18px; line-height:18px;\" id=\"value\" validate=\"{required:true,maxlength:100}\" type=\"text\" name=\"value\" value=\""+$("#goodsName2").val()+"\" ondblclick=\"openDataPicker('personF9')\" datapicker=\"name\" class=\"l-text-field valid\" style=\"width: 131px;\" ligeruiid=\"TextBox1002\">"
			+"</div>"
			+"<strong onclick=\"clearDataPicker('personF9')\"style=\"display: block;\"></strong> "
			+"<span onclick=\"openDataPicker('personF9')\" class=\"p_hov\"></span>"
		    +"</div>"
	);
}
function cToGoodsCategoty(){
	$("#ssspHtml")[0].innerHTML="<span class=\"red\">*</span>商品类目：";
	$("#sssp").append(
			 "<div title=\"商品类目\"  height=\"500px\" width=\"750px\" datapickerurl=\""+base+"/ebsite/treeCoupon/treeDataPicker\" id=\"personF8\" style=\"float: left\" class=\"f7\">"
			 +"<input type=\"hidden\" readonly=\"readonly\"  value=\"\"  validate=\"{required:true,maxlength:100}\" id=\"value\" name=\"value\" datapicker=\"value\">"
			 +"<div class=\"l-text\" style=\"width: 150px;\">"
			 +"		<input readonly=\"readonly\"  style=\"border:none;height:18px; line-height:18px;\" id=\"value\"  validate=\"{required:true,maxlength:100}\" type=\"text\" name=\"value\" value=\""+$("#goodsCategoryName2").val()+"\" ondblclick=\"openDataPicker('personF8')\" datapicker=\"name\" class=\"l-text-field valid\" style=\"width: 131px;\" ligeruiid=\"TextBox1002\">"
			 +"	</div>"
			 +"	<strong onclick=\"clearDataPicker('personF8')\"style=\"display: block;\"></strong> "
			 +"	<span onclick=\"openDataPicker('personF8')\" class=\"p_hov\"></span>"
			 +"</div>"
	);
}

function cToProvince(){
	$("#ssspHtml")[0].innerHTML="<span class=\"red\">*</span>特产省份：";
	$("#sssp").append(
			 "<div title=\"特产省份\"  height=\"500px\" width=\"750px\" datapickerurl=\""+base+"/ebsite/activity/provinceDataPicker\" id=\"personF8\" style=\"float: left\" class=\"f7\">"
			 +"<input type=\"hidden\" readonly=\"readonly\"  value=\"\"  validate=\"{required:true,maxlength:100}\" id=\"value\" name=\"value\" datapicker=\"value\">"
			 +"<div class=\"l-text\" style=\"width: 150px;\">"
			 +"		<input readonly=\"readonly\"  style=\"border:none;height:18px; line-height:18px;\" id=\"value\"  validate=\"{required:true,maxlength:100}\" type=\"text\" name=\"value\" value=\""+$("#provinceName2").val()+"\" ondblclick=\"openDataPicker('personF8')\" datapicker=\"name\" class=\"l-text-field valid\" style=\"width: 131px;\" ligeruiid=\"TextBox1002\">"
			 +"	</div>"
			 +"	<strong onclick=\"clearDataPicker('personF8')\"style=\"display: block;\"></strong> "
			 +"	<span onclick=\"openDataPicker('personF8')\" class=\"p_hov\"></span>"
			 +"</div>"
	);
}

function cToUrl(){
	$("#ssspHtml")[0].innerHTML="<span class=\"red\">*</span>跳转链接：";
	$("#sssp").append("<input type=\"text\" validate=\"{required:true,maxlength:300}\"  name=\"value\" id=\"value\" value=\""+$("#url").val()+"\"/>");
}
function addAdvTypeInput(){
	$("#advtypeDiv").append(
			"<td align=\"right\" style=\"border:0\"><span class=\"red\">*</span>广告类型：</td>"
         	 +"<td align=\"left\" style=\"border: 0\" colspan=\"2\">"
		         +"<select name=\"advType\" id=\"advType\">"
		         +"<option value=\"PRO\">产品</option>"
				 +"<option value=\"LOCAL\">特产</option>"
					+"<option value=\"PRE\">预售</option>"
					+"<option value=\"ROB\">抢购</option>"
					+"<option value=\"SALE\">特惠</option>"
		       +"</select>"
	          +"</td>"
	);
}

function cToRob(){
	$("#ssspHtml")[0].innerHTML="<span class=\"red\">*</span>抢购活动：";
	$("#sssp").append(
			 "<div title=\"抢购商品\"  height=\"500px\" width=\"750px\" datapickerurl=\""+base+"/ebsite/activity/robDataPicker\" id=\"personF8\" style=\"float: left\" class=\"f7\">"
			 +"<input type=\"hidden\" readonly=\"readonly\"  value=\"\"  validate=\"{required:true,maxlength:100}\" id=\"activityId\" name=\"activityId\" datapicker=\"value\">"
			 +"<div class=\"l-text\" style=\"width: 150px;\">"
			 +"		<input readonly=\"readonly\"  style=\"border:none;height:18px; line-height:18px;\" id=\"activityId\"  validate=\"{required:true,maxlength:100}\" type=\"text\" name=\"activityId\" value=\""+$("#activityName2").val()+"\" ondblclick=\"openDataPicker('personF8')\" datapicker=\"name\" class=\"l-text-field valid\" style=\"width: 131px;\" ligeruiid=\"TextBox1002\">"
			 +"	</div>"
			 +"	<strong onclick=\"clearDataPicker('personF8')\"style=\"display: block;\"></strong> "
			 +"	<span onclick=\"openDataPicker('personF8')\" class=\"p_hov\"></span>"
			 +"</div>"
	);
}

function cToPre(){
	$("#ssspHtml")[0].innerHTML="<span class=\"red\">*</span>预售活动：";
	$("#sssp").append(
			 "<div title=\"抢购商品\"  height=\"500px\" width=\"750px\" datapickerurl=\""+base+"/ebsite/activity/preDataPicker\" id=\"personF8\" style=\"float: left\" class=\"f7\">"
			 +"<input type=\"hidden\" readonly=\"readonly\"  value=\"\"  validate=\"{required:true,maxlength:100}\" id=\"activityId\" name=\"activityId\" datapicker=\"value\">"
			 +"<div class=\"l-text\" style=\"width: 150px;\">"
			 +"		<input readonly=\"readonly\"  style=\"border:none;height:18px; line-height:18px;\" id=\"activityId\"  validate=\"{required:true,maxlength:100}\" type=\"text\" name=\"activityId\" value=\""+$("#activityName2").val()+"\" ondblclick=\"openDataPicker('personF8')\" datapicker=\"name\" class=\"l-text-field valid\" style=\"width: 131px;\" ligeruiid=\"TextBox1002\">"
			 +"	</div>"
			 +"	<strong onclick=\"clearDataPicker('personF8')\"style=\"display: block;\"></strong> "
			 +"	<span onclick=\"openDataPicker('personF8')\" class=\"p_hov\"></span>"
			 +"</div>"
	);
}

function typeChange(openType,type){
	$("#sssp").empty();
	if(openType=="LIST" && type=="LOCAL"){
		cToProvince();
	}else if(openType=='VIEW' && type=="ROB"){//抢购详情
		cToRob();
	}else if(openType=="VIEW" && type=="PRE"){//预售详情
		cToPre();
	}else if(openType=="VIEW"){
		cToGoods();
	}else if(openType=="LIST"){
		cToGoodsCategoty();
	}else if(openType=="WEB"){
		cToUrl();
	}else{
		alert("值有误！")
	}
}
function initButton(){ 
	var openType = $("#oponType").val();
	var type = $("#type").val();
	typeChange(openType,type);
	
	$("#oponType").change(function(){
		var openType = $("#oponType").val();
		typeChange(openType,$("#type").val());
	});
	
	$("#type").change(function(){
		var type = $("#type").val();
		if(type!='ACTIVITY'){
			$('#oponType').removeAttr('disabled');
		}
		if(type=="ADV"){
			addAdvTypeInput();
		}else{
			$("#advtypeDiv").empty();
			typeChange($("#oponType").val(),type);
		}
	});
}

function initPageState(){
	var loc = self.location+"";
	var queryString = loc.replace(/^[^\?]+\??/,'');
	var params = parseQuery( queryString );
	$edit_viewstate = params['VIEWSTATE'];
	if($edit_viewstate=='VIEW'){
		
		$('#uploadButton').hide();
		
		//输入框
		$('input,textarea,select').each(function(){
			$(this).attr('disabled','disabled');
		});
		//超链接
		$('a').each(function(){
			if(!$(this).attr('escape')){//如果有escape属性，则跳过
				$(this).removeAttr('onclick');
				$(this).attr('href','javascript:void(0)');
				$(this).attr('disabled','disabled');
			}
		});
		//F7
		$('div[class="f7"]').each(function(){
			$(this).attr('disabled','disabled');
			$(this).find('span').each(function(){
				$(this).removeAttr('onclick');
			});
			$(this).find('strong').each(function(){
				$(this).removeAttr('onclick');
			});
		});
		//关闭按钮 tab_box_close
		$('div[class="tab_box_close"]').each(function(){
			$(this).css('display','none');
			
		});
		//新增按钮 tab_box_add
		$('.tab_box_add').each(function(){
			$(this).css('display','none');
			
		});
	}
}
