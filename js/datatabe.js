var insertid=0;
// 创建数据库

function openDatabase() {
  const dbName = 'chatDatabase';
  const dbVersion =22;
  const request = indexedDB.open(dbName, dbVersion);

  return new Promise((resolve, reject) => {
    request.onerror = function(event) {
      reject('打开数据库失败');
    };

    request.onsuccess = function(event) {
       db = event.target.result;
      resolve(db);
    };

    request.onupgradeneeded = function(event) {
      
      const db = event.target.result;
      // console.log(event.oldVersion);
      if (event.oldVersion < 21) {
        if (db.objectStoreNames.contains('menutaben')) {
                  //迁移数据menutaben
                  const menutabenStore = event.currentTarget.transaction.objectStore('menutaben');
                  const menutabenCursor = menutabenStore.openCursor();
                  menutabenCursor.onsuccess = function(event) {
                    const cursor = event.target.result;
                    if (cursor) {
                      const value = cursor.value;
                      // 修改 value 中的某些字段
                      menutabenStore.put(value);
                      cursor.continue();
                    }
                  };
                 
                 
                  //迁移ask表数据
                  const asktabenStore = event.currentTarget.transaction.objectStore('asktabe');
                  const asktabenCursor = asktabenStore.openCursor();
                  asktabenCursor.onsuccess = function(event) {
                    const cursor = event.target.result;
                    if (cursor) {
                      const value = cursor.value;
                      // 修改 value 中的某些字段
                      menutabasktabenStoreenStore.put(value);
                      cursor.continue();
                    }
                  };
                  const prompttabenStore = event.currentTarget.transaction.objectStore('prompttask');
                  const prompttabenCursor = prompttabenStore.openCursor();
                  prompttabenCursor.onsuccess = function(event) {
                    const cursor = event.target.result;
                    if (cursor) {
                      const value = cursor.value;
                      // 修改 value 中的某些字段
                      prompttabenStore.put(value);
                      cursor.continue();
                    }
                  };

                  const midttabenStore = event.currentTarget.transaction.objectStore('midtabe');
                  const midttabenCursor = midttabenStore.openCursor();
                  midttabenCursor.onsuccess = function(event) {
                    const cursor = event.target.result;
                    if (cursor) {
                      const value = cursor.value;
                      // 修改 value 中的某些字段
                      midttabenStore.put(value);
                      cursor.continue();
                    }
                  };
                  const stpromptStore = event.currentTarget.transaction.objectStore('stprompt');
                  const stpromptCursor = stpromptStore.openCursor();
                  stpromptCursor.onsuccess = function(event) {
                    const cursor = event.target.result;
                    if (cursor) {
                      const value = cursor.value;
                      // 修改 value 中的某些字段
                      stpromptStore.put(value);
                      cursor.continue();
                    }
                  };
        }
       
      }




      // 创建数据表
      // if (db.objectStoreNames.contains('menutaben')) {
      //   db.deleteObjectStore('menutaben'); // Delete the existing object store
      // }
      if (!db.objectStoreNames.contains('menutaben')) {
        const objectStore = db.createObjectStore('menutaben', { keyPath: 'id', autoIncrement: true });
        // 创建索引
        objectStore.createIndex('name', 'name', { unique: false });
        objectStore.createIndex('prid', 'prid', { unique: false });
        objectStore.createIndex('asktype', 'asktype', { unique: false });
        objectStore.createIndex('show', 'show', { unique: false });//是否在列表页可获取
        objectStore.createIndex('nextshow', 'nextshow', { unique: false });//是否在下级列表页可获取
        objectStore.createIndex('hhid', 'hhid', { unique: false });//会话ID
      }
     
      //创建问题优化表
      // if (db.objectStoreNames.contains('asktabe')) {
      //   db.deleteObjectStore('asktabe'); // Delete the existing object store
      // }
      if (!db.objectStoreNames.contains('asktabe')) {
        const objectask = db.createObjectStore('asktabe', { keyPath: 'id', autoIncrement: true });
        objectask.createIndex('ask', 'ask', { unique: false });
        objectask.createIndex('askyh', 'askyh', { unique: false });
      }
    
      //创建问题优化表
      // if (db.objectStoreNames.contains('prompttask')) {
      //   db.deleteObjectStore('prompttask'); // Delete the existing object store
      // }
      if (!db.objectStoreNames.contains('prompttask')) {
        const objecpromptask = db.createObjectStore('prompttask', { keyPath: 'id', autoIncrement: true });
        objecpromptask.createIndex('typeid', 'typeid', { unique: false });
        objecpromptask.createIndex('oldprompt', 'oldprompt', { unique: false });
        objecpromptask.createIndex('prompt', 'prompt', { unique: false });
        objecpromptask.createIndex('sort', 'sort', { unique: false });
        objecpromptask.createIndex('reply', 'reply', { unique: false });
        objecpromptask.createIndex('show', 'show', { unique: false });
        objecpromptask.createIndex('promptTypeIndex', ['prompt', 'typeid'], { unique: false });
      }
    
      //创建Midjourney提示词库
      // if (db.objectStoreNames.contains('midtabe')) {
      //   db.deleteObjectStore('midtabe'); // Delete the existing object store
      // }
      if (!db.objectStoreNames.contains('midtabe')) {
        const objectmid = db.createObjectStore('midtabe', { keyPath: 'id', autoIncrement: true });
        objectmid.createIndex('ask', 'ask', { unique: false });
        objectmid.createIndex('askyh', 'askyh', { unique: false });
      }
    //  if (db.objectStoreNames.contains('stprompt')) {
    //      db.deleteObjectStore('stprompt'); // Delete the existing object store
    //    }
      //创建前缀数据库
      if (!db.objectStoreNames.contains('stprompt')) {
        const objectmid = db.createObjectStore('stprompt', { keyPath: 'id', autoIncrement: true });
        objectmid.createIndex('title', 'title', { unique: false });
        objectmid.createIndex('select', 'select', { unique: false });
      }
    };
  });
}
  
  // 添加数据
  function addData(data,tabname) {
    return openDatabase().then(database => {
      db = database;
      
      const transaction = db.transaction([tabname], 'readwrite');
      const objectStore = transaction.objectStore(tabname);
      const request = objectStore.add(data);
  
      return new Promise((resolve, reject) => {
        request.onsuccess = function(event) {
         
          resolve(event.target.result);
        };
  
        request.onerror = function(event) {
         
          reject(event.target.error);
        };
      });
    }).catch(error => {
      console.log(error);
      throw error;
    });
  }
  
  // 获取数据
  function getData(id, tabname) {
    return new Promise((resolve, reject) => {
      openDatabase()
        .then(database => {
          const transaction = db.transaction([tabname], 'readonly');
          const objectStore = transaction.objectStore(tabname);
          const request = objectStore.get(id);
          request.onsuccess = function(event) {
            const data = event.target.result;
            resolve(data);
          };
  
          request.onerror = function(event) {
            reject(new Error('Failed to get data'));
          };
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  
  

  
  //获取prompt任务列表
function getDatpromptlist(typeid) {
  return new Promise((resolve, reject) => {
    openDatabase().then(database => {
      typeid = typeid?.toString(); // 转换为字符串，确保安全
      const transaction = database.transaction(['prompttask'], 'readonly');
      const objectStore = transaction.objectStore('prompttask');
      const index = objectStore.index('typeid'); // 使用 typeid 索引
      const results = { data: [] };
      //console.log(typeid);
      // 判断是否使用筛选条件
      const range = typeid ? IDBKeyRange.only(typeid) : null;
      index.openCursor(range, 'next').onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
          results.data.push(cursor.value);
          cursor.continue();
        } else {
          // 按 sort 字段降序排列
          results.data.sort((a, b) => b.sort - a.sort);
         // console.log(results);
          resolve(results);
        }
      };
    }).catch(error => {
      reject(error);
    });
  });
}

  function getDatpromptlistasc(typeid) {
    return new Promise((resolve, reject) => {
      openDatabase().then(database => {
        typeid = typeid.toString();
        const transaction = db.transaction(['prompttask'], 'readonly');
        const objectStore = transaction.objectStore('prompttask');
        const index = objectStore.index('typeid');
        const results = { data: [] };
        index.openCursor(IDBKeyRange.only(typeid), 'next').onsuccess = function(event) {
          const cursor = event.target.result;
          if (cursor) {
            results.data.push(cursor.value);
            cursor.continue();
          } else {
            // Sort the results by 'id' field in ascending order
            results.data.sort(function(a, b) {
              return a.id - b.id;
            });
            resolve(results);
          }
        };
      }).catch(error => {
        reject(error);
      });
    });
  }
  
  
  function getDatpromptlist2() {
    return new Promise((resolve, reject) => {
      openDatabase().then(database => {
        const transaction = db.transaction(['prompttask'], 'readonly');
        const objectStore = transaction.objectStore('prompttask');
        const index = objectStore.index('typeid');
        const results = { data: [] };
        index.openCursor(IDBKeyRange.lowerBound(0), 'prev').onsuccess = function(event) {
          const cursor = event.target.result;
          if (cursor) {
            results.data.push(cursor.value);
            cursor.continue();
          } else {
            results.data.sort(function(a, b) {
              return b.sort - a.sort;
            });
            resolve(results);
          }
        };
        transaction.onerror = function(event) {
          reject(event.target.error);
        };
      }).catch(error => {
        reject(error);
      });
    });
  }
  //获取所有优化提示数据
  function getDatasklist() {
    return new Promise((resolve, reject) => {
      openDatabase().then(database => {
        const transaction = db.transaction(['asktabe'], 'readonly');
        const objectStore = transaction.objectStore('asktabe');
        const results = { data: [] }; // Create an empty results object
    
        // Open a cursor to loop through all data in the object store
        objectStore.openCursor(null, 'prev').onsuccess = function(event) {
          const cursor = event.target.result;
  
          if (cursor) {
            results.data.push(cursor.value);
            cursor.continue();
          } else {
            resolve(results);
          }
        };
      }).catch(error => {
        reject(error);
      });
    });
  }
  //获取所有前缀列表
  function getDatstpromptlist() {
    return new Promise((resolve, reject) => {
      openDatabase().then(database => {
        const transaction = db.transaction(['stprompt'], 'readonly');
        const objectStore = transaction.objectStore('stprompt');
        const results = { data: [] }; // Create an empty results object
        // Open a cursor to loop through all data in the object store
        objectStore.openCursor(null, 'prev').onsuccess = function(event) {
          const cursor = event.target.result;
          if (cursor) {
            results.data.push(cursor.value);
            cursor.continue();
          } else {
            resolve(results);
          }
        };
      }).catch(error => {
        reject(error);
      });
    });
  }
  //获取所有生成绘画提示词
  function getDatmidlist() {
    return new Promise((resolve, reject) => {
      openDatabase().then(database => {
        const transaction = db.transaction(['midtabe'], 'readonly');
        const objectStore = transaction.objectStore('midtabe');
        const results = { data: [] }; // Create an empty results object
        // Open a cursor to loop through all data in the object store
        objectStore.openCursor(null, 'prev').onsuccess = function(event) {
          const cursor = event.target.result;
          if (cursor) {
            results.data.push(cursor.value);
            cursor.continue();
          } else {
            resolve(results);
          }
        };
      }).catch(error => {
        reject(error);
      });
    });
  }
  //获取下级数据
  function getDataByCondition(condition) {
    return new Promise((resolve, reject) => {
      openDatabase().then(database => {
        const transaction = db.transaction(['menutaben'], 'readonly');
        const objectStore = transaction.objectStore('menutaben');
        const index = objectStore.index('prid');
        const results = { pid: condition, data: [] };
  
        index.openCursor(IDBKeyRange.only(condition), 'prev').onsuccess = function (event) {
          const cursor = event.target.result;
  
          if (cursor) {
            results.data.push(cursor.value);
            cursor.continue();
          } else {
            resolve(results);
          }
        };
      }).catch(error => {
        reject(error);
      });
    });
  }
  //获取页面可显示菜单列表
  function getDataByconmenu() {
    return new Promise((resolve, reject) => {
      openDatabase().then(database => {
        const transaction = db.transaction(['menutaben'], 'readonly');
        const objectStore = transaction.objectStore('menutaben');
        const index = objectStore.index('show');
        const results = { show: 1, data: [] };
        index.openCursor(IDBKeyRange.lowerBound(1), 'prev').onsuccess = function (event) {
          const cursor = event.target.result;
          if (cursor) {
            const record = cursor.value;
            if (record.show === 1) {
              results.data.push(record);
            }
            cursor.continue();
          } else {
            resolve(results);
          }
        };
      }).catch(error => {
        reject(error);
      });
    });
  }
  
   //更新提问任务
   function updataprompt(id,newData){
    openDatabase().then(database => {
      const transaction = db.transaction(['prompttask'], 'readwrite');
      const objectStore = transaction.objectStore('prompttask');
      const request = objectStore.get(id);
      request.onsuccess = function(event) {
          const data = event.target.result;
          // 更新数据
            if(newData.oldprompt){
              data.oldprompt = newData.oldprompt;
            }
            if(newData.prompt){
              data.prompt = newData.prompt;
              
            }
            if(newData.sort){
              data.sort = newData.sort;
            }
            
            if(newData.reply){
              data.reply = newData.reply;
            }
          const updateRequest = objectStore.put(data);
          updateRequest.onsuccess = function(event) {
          };
          updateRequest.onerror = function(event) {
            console.log(event)
          };
      
      };
    
      request.onerror = function(event) {
       
      };
    }).catch(error => {
     
    });
    
   }
  // 更新数据
  function updateData(id, newData) {
    openDatabase().then(database => {
        const transaction = db.transaction(['menutaben'], 'readwrite');
        const objectStore = transaction.objectStore('menutaben');
        const request = objectStore.get(parseInt(id));
        request.onsuccess = function(event) {
            const data = event.target.result;
            // console.log(data);
            // 更新数据
            if(newData.name){
              data.name = newData.name;
            }
            if(newData.prid){
              data.prid = newData.prid;
            }
            if(newData.hhid){
              data.hhid = newData.hhid;
            }
            const updateRequest = objectStore.put(data);
          
            updateRequest.onsuccess = function(event) {
              
            };
          
            updateRequest.onerror = function(event) {
             
            };
        
        };
      
        request.onerror = function(event) {
         
        };
      }).catch(error => {
       
      });
  }
  //根据问题修改数据
  function updatapromptreply(typeid, prompt, newData) {
    openDatabase()
      .then(database => {
        const transaction = db.transaction(['prompttask'], 'readwrite');
        const objectStore = transaction.objectStore('prompttask');
        
        // 创建索引
     
        
        const index = objectStore.index('promptTypeIndex');
        const request = index.get([prompt, typeid]);
        request.onsuccess = function(event) {
          const data = event.target.result;
          // 更新数据
          if (data) {
            if (newData.reply) {
              data.reply = newData.reply;
            }
            
            const updateRequest = objectStore.put(data);
            updateRequest.onsuccess = function(event) {
              // 更新成功
            };
            updateRequest.onerror = function(event) {
              // 更新失败
            };
          } else {
            // 数据不存在
          }
        };
      
        request.onerror = function(event) {
          // 请求失败
        };
      })
      .catch(error => {
        // 打开数据库失败
        console.log(error)
      });
  }
  
  
  
  // 删除数据
  function deleteData(id, tabname) {
    openDatabase().then(database => {
        const transaction = db.transaction([tabname], 'readwrite');
        const objectStore = transaction.objectStore(tabname);
        const request = objectStore.delete(id);
        console.log(id);
        request.onsuccess = function(event) {
           
        };

        request.onerror = function(event) {
           
        };

        transaction.oncomplete = function(event) {
           
        };
    }).catch(error => {
        console.error("Error opening database:", error);
    });
}
  //批量删除菜单
  function deleteDataByPrid(prid) {
    openDatabase().then(database => {
      const transaction = db.transaction(['menutaben'], 'readwrite');
      const objectStore = transaction.objectStore('menutaben');
      const index = objectStore.index('prid');
      const range = IDBKeyRange.only(prid);
      const request = index.openCursor(range);
      
      request.onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
          objectStore.delete(cursor.primaryKey);
          cursor.continue();
        } else {
         
        }
      };
      
      request.onerror = function(event) {
        
      };
    }).catch(error => {
      console.log(error);
    });
  }
   //批量删除菜单
   function deleteDatasdkByPrid(prid) {
    openDatabase().then(database => {
      const transaction = db.transaction(['prompttask'], 'readwrite');
      const objectStore = transaction.objectStore('prompttask');
      const index = objectStore.index('typeid');
      const range = IDBKeyRange.only(prid);
      const request = index.openCursor(range);
      
      request.onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
          objectStore.delete(cursor.primaryKey);
          cursor.continue();
        } else {
         
        }
      };
      
      request.onerror = function(event) {
        
      };
    }).catch(error => {
      console.log(error);
    });
  }
  //谷歌账号授权
  function googleOAuth2() {
    return new Promise((resolve, reject) => {
      fetch('https://dudube.com/api/userlogin')
      .then(response => response.json())
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });
    });
  }
  //显示提示信息
  function showmesg(msg){
    let errhtml=`  <div class="error-box">
    <span class="close-btn">&times;</span>
    <div class="msgcon">${msg}</div>
  </div>`;
    $("body").prepend(errhtml);
    $('.close-btn').on('click',function(){
      $('.error-box').remove();
    })
    setTimeout(function(){
      $('.error-box').remove();
    },4000);
    
  }
  
  




