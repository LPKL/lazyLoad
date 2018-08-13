/**
 * Created by Administrator on 2018/8/9.
 */
var utils=(function () {
    var getCss=function(curEle,attr){
        var value=null;
        try{
            value=window.getComputedStyle(curEle,null)[attr];

        }catch(e){
            value=curEle.currentStyle[attr];
        }
        //判断value是否是数字加单位的类型
        var reg=/^([+-]?(\d|[1-9]\d+)(\.\d+)?)(px|rem|em|pt)$/;
        if(reg.test(value)){
            value=parseFloat(value);
        }
        return value;
    }
    var setCss=function(ele,attr,value){
        var reg=/width|height|left|top|margin|padding|border|fontSize|marginTop/i;
        if(reg.test(attr)){
            value=parseFloat(value)+'px';
        }
        ele.style[attr]=value;//=>没有单位的时候可能会报错
    }
    var setGroup=function (ele,obj) {
        if(Object.prototype.toString.call(obj)!=='[object Object]'){return ;}
        for(var k in obj){//=>原型上自定义的私有属性也可以获取到
            if(obj.hasOwnProperty(k)){
                setCss(ele,k,obj[k]);
            }
        }
    }
    // 将三种方法组合封装
    var css=function () {
        var arg=arguments;
        if(arg.length==2){
            if(typeof arg[1]=='string'){
                return getCss(arg[0],arg[1]);
            }else{
                setGroup(arg[0],arg[1]);
            }
        }else {
            setCss(arg[0],arg[1],arg[2]);
        }
    }

    var toJson=function(str){
        try{
            var arr=JSON.parse(str);
            return arr;
        }catch(e){
            var arr=eval('('+str+')');
            return arr;
        }
    }
    var toArr=function(ary){
        try{
            var arr=[];
            arr=Array.prototype.slice.call(ary);
            return arr;
        }catch(e){
            var arr=[];
            for (var i = 0; i < ary.length; i++) {
                arr[i]= ary[i];
            }
            return arr;
        }
    }
    return myUtils={
        getCss,
        setCss,
        setGroup,
        css,
        toJson,
        toArr
    }
})()