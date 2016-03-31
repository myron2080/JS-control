$(document).ready(function(){
	var url = window.location.href;
	 if(url.indexOf("showDetail")>0){
		 $.mobile.changePage( "#listPage", { role: "page" } );
	 }
	
	 $("#addBtn").bind("click",function(event, ui) {
			addPerson();
	  });
	 /*$("#bacBut").bind("click",function() {
		 parent.backListPage()
	  });*/
	 $("#saveBtn").bind("click",function() {
		    saveArrive();
	  });
	 isShowDel();
});
function saveArrive(){ 
	if(chek()){
	setPerson();
	$.post($('#arriveForm').attr('action'),$('#arriveForm').serialize(),function(res){
		if(res.STATE == "SUCCESS"){
			commonTipShow(res.MSG,1000);
			window.location.href=base+'/mobile/customershowup/list';
			$("#arriveForm")[0].reset();
		}
    },'json');
}}

/**
 * 客户意向条件  选择
 * @param obj
 */
function changeDiv(obj){
	/*var id=$(obj).attr("key");
	$("#allCondition div").each(function(){
		if($(this).attr("key") == 'conditionKey'){
			$(this).hide();
		}
	});*/
	$("#floorDiv").show();
}

function showLoader() { 
    //显示加载器.for jQuery Mobile 1.2.0  
    $.mobile.loading('show', {  
        text: '加载中...', //加载器中显示的文字  
        textVisible: true, //是否显示文字  
        theme: 'b'       //加载器主题样式a-e  
        //textonly: false,   //是否只显示文字  
        //html: ""           //要显示的html内容，如图片等  
    });}
function addPerson(){
	var param=parseInt($("#indexParam").val(),10)+1;
	$("#indexParam").val(param);
	var div="";
	div+="<div class='chakanbox2 mt10'>" ;
	div+="<a class='Deletean1' key='del' onclick='deleteContact(this);'  href='javascript:void(0);' data-role='button'  data-inline='true' data-icon='delete'><div class='icon-svg27';></div></a><div data-role='fieldcontain' key='contactField' style='margin:0;'>";
	div+="<p><label for='nameId_"+param+"'>合作人</label>";
	div+="<input type='hidden' name='coPerid'  id='coPerid_nameId_"+param+"' value='' />";
	div+="<input type='text' name='name' id='nameId_"+param+"' placeholder='请选择 >>'  onclick='chooseperson(this);' value='' /></p>";//onclick='chooseperson(this);'
	div+="<p><label for='guestNumber_"+param+"'>带客量</label>";
	div+="<input type='number' name='guestNumber' id='guestNumber_"+param+"' value='' /></p>";
	div+="</div>" ;
	div+="</div>";
	$("#contactDiv").append(div);
	$("#contactDiv").parent().trigger('create');
	setAvgGuestNumber();
	 isShowDel();
}

function isShowDel(){
	var list=$("div[key='contactField']").length;
	if(list==1){
	$("a[key='del']").hide();	
	}else{
	$("a[key='del']").show();	
	}
}
function deleteContact(obj){
	var list=$("div[key='contactField']").length;
	/*if(list==1){
		//commonTipShow("至少保留一个合作人!",1000);
		msgDialog("至少保留一个合作人!");
	}else{
		$(obj).parent().remove();
	}*/
	$(obj).parent().remove();
	setAvgGuestNumber();
	isShowDel();
}
function chek(){
	var arriveTime=$("#arriveTime").val();
	if(arriveTime==null||arriveTime==''){
		msgDialog("请输入到场时间");
		return false;
	}
	var pgn=$("#belonPersonGuestNumber").val();
	if(pgn==null||pgn==''){
		msgDialog("请输入归属人带客量");
		return false;
	}else if(!checkNaN(pgn)){
		$("#belonPersonGuestNumber").val("");
		return false;
	}
	if(!chekNumber()){
		return false;
	};
	
	return true;
}
var total=0;
function chekNumber(){
	total=0;
	var bgn=$("#belonPersonGuestNumber").val();
	total+=eval(bgn);
	if(!chekguseNumber()){
		return false;
	}else{
		if(total.toFixed(1)!=1.0){
			msgDialog("带客量之和为1");
			//commonTipShow("带客量之和为1",1000);
			return false;
		}
	}
	return true;
}
function chekguseNumber(){
	var f=true;
	$("#contactDiv div").each(function(){
		if($(this).attr("key") == 'contactField'){
			var name = $(this).find("input[name='name']").val();
			if(name==null||name==''){
				msgDialog("请选择合作人");
				f=false;
			}else{
			var val = $(this).find("input[name='guestNumber']").val();
			total+=eval(val);
			if(val==null||val==''){
			msgDialog("请输入合作人带客量");
			f=false;
			}else if(!checkNaN(val)){
				$(this).find("input[name='guestNumber']").val("");
			f=false;
			}}
			}
	});
	return f;
}
function checkNaN(val){
	var reg=/^[0-9]*[1-9][0-9]*$|[^\d]/g;
	if(!reg.test(val)||!(0<val&&val<=1)){
		msgDialog("带客量只能输入0到1的数字!");
		return false;
	}
	return true;
}
function setAvgGuestNumber(){
	var t_= 1;
	t_+=$("div[key='contactField']").length;
	var avgValue =1.0/t_;
	var avgTotal =avgValue.toFixed(2)*t_;
	var remainder =1.0-avgTotal;
	$("#belonPersonGuestNumber").val(avgValue.toFixed(2)+remainder.toFixed(2));
	$("#contactDiv div").each(function(){
	if($(this).attr("key") == 'contactField'){
     $(this).find("input[name='guestNumber']").val(avgValue.toFixed(2));}
		
	});
}
/**
 * 拼接联系人json
 */
function setPerson(){
	var contactJson="[";
	$("#contactDiv div").each(function(){
		if($(this).attr("key") == 'contactField'){
			contactJson+="{";
			contactJson+="'salesmanId':'"+$(this).find("input[name='coPerid']").val()+"',";
			//contactJson+="'customerBeSpeakId':'"+$("#customerBeSpeakId").val()+"',";
			//contactJson+="'intentionCustomerId':'"+$("#customerId").val()+"',";
			contactJson+="'guestNumber':'"+$(this).find("input[name='guestNumber']").val()+"'},";
		}
	});
	if (contactJson.indexOf(",") != -1) {
		contactJson = contactJson.substring(0, contactJson.length - 1)+"]";
	}else{
		contactJson="";
	}
	$("#personJson").val(contactJson);
}
function loading(type){
	if(type == 'show'){
		var img="<img id='loading_img' src='"+base+"/default/style/images/loading.gif'/>";
		$("#moreDiv").append(img);
	}else{
		$("#loading_img").remove();
	}
}

//人员选择器 Stat
function chooseperson(obj){
	$("#choosePersonId").val($(obj).attr("id"));
	pagesearch(1,1);
	$.mobile.changePage( "#common_person_page", { role: "page" } );
}
// 人员选择器参数 ：快销业务成员
function setChoosePersonParam(para){
	//para.orgbusinesstypes = "4da303cf-975d-4158-b94e-ed117a0ed0e1";
	para.jobNumbers = jobNumbers;
}
function chooseone(obj){
	$.mobile.changePage( "#editPage", { role: "page" } );
	if(currentUserId!=$(obj).attr('pid')){
	$("#"+$("#choosePersonId").val()).val($(obj).attr('pname'));
	$("#coPerid_"+$("#choosePersonId").val()).val($(obj).attr('pid'));
	}else{
		msgDialog("不能选择自己哦！");	
	}
}
//人员选择器 End

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