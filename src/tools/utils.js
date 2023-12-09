import { DEBUG, CONFIG } from '../config/config';
/*
  获取随机整数
  random(3,8) 的随机区间为 3-8
 */
export function r(min,max){
    return Math.floor(Math.random()*(min-max-1)+max+1);
}
export function exptr(min,max,exp){ // 指数随机
    let v = r(min,max-1);
    return Math.round((v-min)*Math.pow(v/(max-min),exp||1)+min+r(0,1));
}
/*
  冒泡排序
  @Param arr {Array} 要进行排序的数组 [{val:30,...},{val:10,...},{val:20,...},...]
  @Param valname? {String} 索引变量名（默认为'val'）
  @Return arr {Array} 排好序的数组

  Example:
  let oldarr = [{
        vote: 30, id: 'A',
    },{
        vote: 10, id: 'B',
    },{
        vote: 20, id: 'C',
    }];
    let newarr = bulbsort(oldarr,'vote');
 */
export function bulbsort(arr,valname='val',type=1){
    let res = [...arr];
    for(let i=0;i<res.length-1;i++){
        for(let j=0;j<res.length-1-i;j++){
            if(type){
                if((res[j][valname]<res[j+1][valname])){
                    let temp=res[j];
                    res[j] = res[j+1];
                    res[j+1] = temp;
                }
            }
            else{
                if((res[j][valname]>res[j+1][valname])){
                    let temp=res[j];
                    res[j] = res[j+1];
                    res[j+1] = temp;
                }
            }
        }
    }
    return res;
}
/*
 获取离元素ele最近的父级 tagname 标签
 */
export function getParentNode(ele,tagname='a'){
    if((ele&&((ele.nodeName||ele.tagName).toUpperCase())===tagname.toUpperCase()||ele.parentNode===null))
        return ele;
    else if(ele)
        return getParentNode(ele.parentNode,tagname);
    return false;
}

/* 通用ajax请求 */
export function query(url,success,fail,type=0,data={}){
    $.ajax({
        url,
        type: type?'POST':'GET',
        data,
        success: function(result){
            if(result.code==0){
                success&&success(result);
            }
            else{
                console.error(result);
                fail&&fail(result||{msg:'请求失败'});
            }
        },
        error: function(e){
            console.error(e);
            fail&&fail(e);
        },
        complete: function(e){
        },
    });
    return true;
}

export function getQueryVariable(variable){
    let query = window.location.search.substring(1);
    let vars = query.split('&');
    for (let i=0;i<vars.length;i++) {
           let pair = vars[i].split('=');
           if(pair[0] == variable){
               return pair[1];
           }
    }
    return false;
}

export function arrContains(arr,number){ // 判断数字数组中是否含有数字
    let res = -1;
    Array.from(arr,(item,index)=>{
        if(item==number){
            res = index;
        }
    });
    return res;
}
























//
