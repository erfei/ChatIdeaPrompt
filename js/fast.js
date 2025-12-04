(function(){
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    // console.log(id); // 输出ID参数的值
   const loadpagdate=function(){
    getDatpromptlist(id).then(results=>{
        let inserhtml="";
        results.data.forEach(item => {
            inserhtml+=` 
            <li class="list-group-item">
            <div class="d-flex justify-content-between">
            <div class="content" data-id="${item.id}" data-sort="${item.sort}" data-reply="${item.reply}" data-oldprompt="${item.oldprompt}">${item.prompt}</div>
            <div class="buttons">
                    <button type="button"    data-id="${item.id}"  class="border-0 bg-transparent delete" >
                        <i class="bi bi-trash bottom-btn "  data-bs-toggle="tooltip" title="删除"  ></i>
                    </button>
                </div>
                </div>
              </li>
            `
          });
          $('.list-group').html(inserhtml);
         
    });
   }
   loadpagdate();
   $(document).on('blur','.content',function(){
    const id = $(this).data('id');
    const content = $(this).text();
    // console.log(content);
    $(this).removeAttr('contenteditable');
    updataprompt(id, {prompt:content});
   })
  // Toggle edit mode on click
  $(document).on('click','.content',function(){
     
    $(this).attr("contenteditable", true).focus();
  });

  // Delete item
  $(document).on('click','.delete',function(){
    let id=$(this).data('id');
    deleteData(id,'prompttask');
     $(this).closest(".list-group-item").remove();
  });

 


  // Add new item
  $(document).on('click','#addBtn',function(){
    var count = $(".list-group").children("li").length+1;
    addData({typeid:id,prompt:'{{input}}',sort:count,reply:'',oldprompt:''},'prompttask').then(insertid=>{
        var newItem = `
        <li class="list-group-item">
            <div class="d-flex justify-content-between">
            <div class="content" data-id="${insertid}" data-sort="${count}" placeholder="" >{{input}}</div>
            <div class="buttons">
                  
                   
                    <button type="button"  data-id="${insertid}"   class="border-0 bg-transparent delete" >
                        <i class="bi bi-trash bottom-btn "  data-bs-toggle="tooltip" title="删除"  ></i>
                    </button>
                </div>
                </div>
        </li>
        `;
        $("#list").prepend(newItem);
       
    } )
 
  })


})();



