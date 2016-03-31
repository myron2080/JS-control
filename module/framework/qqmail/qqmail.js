/**
 * QQMail 企业邮箱集成
 */
var QQMail = {
		//管理员id
		client_id:'',
		//分配的KEY
		client_secret:'',
		//所用URL集合对象
		urls:{
			//获取OAuth验证授权链接
			getOAuth:'https://exmail.qq.com/cgi-bin/token',
			//获取成员信息
			getUser:'http://openapi.exmail.qq.com:12211/openapi/user/get'
		},
		//访问证书
		token:{
			access_token:'WJTJq1UGy9Pipw4x8arxR4-xqtxLWKbOiEUlbqpbYNj5njFAc6OQnfiYosOAvk8NFFPung5xcZRLVN_yalj9rA',
			token_type:'Bearer',
			expires_in:86400,
			refresh_token:''
		},
		//初始化
		init:function(){
			QQMail.client_id = 'dingjiansoft' ;
			QQMail.client_secret = '902e9d4f83ef96dde760cb375cc8ac5f' ;
		},
		//初始化Token访问证书
		initToken:function(){
			$.post(QQMail.urls.getOAuth,{
				grant_type:'client_credentials',
				client_id:QQMail.client_id,
				client_secret:QQMail.client_secret 
			},function(rst){
				//alert(JSON.stringify(rst));
			},'json');
		},
		//获取成员信息
		getUserInfo:function(){
			/*
			$.post(QQMail.urls.getUser,{
				alias:'ohb@dingjianerp.com',
				Authorization:QQMail.token.access_token
			},function(rst){
				alert(JSON.stringify(rst));
			},'jsonp');
			
			$.ajax({
				url:QQMail.urls.getUser,
				type:'GET',
				dataType:'jsonp',
				data:{alias:'ohb@dingjianerp.com',Authorization:QQMail.token.access_token},
				timeout:5000,
				success:function(rst){
					alert(JSON.stringify(rst));
				},
				error:function(xhr,ajaxOptions,thrownError){
					alert(" xhr.status="+ xhr.status + "；xhr.statusText="+xhr.statusText);
				}
			});
			
			var requrl = QQMail.urls.getUser + "?alias=ohb@dingjianerp.com&Authorization="+QQMail.token.access_token;
			$.getJSON(requrl,function(rst){
				alert(JSON.stringify(rst));
			});
			*/
		}
}