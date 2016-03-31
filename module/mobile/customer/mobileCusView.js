$(document).ready(function(){
	// $("#followTxt").textareaAutoHeight();
	var url = window.location.href;
	 if(url.indexOf("showDetail")>0){
		 $.mobile.changePage( "#listPage", { role: "page" } );
	 }
	searchData('0');
	$("#backBtn").bind("click",function(){
		window.location.href = base+"/mobilefastsale/mobileCustomer/list";
	});

});

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
    * 转公客
    */
 function toPublic(flag){
	 if(flag=='toDialog'){//弹出确认信息
		 //$.mobile.changePage( "#dialogPage", { role: "dialog" } );
		 commonCfmShow("确定要转公客么?",'toPublic("go")');
	 }else{
		 $.post(base+'/mobilefastsale/mobileCustomer/toPublic',{customerId:$("#customerId").val()},function(res){
			 if(res.STATE == 'SUCCESS'){
					//msgDialog(res.MSG);
					commonTipShow(res.MSG,1000);
					setTimeout(function(){
						window.location.href = base+"/mobilefastsale/mobileCustomer/list";
					},2000);
				}else{
					commonTipShow(res.MSG,1000);
					//msgDialog(res.MSG);
				}
		 },'json');
	 }
 }
   
/**
 * 添加跟进记录
 */
function addFollow(){
	showload("请稍等");
	var content=$("#followTxt").val();
	if(content == ''){
		commonTipShow("请输入跟进内容!",1000);
		hideload();
		//msgDialog("请输入跟进内容!");
	}else{
		$.post(base+'/mobilefastsale/mobileCustomer/addFollow',{content:content,customerId:$("#customerId").val()},function(res){
			hideload();
			if(res.STATE == 'SUCCESS'){
//				msgDialog(res.MSG);
				$("#followTxt").val("");
				$("#comment").html("");
				$("#followTxt").css('height','34px');
				searchData('0');
			}else{
				//msgDialog(res.MSG);
				commonTipShow(res.MSG,1000);
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
	loading('show');
	var thePage;
	var currentPage=$("#currentPage").val();
	var totalPage=$("#totalPage").val();
	if(str == '0'){//初始化
		thePage=1;
	}else{//点更多
		thePage=parseInt(currentPage,10)+1;
	}
	$("#currentPage").val(thePage);
	$.post(base+'/mobilefastsale/mobileCustomer/followData',{currentPage:thePage,customer:$("#customerId").val()},function(res){
		$("#totalPage").val(res.pageCount);
		 if($("#currentPage").val() == $("#totalPage").val()){//当前为最后一页 隐藏更多按钮
		    	$("#moreBtn").hide();
		    }else{
		    	//$("#moreBtn").show();
		    	initScrollView();
		    }
		if(null != res.items && res.items.length!=0 ){
			var showList=res.items;
			var div="";
			for(var i=0;i<showList.length;i++){
				var obj=showList[i];
	            div+="<li>";
	            div+="<div class='ad-avatar'><img  src='"+imgBase+"/"+obj.person.photo+"'/></div>";
	            div+="<div class='ad-msg'>";
	            div+="<div class='ad-reply'>";
	            div+="<div class='zd'><div class='zdin'>";
	            div+="<div class='zd-list'><b class='fl colorblue'>"+obj.name+"("+obj.org.name+")</b>  <b class='fr colorgray'>"+obj.createTime+"</b></div>";
	            div+="<div class='zd-list' >"+obj.content+"</div></div></div></div></div></li>";
			}
			$("#comment").append(div);
			loading('close');
		}else{
			$("#comment").html("");
			 div="<div class='no-information mt5' align='center'><p><b>暂无跟进！</b></p></div>";
			 $("#comment").append(div);
				loading('close');
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

/*function msgDialog(txt){
	$.mobile.loading( "hide" );
	$("#msgStr").text(txt);
	$.mobile.changePage( "#systemMsg", { role: "dialog" } );
}*/