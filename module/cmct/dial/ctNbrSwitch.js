function NumberConversion(telephoneNumber) {
	var numberstr = telephoneNumber;
	var returnVal = 0;
	var numberlen = telephoneNumber.length;
	
	if (telephoneNumber.substring(0,2)=="00"){
		numberstr = telephoneNumber.substring(2,numberlen);
	}
	else if(telephoneNumber.substring(0,1)=="0"){
		var tempPhone = telephoneNumber.substring(1,numberlen);
		tempPhone = tempPhone.replace(/[^0-9]/g,"");
		numberstr = "86" + tempPhone;
	}
	else if(telephoneNumber.substring(0,1)=="1"){
		numberstr = "86" + telephoneNumber;
	}
	else if(telephoneNumber.substring(0,5)=="95040"){
		numberstr = "86" + telephoneNumber;
	}
	else if(telephoneNumber.substring(0,5)=="95013"){
		numberstr = "86" + telephoneNumber;
	}
	else if(telephoneNumber.substring(0,3)=="400"){
		numberstr = "86" + telephoneNumber;
	}
	else if(telephoneNumber.substring(0,3)=="800"){
		numberstr = "86" + telephoneNumber;
	}
	else{
	    returnVal = 1;
	}
	return [returnVal,numberstr];
};

function PhoneConversion(telephoneNumber){
	if(telephoneNumber.indexOf("86--")!=-1){
		var str = telephoneNumber.replace("86--","");
		return str.substring(0,str.length -1);
	}else if(telephoneNumber.indexOf("86-")!=-1){
		var str = telephoneNumber.replace("86-","");
		return str.substring(0,str.length -1);
	}
	return telephoneNumber ;
}

function PhoneToAll(telephoneNumber) {
	var numberstr = telephoneNumber;
	var numberlen = telephoneNumber.length;
	
	if(telephoneNumber.substring(0,1)=="0"){
		numberstr = "86-" + telephoneNumber ;
	}else if(telephoneNumber.substring(0,1)=="1"){
		numberstr = "86--" + telephoneNumber;
	}
	numberstr = numberstr +"-" ;
	return numberstr
};