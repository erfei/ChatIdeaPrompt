
const $ = (Selector, el) => (el || document).querySelector(Selector);
const $$ = (Selector, el) => (el || document).querySelectorAll(Selector);

// 建议将此选择器设置为您的目标输入框的通用选择器
const INPUT_SELECTOR = '[data-lexical-editor="true"], [data-slate-editor="true"], textarea, div[contenteditable="true"]';



function inputbase(mycontent) {
  const pattern = /\[\[(.*?)\]\]/g;
  let match;
  const uniqueContentMap = new Map();

  while ((match = pattern.exec(mycontent)) !== null) {
    const content = match[1];
    if (!uniqueContentMap.has(content)) {
      const replacement = prompt(content);
      uniqueContentMap.set(content, replacement || '');
    }
  }

  let replacedText = mycontent.replace(pattern, (_, content) => uniqueContentMap.get(content));

  const inputElement = document.querySelector(INPUT_SELECTOR);
  if (!inputElement) {
    setTimeout(() => inputbase(mycontent), 1000);
    return;
  }

  inputElement.focus();

  if (inputElement.tagName === 'TEXTAREA' || inputElement.tagName === 'INPUT') {
    // 普通输入框
    inputElement.value = replacedText;
    inputElement.dispatchEvent(new Event('input', { bubbles: true }));

  } else if (inputElement.dataset.lexicalEditor) {
    // Lexical 编辑器
    document.execCommand('selectAll');
    const dt = new DataTransfer();
    dt.setData('text/plain', replacedText);
    inputElement.dispatchEvent(new ClipboardEvent('paste', {
      bubbles: true,
      cancelable: true,
      clipboardData: dt,
    }));

  } else if (inputElement.dataset.slateEditor) {
    // Slate 编辑器
    document.execCommand('selectAll');
    const dt = new DataTransfer();
    dt.setData('text/plain', replacedText);
    inputElement.dispatchEvent(new InputEvent('beforeinput', {
      bubbles: true,
      cancelable: true,
      inputType: 'insertFromPaste',
      dataTransfer: dt,
    }));

  } else {
    // 其他 contenteditable
    inputElement.focus();
    document.execCommand('selectAll');
    document.execCommand('insertText', false, replacedText);
  }
}
function inputbasekj(mycontent) {
  const pattern = /\[\[(.*?)\]\]/g;
  let match;
  const uniqueContentMap = new Map();
  while ((match = pattern.exec(mycontent)) !== null) {
    const content = match[1];
    if (!uniqueContentMap.has(content)) {
      const replacement = prompt(content);
      uniqueContentMap.set(content, replacement || '');
    }
  }

  let replacedText = mycontent.replace(pattern, (_, content) => uniqueContentMap.get(content));

  const inputElement = document.querySelector(INPUT_SELECTOR);
  if (!inputElement) {
    setTimeout(() => inputbasekj(mycontent), 1000);
    return;
  }

  // ✅ 用统一方法读取，自动判断元素类型
  let inputstr = getEditorText(inputElement);
  inputstr = inputstr.replace(/\/+$/, '');

  replacedText = replacedText.replaceAll('{{input}}', inputstr);
  replacedText = replacedText.includes(inputstr) ? replacedText : inputstr + replacedText;

  inputElement.focus();

  if (inputElement.tagName === 'TEXTAREA' || inputElement.tagName === 'INPUT') {
    inputElement.value = replacedText;
    inputElement.dispatchEvent(new Event('input', { bubbles: true }));
    inputElement.dispatchEvent(new Event('change', { bubbles: true })); // ✅ 部分框架需要 change 事件

  } else if (inputElement.dataset.lexicalEditor) {
    document.execCommand('selectAll');
    const dt = new DataTransfer();
    dt.setData('text/plain', replacedText);
    inputElement.dispatchEvent(new ClipboardEvent('paste', {
      bubbles: true,
      cancelable: true,
      clipboardData: dt,
    }));

  } else if (inputElement.dataset.slateEditor) {
    inputElement.focus();
    document.execCommand('selectAll');
    const success = document.execCommand('insertText', false, replacedText);
    if (!success) {
      const dt = new DataTransfer();
      dt.setData('text/plain', replacedText);
      inputElement.dispatchEvent(new InputEvent('beforeinput', {
        bubbles: true,
        cancelable: true,
        inputType: 'insertText',
        data: replacedText,
        dataTransfer: dt,
      }));
    }

  } else {
    inputElement.focus();
    document.execCommand('selectAll');
    document.execCommand('insertText', false, replacedText);
  }
}
function getEditorText(inputElement) {
  // ✅ textarea / input 必须用 .value
  if (inputElement.tagName === 'TEXTAREA' || inputElement.tagName === 'INPUT') {
    return inputElement.value.trim();
  }
  // contenteditable 系列用 innerText
  return (inputElement.innerText || inputElement.textContent || '').trim();
}