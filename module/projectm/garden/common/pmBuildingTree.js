function loadBuidTree(iframeUrl){
	$.post(base+"/projectm/pmGarden/buildingTree",{gardenId:gardenId,cityId:cityId},function(data){
		$('#buildUl').html('');
		$('#buildUl').append(data);
		$('[buildId]').click(function(){
			var bid=$(this).attr('buildId');
			var gid=$(this).attr('gardenId');
			$("#addclass").remove();
			$(this).append("<b class='red-arrow' id='addclass'></b>")
			var paramStr = $("#buidingParamStr").val();
			if(paramStr){
				var searchType = $($("body",parent.document),parent.document).find("input[checked]");
				paramStr = paramStr.replace(/!/g, "&");
				if(searchType && searchType.val() == "all"){
					paramStr = "";
				}
			}
			displayLoading();
			$("#roomLists").attr("src",getPath()+iframeUrl+"?buildingId="+bid+"&gardenId="+gid + "&" + paramStr+"&cityId="+cityId);
			$(this).parents('ul').find('.current').removeClass('current');
			$(this).addClass('current');
			
			$($("body",parent.document),parent.document).find("input[name='searchType']").click(function(){
				var type = this.value;
				if(type == "all"){
					$("#roomLists").attr("src",getPath()+iframeUrl+"?buildingId="+bid+"&gardenId="+gid+"&cityId="+cityId);
				}else{
					$("#roomLists").attr("src",getPath()+iframeUrl+"?buildingId="+bid+"&gardenId="+gid + "&" + paramStr+"&cityId="+cityId);
				}
				calcCount();
			});
			calcCount();
		});
		
		
		$('[buildId]').each(function(i, ele){
			if(i == 0 ){
				var bid=$(this).attr('buildId');
				var gid=$(this).attr('gardenId');
				var paramStr = $("#buidingParamStr").val();
				if(paramStr){
					var searchType = $($("body",parent.document),parent.document).find("input[checked]");
					paramStr = paramStr.replace(/!/g, "&");
					if(searchType && searchType.val() == "all"){
						paramStr = "";
					}
					$($("body",parent.document),parent.document).find("span[key='rdoSpan']").show();
				}
				$("#roomLists").attr("src",getPath()+iframeUrl+"?buildingId="+bid+"&gardenId="+gid + "&" + paramStr+"&cityId="+cityId);
				$(this).parents('ul').find('.current').removeClass('current');
				$(this).addClass('current');
				calcCount();
				
				$($("body",parent.document),parent.document).find("input[name='searchType']").click(function(){
					var type = this.value;
					if(type == "all"){
						$("#roomLists").attr("src",getPath()+iframeUrl+"?buildingId="+bid+"&gardenId="+gid+"&cityId="+cityId);
					}else{
						$("#roomLists").attr("src",getPath()+iframeUrl+"?buildingId="+bid+"&gardenId="+gid + "&" + paramStr+"&cityId="+cityId);
					}
					calcCount();
				});
			}
		});
		
		$('[buildId]:first').click();
		
		
		
	});
}

function calcCount(){
	var inter = setInterval(function(){
		var temp = $(document.getElementById('roomLists').contentWindow.document.body);
		var saleCount = temp.find("td[flag='SALE']").length;
		var rentCount = temp.find("td[flag='RENT']").length;
		var soldCount = temp.find("td[flag='SOLD']").length;
		var dataCount = temp.find("td[flag='DATA']").length;
		var rentSale = temp.find("td[flag='RENT_SALE']").length;
		$($("body",parent.document),parent.document).find("span[id='saleSpan']").html("(" + saleCount + ")"); 
		$($("body",parent.document),parent.document).find("span[id='rentSpan']").html("(" + rentCount + ")"); 
		$($("body",parent.document),parent.document).find("span[id='soldSpan']").html("(" + soldCount + ")"); 
		$($("body",parent.document),parent.document).find("span[id='dataSpan']").html("(" + dataCount + ")"); 
		$("span[id='saleSpan']").html("(" + saleCount + ")"); 
		$("span[id='rentSpan']").html("(" + rentCount + ")"); 
		$("span[id='soldSpan']").html("(" + rentSale + ")"); 
		$("span[id='dataSpan']").html("(" + (dataCount+soldCount) + ")"); 
	},100);
	
	setTimeout(function(){
		window.clearInterval(inter)
	},10000);
}