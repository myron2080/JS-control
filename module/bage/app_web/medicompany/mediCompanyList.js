$(document).ready(function(){
	searchData('0');
	$(window).scroll(function(){
		　　var scrollTop = $(this).scrollTop();
		　　var scrollHeight = $(document).height();
		　　var windowHeight = $(this).height();
		　　if(scrollTop + windowHeight == scrollHeight){
				if($("#currentPage").val()!= $("#totalPage").val()&&$("#cityPickerDiv").is(":hidden"))
					searchData('1');
		　　}
	});
});


function searchData(str){
	showLoader();
	var thePage;
	var currentPage=$("#currentPage").val();
	var totalPage=$("#totalPage").val();
	if(str == '0'){//初始化
		thePage=1;
	}else{//点更多
		thePage=parseInt(currentPage,10)+1;
	}
	$("#currentPage").val(thePage);
	var para = {};
	para.currentPage = thePage;
	para.pageSize = 10;
	para.key = $('#key').val()==$('#key').attr("defaultValue")?"":$('#key').val();
	if($("#cityId").val())
	para.cityId = $("#cityId").val();
	$.post(base+'/app_web/medicompany/getPagData',para,function(res){
		$("#totalPage").val(res.pageCount);
		if(null != res.items&&res.items.length!=0){
			var showList=res.items;
			var html='';
			for(var i=0;i<showList.length;i++){
				var obj=showList[i];
				html+='<dl  onclick=viewDetail("'+obj.id+'")>';
				var imgSrc = base+'/default/style/images/app_web/noDataImge_S.jpg';
				if(obj.logoURL)
				imgSrc =  base+'/images/'+obj.logoURL.replace("_size","_125X63");
			    html+='<dt><img src="'+imgSrc+'" alt=""/></dt>';
			    html+='<dd>';
			    var name = '';
			    if(obj.fullName){
			    	name = obj.fullName;
			    }else{
			    	name = obj.name;
			    }
			    html+='<h3>'+name+'</h3>';
			    html+='<ul>';
			    var legalPerson='';
			    if(obj.legalPerson)
			    legalPerson	= obj.legalPerson+'　';
			   // 
			    var foundingDate = ''
			    if(obj.foundingDate)
			    foundingDate = obj.foundingDate.substring(0,4)+'年成立';
			    html+='<li>'+legalPerson+foundingDate+'</li>';
			    var personCount = obj.personCount;
			    if(personCount.indexOf("人")==-1)
			    	personCount+="人";
			    html+='<li>'+obj.bunkCount+'个铺位　'+personCount+'</li>';
			    html+='</ul>';
			    html+='</dd>';
			    html+='<a href="javascript:void(0);" class="Arrow"><img src="'+base+'/default/style/images/app_web/ico1.png" alt=""/></a>';
			    html+='</dl>';
				
			}
			if(str == '0'){//初始化
				$("#dataList").html("");
			}
			$("#dataList").append(html);
		}else{
			var html = '';
			html += '<div style="height:'+document.body.clientHeight+'px;text-align:center;vertical-align:middle;"><span ><img src="' + base + '/default/style/images/app_web/app_empty_m.png"/></span></div>';
			$("#dataList").html(html);
		}
		hideLoader();
	},'json');
}
function viewDetail(id){
	window.location.href=base+"/app_web/medicompany/mediCompanyView?id="+id+"&userId="+userId;
}
