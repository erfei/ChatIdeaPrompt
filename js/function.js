const $ = (Selector, el) => (el || document).querySelector(Selector);
const $$ = (Selector, el) => (el || document).querySelectorAll(Selector);

// 建议将此选择器设置为您的目标输入框的通用选择器
const INPUT_SELECTOR = 'textarea, div[contenteditable="true"]'; 

/**
 * 处理模板，清空原有内容，然后将新内容整体输入。
 * @param {string} mycontent 包含 [[模板]] 和 {{input}} 占位符的文本。
 */
function inputbase(mycontent) {
    let oldconet=mycontent;
    const pattern = /\[\[(.*?)\]\]/g;
    let match;
    const uniqueContentMap = new Map();

    // 1. 处理 [[模板]] 替换
    while ((match = pattern.exec(mycontent)) !== null) {
        const content = match[1];
        if (!uniqueContentMap.has(content)) {
            const replacement = prompt(`${content}`);
            uniqueContentMap.set(content, replacement || '');
        }
    }

    // 2. 替换 [[内容]] 为对应的用户输入
    let replacedText = mycontent.replace(pattern, (_, content) => uniqueContentMap.get(content));

    // 3. 查找输入元素
    const inputElement = $(INPUT_SELECTOR);

    if (!inputElement) {
        setTimeout(() => {
            inputbase(mycontent);
        }, 1000);
        return;
    }
    
    // 4. 获取当前内容 (用于处理 {{input}} 占位符)
    let currentInputContent = '';
    
    if (inputElement.tagName === 'TEXTAREA' || inputElement.tagName === 'INPUT') {
        // Textarea/Input 使用 .value
        currentInputContent = inputElement.value;
    } else if (inputElement.isContentEditable) {
        // ContentEditable 使用 .textContent
        currentInputContent = inputElement.textContent;
    }
    
    // 替换 {{input}}
    replacedText = replacedText.replaceAll('{{input}}', currentInputContent.trim().replace(/\/+$/, ""));
    
    // 5. 聚焦元素
    inputElement.focus();

    // --- 整体替换逻辑 ---
    
    // A. 针对 <textarea> 或 <input>
    if (inputElement.tagName === 'TEXTAREA' || inputElement.tagName === 'INPUT') {
        
        // 1. 清空内容
        inputElement.value = ''; 
        
        // 2. 设置新内容
        inputElement.value = replacedText;
        
        // 触发事件以更新框架状态 (如 Vue/React)
        inputElement.dispatchEvent(new Event('input', { bubbles: true }));

    } 
    // B. 针对 contenteditable 元素 (如 div, p)
    else if (inputElement.isContentEditable) {
        
        // 1. 清空内容 (使用 innerHTML 确保清除所有 DOM 节点)
        inputElement.innerHTML = ''; 
        
        // 2. 设置新内容
        // 注意：这里使用 innerHTML 方便插入可能包含 HTML 标签的内容，例如换行符 <br>
        inputElement.innerHTML = replacedText;
        
        // 触发事件以更新框架状态
        inputElement.dispatchEvent(new Event('input', { bubbles: true }));
        
        // 3. 将光标移到文本末尾 (确保用户可以立即继续输入)
        // 这一步对于富文本编辑器很重要，因为设置 innerHTML 不会自动移动光标
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(inputElement);
        range.collapse(false); // false 表示折叠到末尾
        sel.removeAllRanges();
        sel.addRange(range);
        
    } else {
        console.warn("元素类型不支持整体内容替换操作。", inputElement);
    }
}
