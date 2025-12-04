(function(){
    let runtast=0;
    let zdypr=2;
    let promptcontxt='';
    const $ = (Selector, el) => (el || document).querySelector(Selector);
    const $$ = (Selector, el) => (el || document).querySelectorAll(Selector);
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
            openfastbind();
            autogotobind();
            subEventListener();
            stpromptbind();//绑定前缀列表
            stpromptadd();//添加前缀点击事件
            importbtn();
       
    }
    let sennum=-1;
    let promptlist=[];
    let fistpromp='';
    //导出事件
    const importbtn=function(){
      setTimeout(function() {
          var button = document.createElement('button');
          button.className = 'btn relative btn-secondary text-token-text-primary importbtn';
          button.style.display = 'var(--screen-size-hidden-on-compact-mode)';
          button.textContent = messages['btn_export'].message;
          button.id="donwbtn"
          document.body.appendChild(button);
          $(".importbtn").onclick=function(){
            var fullUrl = window.location.href;
            var parsedUrl = new URL(fullUrl);
            var lastPart = parsedUrl.pathname.split('/').pop();
                allConverex(lastPart).then(response=>{
                  let remakedowm="";
                  for(let value  of  Object.values(response.dhlist)){
                    // console.log(value);
                      if(value && value.message && value.message.content&&value.message.content.parts){
                          remakedowm+=value.message.content.parts[0]+"\n";
                      }
                  }
                var timestamp = new Date().getTime();
                var blob = new Blob([remakedowm], { type: "text/markdown" });
                 var downloadLink = document.createElement("a");
                 downloadLink.href = URL.createObjectURL(blob);
                  downloadLink.download = response.title+'.md';
                  downloadLink.target = '_blank';
                  downloadLink.click();
              })
          }
      }, 1000);

      
      
    }
    const openfastbind=function(){
        var inputElement =  $('#prompt-textarea');
        inputElement.addEventListener('keyup', function(event) {
            const value = inputElement.value; // 获取输入框当前的值
            // console.log(event);
            // if (event.key === '/') {
            //    //这里需要显示快捷提示词框
            //    openfast();
            // }
            // if(event.key==='ArrowUp'){
           
            // }
            // if(event.key==='ArrowDown'){
            //     //按了向下
             
               
            // }
            /////回车发送消息事件
            if (event.key === 'Enter') {
          
                // sennum=-1;
                // promptlist.length = 0;
                // //执行自动继续代码
                //  if(runtast===0){
                  
                //     chrome.storage.sync.get('autogo', function(items) {
                       
                //         if(items.autogo===1){
                //                 startautogo();
                //         }else{
                //             clearInterval(timergo);
                //             timergo=null;
                //         }
                //     });
                //  }
              }
          });
          
          inputElement.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
           
            }
            if (event.ctrlKey && event.key === 'ArrowUp') {
                // 执行相应的操作或函数
                     //按了向上键
                     if(sennum==-1){
                        //获取对话用户历史记录
                        allConver().then(response=>{
                            //console.log(response.dhlist);
                            let nowmsg=response.dhlist;
                            for(let value  of  Object.values(nowmsg)){
                                if(value.message){
                                    if(value.message.author.role=='user')
                                    {
                                      //提问
                                      ask=value.message.content.parts[0];
                                      promptlist.push(ask);
                                    }
                                  }
                            }
                            promptlist.reverse();
                          //  console.log(promptlist);
                              fistpromp=inputElement.innerHTML;
                              sennum+=1;
                             inputElement.innerHTML=promptlist[sennum];
                             inputElement.focus()
                             var range = document.createRange();
                            // 创建 Selection 对象
                            var selection = window.getSelection();

                            // 将 range 设置为元素内容的最后位置
                            range.selectNodeContents(inputElement);
                            range.collapse(false); // collapse(false) 表示将光标置于内容的末尾

                            // 清空 selection 对象中的任何选中范围，然后添加新的 range
                            selection.removeAllRanges();
                            selection.addRange(range);

                            
                         })
                    }else{
                        sennum+=1;
                        if(sennum<promptlist.length){
                            inputElement.innerHTML=promptlist[sennum];
                            inputElement.focus()
                            var range = document.createRange();
                            // 创建 Selection 对象
                            var selection = window.getSelection();

                            // 将 range 设置为元素内容的最后位置
                            range.selectNodeContents(inputElement);
                            range.collapse(false); // collapse(false) 表示将光标置于内容的末尾

                            // 清空 selection 对象中的任何选中范围，然后添加新的 range
                            selection.removeAllRanges();
                            selection.addRange(range);
                        }
                       
                       
                    }
              }
              if (event.ctrlKey && event.key === 'ArrowDown') {
                // 执行相应的操作或函数
                if(sennum>0){
                    sennum-=1;
                    inputElement.innerHTML=promptlist[sennum];
                    inputElement.focus()
                    var range = document.createRange();
                    // 创建 Selection 对象
                    var selection = window.getSelection();

                    // 将 range 设置为元素内容的最后位置
                    range.selectNodeContents(inputElement);
                    range.collapse(false); // collapse(false) 表示将光标置于内容的末尾

                    // 清空 selection 对象中的任何选中范围，然后添加新的 range
                    selection.removeAllRanges();
                    selection.addRange(range);
                }else{
                    inputElement.value=fistpromp;
                    inputElement.focus()
                    var range = document.createRange();
                    // 创建 Selection 对象
                    var selection = window.getSelection();

                    // 将 range 设置为元素内容的最后位置
                    range.selectNodeContents(inputElement);
                    range.collapse(false); // collapse(false) 表示将光标置于内容的末尾

                    // 清空 selection 对象中的任何选中范围，然后添加新的 range
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
              }
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
        <p class="modal-ts">{{input}}将会被替换为您在输入框输入的内容,[[变量名称]可自定义输入变量</p>
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
      inputcon(li.textContent)
   
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
      //  $("#promptcon").value =items.promptcon;
       // let zdypr=2;
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
  // $("#promptcon").addEventListener("change", function() {
  //   // 获取Textarea的最终内容
  //   const content = this.value;
  //   promptcontxt=content;
  //   chrome.storage.sync.set({ promptcon: content }, function() {
               
  //   });
  // });
}
const startautogo=function(){
   
    if (timergo) return; // 如果定时器已经在运行，则返回
    timergo=setInterval(function(){
        if(runtast===1){
            return ;
        }
      // 定时器执行的代码
        if($('.text-2xl')){
            ///console.log("消息回复中");
        }else{
           
            let buttons= $$('form .relative .h-full button');
                if(buttons.length>1){
                    //存在继续按钮
                    for (var i = 0; i < buttons.length; i++) {
                        var button = buttons[i];
                        if (button.innerText.includes("Continue generating")) {
                            //内容输出未完成，点击按钮继续
                            // console.log('点击续写按');钮
                            button.click();
                            clearInterval(timergo);
                            timergo=null;
                            return ;
                        }
                    }
                }
                
            clearInterval(timergo);
            timergo=null;
           
        }
    },2000);
}
const loadmenushow=function(){
    //自动任务菜单是否显示
    chrome.storage.sync.get('menushow', function(items) {
            if(items.menushow==1){
                $('#myFloatBox').style.width='260px';
                $('.showbtn').textContent="›";
            }else{
                $('#myFloatBox').style.width='0px';
                $('.showbtn').textContent="‹";
            }
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
 const menushowbind=function(){
    $('.showbtn').onclick=function(){
       
        if(this.textContent=='›'){
             
            $('#myFloatBox').style.width='0px';
            this.textContent="‹";
            chrome.storage.sync.set({ menushow: 2 }, function() {
            });
        }else{
            if(this.textContent==='‹'){
                $('#myFloatBox').style.width='260px';
                this.textContent="›";
                chrome.storage.sync.set({ menushow: 1 }, function() {});
               
            }
        }
        
    }
 }
 const menudefhide=function(){
    // var inputElement =  $('.dark .h-full');
    // const html =` <div class="hidemenubtn">‹</div>`;
    // inputElement.insertAdjacentHTML('afterend', html);
    // $('.hidemenubtn').onclick=function(){
    //     if(this.textContent=='‹'){
    //         this.style.left="0px";
    //         $('.dark').style.width='0px';
    //         this.textContent="›";
    //     }else{
    //         if(this.textContent==='›'){
    //             $('.dark').style.width='260px';
    //             this.style.left="260px";
    //             this.textContent="‹";
    //         }
    //     }
    // }
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
             fastlistbibnd('');
              selectElement.options.add(option1);
             selectElement.options.add(option1);
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
  
            inputcon(li.textContent)
            closefast();
        });
        });

    }
    const inputcon=function(mycontent){
            mycontent=convertNewlinesToParagraphs(mycontent);

            const pattern = /\[\[(.*?)\]\]/g;
              let match;
              const uniqueContentMap = new Map();

              // 提取唯一内容并 prompt 一次
              while ((match = pattern.exec(mycontent)) !== null) {
                  const content = match[1];
                  if (!uniqueContentMap.has(content)) {
                      const replacement = prompt(`${content}`);
                      uniqueContentMap.set(content, replacement);
                  }
              }

           // 替换 [[内容]] 为对应的用户输入
             let replacedText = mycontent.replace(pattern, (_, content) => uniqueContentMap.get(content));
            
            var inputElement =  $('#prompt-textarea');

            let inputstr= inputElement.innerHTML.trim();
           
            inputstr=inputstr.replace(/\/+$/, "");
            replacedText = replacedText.replaceAll('{{input}}', inputstr);
             let newStr = replacedText.includes(inputstr) ? replacedText : inputstr + replacedText;

             inputElement.innerHTML =newStr;
              inputElement.focus();
              // 创建 Range 对象
              var range = document.createRange();
              // 创建 Selection 对象
              var selection = window.getSelection();

              // 将 range 设置为元素内容的最后位置
              range.selectNodeContents(inputElement);
              range.collapse(false); // collapse(false) 表示将光标置于内容的末尾

              // 清空 selection 对象中的任何选中范围，然后添加新的 range
              selection.removeAllRanges();
              selection.addRange(range);
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
    // const hidebox=function(elmnt,box){
    //     elmnt.onclick=function(){
    //         box.style.display="none";
    //     };
    // }
    const loadCIP=function(){

        if ($("#fastbtn")!==null) {
            return;
        }
    
        
        txtinput();
    }
    
 
    //绑定自动任务菜单数据
    const createaskmenu=function(seid=0){
        chrome.runtime.sendMessage({type: "askmenu"}, function(response) {
             
             let selectElement = $('.menuselect');
            selectElement.options.length = 0;
            let optionindex = new Option('select Task', '');
            selectElement.options.add(optionindex);
            response.data.forEach((item, index)=>{
                let option1 = new Option(item.name, item.id );
                if(item.id==seid){
                    option1.selected=true;
                }
                 
                selectElement.options.add(option1);
            });
            if(seid!=0){
                asklisdatabind(seid);
            }
            chrome.storage.sync.get('cid', function(items) {
                //  console.log(items.cid )
                 selectElement.value=items.cid;
             });
            // 获取你想要打开的URL
            selectElement.addEventListener('change', (event) => {
                chrome.storage.sync.set({ 'cid': event.target.value}, function() {});
                asklisdatabind(event.target.value);
              });
         });
    }
    const asklisdatabind=function(tid){
        //获取列表
        chrome.runtime.sendMessage({type: "asklistup",tid:tid}, function(response) {
             loadask();
         });
    }
    let timerId = null;
    
    let timerlast=null;
    let run=0;
    const startTimer=function() {
     
        if (timerId) return; // 如果定时器已经在运行，则返回
        timerId = setInterval(() => {
          
            if(run==1){
                return;
            }
            // console.log(sendall);
          // 定时器执行的代码
            if($('.text-2xl')){
                // console.log("消息回复中");
            }else{
                
                     run=1;
                    let buttons= $$('form .relative .h-full button');
                    if(buttons.length<=0){
                        autoask();
                    }else{
                       
                        nowConversation().then(response=>{
                            //  console.log(response);
                            if(response.dhlist[2].message.end_turn){
                                
                                let cid=$('.menuselect').value;
                                if(cid!=''){
                                    chrome.runtime.sendMessage({type:"savereply",data:response.dhlist,cid:cid,dhid:response.dhid}, function(response) {});
                                }
                                autoask();
                                
                            }else{
                                run=0;
                                sendmsg('please continue');
                                return false;
                            }
                    })
                    }
             
          
              
            }
          
        }, 3000); // 间隔时间为 2 秒
      }
    const autoask=function(){
        chrome.storage.local.get("asklist", function(data) {
            askdata=data;
           //  console.log(data)
            if(data.asklist){
             
             let sendnum=0;
            //  console.log(data.asklist.length);
             let index=0;
             data.asklist.some(item => {
                // console.log(item);
                index+=1;
                if(item.send==1){
                    //发送消息
                    //  console.log(item);
                     if(sendall==1){
                        sendmsg(item.ask);
                      
                        item.send=2;
                        run=0;
                        chrome.storage.local.set({asklist: data.asklist}, function() {});
                        sendnum+=1;
                        $('.sendcount').textContent=`${index}/${data.asklist.length}`;
                        return true; // 停止循环
                     }else{
                        if(item.reply.trim()==''){
                            sendmsg(item.ask);
                            item.send=2;
                            run=0;
                            chrome.storage.local.set({asklist: data.asklist}, function() {});
                            sendnum+=1;
                            $('.sendcount').textContent=`${index}/${data.asklist.length}`;
                            return true; // 停止循环
                        }else{
                            item.send=2;
                            chrome.storage.local.set({asklist: data.asklist}, function() {});
                            sendnum+=1;
                            $('.sendcount').textContent=`${index}/${data.asklist.length}`;
                        }
                     }
              
                }
            });
               
                //执行完成结束循环
                if(sendnum==0){
                    pauseTimer();
                    //这里需要获取最后一次输入内容
                    if (timerlast) return;
                    timerlast=setInterval(function(){
                        if($('.text-2xl')){
                            //  console.log("消息回复中");
                        }else{
                            clearInterval(timerlast);
                            timerlast=null;
                            allConver().then(response=>{
                                // console.log(response);
                               
                                let cid=$('.menuselect').value;
                                if(cid!=''){
                                    chrome.runtime.sendMessage({type:"savereply",data:response.dhlist,cid:cid,dhid:response.dhid}, function(response) {});
                                }
                                run=0;
                                // console.log(response);
                                // //这里需要获取所有聊天记录并保存
                                //          for(let value  of  Object.values(response)){
                                //             if(value.message){
                                //                 console.log([value.message.content.parts[0],value.message.end_turn,value.message.author.role])
                                //              }
                                //         }
                             })
                        }
                    },2000);
                }
            }else{
                pauseTimer();
            }
            
        });
    }
    const runask=function(){
        chrome.storage.local.get("asklist", function(data) {
            askdata=data;
            
            if(data.asklist){
             
             let sendnum=0;
             data.asklist.some(item => {
                // console.log(item);
                if(item.send==1){
                    //发送消息
                  //   console.log(item.ask)
                    sendmsg(item.ask);
               
                    item.send=2;
                    chrome.storage.local.set({asklist: data.asklist}, function() {});
                    sendnum+=1;
                    return true; // 停止循环
                }
            });
               
                //执行完成结束循环
                if(sendnum==0){
                    pauseTimer();
                    //这里需要获取最后一次输入内容
                    if (timerlast) return;
                    timerlast=setInterval(function(){
                        let buttonss= $$('form .relative .h-full button');
                        for (var m = 0; m < buttonss.length; m++) {
                            var buttonv = buttonss[m];
                            if (buttonv.innerText.includes("Stop generating")) {
                                //内容输出中，停止循环
                                //   console.log('最后一次任务执行中');
                               
                                 return ;
                              
                             }
                            if(buttonss.length>1){
                                if (buttonv.innerText.includes("Continue generating")) {
                                    //内容输出未完成，点击按钮继续
                                   
                                    // console.log('最后一次任务点击继续');
                                    buttonv.click();
                                     return ;
                                 }
                            }else{
                                if (buttonv.innerText.includes("Regenerate response")) {
                                    //保存最后一次输出结果
                                    clearInterval(timerlast);
                                    // console.log('最后一次任务保存数据');

                                    return ;
                                }
                            }
                           
                          
                        }
                        // if($('.text-2xl')){
                        //     // console.log("消息回复中");
                        // }else{
                        //     clearInterval(timerlast);
                        //     allConver().then(response=>{
                        //         console.log(response);
                        //         let cid=$('.menuselect').value;
                        //         if(cid!=''){
                        //             chrome.runtime.sendMessage({type:"savereply",data:response.dhlist,cid:cid,dhid:response.dhid}, function(response) {});
                        //         }
                              
                        //         // console.log(response);
                        //         // //这里需要获取所有聊天记录并保存
                        //         //          for(let value  of  Object.values(response)){
                        //         //             if(value.message){
                        //         //                 console.log([value.message.content.parts[0],value.message.end_turn,value.message.author.role])
                        //         //              }
                        //         //         }
                        //      })
                        // }
                    },2000);
                }
            }else{
                pauseTimer();
            }
            
        });
    }
    const pauseTimer=function() {
        clearInterval(timerId); // 清除定时器
        timerId = null; // 重置定时器 ID
        runtast=0;
        $('.aoutask').innerHTML=`<button type="button" title="Automatically send all"  class="allsmg" >
        <svg  stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        ${messages['btn_allsend'].message}
        </button>
        <button type="button"  class="olsmg" >
        <svg  stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        ${messages['btn_olsend'].message}
        </button>
        `;
        allaskbind();
      }
    var sendall=1;
    const allaskbind=function(){
        //绑定自动提问
        $('.allsmg').addEventListener("click", function() {
            // 在这里编写按钮点击后要执行的代码
              $('.aoutask').innerHTML=`<button type="button"  title="stop" class="stop" ><span class="stopbtn"></span><span class="sendcount"><span></button>`;
              sendall=1;
              //let cid=$('.menuselect').value;
              
              startTimer();
              
             /// console.log(sendall);
              runtast=1;
              stopbind();
          });
          $('.olsmg').addEventListener("click", function() {
            $('.aoutask').innerHTML=`<button type="button"  title="stop" class="stop" ><span class="stopbtn"></span><span class="sendcount"><span></button>`;
            sendall=2;
            startTimer();
            runtast=1;
            stopbind();
          })
    }
    const stopbind=function(){
        //绑定停止事件
        $('.stopbtn').addEventListener("click", function() {
            // 在这里编写按钮点击后要执行的代码
            pauseTimer();
          });
    }
    const loadask = async function() {
        return new Promise((resolve, reject) => {
          chrome.storage.local.get("asklist", function(data) {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              askdata = data;
              if (data.asklist) {
                let htmcon = $('#myList');
                htmcon.innerHTML = '';
                let lilisst='';
                data.asklist.forEach(item => {
                  const newli = `
                    <li>
                      <span class="askcon">${item.ask}</span>
                      <button type="button" class="smg" title="send" data-ask="${item.ask}">
                        <svg  stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-1 sensvg" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                          <line x1="22" y1="2" x2="11" y2="13"></line>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                      </button>
                    </li>
                  `;
                  lilisst+=newli;
                });
                htmcon.innerHTML = lilisst;
                sendcontent();
                resolve();
              } else {
                resolve();
              }
            }
          });
        });
      }
      

    const sendcontent=function(li){
        const liElements =$$('#myList .smg');
        liElements.forEach(li => {
        li.addEventListener('click', () => {
            const content = li.getAttribute('data-ask');;
            
            sendmsg(content)
        });
        });

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
        // const btn= $('form.stretch button');
        // if(btn){
        //     setTimeout(() => {
        //         $('form.stretch button').dispatchEvent(clickEvent);
        //     }, 500);
           
        // }else{
        //     console.log('按钮不存在');
        // }
    }
    const inputEvent = new Event('input', {
        bubbles: true,
        cancelable: true
      });
    // const clickEvent = new MouseEvent('click', {
    //     view: window,
    //     bubbles: true,
    //     cancelable: true
    //   });
    const nInterval2Fun = function() {
        if ($(symbol1_class)) {
            loadCIP();
           
        }
    };
    const Funerval1=function(){
        if ($(symbol1_class)) {
            keepChat();
        }
    };
    const keepChat = function() {
        fetch(u)
        .then(response => {
          if (!response.ok) {
            //throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          // 处理返回的数据
        })
        .catch(error => {
          ///console.error('Error:', error);
          // 返回默认值或空对象
          return {};
        });
    }
    let savelink="";
    let code="";
    let invid="";
    chrome.runtime.onMessage.addListener(function(request, sender, sendRequest){
       
        if(request.type=='askmsg'){
          if(request.ex=='update'){
             loadask();
            createaskmenu(request.seid);
          }
        }
        if(request.type=='insertselect'){
           if (window.location.href.includes(request.acurl)) {

             inputcon(request.prompt);
            }
            if(request.savelink!== 'undefined' && request.savelink){
              
               savelink=request.savelink;
               code=request.code;
               invid=request.invid;
               savedatabtn();
            }
           
        }
       
    });
    const savedatabtn=function(){
      setTimeout(function() {
          var button = document.createElement('button');
          button.className = 'btn relative btn-secondary text-token-text-primary savebtn';
          button.style.display = 'var(--screen-size-hidden-on-compact-mode)';
          button.textContent = "保存数据";
          button.id="savebtn"
          document.body.appendChild(button);
          $(".savebtn").onclick=function(){
            var fullUrl = window.location.href;
            var parsedUrl = new URL(fullUrl);
            var lastPart = parsedUrl.pathname.split('/').pop();
             Converex(lastPart).then(response=>{
                 const lastmsg=response.message.content.parts[0]
                      // 构造要提交的 payload
                  chrome.runtime.sendMessage({
                      type: "save-to-server",
                      payload: {
                            savelink:savelink|| '',
                              code: code || '',
                              invid: invid || '',
                              aireport:lastmsg
                      }
                  });

              })
             setTimeout(() => {
                   // savelink="";
                   // code="";
                   //  invid="";
                    button.remove();
                }, 500);
          }
      }, 1000);

      
      
    }
    // var eventspace = new KeyboardEvent('keydown', {
    //     key: ' ',
    //     code: 'Space',
    //     which: 32,
    //     keyCode: 32,
    //     bubbles: true
    //   });
      
      // 触发键盘事件
  
    const symbol1_class = 'nav.flex';
    let nInterval2 = setInterval(nInterval2Fun,3000);//加载页面窗口
    let nInterval1 = setInterval(Funerval1,30000);//刷新session
    const u = `https://chatgpt.com/api/auth/session`;
   function convertNewlinesToParagraphs(str) {
  // 去除首尾空格并按换行符分割，再过滤掉空行
  const lines = str.trim().split(/\r?\n/).filter(line => line.trim() !== '');
  // 将每行用 <p> 包裹
  return lines.map(line => `<p>${line}</p>`).join('');
}
})();

