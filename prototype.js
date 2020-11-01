
/* 
    일반함수코드를 prototype 기반 객체지향 코드로 변경
    1. 외부로부터 특정 인스턴스로 값을 전달하기 위한 생성자 함수
    2. 생성자함수의 prototype에 등록할 메서드(함수)
    3. 생성자함수로부터 인스턴스로 값을 전달할 때는 this객체에 담아서 전달  
    4. 인스턴스 복사할 때 무조건 해야하는 기능 2가지 
       - initDOM() 돔 초기화 
       - bindingEvent()  이벤트 연결
*/

function MyScroll(props) {
    this.initDOM(props);
    this.setPos(); //load
    this.bindingEvent(props);
}

MyScroll.prototype.initDOM = function(props) {
    this.sec = document.querySelectorAll(props.boxs)
    this.sec_arr = Array.prototype.slice.call(this.sec)
    this.btn = document.querySelectorAll(props.btns)
    this.len = this.sec.length
    this.enableClick = true;
    this.offs = [];
    this.baseLine = props.baseLine;
}

MyScroll.prototype.bindingEvent = function(props) {
    // 인스턴스를 지칭하는 this를 해당 메서드 안에서만 지역변수 self로 옮겨담음
    // 이유 : 이벤트문 안쪽에서의 this와 충돌을 피하기 위해.
    var self = this;

    // click event
    for(var i = 0; i < self.len; i++) {
        (function(index) {
            self.btn[index].onclick = function() {
                var isOn = this.classList.contains('on')
                if(isOn) return ; //이즈온이 트루면 함수실행안됨

                if(self.enableClick) { //트루면 클릭안됨
                    self.animate(window, {
                        prop: 'scroll',
                        value: self.offs[index],
                        duration: props.speed,
                    })
                    self.enableClick = false;
                }

                // self.activation(index, btn);
                
            }
        })(i)
    }
    
    // scroll event
    window.onscroll = function() {
        var scroll = window.scrollY || window.pageYOffset;
        var activeNum = 0;
        
        self.offs.forEach(function(val, index) {
            if(scroll >= val + self.baseLine) activeNum = index;
        })
        self.activation(activeNum, self.btn);
        self.activation(activeNum, self.sec);
        
    }
}

MyScroll.prototype.setPos = function() {
    var self = this
    self.sec_arr.forEach(function(val, index, arr) {
        // console.log(val, index, arr)
        self.offs.push(val.offsetTop) // offs 배열에 각 엘리먼트 옵셋탑깞을 넣음!
        
    })
    self.offs.push(self.sec_arr[self.len-1].offsetTop + self.sec_arr[self.len-1].offsetHeight) // 마지막 박스의 처음값에 박스 전체값을 더하면 마지막위치가 나옴
}


MyScroll.prototype.animate = function(selector, option){           
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
            self.enableClick = true;            
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
            self.enableClick = true;            
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

MyScroll.prototype.activation = function(activeNum, items){ 
    for(let k=0; k<items.length; k++){
        items[k].className="";
    }
    items[activeNum].classList.add("on");
}