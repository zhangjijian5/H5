// function Testfunction(id){
//     var search = document.getElementById("id")
//     search.addEventListener('click',function(){alert('你点击了p1元素');},false)


//     }

// Testfunction(myP)
// document.getElementById("myP").addEventListener("click",function(){
//     alert("你点击了p1元素");
//  },false); /**false为冒泡传递**/
// document.getElementById("myDiv").addEventListener("click",function(){
//     alert('你点击了div1元素');
//  },false);
// document.getElementById("myP2").addEventListener("click",function(){
//     alert('你点击了p2元素');
//  },true) ;/**true为捕获传递**/
// document.getElementById("myDiv2").addEventListener("click",function(){
//     alert('你点击了div2元素');
//  },true);

//  document.getElementById('myDiv3').addEventListener('mousemove',myFunction)
 
// function add(x,y){
//     var z=x+y;
//     return z;
// }
// var i=add(15,11)
// console.log(i)



// function slogan(num,time){
//     /* 参数的默认值*/
//     // if (time == undefined){
//     //     time =7;
//     // }
//     time = time || 8;
//     for(var i = 1;i <= num; i++){
//         console.log(time+'点'+ i +'学习');
//     }
// }
// var time=1;
// slogan(10);

/* 动态传参 */
function add2(){
    var z = 0;
    // x = arguments[0];
    // y = arguments[1];
    for(var i=0;i<=arguments.length;i++){
        z += arguments[i];
    }
    return z;
}
var te= add2(1,2,3,4);
console.log('ls'+ te);