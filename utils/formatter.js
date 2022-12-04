
export function  getMonDay(){
	
	let temp = new Date().toDateString();
	
	let mon = temp.substring(4,7);
	
	let day = temp.substring(8,10);
	let first = day.substring(0,1);
	if(first == 0) {
		return mon+' '+day.substring(1,2)
	}
	else{
		return mon+' '+day
	}
} 



export function toWeekName() {
 var a = new Array("日", "一", "二", "三", "四", "五", "六");  
 var week = new Date().getDay();  
 var str = "星期"+ a[week]; 
 
 return str;
}