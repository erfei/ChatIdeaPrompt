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
                <div id="myset" class="myfast">
                <div class="header">
                  <select name="language" class="form-control" id="language">
                      <option value="en">English</option>
                      <option value="zh_CN">中文(简体)</option>
                      <option value="zh_TW">中文(繁體)</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="ar">العربية</option>
                      <option value="ru">Русский</option>
                      <option value="hi">हिन्दी</option>
                      <option value="pt">Português</option>
                      <option value="bn">বাংলা</option>
                      <option value="ja">日本語</option>
                      <option value="de">Deutsch</option>
                      <option value="ko">한국어</option>
                      <option value="ta">தமிழ்</option>
                      <option value="it">Italiano</option>
                      <option value="tr">Türkçe</option>
                      <option value="nl">Nederlands</option>
                    </select>
                   
   
              
                    <span class="close-set close">X</span>
                    <div class="aibtn">
                       <a class="stpcreate">添加</a>
                    </div>
                    </div>
                    <div class="content">
                    <ul id="stpromlist">
                   </ul>
                   
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', html);
            closefastbind();
            fastmenubind();
            selectfastbind();
          
            showfastbind();
           // openfastbind();
            autogotobind();
            subEventListener();
            stpromptbind();//绑定前缀列表
            stpromptadd();//添加前缀点击事件

       
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
//绑定添加前缀提示
const stpromptadd=function(){
  //点击添加按钮
  $('.stpcreate').onclick=function(){
    var newElement = document.createElement('div');
    newElement.innerHTML = `<div id="myModal" class="modal">
    <div class="modal-content">
      <span class="closebox closebtn" >&times;</span>
      <div class="modal-header">
        <h4>自定义提示</h4>
        <p class="modal-ts">{{input}}将会被替换为您在输入框输入的内容,[[变量名称]]可自定义输入变量</p>
      </div>
    
      <textarea id="userInput"  rows="10"></textarea>
      <div class="modal-bottom">
          <button class="btn-bot savestprompt"> 保存</button>
        
      </div>
    
    </div>
  </div>
    `;
    document.body.appendChild(newElement);
    //添加关闭按钮事件
    $('.closebtn').onclick=function(){
      $("#myModal").remove();
    }
    //点击保存事件
    $('.savestprompt').onclick=function(){
      savestprompt();
    }
  }



}
//保存前缀提示
const savestprompt=function(){
  var inputElement =  $('#userInput');
  var inputstr= inputElement.value;
  inputstr=inputstr.replace(/\/+$/, "");
  if(inputstr==''){
      return true;
  }
  //console.log(inputstr);
  chrome.runtime.sendMessage({type: "stpromptsave",inputtxt:inputstr}, function(response) {
    promptcontxt=inputstr;
    chrome.storage.sync.set({ promptcon: inputstr }, function() {
              
    }); 
      $("#myModal").remove();
      stpromptbind();//重新绑定
    
  });

}
//绑定前缀
const stpromptbind=function(){
  chrome.runtime.sendMessage({type: "stpromptlist"}, function(response) {
            
    let inserhtml="";
    response.data.forEach(item => {
       
        inserhtml+=`<li  title="单机选择"><span class="del-stpr" data-id="${item.id}" data-title="${item.title}">X</span><span class="stprompli" data-id="${item.id}">${item.title}</span> </li>`;
       
       
    })
    $('#stpromlist').innerHTML=inserhtml;
    stpromptclick();
});
}
//绑定前缀列表点击事件
const stpromptclick=function(){
  const liElements =$$('.stprompli');
  liElements.forEach(li => {
  li.addEventListener('click', () => {
      inputbase(li.textContent)
   
        $('#myset').style.display="none";
      
      
  });
  });
  const delElements =$$('.del-stpr');
  delElements.forEach(li => {
    li.addEventListener('click', () => {
        var seid= li.getAttribute('data-id');
        var title=li.getAttribute('data-title');
        chrome.runtime.sendMessage({type: "stpromptdel",id:seid}, function(response) {
          if(title==promptcontxt){
            promptcontxt='';
            chrome.storage.sync.set({ promptcon: "" }, function() {
                      
            }); 
          }
          stpromptbind();
        
      });
        
    });
    });
}
const subEventListener=function(){
  document.addEventListener('DOMContentLoaded', function() {
    $('form.stretch ').addEventListener('submit', function(event) {
      sennum=-1;
      promptlist.length = 0;
    
     event.preventDefault(); 
    
 
    });
  });
  
}
const autogotobind=function(){
  
  
  chrome.storage.sync.get('language', function(items) {
    $("#language").value =items.language;
  });
  chrome.storage.sync.get('promptcon', function(items) {
    if(items.promptcon){
     
        promptcontxt=items.promptcon;
    }
  });
   
 
  // 添加事件监听器
  $("#language").addEventListener("change", function() {
    let selectedLanguage = this.value;
    chrome.storage.sync.set({ language: selectedLanguage }, function() {
        window.location.reload(); // 刷新页面
      });
  });

}



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
            $('.close-set').onclick=function(){
                $('#myset').style.display="none";
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

