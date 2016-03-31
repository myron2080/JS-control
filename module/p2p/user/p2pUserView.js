$(document).ready(function(){
	$(".system_tab li").click(function(){
		$(this).parent().find("li").removeClass('hover');
		$(this).addClass('hover');
		var cdiv = $(this).attr("cdiv");
		$("#contentdivul").find("div[id^='con_two']").hide();
		$("#"+cdiv).show();
		var seq = $(this).attr("seq");
		inituldata(seq);
	});
	
	$("#two1").click();
	
});

function inituldata(seq){
	if(seq==1){
		
	}else if(seq==2){
		$.post(getPath()+'/p2p/shiftinList/listAllData',{userId:$("#dataId").val()},function(data){
			var html = '<table class="common_table" style="width:100%"><tr><td>充值时间</td><td>充值金额</td><td>充值方式</td></tr>';
	 	
			$("#con_two_2").html('');
			$.each(data,function(i,item){
				html += '<tr>';
				html +='<td>'+item.shiftinDateStr+'</td>';
				html +='<td>'+item.money+'</td>';
				html +='<td>'+item.patterndesc+'</td>';
					+'</tr>'
			});
			html += '</table>';
			$("#con_two_2").html(html);
		},'json');
	}else if(seq==3){
		$.post(getPath()+'/p2p/withdrawList/listAllData',{userId:$("#dataId").val()},function(data){
			var html = '<table class="common_table" style="width:100%"><tr><td>提现时间</td><td>提现金额</td><td>提现方式</td></tr>';
		 	
			$("#con_two_3").html('');
			$.each(data,function(i,item){
				html += '<tr>';
				html +='<td>'+item.withdrawDate+'</td>';
				html +='<td>'+item.money+'</td>';
				html +='<td>'+item.patterndesc+'</td>';
					+'</tr>'
			});
			html += '</table>';
			$("#con_two_3").html(html);
		},'json');
	}else if(seq==4){
		$.post(getPath()+'/p2p/p2paccount/listAllData',{userId:$("#dataId").val()},function(data){
			var html = '<table class="common_table" style="width:100%"><tr><td>业务时间</td><td>业务金额</td><td>业务类型</td><td>状态</td></tr>';
		 	
			$("#con_two_4").html('');
			$.each(data,function(i,item){
				html += '<tr>';
				html +='<td>'+item.optionDate+'</td>';
				html +='<td>'+item.amount+'</td>';
				html +='<td>'+item.typedesc+'</td>';
				html +='<td>'+item.statusdesc+'</td>';
					+'</tr>'
			});
			html += '</table>';
			$("#con_two_4").html(html);
		},'json');
	}else if(seq==5){
		$.post(getPath()+'/p2p/investmentProject/listAllData',{userId:$("#dataId").val()},function(data){
			var html = '<table class="common_table" style="width:100%"><tr><td>借款时间</td><td>借款金额</td><td>还款方式</td><td>借款备注</td><td>操作</td></tr>';
		 	
			$("#con_two_5").html('');
			$.each(data,function(i,item){
				html += '<tr>';
				html +='<td>'+item.createDate+'</td>';
				html +='<td>'+item.amount+'</td>';
				html +='<td>'+item.paymentOptionsName+'</td>';
				html +='<td>'+item.title+'</td>';
				html +='<td>'+'<a href="javascript:void(0)" onclick="viewPlan(\''+item.id+'\')" >查看还款计划</a>'+'</td>';
					+'</tr>'
			});
			html += '</table>';
			$("#con_two_5").html(html);
		},'json');
	}else if(seq==6){
		$.post(getPath()+'/p2p/user/getRecommender',{id:$("#dataId").val()},function(data){
			var html = '<table class="common_table" style="width:100%"><tr><td>推荐人用户名</td><td>推荐人姓名</td></tr>';
		 	
			$("#con_two_6").html('');
			$.each(data,function(i,item){
				html += '<tr>';
				html +='<td>'+item.userName+'</td>';
				if(item.name!=''){
					html +='<td>'+item.name+'</td>';
				}else{
					html +='<td>暂未设置姓名</td>';
				}
			});
			html += '</table>';
			$("#con_two_6").html(html);
		},'json');
	}
}

function viewPlan(id){
	art.dialog.open(getPath() +"/p2p/repaymentDetail/list?pid="+id,
			{
				id : "projectplan",
				title : '还款计划',
				background : '#333',
				width : 830,
				height : 550,
				lock : true	 
				});
}