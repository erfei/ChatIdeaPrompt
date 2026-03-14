
(function(){
    const $ = (Selector, el) => (el || document).querySelector(Selector);
    const $$ = (Selector, el) => (el || document).querySelectorAll(Selector);
    let globalSavelink = '';
    let globalCode = '';
    let globalInvid = '';
    let OPTIONS = [];       
    // 创建气泡主容器
const tooltip = document.createElement('div');
tooltip.id = 'selection-tooltip';
tooltip.innerHTML = `
  <div class="tooltip-trigger">✨ Ask AI</div>
  <div class="tooltip-menu"></div>
`;
document.body.appendChild(tooltip);
const tooltipMenu = tooltip.querySelector(".tooltip-menu");
 // ========== 动态渲染菜单 ==========
  function renderMenu(enabledList) {
    tooltipMenu.innerHTML = ""; // 清空菜单
      // console.log(enabledList);
    OPTIONS.forEach(opt => {
      // console.log(opt.id);
      if (enabledList.includes(opt.id)) {
              // console.log(opt);
        tooltipMenu.insertAdjacentHTML("beforeend", `
          <div class="tooltip-item">
            <a class="tooltip-btn" data-action="${opt.id}" href="javascript:void(0)">
              ${opt.icon} ${opt.name}
            </a>
          </div>
        `);
      }
    });

    // 永远追加 Save
    tooltipMenu.insertAdjacentHTML("beforeend", `
      <div class="tooltip-item">
        <a class="tooltip-btn" data-action="savepr" href="javascript:void(0)">📋 Save</a>
      </div>
    `);
  }

  // ========== 读取用户设置 ==========
  async function loadUserOptions() {
    return new Promise(resolve => {
      chrome.storage.sync.get(["AIOptions"], data => {

        // 默认全选
        if (!data.AIOptions) {
          resolve(OPTIONS.map(o => o.id));
        } else {
          resolve(data.AIOptions);
        }
      });
    });
  }
async function initMenu() {

  // 先加载远程 OPTIONS
  await loadRemoteOptions();

  // 再加载用户设置
  const list = await loadUserOptions();

  renderMenu(list);
}

initMenu();

let hideTimeout = null;
//获取配置
function loadRemoteOptions() {

  return new Promise(resolve => {

    chrome.runtime.sendMessage(
      { type: "getOptions" },
      function(response) {

        if (response && response.type=="getoption") {
          OPTIONS = response.data;
        } else {
          console.error("获取远程配置失败");
        }

        resolve();
      }
    );

  });

}



// 显示提示气泡
function showTooltip() {
  const selection = window.getSelection();
  const text = selection.toString().trim();
  if (text.length === 0) return;

  const range = selection.getRangeAt(0);
  const rects = range.getClientRects();
  if (rects.length === 0) return;

  const lastRect = rects[rects.length - 1];

  const tooltipWidth = tooltip.offsetWidth || 200;
  const left = lastRect.left + (lastRect.width / 2) - (tooltipWidth / 2);
  const top = lastRect.bottom + 30; // 下方 50 像素

  tooltip.style.left = `${Math.max(0, left + window.scrollX)}px`;
  tooltip.style.top = `${top + window.scrollY}px`;
  tooltip.style.display = 'block';
}
function showTooltip2() {
  const selection = window.getSelection();
  const text = selection.toString().trim();
  if (text.length === 0) return;

  const range = selection.getRangeAt(0);
  const rects = range.getClientRects();
  if (rects.length === 0) return;

  const rect = rects[0]; // 也可以尝试取 rects[rects.length -1]

  const tooltipWidth = tooltip.offsetWidth || 200;
  const left = rect.left + (rect.width / 2) - (tooltipWidth / 2) + window.scrollX;
  const top = rect.bottom + 10 + window.scrollY; // 比之前 30 少一点，试试更贴近选中内容

  tooltip.style.position = 'absolute'; // 确保绝对定位
  tooltip.style.left = `${Math.max(0, left)}px`;
  tooltip.style.top = `${top}px`;
  tooltip.style.display = 'block';

 // console.log(`Tooltip定位到: left=${left}, top=${top}`);
}
window.addEventListener('trigger-ai-tooltip', () => {
   
   const  { savelink, code, invid } = event.detail;
    globalSavelink = savelink;
    globalCode = code;
    globalInvid = invid;
  showTooltip2(); // 🔥 你自己原来的函数
});


// 隐藏气泡
function hideTooltip() {
  tooltip.style.display = 'none';
}

// 悬停处理：防止闪烁
tooltip.addEventListener('mouseenter', () => {
  clearTimeout(hideTimeout);
  tooltip.classList.add('show-menu');
});

tooltip.addEventListener('mouseleave', () => {
  hideTimeout = setTimeout(() => {
    tooltip.classList.remove('show-menu');
    //hideTooltip();
  }, 300);
});
tooltip.querySelector('.tooltip-trigger').addEventListener('click', () => {
  tooltip.classList.toggle('show-menu');
});
// 监听文字选择变化
let tooltipTimer = null;

document.addEventListener('mouseup', () => {
  clearTimeout(tooltipTimer); // 清除之前的定时器
  const selection = window.getSelection().toString().trim();

  if (selection.length > 0) {
    tooltipTimer = setTimeout(showTooltip, 500); // 延迟 1 秒显示
  } else {
    hideTooltip();
  }
});

document.addEventListener('selectionchange', () => {
  const selection = window.getSelection().toString().trim();
  if (selection.length === 0) {
    clearTimeout(tooltipTimer);
    hideTooltip();
  }
});

tooltip.addEventListener('click', (e) => {
  var target = e.target.closest('.tooltip-btn');
  if (!target) return;
  var action = target.dataset.action;
  const selectedText = window.getSelection().toString().trim();
   //alert(globalSavelink+"|"+globalCode+"|"+globalInvid)
  if (!selectedText) {
   
    return;
  }
   const message = {
        type: "askai",
        action: action,
        setext: selectedText
    };
     if (typeof globalSavelink !== 'undefined' && globalSavelink) {
        message.savelink = globalSavelink;
        message.code = globalCode;
        message.invid = globalInvid;
    }
  
   chrome.runtime.sendMessage(message, function(response) {
            
         });
   globalSavelink="";
   globalCode="";
   globalInvid="";
});
})()

