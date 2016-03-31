$(function(){
	
	//验证。。。。
	// 必须每个类别都得填写
	
	//统计分类对应的商品
	
	//提交
	//父订单id		分类商品id
	
	
});

function saveEdit(dlg){
	//测试
	console.info('验证结果：'+validate());
	console.info('分类结果：'+statistics());
	if(validate()){
		//提交数据
		$.post(base+'/ebsite/order/orderSplitSave',{
			//orderid
			poid:$('#dataId').val(),
			splitOrderJson:statistics()
		},function(res){
			console.info(res);
			if(res.STATE == 'SUCCESS'){//拆单成功
				art.dialog({
					icon: 'succeed',
				    time: 1,
				    content: res.MSG
				});
				setTimeout(function(){art.dialog.close();},1000);		
			}
		},'json');
	}
	return false;
}

//验证
function validate(){
	var flag=true;
	var classifyAll=[];
	//如果要拆分。每个订单都需要填写分类类别
	$('.chaidanCate').each(function(i,n){
		var $thisDiv=$(this);
		var classify = $thisDiv.find('select[name="classify"]').val();
		if(flag){//如果为true；继续执行
			if(classify){//如果为真表是有值
				// no something....
			}else{
				//提示
				art.dialog.tips('必须选择拆分类别！');
				flag=false;
			}
		}
		classifyAll.push(classify);
	});
	if(isSameAs(classifyAll)){//为真，则提示，组织程序乡下
		art.dialog.tips('请至少拆分成两类！');
		flag = false;
	}
	return flag;//只有所有的验证都通过才会为true;
}


//判断是否只分了一个类
/**
 * 如果返回false表示，有不相同的。否则为同一类
 */
function isSameAs(arry){
	var flag=true;
	var firstClassify=arry[0];
	for(var i=0;i<arry.length;i++){
		if(flag){//如果为真继续
			if(firstClassify == arry[i]){
				//no something。。。
			}else{//如果有不相等的。则停止搜索
				flag=false;
			}
		}
	}
	return flag;
}
//统计分类订单
function statistics(){

	var result={};
	
	var A=[];
	var B=[];
	var C=[];
	var D=[];
	
	$('.chaidanPro').each(function(i,n){
		var $thisDiv=$(this);//当前div
		//获取分类类别
		var classify = $thisDiv.find('select[name="classify"]').val();
		if('A' == classify){//表示A类
			A.push($thisDiv.find('input[name^="ordd"]').val());//存入商品id
		}else if('B' == classify){//表示B类
			B.push($thisDiv.find('input[name^="ordd"]').val());//存入商品id
		}else if('C' == classify){//表示C类
			C.push($thisDiv.find('input[name^="ordd"]').val());//存入商品id
		}else {//表示D类
			D.push($thisDiv.find('input[name^="ordd"]').val());//存入商品id
		}
	});
	
	if(A.length>0){//表明有值
		result.a=A.join(',');//逗号拆分
	}
	
	if(B.length>0){//表明有值
		result.b=B.join(',');//逗号拆分
	}
	
	if(C.length>0){//表明有值
		result.c=C.join(',');//逗号拆分
	}
	
	if(D.length>0){//表明有值
		result.d=D.join(',');//逗号拆分
	}
	
	return JSON.stringify(result);
}


//接收父订单

//处理拆分的结果


//提交------拆分的结果-----父订单id-------模拟下单操作
