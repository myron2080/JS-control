wrightDumc();
function wrightDumc(){
	document.write('<script type="text/javascript" src="'+base+'/default/js/common/Loading.js"></script>');
	document.write('<script type="text/javascript" src="'+base+'/default/js/control/jiaoben1393/js/jQueryRotate.2.2.js"></script>');
	document.write('<script type="text/javascript" src="'+base+'/default/js/common/Drag.js"></script>');
};

var EnlargerImg={
	init:function(o){
		var _this=this;
		var _degree_enlarger_img=0;
		var op={
			//图片列表取值类型,1.single单张图片，2.str以逗号隔开的URL形式，3.enlararr以class 以下的enlarger取值
			type:'single',
			//str以逗号隔开的URL形式
			imgUrlStr:''
		}
		$.extend(op,o);
		$('[enlarger]').css('cursor','pointer').click(function(){
			_this.imgparm.imgArr=[];
			_degree_enlarger_img=0;
			if(op.type=='str' && op.imgUrlStr!=''){
				_this.combArr(op.imgUrlStr.split(','));
			}else if(op.type=='enlararr'){
				$.each($(this).parents('.enlararr').find('[enlarger]'),function(n,o){
					_this.imgparm.imgArr[n]=$(o).attr('enlarger');
				});
			}
			
			var imgSrc=$(this).attr('enlarger');
		/*	var outDiv='<div id=enlOutDiv><div id=ipdic>'+
					'<li class="view-photos01" id=close ><a title=关闭 ></a></li>'+
					'<li class="view-photos02" id=big ><a title=放大 ></a></li>'+
					'<li class="view-photos03" id=small ><a title=缩小 ></a></li>'+
					'<li class="view-photos04" id=artwork ><a title=原图 ></a></li>'+
					'<li class="view-photos05" id=biggest ><a title=最大 ></a></li>'+				
					'</div><div id=inDiv><div id=imgDiv><img id=enlImg /></div></div></div>';*/
			var topWin=window.top;
			var width=topWin.document.documentElement.clientWidth;
			var height=topWin.document.documentElement.clientHeight;
			var topBOdy=$(topWin.document).find('body');
			
			
			var outDiv='<div id=enlOutDiv><div id=ipdic>'+
			'<li id="_leftRotate"><a  href="javascript:void(0);"><img src="'+base+'/default/style/images/common/imageView/ico5.png">左旋转</a></li>'+
			'<li id="_rightRotate"><a href="javascript:void(0);"><img src="'+base+'/default/style/images/common/imageView/ico4.png">右旋转</a></li>'+
			'<li id=big><a   href="javascript:void(0);"><img  src="'+base+'/default/style/images/common/imageView/ico1.png">放大</a></li>'+
			'<li id=small><a  href="javascript:void(0);"><img  src="'+base+'/default/style/images/common/imageView/ico2.png">缩小</a></li>'+
			'<li id=down_img><a href="javascript:void(0);"><img  src="'+base+'/default/style/images/common/imageView/ico3.png">下载</a></li>'+
			'<li id=close><a  href="javascript:void(0);"><img src="'+base+'/default/style/images/common/imageView/ico6.png">关闭</a></li>'+
			'</div><div id=inDiv><div id="imgDiv"><img id="enlImg" /></div></div></div>';
			
			if(topBOdy.find('#enlOutDiv').length>0){		
				return ;
			}else{
				topBOdy.append(outDiv);
			}
			var enlOutDiv=topBOdy.find('#enlOutDiv');
			enlOutDiv.css({'position':'absolute','width':width,'height':height,'top':0,'left':0,'overflow':'hidden','z-index':10000});
			enlOutDiv.css({'background-color':'#555','opacity':0.95,'filter':'alpha(opacity=95)','-moz-opacity':0.95});//,
			
			enlOutDiv.find('#inDiv').css({'margin':'auto','width':'1200'});
			// enlOutDiv.find('#inDiv').css({'width':'1200'});
			
			enlOutDiv.find('#imgDiv').css({'display':'table-cell','vertical-align':'middle','width':width,'text-align':'center','height':height,'overflow':'hidden'});
			
			//enlOutDiv.find('#ipdic').addClass("view-photos");
			enlOutDiv.find('#ipdic').addClass("imglist_enlarger");
			//enlOutDiv.find('#ipdic li').css({'cursor':'pointer','width':80,'height':95,'float':left});
			//enlOutDiv.find('#ipdic li a').css({'cursor':'pointer','width':80,'height':95,'float':left,'display':'inline-block'});
			//$.each(enlOutDiv.find('#ipdic img'),function(n,o){
			//	$(o).attr('src',imgPrePath+'/common/'+$(this).attr('id')+'.png');
			//});
			
			
			var img=enlOutDiv.find('#enlImg');
			_this.imgparm.imgEm=img;
			
			//enlOutDiv.find('#imgDiv').dragDrop();
			
			//img.attr('src',imgSrc).css({'min-width':50,'max-width':1200});
			//var imgArtworkWidth=img.width();
			/*var imga = new Image();
			imga.onload = function(){
				imgArtworkWidth=this.width
				imgArtworkHeight=this.height
			}
			imga.src = imgSrc;*/
			_this.loadImg(imgSrc);
			if(_this.imgparm.imgArr.length>1){
				img.mousemove(function(e){
					_this.mouseEver(this, e);
				});
				img.mouseover(function(e){
					_this.mouseEver(this, e);
				});
				
			}
			
			enlOutDiv.find('#big').click(function(e){
				var imgWidth=img.width();
				img.css('width',imgWidth*1.2);
				_this.stopProp(e);
				
			});
			enlOutDiv.find('#down_img').click(function(e){
				var src=$(img).attr("src");
				src=src.replace(getPath()+"/images","");
				var fm="<iframe id=\"download_Img_Form\" name=\"download_Img_Form\" style=\"display: none\" src='"+getPath()+"/framework/images/outputimage?url="+src+"'></iframe>";
				 $(topBOdy).append(fm);
				_this.stopProp(e);
			});
			
			enlOutDiv.find('#_rightRotate').click(function(e){
				
				_degree_enlarger_img+=90;
				$(img).rotate(_degree_enlarger_img);
				_degree_enlarger_img=_degree_enlarger_img>360?_degree_enlarger_img%360:_degree_enlarger_img;
				
				_this.stopProp(e);
			});
			enlOutDiv.find('#_leftRotate').click(function(e){
				//_this.imgRotate(e,-90);
				_degree_enlarger_img+=-90;
				$(img).rotate(_degree_enlarger_img);
				_degree_enlarger_img=_degree_enlarger_img>360?_degree_enlarger_img%360:_degree_enlarger_img;
				
				_this.stopProp(e);
			});
			enlOutDiv.find('#small').click(function(e){
				var imgWidth=img.width();
				img.css('width',imgWidth*0.8);
				_this.stopProp(e);
			});
			enlOutDiv.find('#close').click(function(e){
				enlOutDiv.remove();
				Loading.close();
				_this.stopProp(e);
			});
			enlOutDiv.find('#artwork').click(function(e){
				img.css('width',_this.imgparm.imgw);
				_this.stopProp(e);
			});
			enlOutDiv.find('#biggest').click(function(e){
				img.css('width',1200);
				_this.stopProp(e);
			});
			
			enlOutDiv.click(function(){
				enlOutDiv.remove();
				Loading.close();
			});
			
			img.click(function(e){
				_this.stopProp(e);			
			});
		});

	},
	imgRotate:function (obj,a){
		var path=$("#images1").attr("src");
		if(path){
			//_degree+=a;
			$("#enlImg").rotate(a);
		}
	},
	
	mouseEver:function(obj,e){
		var _this=this;
		var il=$(obj).offset().left;
		var imgw=$(obj).width();
		var mx=e.pageX;
		var jace=il+imgw/2-20;
		if(mx<=jace){
			$(obj).css({'cursor':'url("'+imgPrePath+'/common/left.png"),auto'});
			$(obj).unbind('click').click(function(e){
				var n;
				if(_this.imgparm.i==0){
					n=_this.imgparm.imgArr.length-1;
				}else{
					n=_this.imgparm.i-1;
				}
				_this.imgparm.i=n;
				_this.loadImg(_this.imgparm.imgArr[n]);
				_this.stopProp(e);
				
			});
		}
		if(mx>jace){
			var ulr=imgPrePath+'/common/right.png';
			$(obj).css({'cursor':"url('"+ulr+"'),auto"});
			$(obj).unbind('click').click(function(e){
				var n;
				if(_this.imgparm.i==_this.imgparm.imgArr.length-1){
					n=0;
				}else{
					n=_this.imgparm.i+1;
				}
				_this.imgparm.i=n;
				_this.loadImg(_this.imgparm.imgArr[n]);
				_this.stopProp(e);
			});
		}
	},
	//初始化图片
	loadImg:function(imgSrc){
		Loading.init({
			winType:'top',
			lock:false
		});
		var _this=this;
		//setTimeout(function(){
			var imga = new Image();
			imga.onload = function(){
				_this.imgparm.imgw=this.width;
				_this.imgparm.imgEm.attr('src',imgSrc).css({'min-width':50,'max-width':1200,'width':this.width});
				 Loading.close();
				//imgArtworkWidth=this.width
				//imgArtworkHeight=this.height
			}
			imga.src = imgSrc;
			//$('#enlOutDiv').find('#enlImg').css('width',_this.imgparm.imgw);
			//if(_this.imgparm.imgUrl==''){
				for(var n=0;n<_this.imgparm.imgArr.length;n++){
					if(imgSrc==_this.imgparm.imgArr[n]){
						_this.imgparm.i=n;
						//break;
					}
				}
			//}
			_this.imgparm.imgUrl=imgSrc;
			//_this.imgparm.imgEm.attr('src',imgSrc).css('width',_this.imgparm.imgw);
			//$('#enlOutDiv').find('#enlImg').attr('src',imgSrc).css('width',_this.imgparm.imgw);
		//},300);
	},
	combArr:function(imgArr){
		if(imgArr.length>0){
			$.each(imgArr,function(n,o){
				imgArr[n]=(imgBase+'/'+o).replace('size','origin');
			});
			this.imgparm.imgArr=imgArr;
		}
	},
	stopProp:function(event){
		if (window.event)
			window.event.cancelBubble = true;
		else if(event&&event.stopPropagation)
			event.stopPropagation();
	},
	//当前图片参数
	imgparm:{
		//原图宽
		imgw:0,
		//图片序号
		i:0,
		//图片数组
		imgArr:[],
		//图片url
		imgUrl:'',
		//img
		imgEm:null
	}
}