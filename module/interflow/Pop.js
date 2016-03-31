
//头像浮动框
 	popPerson =function(){
	    $('[pop_person_id]').unbind('click').click(function(){	
		var $parent=$('body');
		var left=$(this).offset().left-5;
		var top=$(this).offset().top+$(this).height();
	    var personId=$(this).attr('pop_person_id');
	    $('div[id="person_new"]').remove();
	    var perdivStr="<div id='person_new' show='no' style='z-index:101'>" +
	    '<div class="personal_information_top"><img src="'+getPath()+'/default/style/images/personal_information01.png"/></div>'+
	    '<div class="personal_information_box"><img class="loadimg" src="'+getPath()+'/default/style/images/loading44.gif"/></div>'+
	    '<div class="personal_information_bottom"><img src="'+getPath()+'/default/style/images/personal_information03.png"/></div></div>';
	    $parent.append($(perdivStr));
	    var $persondiv=$parent.find('#person_new').find('.personal_information_box');
	    $parent.find('#person_new').css({'left':left,'top':top});
	    setTimeout(function(){
	    	closeOutBorder($parent.find('#person_new'));
	    },80);
	    $.ajax({
	    	type:"POST",
	    	data:{personId:personId},
	    	url:getPath()+"/interflow/addressBook/getPersonInfo",
	    	success:function(data){
	    		alert(data);
	    		var $pop=$(data).find('#pop_person_new');
	    		$persondiv.html($pop.html());
	    		//$persondiv.css('text-align','left');
	    		//PopNew.attention();
	    		//PopNew.cancelAtten();
	    	}
	    })
	   });
}
 	
 	function closeOutBorder($em){
 		var offset=$em.offset();
 		var em_left=offset.left;
 		var em_top=offset.top;
 		var em_width=$em.width();
 		var em_height=$em.height();
 		var em_bottom=em_top+em_height;
 		var em_right=em_left+em_width;
 		//$em.attr('show','no');
 		var show=$em.attr('show');
 		if(show!='yes') $em.attr('no');
 		$('html').unbind('click').click(function(e){
 			show=$em.attr('show');
 			//alert(em_left+'-'+em_right+'-'+em_top+'-'+em_bottom+'*'+e.pageX+'*'+e.pageY+'-'+show);
 			if(em_left>e.pageX||e.pageX>em_right||e.pageY<em_top||e.pageY>em_bottom){
 				if(show=='no') {
 					$em.attr('show','yes');
 					$em.hide();
 					//$('html').unbind('click');
 				}else{
 					$em.attr('show','no');
 					//alert(1+$em.attr('show'));
 				}
 			}else{
 				$em.attr('show','no');
 				//alert(2+$em.attr('show'));
 			}
 		})
 	}