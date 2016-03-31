$(document).ready(function(){
	$("#backBtn").bind("click",function(){
		  window.location.href = base+"/mobile/roomlisting/list?queryType="+queryType;
	});
	$("#toMap").bind("click",function(){
		viewMap();
	});
	$("#toEdit").bind("click",function(){
		editView();
	});
	//addPhotoButton("uploadImage","swipeImg");
	followData('0');
});
//显示加载器  
function showLoader() {  
    //显示加载器.for jQuery Mobile 1.2.0  
    $.mobile.loading('show', {  
        text: '加载中...', //加载器中显示的文字  
        textVisible: true, //是否显示文字  
        theme: 'b',        //加载器主题样式a-e  
        textonly: false,   //是否只显示文字  
        html: ""           //要显示的html内容，如图片等  
    });}

function initScrollView(){
	$(window).scroll(function(){
		　　var scrollTop = $(this).scrollTop();
		　　var scrollHeight = $(document).height();
		　　var windowHeight = $(this).height();
		　　if(scrollTop + windowHeight == scrollHeight){
				if($("#currentPage").val()!= $("#totalPage").val())
		　　　　followData('1');
		　　}
	});
}
function followData(str){
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
	var param={};
	param.pageSize=10;
	param.currentPage=thePage;
	param.roomListingId=roomlistingId;
	param.sortType = 'HOUSEFOLLOW';
	
	$.post(base+'/mobile/roomlisting/roomFollowList',param,function(res){
		$("#totalPage").val(res.pageCount);
		 if($("#currentPage").val() == $("#totalPage").val()){//当前为最后一页 隐藏更多按钮
		    	$("#moreDiv").hide();
		    }else{
		    	initScrollView();
		    	//$("#moreDiv").show();
		    }
		if(null != res.items && res.items.length!=0 ){
			var showList=res.items;
			var div='';
			for(var i=0;i<showList.length;i++){
				var obj=showList[i];
				if(haspermiss=='no'){
					description = description.replace(/手机号由.*更新为\d*/g,'手机号由***更新为***');
					description = description.replace(/座机由.*更新为\d{3,4}-?\d{7,9}/g,'座机由***更新为***');
				}
			
				
			var photo=base+"/default/style/images/mobile/man.jpg"
			if(obj.creator.photo)
			photo=imgBase+'/'+obj.creator.photo;
				div+='<li>';
				div+='<div class="ad-avatar">';
				div+='<img src="'+photo+'"></div>';
				div+='<div class="ad-msg">';
				div+='<div class="ad-reply">';
				div+=' <div class="zd"><div class="zdin"><div class="zd-list">';
				div+='<b class="fl colorblue">'+obj.creator.name+' </b>&nbsp;&nbsp;'+obj.org.name;
				div+='<b class="fr colorgray">'+obj.createTime+'</b></div>';
				div+='<div class="zd-list">'+obj.description;
	            div+='</div>';
	            div+='</div></div></div></div>';
	            div+=' </li>';
	            
			
			}
			$("#comment").append(div);
			//loading('close');
		}else{
			$("#comment").html("");
			 div="<div class='no-information mt5' align='center'><p><b>暂无跟进！</b></p></div>";
			 $("#comment").append(div);
				//loading('close');
		}
	},'json');
}
/**
 * 添加跟进记录
 */
function addFollow(){
	var remark=$("#followTxt").val();
	if(remark == ''){
		//msgDialog("请输入跟进内容!");
	//	$("#followTextStr").show();
	//	$("#followTxt").focus();
		commonTipShow("请输入跟进内容!");
	}else{
		$("#followTextStr").hide();
		$.post(base+'/mobile/roomlisting/addRoomFollow',{remark:remark,roomlistingId:roomlistingId},function(res){
			if(res.STATE == 'SUCCESS'){
				$("#followTxt").val("");
				$("#comment").html("");
				followData('0');
			}else{
				msgDialog(res.MSG);
			}
		},'json');		
	}
}
function editView(){
	window.location.href = base+"/mobile/roomlisting/roomEditView?roomListingId="+roomlistingId;
}

function viewMap(){
	window.location.href = base+"/mobile/roomlisting/toMap?roomListingId="+roomlistingId;
}

addPhotoButton=function(id,parentdiv){
	var url ='/broker/listingImage/compressUpload?direct=room/images&type=ROOMFIGURE&rlId='+$("#roomListingId").val()+'&roomId='+$("#roomId").val()+'&gardenId='+$("#gardenId").val();
	new AjaxUpload($("#"+id), {
    	action: getPath()+url,
        autoSubmit: true,
        name: "image",
        responseType: "json",
        onSubmit: function(file, extension){
        	if (extension && /^(jpg|png|jpeg|gif)$/.test(extension)) {
            }
            else {
                commonTipShow('只允许上传jpg|png|jpeg|gif图片','1000');
                return false;
            }
        	
        },
        onComplete: function(file, json){  
        	if(json.STATE=='FAIL'){
        		art.dialog.tips(json.MSG);
        		return;
        	}else{
        	var strHtml ="<div id='showImage_"+json.id+"'><b><a key='swipe' href='"+getPath()+'/images/'+json.PATH.replace('size', 'origin')+"' rel='external' >"
		             +"<img style='max-height:200px;' src='"+getPath()+'/images/'+json.PATH.replace('size', '400X300')+"'  /></a></b></div>";
       		$("#"+parentdiv).prepend(strHtml);
        		
       		var elem = document.getElementById('mySwipe');
        		//window.mySwipe = $('#mySwipe').Swipe().data('Swipe');
        		window.mySwipe = Swipe(elem, {
        		   startSlide: 0,
        		   auto: false,
        		   stopPropagation:true
        		  // continuous: true,
        		  // disableScroll: true,
        		  // stopPropagation: true,
        		  // callback: function(index, element) {},
        		  // transitionEnd: function(index, element) {}
        		}); 
        		$("a[key='swipe']").photoSwipe();
        }
        }
    });
}