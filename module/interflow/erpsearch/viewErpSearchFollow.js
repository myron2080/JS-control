$(document).ready(function(){
	
	initTableData();
	
	
	
});
var currPage = 1 ;
var currPageSize = 60 ;
var tempYear = "";
function initTableData(){
	var queryParam = {
			customerphone:$("#customerphone").val()
			
	};
	if(queryParam!= undefined){
		queryParam.page = currPage ;
		queryParam.pageSize = currPageSize ;
		//$.extend(queryParam,{page:currPage,pageSize:currPageSize});
		//alert(JSON.stringify(queryParam));
		Loading.init({winType:'div',divObj:$("#itemDiv")[0],tip:'正在搜索线索，请稍后片刻...'});
		$.post(getPath() + "/interflow/erpsearch/erpSearchFollowData", queryParam,function(res) {
			if(res){
				var div="";
				var data=res.items;
				var recordCount = res.recordCount ;
				
				//这里生成表格数据
				if(data!=null && data!=''){
					div+='<div class="newct-conent" key="fllowRecord">';
					for(var i = 0;i < data.length; i++){
							var customerFollow=data[i];
							var year = customerFollow.followDate.substring(0,4);
							if(year != tempYear){
								tempYear = customerFollow.followDate.substring(0,4);
								div+='<div class="newct-year"><span>' + tempYear + '年</span></div>';
								div+='<div class="newct-c">';
							}else{
								if(currPage == 1 && i == 0){
									tempYear = year;
									div+='<div class="newct-year"><span>' + tempYear + '年</span></div>';
									div+='<div class="newct-c">';
								}
							}
							
							div+='<div class="newctlist">';
							div+='<div class="newctlist-name">' + customerFollow.followDate.substring(5,7) + '月' + customerFollow.followDate.substring(8,10) + '日</div>';
							div+='<div class="newctlist-r">';
							div+='<span class="fl">';
							div+='<b style="font-size:14px; font-weight:bold; color:#0077b3;">'+ customerFollow.customerName + '</b>';
							div+='<b style="font-weight:bold;">(' + customerFollow.orgName + ')' + customerFollow.followType + '</b>';
							div+='</span>';
							div+='<span class="fr" style="color:#999;">' + customerFollow.followDate.substring(11,16) + '</span>';
							div+='</p>';
							div+='<p>' + customerFollow.followDesc + '</p>';
							div+='<b class="newctlist-yuan"></b>';
							div+='</div></div>';
							if(i == 0){
								div+='</div>';
							}else{
								if(year != tempYear){
									div+='</div>';
								}
							}
					}
					div+="</div>";
				}else{
					div+="<div class='customer-tabbox-t01' key='fllowRecord'>";
					div+="无跟进记录.";
					div+="</div>";
				}
				$("#itemDiv").html("");
				$("#itemDiv").append(div);
				
				//是否显示更多链接
				if(recordCount!=null && recordCount > 20){
					var moreCount = recordCount - ( currPage * currPageSize ) > 0 ? recordCount - ( currPage * currPageSize) : 0 ;
					if(moreCount > 0){
						$("#moreLength").text(recordCount - ( currPage * currPageSize ));
						$("#viewMore").show();
					}
				}
				if(Loading.isExistLoad()){
					Loading.close();//关闭加载
				}
			}
		},'json');
	}
	
}

/**
 * 发短信
 */


function sendMessge(id){
	detailMessage=$.ligerDialog.open({height:460,
		width:660,
		url: getPath()+"/cmct/note/topicMessage?customerId="+id,
		title:"发送短信",
		isResize:true,
		isDrag:true});
}

function closeDetailMessage() {
	detailMessage.close();
}