$(document).ready(function(){
//	 $("#followTxt").textareaAutoHeight();
	searchData('0');
	$("#backBtn").bind("click",function(){
		window.location.href = base+"/mobilefastsale/intention/list";
	});
	$("#editCustomer").bind("click",function(){
		 editFunc();
	});
	 initBeSpeakData();
});
function editFunc(){
	if(editId!=null&&editId!=''){
		if(canEdit=="Y"){
			window.location.href = base+"/mobile/infield/edit?id="+editId;}else{
				msgDialog("无权限修改");
			}
	}else{
		window.location.href = base+"/mobilefastsale/intention/edit?id="+$("#customerId").val();}
}
function setHeight(obj)
{
  obj.style.height = obj.scrollHeight + 'px';
}


/**
 * textarea自适应
 */
$.fn.extend({
    textareaAutoHeight: function(options) {
        this._options = {
            minHeight: 0,
            maxHeight: 1000
        }
 
        this.init = function() {
            for (var p in options) {
                this._options[p] = options[p];
            }
            if (this._options.minHeight == 0) {
                this._options.minHeight = parseFloat($(this).height());
            }
            for (var p in this._options) {
                if ($(this).attr(p) == null) {
                    $(this).attr(p, this._options[p]);
                }
            }
            $(this).keyup(this.resetHeight).change(this.resetHeight)
                .focus(this.resetHeight);
        }
        this.resetHeight = function() {
            var _minHeight = parseFloat($(this).attr("minHeight"));
            var _maxHeight = parseFloat($(this).attr("maxHeight"));
 
            if (!$.browser.msie) {
                $(this).height(0);
            }
            var h = parseFloat(this.scrollHeight);
            h = h < _minHeight ? _minHeight :
                h > _maxHeight ? _maxHeight : h;
            $(this).height(h).scrollTop(h);
            if (h >= _maxHeight) {
                $(this).css("overflow-y", "scroll");
            } else {
                $(this).css("overflow-y", "hidden");
            }
        }
        this.init();
    }
});

function showme(){
    var oSon = window.document.getElementById("hint");
    if (oSon == null) return;
    with (oSon){
     innerText = guoguo.value;
     style.display = "block";
     style.pixelLeft = window.event.clientX + window.document.body.scrollLeft + 6;

     style.pixelTop = window.event.clientY + window.document.body.scrollTop + 9;

    }
   }
   function hidme(){
    var oSon = window.document.getElementById("hint");
    if(oSon == null) return;
    oSon.style.display="none";
   }

 
/**
 * 添加跟进记录
 */
function addFollow(){
	showload("请稍等");
	var remark=$("#followTxt").val();
	if(remark == ''){
		//msgDialog("请输入跟进内容!");
	//	$("#followTextStr").show();
		//$("#followTxt").focus();
		commonTipShow("请输入跟进内容！");
		hideload();
	}else{
		$("#followTextStr").hide();
		$.post(base+'/mobilefastsale/intention/saveIntentionFollow',{remark:remark,customerId:$("#customerId").val()},function(res){
			hideload();
			if(res.STATE == 'SUCCESS'){
				$("#followTxt").val("");
				$("#comment").html("");
				$("#followTxt").css('height','34px');
				searchData('0');
			}else{
				msgDialog(res.MSG);
			}
		},'json');
	}
}

function initScrollView(){
	$(window).scroll(function(){
		　　var scrollTop = $(this).scrollTop();
		　　var scrollHeight = $(document).height();
		　　var windowHeight = $(this).height();
		　　if(scrollTop + windowHeight == scrollHeight){
				if($("#currentPage").val()!= $("#totalPage").val())
					searchData('1');
		　　}
	});
}
function searchData(str){
	//loading('show');
	var thePage;
	var currentPage=$("#currentPage").val();
	var totalPage=$("#totalPage").val();
	if(str == '0'){//初始化
		thePage=1;
	}else{//点更多
		thePage=parseInt(currentPage,10)+1;
	}
	$("#currentPage").val(thePage);
	$.post(base+'/mobilefastsale/intention/getFollowData',{pageSize:10,currentPage:thePage,intentionCustomerId:$("#customerId").val()},function(res){
		$("#totalPage").val(res.pageCount);
		 if($("#currentPage").val() == $("#totalPage").val()){//当前为最后一页 隐藏更多按钮
		    	$("#moreBtn").hide();
		    }else{
		    	//$("#moreBtn").show();
		    	initScrollView();
		    }
		if(null != res.items){
			var showList=res.items;
			var div="";
			for(var i=0;i<showList.length;i++){
				var obj=showList[i];
				var personPhoto =base+"/"+"default/style/images/mobile/man.jpg";
				if(obj.person.photo)
				 personPhoto = imgBase+"/"+obj.person.photo;
	            div+="<li>";
	            div+="<div class='ad-avatar'><img  src='"+personPhoto+"'/></div>";
	            div+="<div class='ad-msg'>";
	            div+="<div class='ad-reply'>";
	            div+="<div class='zd'><div class='zdin'>";
	            div+="<div class='zd-list'><b class='fl colorblue'>"+(obj.person?obj.person.name:'')+"("+(obj.org?obj.org.name:'')+")</b>  <b class='fr colorgray'>"+obj.followDate+"</b></div>";
	            div+="<div class='zd-list' >"+obj.followDesc+"</div></div></div></div></div></li>";
			}
			$("#comment").append(div).trigger("create"); 
			//loading('close');
		}
	},'json');
}


function initFollowData(){
	$.post(getPath()+"/mobilefastsale/intention/getFollowData",{intentionCustomerId:$("#id").val()},function(data){
		for(var i = 0;i<data.length;i++){
			$('<tr>'+
					'<td width="15%">'+data[i].followResult+'</td>'+
                    '<td width="60%">'+data[i].followDesc+'</td>'+
                    '<td width="10%">'+data[i].person.name+'</td>'+
                    '<td width="15%">'+data[i].followDate+'</td>'+
                  '</tr>').appendTo("#followData");
		}
		if(data.length==0){
			$('<tr><td colspan="4">没有相关跟进记录</td></tr>').appendTo("#followData");
		}
		if(data.length > 3){
			$("#div_customerFollows").css({"overflow-y":"auto","height":"100px"});
			$("#head_customerFollows").css({"width":"98%"});
			$("#tab_customerFollows").css({"width":"100%"});
			$("#div_customerFollows").width($("#head_customerFollows").width()+17);
		}else{
			$("#head_customerFollows").css({"width":"100%"});
			$("#tab_customerFollows").css({"width":"100%"});
		}
	},'json');
}

function initBeSpeakData(){
	$.post(getPath()+"/mobilefastsale/intention/getBeSpeakData",{intentionCustomerId:$("#id").val()},function(data){
		 
		$("#beSpeakDiv").html('');
		for(var i = 0;i<data.length;i++){
			 
			var beSpeakHtml = '';
			var obj = data[i];
			var infilePersonName="";
			if(obj.item.isEnableDiamond=="Y")
				infilePersonName =obj.withinCustomer.name;
			if(obj.bookingCarStatus.value !='SHOWUP' && obj.bookingCarStatus.value !='DEAL'){
				beSpeakHtml+='<div class="chakanbox infoline font14" >'+	
		          '<span class="bold" style="line-height:22px;">预约'+(obj.bookingCarTime||'')+' &nbsp;'+infilePersonName+'&nbsp;带看&nbsp;'+obj.item.registerName+'</span>'+
		          '<a class="lightblue-btn fr" href="#arriveOpDiv" style="display:none;"  data-rel="popup"  data-position-to="window" onclick="setCustomerBeSpeakId(\''+obj.id+'\',\''+(obj.bookingCarTime||'')+'\')">到场确认</a>';
				beSpeakHtml+='<a href="javascript:void(0);" key="'+obj.id+'" onclick="openBeSpeak(this)" style="float:right;line-height: 22px;" class="delete">修改</a>';
				 if(obj.bookingCarAddress){
					 beSpeakHtml+= '<p>接车地址：<em class="color999">'+obj.bookingCarAddress+'</em></p>';
				 }
				 beSpeakHtml+= '</div>';
			}else if(obj.bookingCarStatus.value =='SHOWUP'){
				var bin= "";
				if(obj.buyIntention)
				bin= obj.buyIntention.name;
			
				beSpeakHtml+='<div class="chakanbox infoline bold font14">'+	
		          '<p class="mb5">'+	
		             '<span>预约 '+(obj.bookingCarTime||'')+'  &nbsp;'+infilePersonName+'&nbsp;带看&nbsp;'+obj.item.registerName+'</span>'+	
		             '<span class="colorgreen fr">已到场</span>'+	
		          '</p>'+	
		          '<p class="mb5">'+(obj.arriveTime||'')+'确认到场  '+bin+'</p>';
		          if(obj.sendCarDesc){
						 beSpeakHtml+= '<p>备注：<em class="color999">'+obj.sendCarDesc+'</em></p>';
					  }
					  beSpeakHtml+= '</div>';	
			}else if(obj.bookingCarStatus.value =='DEAL'){
				beSpeakHtml+='<div class="chakanbox infoline bold font14" key="'+obj.id+'" onclick="openBeSpeak(this)">'+	
		          '<p class="mb5">'+	
		             '<span>预约 '+(obj.bookingCarTime||'')+'  &nbsp;'+infilePersonName+'&nbsp;带看&nbsp;'+obj.item.registerName+'</span>'+	
		             '<span class="colorred fr">未到场</span>'+	
		          '</p>'+	
		          '<p class="mb5">'+(obj.arriveTime||'')+'确认未到场  '+(obj.buyIntention?obj.buyIntention.name:'')+'</p>';
				  if(obj.sendCarDesc){
					 beSpeakHtml+= '<p>备注：<em class="color999">'+obj.sendCarDesc+'</em></p>';
				  }
				  beSpeakHtml+= '</div>';	
			}
			$(beSpeakHtml).appendTo("#beSpeakDiv");
		}
		if(data.length==0){
			$('<div class="no-information" align="center"><p><b>没有相关预约记录</b></p></div>').appendTo("#beSpeakDiv");
		}
	},'json');
}

function loading(type){
	if(type == 'show'){
		var img="<img id='loading_img' src='"+base+"/default/style/images/loading.gif'/>";
		$("#moreDiv").append(img);
	}else{
		$("#loading_img").remove();
	}
}
function initSelect(name){
	var  val = $("input[name='"+name+"']").val();
	tdClick($("td[key='"+val+"']"));
}
function tdClick(obj){
var val =  $(obj).attr("key");
var name = $(obj).attr("name");
	$(obj).addClass("now").siblings("td[name='"+name+"']").removeClass("now");
	$("td[name='"+name+"']").find("span").removeClass("icon-svg25 Greenico").addClass("Ashico");
	$(obj).find("span").addClass("icon-svg25 Greenico");
	$("input[name='"+name.substring(1)+"']").val(val);
}
var taget ="";
function openBeSpeak(obj){
	var id =$(obj).attr("key");
	$.post(base+"/mobilefastsale/intention/getCustomerBeSpeak",{id:id},function(res){
		if(res.STATE == "SUCCESS"){
			$("#beSpeakForm")[0].reset();
			var data = res.OBJ;
			$("#beSpeakOpDiv").popup("open");
			$("#cb_dataId").val(data.id);
			$("#itemId option[value="+data.item.id+"]").attr("selected", true);
			var key=$("#itemId option[value="+data.item.id+"]").attr("key");
			if(key=='Y'){
				$("#ncgw_Div").show();
				getProjectMan(data.item.id);
				taget=data.withinCustomer.id;
			}else{
				$("#ncgw_Div").hide();
				taget="";
				$("#ncgw").html("");
			}
			$("#bookingCarTime").val(data.bookingCarTime);
			$("#bookingCarAddress").val(data.bookingCarAddress);
			$("input[name='bookingCarType']").val(data.bookingCarType);
			initSelect('bookingCarType');
		}else{
			//错误信息
			msgDialog(res.MSG);
		}
    },'json');
}

function msgDialog(txt){
	$.mobile.loading( "hide" );
	$("#msgStr").text(txt);
	//$.mobile.changePage( "#systemMsg", { role: "dialog" } );
	$("#systemMsg").popup("open");
}
function resetForm(){
	$("#beSpeakForm")[0].reset();
	var key=$("#itemId option[value="+$("#itemId").val()+"]").attr("key");
	if(key=='Y'){
		$("#ncgw_Div").show();
		getProjectMan($("#itemId").val());
		taget="";
	}else{
		$("#ncgw_Div").hide();
		taget="";
		$("#ncgw").html("");
	}
}
function saveBeSpeak(){ 
	
	$.post($('#beSpeakForm').attr('action'),$('#beSpeakForm').serialize(),function(res){
		if(res.STATE == "SUCCESS"){
			$("#beSpeakOpDiv" ).popup( "close" );
			initBeSpeakData();
			$("#beSpeakForm")[0].reset();
		}else{
			//错误信息
			msgDialog(res.MSG);
		}
    },'json');
}

function setCustomerBeSpeakId(id,bookingCarTime){
	$("#customerBeSpeakId").val(id);
	$("#arriveTime").val(bookingCarTime);
}

function saveArrive(){ 
	
	$.post($('#arriveForm').attr('action'),$('#arriveForm').serialize(),function(res){
		if(res.STATE == "SUCCESS"){
			$("#arriveOpDiv" ).popup( "close" );
			initBeSpeakData();
			$("#arriveForm")[0].reset();
			$("#ncgw_Div").hide();
		}else{
			//错误信息
			msgDialog(res.MSG);
		}
    },'json');
}
function changeFunc(obj){
	taget="";
	var key=$("#itemId option[value="+$(obj).val()+"]").attr("key");
	if(key=='Y'){
		getProjectMan($(obj).val());
		$("#ncgw_Div").show();
	}else{
		$("#ncgw_Div").hide();
		$("#ncgw").html("");
	}
}

function getProjectMan(id){
	$.post(base+"/mobilefastsale/intention/getProjectMan",{projectId:id},function(res){ 
		if(res.STATE == "SUCCESS"){
			var projectList =  res.PLIST;
			var option ='';
			
			//option +='<option value=" " >请选择</option>';
			for(var i=0;i<projectList.length;i++){
				var obj = projectList[i];
				var selected="";
					option +='<option   value="'+obj.person.id+'" >'+obj.person.name+'</option>';
			}
			$("#ncgw").html(option);
		$("#ncgw option[value="+taget+"]").prop("selected", true);
		$('#ncgw').selectmenu('refresh'); 
			
		}
	},'json');
}
//人员选择器 Stat
function chooseperson(obj){
	pagesearch(1,1);
	$.mobile.changePage( "#common_person_page", { role: "page" } );
}
// 人员选择器参数 ：快销业务成员
function setChoosePersonParam(para){
	para.jobNumber = jobNumber;
}
function chooseone(obj){
	$.mobile.changePage( "#listPage", { role: "page" } );
	$("#ncgw").val($(obj).attr('pname'))
	$("#ncgw_id").val($(obj).attr('pid'))
	$("#beSpeakOpDiv").popup("open");
}
//人员选择器 End

//标签

$(function(){
	markObj.loadMark();
	
	$("li[name=label]").live('taphold',function(){
		commonCfmShow('删除标签');
		var keyId = $(this).attr('keyId');
		$("#OKBtn").live('click',function(){
			markObj.delMark(keyId);
		})
	})
})

//标签
var markObj={
//		loadHotMark:function(){
//			$.post(getPath()+"/fastsale/intt/getHotMark",{pageSize:20},function(data){
//				var _mhtml = "" ;
//				if(data!=null && data.length > 0){
//					for(var i = 0 ; i < data.length ; i ++){
//						_mhtml += '<a class="jr-twoa" href="javascript:void(0)" key="'+data[i].ID+'" title="点击贴上" onclick=InttView.saveMark("'+data[i].ID+'")>'+data[i].NAME+'</a>' ;
//					}
//				}else{
//					_mhtml += "暂无数据" ;
//				}
//				$("#hotmark_detail").html("");
//				$("#hotmark_detail").html(_mhtml);
//			},'json');
//		},
		//贴上标签
		saveMark:function(markId){
			var customerId = $("#customerId").val();
			if(customerId == null || customerId == ""){
				return false;
			}
			if(markId == null || markId == ''){
				var _tmark = $("#tMark").val();
				if(_tmark == null || _tmark.trim() == ""){
					msgPop('请输入标签名');
					return false ;
				}else if(_tmark.length < 2 || _tmark.length > 5 ){
					msgPop('请输入两到五个字符');
					return false ;
				}
				//防重复
				var arr = $("li[name=label]");
				for(var i in arr){
					var name = arr[i].textContent;
					if(_tmark == name){
						msgPop("该标签已存在");
						return false;
					}
				}
				//防重复
			}
			$.post(getPath()+"/fastsale/intt/saveMark",{
				customerId:customerId,
				markId:markId,
				markName:$("#tMark").val().trim()
			},function(data){
				if(data[0].FLAG == 'SUCC'){
					markObj.loadMark();
					$("#tMark").val('');
				}else{
					msgPop(data[0].MSG);
				}
			},'json');
		},
		//删除标签
		delMark:function(markId){
			if(markId == null || markId == ''){
				return false ;
			}
			var customerId = $("#customerId").val();
			if(customerId == null || customerId == ""){
				return false;
			}
			$.post(getPath()+"/fastsale/intt/delMark",{
				customerId:customerId,
				markId:markId
			},function(data){
				if(data[0].FLAG == 'SUCC'){
					markObj.loadMark();
				}else{
					msgPop(data[0].MSG);
				}
			},'json');
		},
		//加载标签
		loadMark:function(){
			var customerId = $("#customerId").val();
			$.post(getPath()+"/fastsale/intt/getMark",{customerId:customerId},function(data){
				var _mhtml = "" ;
				if(data!=null && data.length > 0){
					for(var i = 0 ; i < data.length ; i ++){
						_mhtml += '<li keyId="'+data[i].ID+'" name="label">'+data[i].NAME+'</li>' ;
					}
				}
				$("#labels").html(_mhtml);
			},'json');
		}
}

/**
 * 弹出 提示信息
 * @param txt
 */
function msgPop(txt){
	$.mobile.loading( "hide" );
	$("#msgPopupStr").text(txt);
	$("#popupSystemMsg").popup("open");
	setTimeout('$("#popupSystemMsg").popup("close")', 1000 );
}
