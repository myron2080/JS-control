//匹配最后一个@字符串
var lastEndAtExp=/@[a-zA-Z\u4E00-\u9FA5]{1,20}$/g;
//匹配@人字符串
var atExp=/@[a-zA-Z\u4E00-\u9FA5]{1,10}[(][\w-]{1,20}[)]/g;

var selectCss={'background-color':'#005EAC','color':'#fff'};
var unSelectCss={'background-color':'#fff','color':'#000'};

var at={
	init:function(){
		var _this=this;
		$('[atBox]').unbind('keyup').keyup(function(e){
			_this.buildAt(this);
			handelValea($(this));
		});
		$('[atBox]').unbind('click').click(function(){
			_this.buildAt(this);
		});
		$('[atBox]').unbind('blur').blur(function(){
			setTimeout(function(){
				$('#showPerson').hide();
			},300);
		});
		
		$('[atBox]').unbind('focus').focus(function(){
			handelValea($(this));
		});
		$('[atBox]').unbind('keydown').keydown(function(e){
			handelValea($(this));
			return _this.keyBord(e);
		});
		
		//btnBackground=$('[atBox]').parents('.talkboxin').find('#coment_btn').css('background');
		//$span.html(limitNum);
		
	},
	buildAt:function(_this){
		var $em=$(_this);
		var start=this.getCurStat(_this);
		var text=$em.val();
		var startText=text.substring(0, start);
		if(this.emData.startText!=startText){
			this.emData.startText=startText;
			this.emData.w=$em.width();
			this.emData.h=$em.height();
			this.emData.$em=$em;
			this.emData.$p=$em.parent();
			this.emData.text=$em.val();
			this.emData.start=start;
			this.createPos();
			var lastEndAtText=startText.match(lastEndAtExp);
			if(lastEndAtText!=null){
				var lastAtprevText=this.emData.beforeAtText=startText.substring(0,start-lastEndAtText[0].length);
				this.emData.lastAtText=lastEndAtText[0];
				this.emData.afterAtText=text.substring(start,text.length);
				var posDivString=this.format(lastAtprevText)+'<span id=at_pos_sap >'+lastEndAtText+'</span>';
				this.emData.$p.find('#at_posdiv').html(posDivString);
				var sap_l=this.emData.$p.find('#at_pos_sap').offset().left;
				var sap_t=this.emData.$p.find('#at_pos_sap').offset().top;
				var pos_l=this.emData.$p.find('#at_posdiv').offset().left;
				var pos_t=this.emData.$p.find('#at_posdiv').offset().top;
				var sap_h=this.emData.$p.find('#at_pos_sap').height();
				this.emData.rel=sap_l-pos_l;
				this.emData.ret=sap_t-pos_t;
				this.emData.sap_h=sap_h;
				this.showPerson(text);
				this.keyParm.index=-1;
			}else if(startText == "@"){
				var posDivString='<span id=at_pos_sap >@</span>';
				this.emData.$p.find('#at_posdiv').html(posDivString);
				var sap_l=this.emData.$p.find('#at_pos_sap').offset().left;
				var sap_t=this.emData.$p.find('#at_pos_sap').offset().top;
				var pos_l=this.emData.$p.find('#at_posdiv').offset().left;
				var pos_t=this.emData.$p.find('#at_posdiv').offset().top;
				var sap_h=this.emData.$p.find('#at_pos_sap').height();
				this.emData.rel=sap_l-pos_l;
				this.emData.ret=sap_t-pos_t;
				this.emData.sap_h=sap_h;
				this.showPerson(text);
				this.keyParm.index=-1;
			}else{
				this.emData.$p.find('#at_posdiv').html('');
				$('[id="showPerson"]').remove();
			}
		}else{
			$('#showPerson').show();
		}
	},
	emData:{
		w:0,
		h:0,
		start:0,
		text:'',
		$em:null,
		$p:null,
		startText:'',
		rel:0,
		ret:0,
		sap_h:0,
		lastAtText:'',
		beforeAtText:'',
		afterAtText:''
	},
	showPerson:function(text){
		$('[id="showPerson"]').remove();
		var nameStr = "";
		if(text != "@"){
			nameStr = this.emData.lastAtText.replace(/@/, '');
		}
		var em_l=this.emData.$em.offset().left;
		var em_t=this.emData.$em.offset().top;
		var per_l=em_l+this.emData.rel;
		var per_t=em_t+this.emData.ret+this.emData.sap_h;
		var div=$('<div id=showPerson ></div>');
		div.css({
			'position':'absolute',
			'left':per_l,
			'top':per_t,
			'padding':2,
			'width':145,
			'border':'2px solid #ccc',
			'background-color': '#fff',
			'opacity':0.9,
			'filter':'alpha(opacity=90)',
			'-moz-opacity':0.9,
			'z-index': 1999999
		});
		//opacity:0.9;
		 // filter:alpha(opacity=90);-moz-opacity:0.9;background-color: #fff
		$('body').append(div);
		var _this=this;
		$.post(base+'/blog/at/personlist',{nameStr:nameStr,jobStatusNotIn:"jobStatusNotIn"},
			function(data){
				$('#showPerson').html(data);
				$("#showPerson #person_item").hover( function() {
					$("#showPerson #person_item").removeAttr('select').css(unSelectCss);
					$(this).css(selectCss);
					$(this).attr('select','');
					_this.keyParm.index=$(this).index()-1;
				}, function() {
					//$(this).css(unSelectCss);
				});
				$("#showPerson #person_item").unbind('click').click(function(){
					_this.selectItem(this);
				});
			}
		);
	},
	selectItem:function(obj){
		var number=$(obj).find('#number').val();
		var name=$(obj).find('#name').val();
		var textAt='@'+name+'('+number+')';
		if(number){
			this.emData.$em.val(this.emData.beforeAtText+textAt+this.emData.afterAtText);
			$(obj).parent().remove();
			this.emData.$em.focus();
		}
	},
	getCurStat:function(em){
		if (em&&(em.tagName=="TEXTAREA"||em.type.toLowerCase()=="text")) {
             if($.browser.msie){
				var range = document.selection.createRange();
            	 var range_all = document.body.createTextRange();
                 range_all.moveToElementText(em);
                 //两个range，一个是已经选择的text(range)，一个是整个textarea(range_all)
                 //range_all.compareEndPoints()比较两个端点，如果range_all比range更往左(further to the left)，则                //返回小于0的值，则range_all往右移一点，直到两个range的start相同。
                 // calculate selection start point by moving beginning of range_all to beginning of range
                 for (start=0; range_all.compareEndPoints("StartToStart", range) < 0; start++)
                     range_all.moveStart('character', 1);
                 // get number of line breaks from textarea start to selection start and add them to start
                 // 计算一下n
                 for (var i = 0; i <= start; i ++){
                     if (em.value.charAt(i) == 'n')
                         start++;
                 }
                 return  start;
             }else{
                 return em.selectionStart;
             }
         }
	},
	createPos:function(){
		var $posDiv;
		var $emParent=this.emData.$p;
		if($emParent.find('#at_posdiv').attr('id')){
			$posDiv=$('#at_posdiv');
		}else{
			$posDiv=$('<div id=at_posdiv ></div>');
			$emParent.append($posDiv);
		}
		var fontSize=parseInt((this.emData.$em.css('font-size')).match(/^[0-9]{1,2}/));
		if($.browser.msie){
			fontSize=fontSize+3;
		}
		$emParent.find('#at_posdiv').css({
			'width':this.emData.w,
			'height':this.emData.h,
			'position':'absolute',
			//'background-color':'red',
			'visibility':'hidden',
			'font-size':fontSize+'px',
			'word-wrap':'break-word',
			'text-align':'left'
		});
	},
	format: function(s) {//正则替换一些html代码
		var q= {
			"<": "&lt;",
			">": "&gt;",
			'"': "&quot;",
			"\\": "&#92;",
			"&": "&amp;",
			"'": "&#039;",
			"\r": "",
			"\n": "<br>",
			" ":"&nbsp;"
		};
		var o = /<|>|\'|\"|&|\\|\r\n|\n| /gi;
		return s.replace(o, function(r) {
			return q[r]
		});
	},
	fomatAtText:function($at_content){
		var _this=this;
		$.each($at_content,function(n,obj){
			var content=$(obj).html();
			$(obj).html(_this.fomatOneAtText(content));
		});
		
	},
	fomatOneAtText:function(content){
		var persons=content.match(atExp);
		if(persons!=null){
			$.each(persons,function(n,obj){
				var name=obj.match(/[^@(][a-zA-Z\u4E00-\u9FA5]{1,10}/);
				var number=obj.match(/[\(（][\s\S]*[\)）]/).toString();
				number = number.split("(")[1].split(")")[0];
				var a='<a person-pop='+number+' pop-name='+name+' style="color:#14A0CD;height:15px;cursor:pointer" >@'+name+'</a>';
				content=content.replace(obj,a);
			});
		}
		return content;
	},
	getAtPersons:function(content){
		var persons=content.match(atExp);
		var personStr='';
		if(persons!=null){
			$.each(persons,function(n,obj){
				var name=obj.match(/[^@(][a-zA-Z\u4E00-\u9FA5]{1,10}/);
				var number=obj.match(/[^()][\w-]{1,20}/);
				personStr+=',{name:"'+name+'",number:"'+number+'"}';
			});
			personStr='{list:['+personStr.substring(1,personStr.length)+']}';
		}
		return personStr;
	},
	keyParm:{
		index:-1
	},
	keyBord: function(e) {//键盘操作
		e=e||event;
		var _this=this;
		var key=e.keyCode;
		var len=$("#showPerson #person_item").length;
		switch(key) {
			case 40:
				//下
				_this.keyParm.index++;
				if(_this.keyParm.index>len-1) {
					_this.keyParm.index=0;
				}
				_this.move();
				//return false一定要加上，不然JS会继续进行调用keyHandler，从而绑定了keyup事件影响到键盘的keydown事件
				return false; 
				break;
			case 38:
				//上
				_this.keyParm.index--;
				if(_this.keyParm.index<0) {
					_this.keyParm.index=len-1;
				}
				_this.move();
				return false;
				break;
			case 13:
				//enter键
				if(_this.keyParm.index>=0){
					_this.selectItem($("#showPerson [select]"));
				}
				return false;
				break;
			default:

		};
	},
	move:function(){
		$("#showPerson #person_item").css(unSelectCss).removeAttr('select');
		$("#showPerson #person_item").eq(this.keyParm.index).css(selectCss).attr('select','');
	}
}

var limitNum=140;
var btnBackground;
/*function validateLen($em,$span){
	//var limitNum=parseInt($span.html());
	btnBackground=$em.parents('.blues').find('#coment_btn').css('background');
	$span.html(limitNum);
	$em.keyup(function(){
		handelValea($(this),$span,limitNum);
	});
	$em.focus(function(){
		handelValea($(this),$span,limitNum);
	});
	$em.keydown(function(){
		handelValea($(this),$span,limitNum);
	});
}*/

function handelValea($em){
	var $span=$em.parents('.msgBox').find('#wordNum');
	if($span.prev().html()){
		var content=$em.val();
		var chArr=content.match(/[\u4E00-\u9FA5]/g);
		var chByte=0;
		var $coment_btn=$em.parents('.msgBoxin').find('#commentBtn');
		if(chArr!=null){
			chByte=chArr.length;
		}
		var num=parseInt((content.length+chByte)/2);
		var showNum=Math.abs(num-limitNum);
		if(num>limitNum){
			//$coment_btn.attr('disabled','disabled').css({'background':'#ccc'});
			$coment_btn.removeClass("orangebtn").addClass('graybtn');
			$coment_btn.attr("flag","false");
			$span.prev().html($span.prev().html().replace('您还可以输入','已经超过'));
			$span.html('<span style="color:red">'+showNum+'</span>');
		}else{
			//$coment_btn.removeAttr('disabled').css({'background':btnBackground});
			$coment_btn.removeClass("graybtn").addClass('orangebtn');
			$coment_btn.attr("flag","true");
			$span.prev().html($span.prev().html().replace('已经超过','您还可以输入'));
			$span.html(showNum);
		}
	}
}

