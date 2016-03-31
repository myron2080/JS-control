var timeoutShow;
var remoTimeout;
var personPop={
	init:function(){
		$('[person-pop]').unbind('mouseover').mouseover(function(){
			var $t=$(this);
			clearTimeout(remoTimeout);
			clearTimeout(timeoutShow);
			//$('#person_pop_div').html('');
			if(!$('#person_pop_div').attr('id')){
				var number=$(this).attr('person-pop');
				var div=$('<div class="pop-up" id=person_pop_div ></div>');
				div.css({'top':'0','left':'0','position':'absolute','display':'none'});
				$('body').append(div);
			}else{
				//$('#person_pop_div').hide();
			}
			timeoutShow=setTimeout(function (){
				personPop.showInfo($t);
			},600);
		});
		$('[person-pop]').unbind('mouseout').mouseout(function(){
			personPop.remoPop();
			$('#person_pop_div').unbind('mouseover').mouseover(function(){
				clearTimeout(remoTimeout);
			});
		});
		$('[person-pop]').unbind('click').click(function(){
			var number=$(this).attr('person-pop');
			var name=$(this).attr('pop-name');
			personPop.personalPage(name, '', number);
		});
	},
	remoPop:function(){
		clearTimeout(timeoutShow);
		remoTimeout=setTimeout(function(){
			$('[id="person_pop_div"]').remove();
		},600);
	},
	showInfo:function($t){
		var $person_pop_div=$('#person_pop_div');
		var div_height=$('#person_pop_div').height();
		var div_width=$('#person_pop_div').width();
		var win_h=document.documentElement.clientHeight;
		var win_w=document.documentElement.clientWidth;
		var $t_width=$t.width();
		var $t_height=$t.height();
		var left = $t.offset().left-5;
		var top = $t.offset().top-div_height-12;
		var allowCss='arrow';
		var alTop=12;
		var alLeft=20;
		var differ=(win_w-left)-div_width;
		if(differ<0){
			left+=differ-5;
			allowCss='arrow';
			alLeft-=differ-10;
		}
		if(top<0){
			top+=(div_height+$t_height+21);
			allowCss='arrow_up';
			alTop=-123;
		}
		$('#person_pop_div').css({'left':left,'top':top});
		$('#person_pop_div').html('');
		$('#person_pop_div').unbind('mouseleave').mouseleave(function(){
			personPop.remoPop();
		});
		var _this=this;
		$('#person_pop_div').show();
		$.post(base+"/blog/at/personPop",
			{number:$t.attr('person-pop')},
			function(data){
				$('#person_pop_div').html(data);
				$person_pop_div.find('.arrow').removeClass('arrow').addClass(allowCss).css({'top':alTop,'left':alLeft});
				_this.initClass();
				_this.atten();
				_this.cancelAtten();
				_this.blogList();
			}
		);
	},
	atten:function(){
		var _this=this;
		$('#person_pop_div .noAtten').unbind('click').click(function(){
			var personId=$('#person_pop_div #personId').val();
			var orgId=$('#person_pop_div #orgId').val();
			var $this=$(this);
			$.post(base+"/blog/fans/saveFans",{'creatorBy.id':personId,'orgBy.id':orgId},function(data){
				$this.attr('status',data.status);
				art.dialog.tips('已关注');
				_this.initClass();
				$this.unbind('click');
				_this.cancelAtten();
			},'json');
		});
	},
	cancelAtten:function(){
		var _this=this;
		$('#person_pop_div #cancel').unbind('click').click(function(){
			var personId=$('#person_pop_div #personId').val();
			var $this=$(this);
			art.dialog.confirm("确定取消关注吗？",function(){
				$.post(base+'/blog/fans/deleteFans',{creatorById:personId},function(date){
					if(date.STATE=='SUCCESS'){
						art.dialog.tips('已取消关注',null,"succeed");
						$('#person_pop_div #atten_btn').attr('status','no');
						_this.initClass();
						$this.unbind('click');
						_this.atten();
					}else{
						art.dialog.tips('取消失败，请稍候再试');
					}
				},'json');
			});
		})
	},
	
	initClass:function(){
		var $atten_btn=$('#person_pop_div #atten_btn');
		var $cancel_btn=$('#person_pop_div #cancel');
		var status=$atten_btn.attr('status');
		if('no'==status){
			$atten_btn.attr('class','noAtten').html('关注 ');
			$cancel_btn.hide();
		}else if('yet'==status){
			$atten_btn.attr('class','attention').html('已关注 |');
			$cancel_btn.show();
		}else if('mutual'==status){
			$atten_btn.attr('class','mutual').html('相互关注 |');
			$cancel_btn.show();
		}else{
			$('#person_pop_div .botton a').hide();
			$('#person_pop_div .botton').css('border','none')
		}
	},
	blogList:function(){
		var _this=this;
		$('[id="person_zone"]').unbind('click').click(function(){
			var personId=$('#person_pop_div #personId').val();
			var personName=$('#person_pop_div #personName').val();
			_this.personalPage(personName, personId, '');
		});
	},
	personalPage:function(name,personId,number){
		try{
			var hasY = hasScroll(window.parent.document).Y ; 
			if(hasY){
//				$(window.parent.document).find('body').css({overflow:"hidden"});    //禁用滚动条
			} 
			/*parent.art.dialog.open(base+"/blog/microblog/list?method=listData&personId="+personId+'&number='+number, {
				title:name+"的个人主页",
				id : 'person_zone_'+name,
				width :830,
				height :(($(window).height()>600)?($(window).height()-50):560),
				lock: true,
				close:function(){
					if(hasY){
						$(window.parent.document).find('body').css({overflow:"scroll"});    //启用滚动条
					}
				}
			});*/
			//改版弹页签的模式
			window.top.addTabItem("person_zone_"+name, base+ "/blog/microblog/list?method=listData&personId="+personId+'&number='+number, name);
			//给iframe添加滚动改为默认
//			$(window.parent.frames['person_zone_'+name+'Iframe']).attr("scrolling","auto");
			$(window.parent.parent.frames['person_zone_'+name+'Iframe']).attr("scrolling","auto");
		}catch(e){
			var hasY = hasScroll(window.document).Y ; 
			if(hasY){
//				$(window.document).find('body').css({overflow:"hidden"});    //禁用滚动条
			}
			/*art.dialog.open(base+"/blog/microblog/list?method=listData&personId="+personId+'&number='+number, {
				title:name+"的个人主页",
				id : 'person_zone_'+name,
				width :830,
				height :450,
				lock: true,
				close:function(){
					var hasY = hasScroll(window.document).Y ; 
					if(hasY){
						$(window.document).find('body').css({overflow:"scroll"});    //禁用滚动条
					}
				}
			});*/
			window.top.addTabItem("person_zone_"+name, base+ "/blog/microblog/list?method=listData&personId="+personId+'&number='+number, name);
			$(window.parent.parent.frames['person_zone_'+name+'Iframe']).attr("scrolling","auto");
		}
	}
}

wright();

function wright(){
	(function(){
		document.write('<link href="'+base+'/default/style/css/blog/personPop.css" rel="stylesheet" type="text/css" />');
		document.write('<script type="text/javascript" src="'+base+'/default/js/module/blog/at.js"></script>');
		document.write('<script type="text/javascript" src="'+base+'/default/js/module/interflow/letter/letter.js"></script>');
	})();
}