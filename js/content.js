(function(){
 
    let promptcontxt='';

    //加载多语言配置
   
    let language="en";
     let messages;
 
    const loadlang=function(){
        chrome.storage.sync.get('language', function (response){
        
            if(response.language!=undefined){
                language = response.language
                
            }
            let url1 = chrome.runtime.getURL(`_locales/${language}/messages.json`)
               
                fetch(url1)
                .then((response) => response.json())
                .then((translations) => {
                    messages=translations;
                 
                });
        })
    };
    loadlang();
 

    const txtinput=function(){
        
            const html = `
            <div id="fastbtn">${messages['btn_Fast'].message}</div>
          
            
            
                <div id="myfast" class="myfast">
                <div class="header">
                    <select>
                    </select>
                   
                  
                    <span class="close-btn close">X</span>
                      <div class="aibtn">
                     
                      </div>
                    </div>
                    <div class="content">
                    <ul id="promlist">
                       
                    </ul>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', html);
            closefastbind();
            fastmenubind();
            selectfastbind();
            showfastbind();
     

    }
    let sennum=-1;
    let promptlist=[];
    let fistpromp='';

    const openfastbind=function(){
        var inputElement =  $('textarea');
        inputElement.addEventListener('keyup', function(event) {
            const value = inputElement.value; // 获取输入框当前的值
          
            /////回车发送消息事件
            if (event.key === 'Enter') {
          
              
              }
          });
          
          inputElement.addEventListener('keydown', function(event) {
          
          });
    }
let timergo=null;







let current_url = window.location.href;
 const  check_url=function() {
    //链接改变，重新绑定快捷代码
    if (current_url !== window.location.href) {
        current_url = window.location.href;
        if ($("#fastbtn")!==null) {
            openfastbind();
        }else{
            txtinput();
        }
		
    }
}


setInterval(check_url, 500);
    const showfastbind=function(){
        //打开快捷功能
        $("#fastbtn").onclick=function(){
            openfast();
        }
        //点击设置按钮
        // $("#setbtn").onclick=function(){
        //     $('#myset').style.display="block";
        // }
    }
  
    const fastmenubind=function(){
        //获取菜单
        chrome.runtime.sendMessage({type: "fast"}, function(response) {
            
            let selectElement = $('.header select');
            selectElement.options.length = 0;
            
             let option1 = new Option('ALL', '' );
             selectElement.options.add(option1);
             fastlistbibnd('');
            response.data.forEach((item, index)=>{
                let option1 = new Option(item.name, item.id );
                selectElement.options.add(option1);
                // if(index==0){
                //     fastlistbibnd(item.id);
                // }
            });
            
         });
    }
    const showMesg=function(msg) {
        let errHtml = `
          <div class="error-box">
            <span class="close-btn">&times;</span>
            <div class="msgcon">${msg}</div>
          </div>
        `;
      document.body.insertAdjacentHTML('afterbegin', errHtml);
        $('.close-btn').addEventListener('click', function() {
          $('.error-box').remove();
        });
      setTimeout(function() {
          $('.error-box').remove();
        }, 4000);
      }
    const fastlistbibnd=function(tid){
        //获取列表
        chrome.runtime.sendMessage({type: "fastlist",tid:tid}, function(response) {
            
             elemcon=$('#promlist');
             let inserhtml="";
             response.data.forEach(item => {
                inserhtml+=`<li>${item.prompt} </li>`;
             })
             $('#promlist').innerHTML=inserhtml;
             fastbind();
         });
    }
    const fastbind=function(){

        const liElements =$$('#promlist li');
        liElements.forEach(li => {
        li.addEventListener('click', () => {
  
            inputbase(li.textContent)
            closefast();
        });
        });

    }
    //切换快捷列
    const selectfastbind=function(){
        $('.header select').addEventListener('change', (event) => {
            fastlistbibnd(event.target.value);
          });
    }
    const closefastbind=function(){
            $('.close-btn').onclick=function(){
                closefast();
            }

    }
    const closefast=function(){
        $('#myfast').style.display="none";
    }
    const openfast=function(){
        $('#myfast').style.display="block";
    }

  
  
  
 
  
    const sendmsg=function(message){
        
        var inputElement =  $('#prompt-textarea');
        inputElement.focus()
      
        inputElement.value =message;
        inputElement.dispatchEvent(inputEvent);
       // spaceKeyEvent = new KeyboardEvent('keydown', {keyCode: 32});
        var event = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true
          });
          inputElement.dispatchEvent(event);
       
    }
    const inputEvent = new Event('input', {
        bubbles: true,
        cancelable: true
      });
 
    const nInterval2Fun = function() {
          if ($("#fastbtn")!==null) {
            return;
        }
    
        txtinput();
    };
 


    chrome.runtime.onMessage.addListener(function(request, sender, sendRequest){
       
        if(request.type=='askmsg'){
          if(request.ex=='update'){
            //更新问题列表
             loadask();
            createaskmenu(request.seid);
          }
        }
        if(request.type=='insertselect'){
            if (window.location.href.includes(request.acurl)) {
             inputbase(request.prompt)
            }
            
        }
        sendResponse({ status: "ok" }); // 关键
       return true;  
    });

  
    let nInterval2 = setInterval(nInterval2Fun,3000);//加载页面窗口

   
})();

