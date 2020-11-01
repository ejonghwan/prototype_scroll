// window.scrollY : 현재 브라우저의 스크롤된 거리값 (ie지원안함) - 동적임
// window.pageYOffset : 브라우저 스크롤된 거리값 (ie 지원함) - 정적임

// DOM.offsetTop : DOM의 세로 위치값 - 
// DOM.offsetHeight : 돔의 높이값까지 포함한 세로 위치값 - 정적인값

// window.scroll(가로 스크롤위치, 세로 스크롤 위치)




var sec = document.querySelectorAll('section')
var sec_arr = Array.prototype.slice.call(sec)
var btn = document.querySelectorAll('ul li')
var len = sec.length
var enableClick = true;
var offs = [];
var baseLine = -300;

// click event
for(var i = 0; i < len; i++) {
    (function(index) {
        btn[index].onclick = function() {
            var isOn = this.classList.contains('on')
            if(isOn) return ; //이즈온이 트루면 함수실행안됨

            if(enableClick) { //트루면 클릭안됨
                animate(window, {
                    prop: 'scroll',
                    value: offs[index],
                    duration: 500,
                })
                enableClick = false;
            }

            activation(index, btn);
            
        }
    })(i)
}

setPos();
console.log(offs)

function setPos() {
    sec_arr.forEach(function(val, index, arr) {
        // console.log(val, index, arr)
        offs.push(val.offsetTop) // offs 배열에 각 엘리먼트 옵셋탑깞을 넣음!
        
    })
    offs.push(sec_arr[len-1].offsetTop + sec_arr[len-1].offsetHeight) // 마지막 박스의 처음값에 박스 전체값을 더하면 마지막위치가 나옴
}

window.onscroll = function() {
    var scroll = window.scrollY || window.pageYOffset;
    // console.log(scroll)
    var activeNum = 0;
    
    offs.forEach(function(val, index) {
        if(scroll >= val + baseLine) activeNum = index;
    })
    activation(activeNum, btn);
    activation(activeNum, sec);
    
}



function animate(selector, option){           
    const startTime = performance.now();    
    let current_value;          
    const self = this;
    
    if(option.prop === "opacity") {
        current_value = parseFloat( getComputedStyle(selector)[option.prop] );
    } else if(option.prop === "scroll"){          
        current_value = parseInt( window.scrollY || window.pageYOffset );
    }else{
        current_value = parseInt( getComputedStyle(selector)[option.prop] );
    }   
    
    if(current_value == option.value) return;
    if(current_value < option.value) {
        requestAnimationFrame(run_plus);
    } else {
        requestAnimationFrame(run_minus);
    }  
    
    
    function run_plus(time){   
        let timeLast = time - startTime;      
        let progress = timeLast / option.duration;
        let timer;   
        
        if (progress < 0) progress = 0; 
        if (progress > 1) progress = 1;      
    
        if (progress < 1){
            timer = requestAnimationFrame(run_plus); 
        } else {
            cancelAnimationFrame(timer);   
            if (option.callback) option.callback();             
            enableClick = true;            
        }   

        let result =  current_value + ( (option.value - current_value) * progress);    
        
        if (option.prop === "opacity"){
            selector.style[option.prop] = result;
        } else if(option.prop === "scroll"){
            window.scroll(0,result);
        } else {               
            selector.style[option.prop] = result+"px";
        }  
    }         


    function run_minus(time){     
        let timeLast = time - startTime;      
        let progress = timeLast / option.duration;      
        let timer;
        
        if (progress < 0) progress = 0; 
        if (progress > 1) progress = 1;      
        
        if (progress < 1){
            timer = requestAnimationFrame(run_minus); 
        } else {
            cancelAnimationFrame(timer);              
            if (option.callback) option.callback();
            enableClick = true;            
        }         

        let result =  current_value - ( (current_value - option.value) * progress);    

        
        if (option.prop === "opacity"){
            selector.style[option.prop] = result;
        } else if(option.prop === "scroll"){
            window.scroll(0,result);
        } else {               
            selector.style[option.prop] = result+"px";
        }  
        
    }
}


function activation(activeNum, items){ 
    for(let k=0; k<items.length; k++){
        items[k].className="";
    }
    items[activeNum].classList.add("on");
}