function Testfunction(id){
    var ele = document.getElementById(id)
    (function(){
        document
    }) ();
}

document.getElementById("myP").addEventListener("click",function(){
    alert("你点击了p1元素");
 },false); /**false为冒泡传递**/
document.getElementById("myDiv").addEventListener("click",function(){
    alert('你点击了div1元素');
 },false);
document.getElementById("myP2").addEventListener("click",function(){
    alert('你点击了p2元素');
 },true) ;/**true为捕获传递**/
document.getElementById("myDiv2").addEventListener("click",function(){
    alert('你点击了div2元素');
 },true);

 document.getElementById('myDiv3').addEventListener('mousemove',myFunction)
 