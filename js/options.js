let langmessages = {};
let userPermissions ={'canPerAction':false};
(function(){
    const init=function(){
        loadset();
        createmenu();
    }
const options = [
  { id: "Gemini", name: "Gemini" },
  { id: "DouBao", name: "DouBao" },
  { id: "ChatGPT", name: "ChatGPT" },
  { id: "Claude", name: "Claude" },
  { id: "Grok", name: "Grok" },
  { id: "Copilot", name: "Copilot" },
  { id: "QianWen", name: "QianWen" },
  { id: "DeepSeek", name: "DeepSeek" },
];
// console.log(userLang); // zh-CN | en-US
// let message2 = chrome.i18n.getMessage("appName", {locale: "zh_TW"});
//  console.log(message2);
    $(document).on('click', '.bsa-menu a.has-children:not([target])', function (e) {
      e.preventDefault();
      let $a = $(this);
    
      if (!$a.hasClass('open')) {
        $a.addClass('open');
       
      } else {
        $a.removeClass('open');
      }
    });
    //创建菜单
    const createmenu=function(){
      
        getDataByCondition(0).then(results => {
          //创建自定义菜单
          let inserhtml="";
          results.data.forEach(item => {
            inserhtml=`  <li class="frmenu">
            <a  class="has-children" id="pmneru${item.id}" data-id="${item.id}" data-pid=" ${item.prid}" >${item.name}</a>
             
             <span class="addfolder" data-nextshow="${item.nextshow}" data-id="${item.id}" data-type="${item.asktype}" ><i class="bi bi-plus"></i></span>
              <span class="delfolder" data-id="${item.id}"><i class="bi bi-x"></i></span>
            </li>`
            $(inserhtml).insertAfter('.defmenu');
            //生成二级菜单
            getDataByCondition(item.id).then(resultsch => {
              let chhtml=" <ul >";
              if(resultsch.data.length>0){
                 resultsch.data.forEach(li=>{
                  chhtml+=`  <li class="chlist">
                  <span class="chico chdel" data-id="${li.id}"><i class="bi bi-trash"></i></span>
                    <span class="chico chedit" data-id="${li.id}"><i class="bi bi-pencil-fill"></i></span>
                    <a  class="pr loadmod"  data-id="${li.id}" data-pid="${li.prid}"  data-type="${li.asktype}">${li.name}</a>   
                </li>`;
                 });
              }
              chhtml+='</ul>';
              $(chhtml).insertAfter($("#pmneru"+resultsch.pid));
            }).catch(error => {
              console.log(error);
            });
          });
          
          //
        }).catch(error => {
          
        });
      
        getDataByCondition(911111116).then(resultsch => {
          //创建快捷提示菜单
          let inserhtml="";
          let chhtml=" <ul >";

          if(resultsch.data.length>0){
             chhtml+=`  <li class="chlist">
                         
                            
                            <a   class="pr loadmod"  data-id="" data-pid=""  data-type="fast">ALL</a>   
                        </li>`;
             resultsch.data.forEach(li=>{
              chhtml+=`  <li class="chlist">
              <span class="chico chdel" data-id="${li.id}"><i class="bi bi-trash"></i></span>
                <span class="chico chedit" data-id="${li.id}"><i class="bi bi-pencil-fill"></i></span>
                <a  class="pr loadmod"  data-id="${li.id}" data-pid="${li.prid}"  data-type="${li.asktype}">${li.name}</a>   
            </li>`;
            $('#fastmenuSelect1').append(`<option value="${li.id}">${li.name}</option>`);
             });
          }
          chhtml+='</ul>';
          $(chhtml).insertAfter($("#pmneru"+resultsch.pid));
        }).catch(error => {
          
        });
        

       
    }

//添加自定义菜单
$(document).on('click','#craetemenu',function(){
 
  // if(!userPermissions.canPerAction){
  //   showmesg(messages[language]['errmsgup'].message);
  //   return false;
  // }
  let show= $('#typeSelect').find(":selected").data("show");
  let type=$('#typeSelect').val();
  let name=$('#nameInput').val();

  if(name==''){
    name='new document'
  }
  addData({ name:name, prid:0,asktype:type,show:2,nextshow:show},'menutaben').then(insertid => {
    window.location.reload(); // 刷新页面
  })
 
});
   // 调用方法
$(document).on('click','.loadmod',function(){
  let linktype=$(this).data('type');
  let id=$(this).data('id');
  // console.log(id);
  if(linktype===undefined){
    return ;
  }
  if(id!=undefined){
    url=`${linktype}.html?id=${id}`;
  }else{
    url=`${linktype}.html`;
  }
  $('#iframere').attr('src', url);
});


  $(document).on('mouseenter','.frmenu', function() {
    $(this).find('.addfolder,.delfolder').fadeIn(); // 鼠标移入时，淡入显示该span
  });
  
  $(document).on('mouseleave', '.frmenu', function() {
    $(this).find('.addfolder,.delfolder').fadeOut(); // 鼠标移开时，淡出隐藏该span
  });
  $(document).on('mouseenter', '.chlist',function() {
    $(this).find('.chico').fadeIn(); // 鼠标移入时，淡入显示该span
  });
  $(document).on('mouseleave','.chlist', function() {
    $(this).find('.chico').fadeOut(); // 鼠标移开时，淡出隐藏该span
  });
  $(document).on('click','.delfolder',function(){
    //删除菜单
      $(this).parent('.frmenu').remove();
      let id=$(this).data('id');
      deleteData(id,'menutaben');
      deleteDataByPrid(id);
  });
  $(document).on('click','.addfolder',function(){
    //添加下级菜单
        let pid= $(this).data('id');
         let menutype=$(this).data('type');
          let show=$(this).data('nextshow');
         addData({ name: 'new  folder', prid: $(this).data('id') ,asktype:menutype,show:show,hhid:''},'menutaben').then(insertid => {
        var newLi = $(` <li class="chlist">
        <span class="chico chdel" data-id="${insertid}"><i class="bi bi-trash"></i></span>
          <span class="chico chedit"  data-id="${insertid}"><i class="bi bi-pencil-fill"></i></span>
          <a  class="pr loadmod" data-id="${insertid}" data-pid="${pid}" data-type="${menutype}" >new  folder</a>   
      </li>`); // 创建新的li元素
        $(this).prev('ul').prepend(newLi); // 将新的li元素添加到addfolder前面的ul中
        $(this).prev('ul').show();
        //打开页面
        let linktype=menutype;
        let id=insertid;
        // console.log(id);
        if(linktype===undefined){
          return ;
        }
        if(id!=undefined){
          url=`${linktype}.html?id=${id}`;
        }else{
          url=`${linktype}.html`;
        }
        $('#iframere').attr('src', url);
    }).catch(error => {
      //console.log(error);
    });
     
  });

$(document).on('click','.chedit',function(){
  var prElement = $(this).siblings('.pr');
  prElement.attr('contenteditable', true).focus();
});

$(document).on('blur','.pr', function() {
  const id = $(this).data('id');
  const pid=$(this).data('pid');
  const content = $(this).text();
   $(this).removeAttr('contenteditable');
  updateData(id, {name:content,prid:pid});
  
});

$(document).on("click",".chdel",function(){
  $(this).parent('.chlist').remove();
  deleteData($(this).data("id"),'menutaben');
  deleteDatasdkByPrid($(this).data("id"));
})




    $('#language').change(function() {
      // 在这里添加选项更改后的处理代码
      var selectedOption = $(this).children("option:selected").val();
      // console.log(selectedOption)
      chrome.storage.sync.set({ language: selectedOption }, function() {
        window.location.reload(); // 刷新页面
      });

    });
    $('#savesetting').on('click',function(){

        let MODEL_ID= $('#gptmodel').val();
        let API_KEY=$('#APIkeys').val();
        chrome.storage.sync.set({ MODEL_ID: MODEL_ID,API_KEY:API_KEY }, function() {
         
          $("#setingModal").modal("hide");
        });
    })
     const checkboxs = document.querySelectorAll(".opt");
    const loadset=function(){
            // 获取语言选择框和保存按钮元素
            var languageSelect = $('#language');
            // 从 chrome.storage 中获取语言设置，并在页面加载时设置语言选择框的初始值
            chrome.storage.sync.get('language', function(items) {
                if (items.language) {
                    languageSelect. val(items.language);
                    
                }else{
                  let userLang = chrome.i18n.getUILanguage();
                   userLang= userLang.replace(/-/g, "_");
                  
              
                  if(languageSelect.find(`option[value='${userLang}']`).length > 0){
                    languageSelect. val(userLang);
                    chrome.storage.sync.set({ language: userLang }, function() {
                      window.location.reload(); // 刷新页面
                    });
                  }
                }
            });
          const container = document.getElementById("checkbox-container");

          chrome.storage.sync.get(["AIOptions"], (res) => {
             const saved = res.AIOptions;
              options.forEach(opt =>{
                 const div = document.createElement("div");
                  div.className = "checkbox";

                  const label = document.createElement("label");
                  label.className = "block";

                  const checkbox = document.createElement("input");
                  checkbox.type = "checkbox";
                  checkbox.name = "form-field-checkbox";
                  checkbox.id = opt.id;
                  checkbox.value = opt.id;
                  checkbox.className = "ace input-lg opt";

                  // 默认全选 + 读取 storage
                  checkbox.checked = saved ? saved.includes(opt.id) : true;

                  const span = document.createElement("span");
                  span.className = "lbl bigger-120";
                  span.textContent = " " + opt.name;

                  // 拼接结构
                  label.appendChild(checkbox);
                  label.appendChild(span);
                  div.appendChild(label);
                  container.appendChild(div);
                  checkbox.addEventListener("change", saveConfig);
              });
          });
       
        //加载权限
        
    }
    const  saveConfig=function() {
      const checkboxes = document.querySelectorAll(".opt");

      const checkedValues = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

      chrome.storage.sync.set({ AIOptions: checkedValues }, () => {
        
      });
    }
    let promptTextarea1 = document.getElementById("promptTextarea1");

    promptTextarea1.addEventListener("input", function () {
      this.style.height = "auto";
      this.style.height = this.scrollHeight + "px";
    });
    $('#savefast').on('click',function(){
      //保存提示快捷
      let cid=$('#fastmenuSelect1').val();
      let promptcon=$('#promptTextarea1').val();
      // console.log(cid)
      if(cid==null){
        //如果不存在分类则自动创建分类
                addData({ name:'newfast', prid:911111116,asktype:'fast',show:'2'},'menutaben').then(insertid => {
                  cid=insertid;
                  console.log(insertid)
                  addData({typeid:`${insertid}`,prompt:promptcon,sort:999,reply:'',oldprompt:''},'prompttask').then(insertid1=>{
                    $("#promptsave").modal("hide");
                    $('#iframere').attr('src', `fast.html?id=${cid}`);
                  } );
                })
      }else{
        addData({typeid:cid,prompt:promptcon,sort:999,reply:'',oldprompt:''},'prompttask').then(insertid=>{
          $("#promptsave").modal("hide");
          $('#iframere').attr('src', `fast.html?id=${cid}`);
        } );
      }
   
    });
    $(document).on('click','.upgrade',function(){
      window.open(`https://dudube.com/upgrade?lang=${language}`, '_blank'); 
    })
      chrome.runtime.onMessage.addListener(function(request){
        if(request.type=='saveprompt'){
           console.log(request); 
           $('#promptTextarea1').val('{{input}}'+request.prompt);
           $("#promptsave").modal("show");
           //request.prompt
        }
        
    });
    init();
})();


  




