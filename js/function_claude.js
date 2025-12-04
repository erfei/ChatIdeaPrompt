const $ = (Selector, el) => (el || document).querySelector(Selector);
const $$ = (Selector, el) => (el || document).querySelectorAll(Selector);

// Claude 输入框选择器（基于实际 DOM 结构）
const INPUT_SELECTOR = 'div[data-testid="chat-input"]';

/**
 * 处理模板，清空原有内容，然后将新内容整体输入。
 * 专门优化 Claude 的 Tiptap/ProseMirror 编辑器兼容性。
 * @param {string} mycontent 包含 [[模板]] 和 {{input}} 占位符的文本。
 */
function inputbase(mycontent) {
    const pattern = /\[\[(.*?)\]\]/g;
    const uniqueContentMap = new Map();
    
    // 1. 处理 [[模板]] 替换
    let match;
    while ((match = pattern.exec(mycontent)) !== null) {
        const content = match[1];
        if (!uniqueContentMap.has(content)) {
            const replacement = prompt(`请输入 ${content} 的内容:`);
            uniqueContentMap.set(content, replacement || '');
        }
    }
    
    // 2. 查找输入元素
    const inputElement = $(INPUT_SELECTOR);
    if (!inputElement) {
        console.error("❌ 未找到 Claude 输入框");
        alert("未找到输入框，请确保在 Claude 对话页面使用此脚本");
        return;
    }
    
    // 3. 获取当前内容 (用于处理 {{input}} 占位符)
    // 获取 <p> 标签内的文本内容，忽略 placeholder
    const paragraph = $('p', inputElement);
    let currentInputContent = '';
    if (paragraph && !paragraph.classList.contains('is-empty')) {
        currentInputContent = paragraph.textContent || '';
    }
    
    // 4. 替换占位符
    let replacedText = mycontent.replace(pattern, (_, content) => uniqueContentMap.get(content));
    replacedText = replacedText.replaceAll('{{input}}', currentInputContent.trim().replace(/\/+$/, ""));
    
    // 5. 聚焦元素
    inputElement.focus();
    
    // === Claude Tiptap/ProseMirror 编辑器专用处理方法 ===
    
    try {
        // 步骤 1: 清空内容
        // 选中所有内容
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(inputElement);
        selection.removeAllRanges();
        selection.addRange(range);
        
        // 删除选中的内容
        document.execCommand('delete', false, null);
        
        // 步骤 2: 逐字符插入新内容
        // 这是兼容 Tiptap/ProseMirror 的关键
        for (let i = 0; i < replacedText.length; i++) {
            const char = replacedText[i];
            
            // 处理换行符
            if (char === '\n') {
                // 插入换行
                document.execCommand('insertParagraph', false, null);
                continue;
            }
            
            // 触发 beforeinput 事件（Tiptap 监听此事件）
            const beforeInputEvent = new InputEvent('beforeinput', {
                bubbles: true,
                cancelable: true,
                inputType: 'insertText',
                data: char
            });
            inputElement.dispatchEvent(beforeInputEvent);
            
            // 插入字符
            document.execCommand('insertText', false, char);
            
            // 触发 input 事件
            const inputEvent = new InputEvent('input', {
                bubbles: true,
                cancelable: false,
                inputType: 'insertText',
                data: char
            });
            inputElement.dispatchEvent(inputEvent);
        }
        
        // 步骤 3: 触发最终的事件，确保编辑器状态更新
        inputElement.dispatchEvent(new Event('input', { bubbles: true }));
        inputElement.dispatchEvent(new Event('change', { bubbles: true }));
        
        // 步骤 4: 将光标移到末尾
        const finalRange = document.createRange();
        const sel = window.getSelection();
        finalRange.selectNodeContents(inputElement);
        finalRange.collapse(false); // 折叠到末尾
        sel.removeAllRanges();
        sel.addRange(finalRange);
        
        console.log("✅ 内容已成功输入到 Claude 编辑器");
        
    } catch (error) {
        console.error("❌ 输入过程出错:", error);
        
        // 备用方案：直接设置 paragraph 的内容
        const paragraph = $('p', inputElement) || inputElement;
        
        // 清除 is-empty 类
        paragraph.classList.remove('is-empty', 'is-editor-empty');
        
        // 设置文本内容
        paragraph.textContent = replacedText;
        
        // 移除 <br> 标签
        const br = $('br.ProseMirror-trailingBreak', paragraph);
        if (br) br.remove();
        
        // 触发事件
        inputElement.dispatchEvent(new Event('input', { bubbles: true }));
        inputElement.dispatchEvent(new Event('change', { bubbles: true }));
        
        console.warn("⚠️ 使用了备用输入方案");
    }
}
