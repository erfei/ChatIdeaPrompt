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

            `;
            document.body.insertAdjacentHTML('beforeend', html);
            closefastbind();
            fastmenubind();
            selectfastbind();
          
            showfastbind();
            openfastbind();
       
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
    
 
   



      

 

    const inputEvent = new Event('input', {
        bubbles: true,
        cancelable: true
      });

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

