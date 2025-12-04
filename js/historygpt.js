
    let myAuth;
    async function Auth(){
        async function getAuth (){
            const controller = new AbortController();
            const signal = controller.signal;
    
            const timeout = setTimeout(() => {
                controller.abort();
            }, 5000);
            try{
                const response = await fetch(
                    "https://chatgpt.com/api/auth/session?stop=true",
                    {
                        method: "GET",
                        headers: {
                            "content-type": "application/json",
                        },
                        signal,
                    }
                );
                clearTimeout(timeout);
                
                if (response.ok) {
                    return response.json();
                } else {
                  
                    return Promise.reject(response);
                }
            }catch(error){
                return Promise.reject(error); 
            }
        }
        getAuth().then(result=>{
            myAuth = result?.accessToken
            if (myAuth) {
               
            }
        })
    } 
    Auth();

    //获取所有对话
    async function allConver(){
        const regex = /^https:\/\/chat\.openai\.com\/c\/([a-f\d-]+)$/;

        // 获取当前页面链接
        const currentUrl = window.location.href;

        // 匹配正则表达式
        const match = currentUrl.match(regex);

        // 如果匹配成功，则表示链接格式正确
        let thread;
        if (match !== null) {
        // 获取可变参数
        const variableParam = match[1];
            thread =await getConversation(variableParam);
            //console.log(thread)
            return {dhlist:thread["mapping"],dhid:variableParam};
            // console.log(thread)
            // //需要保存最新对话到数据库
            // savenewhh(thread);
        } else {
           
            let newhh= await getconversationsbackend();
            let newseid=newhh.items[0].id;
            thread=await getConversation(newseid);
           

          return {dhlist:thread["mapping"],dhid:newseid};
            // console.log(thread);
            // savenewhh(thread);
           
        }
    }
    async function allConverex(id){
        let thread;
        thread =await getConversation(id);
        return {dhlist:thread["mapping"],title:thread["title"]};
    }
    async function Converex(id){
         let thread;
        thread =await getConversation(id);
         const last= convoTolast(thread);
        return last;
    }
    ///获取最新3条对话
    async function nowConversation(){
        // 定义一个正则表达式
            const regex = /^https:\/\/chat\.openai\.com\/c\/([a-f\d-]+)$/;

            // 获取当前页面链接
            const currentUrl = window.location.href;

            // 匹配正则表达式
            const match = currentUrl.match(regex);

            // 如果匹配成功，则表示链接格式正确
            let thread;
            if (match !== null) {
            // 获取可变参数
            const variableParam = match[1];
                thread =convoToTree(await getConversation(variableParam));
                return  {dhlist:thread,dhid:variableParam};
                // console.log(thread)
                // //需要保存最新对话到数据库
                // savenewhh(thread);
            } else {
               
                let newhh= await getconversationsbackend();
                let newseid=newhh.items[0].id;
                thread=convoToTree(await getConversation(newseid));
                return  {dhlist:thread,dhid:newseid};
                // console.log(thread);
                // savenewhh(thread);
               
            }
            
    }

    async function Conversationlast(){
        // 定义一个正则表达式
            const regex = /^https:\/\/chatgpt\.com\/c\/([a-f\d-]+)$/;

            // 获取当前页面链接
            const currentUrl = window.location.href;

            // 匹配正则表达式
            const match = currentUrl.match(regex);

            // 如果匹配成功，则表示链接格式正确
            let thread;
            if (match !== null) {
            // 获取可变参数
            const variableParam = match[1];
                thread =convoTolast(await getConversation(variableParam));
                return thread;
                // console.log(thread)
                // //需要保存最新对话到数据库
                // savenewhh(thread);
            } else {
               
                let newhh= await getconversationsbackend();
                let newseid=newhh.items[0].id;
                thread=convoTolast(await getConversation(newseid));
                return thread;
                // console.log(thread);
                // savenewhh(thread);
               
            }
            
    }
    function convoTolast(obj){
        const messages = obj["mapping"]
        let lastNode = findLastChild(obj.current_node, messages);
        return lastNode;
    }
    function convoToTree(obj) {
        const messages = obj["mapping"]
        let lastNode = findLastChild(obj.current_node, messages);
        let lastNode1 = findLastTwoNodes(lastNode.parent, messages);
        let last3node= findLastThreeNodes(lastNode1[0].parent,messages);
        return last3node; 
    }
 

    function findLastThreeNodes(startingNodeId, tree) {
        let currentNode = tree[startingNodeId];
        let parent;
        let grandParent;
        while (currentNode.children.length > 0) {
          grandParent = parent;
          parent = currentNode;
          currentNode = tree[currentNode.children[0]];
        }
        return [grandParent,parent,currentNode];
      }

    function findLastTwoNodes(startingNodeId, tree) {
        let currentNode = tree[startingNodeId];
        let parent;
        while (currentNode.children.length > 0) {
          parent = currentNode;
          currentNode = tree[currentNode.children[0]];
        }
        return [parent,currentNode];
      }
    function findLastChild(startingNodeId, tree) {
        let currentNode = tree[startingNodeId];
        while (currentNode.children && currentNode.children.length > 0) {
          currentNode = tree[currentNode.children[currentNode.children.length - 1]];
        }
        return currentNode;
      }
    function getconversationsbackend(Token=myAuth){
        return fetch(`https://chatgpt.com/backend-api/conversations?offset=0&limit=1&order=updated`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                Authorization: Token,
            },
        }).then((response) => {
                
                if (response.ok) {
                    return response.json();
                }
                 return Promise.reject(response);
        })
    }
    function getconversations(Token=myAuth){
        return fetch(`https://chatgpt.com/backend-api/conversations?offset=0&limit=100&order=updated`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                Authorization: Token,
            },
        }).then((response) => {
                
                if (response.ok) {
                    return response.json();
                }
                 return Promise.reject(response);
        })
    }
    function getConversation(id,Token=myAuth){
       
        return fetch(`https://chatgpt.com/backend-api/conversation/${id}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                Authorization: Token,
            },
        }).then((response) => {
                
                if (response.ok) {
                    return response.json();
                }
                 return Promise.reject(response);
        })
    }

 
