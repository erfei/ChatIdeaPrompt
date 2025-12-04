try {
  importScripts('js/datatabe.js', 'js/datatabe.js');
}catch (error) {
  
  // 如果导入失败，可以在这里进行错误处理
}

(function(){
 var lg="";
// 监听消息，当收到打开弹出窗口的消息时，打开一个弹出窗口
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
chrome.runtime.onMessage.addListener(function(request, sender, sendRequest){
	

 //将内容保存到服务器
    if(request.type=="save-to-server"){
        const { savelink, code, invid,aireport } = request.payload;
         console.log(request.payload);
        fetch(savelink, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ code, invid,aireport })
        })
        .then(res => res.json())
        .then(data => {
            console.log("✅ background 提交成功", data);
            // sendResponse({ success: true, data });
        })
     

        return true; // 告诉 Chrome 异步 sendResponse
    }
    if(request.type=="askai"){
      const action = request.action;
      const selecttext = request.setext;
      const savelink=request.savelink;
      const code=request.code;
      const invid=request.invid;
      let targetUrl = "";
     if (action === "savepr") {
        const optionsUrl = chrome.runtime.getURL("html/options.html");
        chrome.tabs.query({}, function (tabs) {
          const existingTab = tabs.find(tab => tab.url === optionsUrl);
          if (existingTab) {
            chrome.tabs.update(existingTab.id, { active: true });
            setTimeout(() => {
              chrome.runtime.sendMessage({ type: 'saveprompt', prompt: selecttext });
            }, 300);
          } else {
            chrome.tabs.create({ url: "html/options.html" }, function () {
              setTimeout(() => {
                chrome.runtime.sendMessage({ type: 'saveprompt', prompt: selecttext });
              }, 800);
            });
          }
        });
        sendResponse({ status: "savepr-done" });
        return true;
      }
      const urlMap = {
    DouBao: "https://www.doubao.com/chat/",
    DeepSeek: "https://chat.deepseek.com/",
    ChatGPT: "https://chatgpt.com/",
     Gemini: "https://gemini.google.com/app",
     Copilot:"https://copilot.microsoft.com/",
     Claude:"https://claude.ai/",
     QianWen:"https://www.qianwen.com/",
     Grok:"https://grok.com/"
    };
     // console.log(selecttext);
     targetUrl = urlMap[action];
     if (!targetUrl) return;
     chrome.tabs.query({}, function (tabs) {
        const existingTab = tabs.find(tab => tab.url && tab.url.startsWith(targetUrl));

      if (existingTab) {
        chrome.tabs.update(existingTab.id, { active: true });
        setTimeout(() => {
          safeTabsSendMessage(existingTab.id, {
            type: 'insertselect',
            acurl: targetUrl,
            prompt: selecttext,
             savelink:savelink,
                  code:code,
                  invid:invid
          }).then(res => {
            console.log("✅ 消息发送成功", res);
          }).catch(err => {
            // console.error("❌ 消息发送失败", err);
          });
        }, 300);
      } else {
        chrome.tabs.create({ url: targetUrl, active: true }, function (newTab) {
          const listener = function (tabId, changeInfo, updatedTab) {
            if (tabId === newTab.id && changeInfo.status === "complete") {
              chrome.tabs.onUpdated.removeListener(listener);
              setTimeout(() => {
                safeTabsSendMessage(newTab.id, {
                  type: 'insertselect',
                  acurl: targetUrl,
                  prompt: selecttext,
                  savelink:savelink,
                  code:code,
                  invid:invid
                }).then(res => {
                  console.log("✅ 消息发送成功", res);
                }).catch(err => {
                  // console.error("❌ 消息发送失败", err);
                });
              }, 1000); // 加载后稍微等一下更保险
            }
          };
          chrome.tabs.onUpdated.addListener(listener);
        });
      }
    });

    // sendResponse({ status: "ok" });
    return true;
    }

    if(request.type=='askmsg'){
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {  
        chrome.tabs.sendMessage(tabs[0].id,request, function(response) {  
         
        });  
     });
     sendRequest({type: "reaskmsg", data: '更新成功'});
    }
    if(request.type=='insertselect'){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {  
          chrome.tabs.sendMessage(tabs[0].id,request, function(response) {  
           
          });  
       });
    }
    if(request.type=='fast'){
        getDataByCondition(911111116).then(resultsch => {
          //  console.log(resultsch);
          sendRequest({type: "fastmenudata",data:resultsch.data});
      })
    }
    //保存提示前缀
    if(request.type=='stpromptsave'){
      addData({title:request.inputtxt,select:0},'stprompt').then(insertid=>{
         
          sendRequest({type: "stpromptdata",data:insertid});
    } )
 
    }
    //删除提示前缀
    if(request.type=='stpromptdel'){
      
      deleteData(parseFloat(request.id),'stprompt');
      
      sendRequest({type: "stpromptdata",data:request.id});
    }
    if(request.type=="fastlist"){
      //获取快捷列表
            getDatpromptlist(request.tid).then(results=>{
                sendRequest({type: "fastlist",data:results.data});
          });
    }
    if(request.type=="stpromptlist"){
      //获取快捷列表
      getDatstpromptlist().then(results=>{
                sendRequest({type: "stpromptlist",data:results.data});
          });
    }
    if(request.type=="askmenu"){
      //获取快捷列表
          getDataByconmenu().then(results=>{
           
                sendRequest({type: "askmenulist",data:results.data});
          });
    }
    if(request.type=="asklistup"){
      //获取快捷列表
      getDatpromptlist(request.tid).then(results=>{

         let asklist=[];
         results.data.forEach(element => {
          asklist.push({ask:element.prompt,send:1,reply:element.reply });
         });
         asklist.reverse();
         chrome.storage.local.set({asklist: asklist}, function() {});
         sendRequest({type: "askload"});
       });
    }

    if(request.type=="savereply"){
        let ask='';
        let reply=''
        updateData(request.cid, {hhid:request.dhid});
      //  console.log(request.dhid)
        for(let value  of  Object.values(request.data)){
          if(value.message){
              if(value.message.author.role=='user')
              {
                //提问
                if(value.message.content.parts[0]!='please continue'){
                  ask=value.message.content.parts[0];
                  reply='';
                }
                continue;
              }
              if(value.message.author.role=='assistant')
              {
                //回答
                reply+=value.message.content.parts[0];
                if(value.message.end_turn){
                  //回答完成，保存
                  // console.log([ask,reply]);
                  updatapromptreply(request.cid,ask,{reply:reply})
                }
              }
             
            }
      }
    }
    return true;
});
//扩展安装完成事件
chrome.runtime.onInstalled.addListener(function() {
 // chrome.runtime.openOptionsPage();
  setTimeout(() => {
    chrome.contextMenus.create({
      id: "savePrompt",
      title: messages['contextMenus_savePrompt'].message,
      contexts: ["selection"],
  });
  // chrome.contextMenus.create({
  //   id: "gochatgpt",
  //   title: messages['contextMenus_gochatgpt'].message,
  //   contexts: ["selection"],
  // });
  }, 1000);

});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "savePrompt") {
    /// console.log(info.selectionText);
     let optionsUrl = chrome.runtime.getURL("html/options.html");
     ///console.log(optionsUrl);
     chrome.tabs.query({}, function(tabs) {
      // 遍历所有标签页
      for (let tab of tabs) {
        // 判断当前标签页是否是选项页
        if (tab.url && tab.url === optionsUrl) {
          // 如果选项页已经打开，则切换到选项页
          chrome.tabs.update(tab.id, { active: true });
          setTimeout(() => chrome.runtime.sendMessage({type:'saveprompt',prompt:info.selectionText}), 300)
          return;
        }
      }
      // 如果选项页没有打开，则创建新的标签页并打开选项页
     
      chrome.tabs.create({url: "html/options.html"});
      setTimeout(() => chrome.runtime.sendMessage({type:'saveprompt',prompt:info.selectionText}), 800)
    });
  }
  // if (info.menuItemId === "gochatgpt") {
  //   chrome.tabs.query({}, function(tabs) {
  //     var targetUrl = 'https://chat.openai.com/';
  //     // 遍历所有标签页
  //     for (let tab of tabs) {
  //       // 判断当前标签页是否是选项页
  //        //  console.log(tab.url);
  //         // 如果选项页已经打开，则切换到选项页
  //         if (tab.url &&tab.url.startsWith(targetUrl)) {
  //           // 如果选项页已经打开，则切换到选项页
  //           chrome.tabs.update(tab.id, { active: true });
  //          // console.log(info.selectionText);
  //            setTimeout(function(){
  //               chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {  
  //                 chrome.tabs.sendMessage(tabs[0].id,{type:'insertselect',prompt:info.selectionText}, function(response) {  
                  
  //                 });  
  //             });
  //            }, 300)
  //           return;
  //         }
        
  //     }
  //     // 如果选项页没有打开，则创建新的标签页并打开选项页
     
  //     chrome.tabs.create({ url: targetUrl, active: true }, function(tab) {
  //       // 监听标签页更新事件
  //       chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  //         // 检查更新的标签页是否为目标标签页
  //         if (tabId === tab.id && changeInfo.status === "complete") {
  //           // 页面加载完毕
           
  //           // 在这里执行你的操作
  //           setTimeout(function(){
  //             chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {  
  //               chrome.tabs.sendMessage(tabs[0].id,{type:'insertselect',prompt:info.selectionText}, function(response) {  
                    
  //                   });  
  //               });
  //           },3000);
            
  //         }
  //       });
  //     });

  //   });
  // }
});
// chrome.commands.onCommand.addListener(function(command) {
//   if (command === "open_context_menu") {
//     // 在这里执行您想要的操作
//     // 例如，打开右键菜单
//     console.log('33333')
//     chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//       var currentTab = tabs[0];
//       // 向当前标签页发送消息，模拟右键菜单点击事件
//       chrome.tabs.sendMessage(currentTab.id, { action: "open_context_menu" });
//     });
     
//   }
// });
  



chrome.action.onClicked.addListener(function() {
  chrome.runtime.openOptionsPage();
});
function safeSendMessage(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        console.error("❌ sendMessage 失败:", chrome.runtime.lastError.message);
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });
}

// 发送到某个 tab 的内容脚本
function safeTabsSendMessage(tabId, message) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });
}
})();




  

  