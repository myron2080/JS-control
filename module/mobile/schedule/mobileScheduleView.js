$(document).ready(function(){
	 $("#followTxt").textareaAutoHeight();
	searchData('0');
	$("#backBtn").bind("click",function(){
		window.location.href = base+"/mobilefastsale/mobileCustomer/list";
	});
	$("#editCustomer").bind("click",function(){
		window.location.href = base+"/mobilefastsale/mobileCustomer/editCustomer?id="+$("#customerId").val();
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
		 $.mobile.changePage( "#dialogPage", { role: "dialog" } );
	 }else{
		 $.post(base+'/mobilefastsale/mobileCustomer/toPublic',{customerId:$("#customerId").val()},function(res){
			 if(res.STATE == 'SUCCESS'){
					msgDialog(res.MSG);
					setTimeout(function(){
						window.location.href = base+"/mobilefastsale/mobileCustomer/list";
					},2000);
				}else{
					msgDialog(res.MSG);
				}
		 },'json');
	 }
 }
   
/**
 * 添加跟进记录
 */
function addFollow(){
	var content=$("#followTxt").val();
	if(content == ''){
		msgDialog("请输入跟进内容!");
	}else{
		$.post(base+'/mobilefastsale/mobileCustomer/addFollow',{content:content,customerId:$("#customerId").val()},function(res){
			if(res.STATE == 'SUCCESS'){
//				msgDialog(res.MSG);
				$("#followTxt").val("");
				$("#followDiv").html("");
				searchData('0');
			}else{
				msgDialog(res.MSG);
			}
		},'json');
	}
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
		    	$("#moreBtn").show();
		    }
		if(null != res.items){
			var showList=res.items;
			var div="";
			for(var i=0;i<showList.length;i++){
				var obj=showList[i];
				div+="<p class='zd'>";
				div+="<span style='line-height:24px;'><b class='fl'><img src='"+imgBase+"/"+obj.person.photo+"'/>"+obj.name+"</b> <b class='fr'>"+obj.createTime+"</b></span>";
				div+="<span style='text-align:left; padding-top:5px;word-break:break-all;'>"+obj.content+"</span>";
				div+="</p>";
			}
			$("#followDiv").append(div);
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

function msgDialog(txt){
	$.mobile.loading( "hide" );
	$("#msgStr").text(txt);
	$.mobile.changePage( "#systemMsg", { role: "dialog" } );
}