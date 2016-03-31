var dlg ;
$(document).ready(function(){
	/*$("#mainPic").mousedown(function(e){
        if(1 == e.which){
			iX = e.clientX - this.offsetLeft;
          iY = e.clientY - this.offsetTop;
			
          imgTop = $(".picbox").offset().top;
			imgLeft = $(".picbox").offset().left;
			$(".picin").css("left",iX-imgLeft);
			$(".picin").css("top",iY-imgTop);
        }
      });*/
	
//	$("#mainPic").jsRightMenu({
//	});
//	$("#mainPic").on("contextmenu", function(e) {
//        return false;
//    });
	$("#mainPic").click(function(event){
		var scroolLeft = $(document).scrollLeft();
		var scrollTop = $(document).scrollTop();
		var left = getX(event);
		var top = getY(event);
		$("#markData").show();
		$("#markData").css("left",left);
		$("#markData").css("top",top);
		$("#markData").css("position","absolute");
	});
	
	
	art.dialog.data("dlgData",closeData);
	art.dialog.data("closeSightDesc",closeSightDesc);
	
	$("a[key='markKey']").bind("contextmenu", function(event, a){
		return false;
	});
	
	$("a[key='markKey']").on("contextmenu", function(e) {
        return false;
    });
	$("a[key='markKey']").on("mousedown", function(event, a){
		if(event.which == 3 || a == 'right'){
			$("#markData").hide();
			var left = $(this).position().left+ 0 ;
			var top = $(this).position().top +45;
			$("#markEdit").show();
			$("#markEdit").css("left",left);
			$("#markEdit").css("top",top);
			$("#markEdit").css("position","absolute");
			$("#markId").val($(this).attr("id"));
        }
	});
	
	$("#mainPic").bind("mousedown", function(event, a){
		var objId = $(this).attr("id");
		if(event.which != 3 && a != 'right'){
			$("#markEdit").hide();
		}
		
		var key = $(this).attr("key");
		if(event.which != 3 && a != 'right' && 'markKey' !=key){
			$("#markData").hide();
		}
	});
	
	
	$("#jquery_jplayer_1").jPlayer({
	    ready: function () {
	      $(this).jPlayer("setMedia", {
	    	  mp3:recordUrl
	      });
	    },
	   swfPath: base + "/default/js/control/jplayer",
	   supplied: "mp3",
	   solution: "flash, html",
	   smoothPlayBar: true,
	   keyEnabled: true
	  }); 

	$("#speaker").click(function(){
		$(this).hide();
		$("#nospeaker").show();
		playerStop();
		
	});
	$("#nospeaker").click(function(){
		$(this).hide();
		$("#speaker").show();
		playerPlay();
		
	});
	
	setTimeout(function(){
		playerPlay();
	},2000);

});

function playerPlay(){
	$("#jquery_jplayer_1").jPlayer("play");
}

function playerStop(){
	$("#jquery_jplayer_1").jPlayer("stop");
}


var sightDesc;
var recordUrl;
function closeSightDesc(desc,url){
	sightDesc = desc;
	recordUrl = url
	$("#jquery_jplayer_1").jPlayer("setMedia", { 
		   mp3:base + "/images/" + recordUrl
	}).jPlayer("stop");
	$("#nospeaker").show();
	$("#speaker").hide();
	dlg.close();
}

function sightDescSet(){
	var sightId = $("#showPic").attr("key");
	dlg =art.dialog.open(base +"/ebhouse/onlinesale/sightDescSet?id=" + sightId,
		{
			id : "sightDescSet",
			title : "设置整体描述",
			background : '#333',
			width : 750,
			height : 250,
			lock : true,
			button : [ {
				className : 'aui_state_highlight',
				name : '保存',
				callback : function() {
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.save){
						dlg.iframe.contentWindow.save(dlg);
						setTimeout(function(){
							$("#sp_sightDesc").html(sightDesc);
//							$("#sightDesc").value(sightDesc);
							$("#sightRecordUrl").show();
							
							
						}, 1000);
					}
					return false;
				}
			} , {
				name : '取消',
				callback : function() {
				}   
			}],
			close:function(){			
			 }
		});	
}



var markId;
function closeData(id){
	markId = id;
	dlg.close();
}

function markData(obj){
	var sightId = $("#showPic").attr("key");
	var onlineSaleModelId = $("#onlineSaleModelId").val();
	var picWidth = $("#showPic").attr("width");
	var picHeight = $("#showPic").attr("height");
	var left = $("#markData").position().left - 15;
	var top = $("#markData").position().top-40;
	$("#markData").hide();
	dlg =art.dialog.open(base +"/ebhouse/onlinesale/markData?onlineSaleModelId=" + onlineSaleModelId + "&sightId=" + sightId + "&picWidth=" + picWidth + "&picHeight=" + picHeight + "&top=" + top  + "&left=" + left ,
		{
			id : "markData",
			title : "新增标点",
			background : '#333',
			width : 750,
			height : 515,
			lock : true,
			button : [ {
				className : 'aui_state_highlight',
				name : '保存',
				callback : function() {
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.save){
						dlg.iframe.contentWindow.save(dlg);
						setTimeout(function(){
							var tempMark = "";
							tempMark += '<a id="' + markId +'" key="markKey" class="feature-photol-link" href="javascript:void(0);" style="left: ' + left + 'px; top: ' + top + 'px;">';
							tempMark += '<div class="feature-photo-house">';
							tempMark += '<div class="mark-red"></div>';
							tempMark += '</div>';
							tempMark += '</a>';
//							$("#markList").append('<a class="mark-red" key="markKey" id="' + markId +'" style="left: ' + left + 'px; top: ' + top + 'px;position: absolute" href="javascript:void(0)"></a>');
							$("#markList").append(tempMark);
							$("a[key='markKey']").on("mousedown", function(event, a){
								if(event.which == 3 || a == 'right'){
//									$(this).jsRightMenu({
//								    	menuList: [{ menuName: "编辑", clickEvent: "editData(this)"},{ menuName: "删除", clickEvent: "deleteData(this)"}]
//									});
									var left = $(this).position().left+ 20 ;
									var top = $(this).position().top +30;
									$("#markEdit").show();
									$("#markEdit").css("left",left);
									$("#markEdit").css("top",top);
									$("#markEdit").css("position","absolute");
									$("#markId").val($(this).attr("id"));
						        }
							});
							
							$("a[key='markKey']").on("contextmenu", function(e) {
						        return false;
						    });
						},1000);
					}
					return false;
				}
			} , {
				name : '取消',
				callback : function() {
				}   
			}],
			close:function(){			
//				searchData();
			 }
		});	
}


function editMarkData(){
	var markId = $("#markId").val();
	var markObj = $("a[id='" + markId + "']");
	var sightId = $("#showPic").attr("key");
	var onlineSaleModelId = $("#onlineSaleModelId").val();
	$("#markEdit").hide();
	dlg =art.dialog.open(base +"/ebhouse/onlinesale/markData?id=" + markId + "&sightId=" + sightId + "&onlineSaleModelId=" + onlineSaleModelId ,
		{
			id : "markData",
			title : "编辑标点",
			background : '#333',
			width : 750,
			height : 515,
			lock : true,
			button : [ {
				className : 'aui_state_highlight',
				name : '保存',
				callback : function() {
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.save){
						dlg.iframe.contentWindow.save(dlg);
					}
					return false;
				}
			} , {
				name : '取消',
				callback : function() {
				}   
			}],
			close:function(){			
//				searchData();
			 }
		});	
}
function delMarkData(){
	var markId = $("#markId").val();
	$("#markEdit").hide();
	art.dialog.confirm('确定删除?',function(){
			$.post(getPath() + '/ebhouse/onlinesale/delMarkData',{id:markId},function(res){
				if(res.STATE=="SUCCESS"){
					art.dialog({icon: 'succeed', time: 1,content: "删除成功!"});
					$("a[id='" + markId + "']").remove();
				}else{
					art.dialog({icon: 'warning', time: 1,content: "删除失败!"});
				}
			},'json');
	});
}




function toSetGard(onlineSaleId,houseProjectId){
	var dlg =art.dialog.open(base +"/ebhouse/onlinesale/toSetGard?onlineSaleId="+onlineSaleId + "&houseProjectId=" + houseProjectId,
		{
			id : "setGard",
			title : "在线售楼处评分",
			background : '#333',
			width : 950,
			height : $list_editHeight,
			lock : true,
			button : [ {
				className : 'aui_state_highlight',
				name : '保存',
				callback : function() {
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.save){
						dlg.iframe.contentWindow.save(dlg);
					}
					return false;
				}
			} , {
				name : '取消',
				callback : function() {
				}   
			}],
			close:function(){			
//				searchData();
			 }
		});			
}


function getX(e) {
	  e = e || window.event;
	   
	return e.pageX || e.clientX + document.body.scroolLeft;
	}

function getY(e) {
  e = e|| window.event;
 return e.pageY || e.clientY + document.boyd.scrollTop;
}