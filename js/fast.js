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
                  <button type="button"    data-id="${item.id}" data-typeid="${item.typeid}" data-prompt="${item.prompt}"   class="border-0 bg-transparent edit" >
                              <i class="bi bi-pencil-fill bottom-btn "  data-bs-toggle="tooltip"   ></i>
                  </button>
                    <button type="button"    data-id="${item.id}"  class="border-0 bg-transparent delete" >
                        <i class="bi bi-trash bottom-btn "  data-bs-toggle="tooltip"   ></i>
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
   // $(document).on('blur','.content',function(){
   //  const id = $(this).data('id');
   //  const content = $(this).text();
   //  // console.log(content);
   //  $(this).removeAttr('contenteditable');
   //  updataprompt(id, {prompt:content});
   // })
  // Toggle edit mode on click
  // $(document).on('click','.content',function(){
     
  //   $(this).attr("contenteditable", true).focus();
  // });

  // Delete item
  $(document).on('click','.delete',function(){
    let id=$(this).data('id');
    deleteData(id,'prompttask');
     $(this).closest(".list-group-item").remove();
  });

  $(document).on('click','.edit',function(){
    let id=$(this).data('id');

    let typeid=$(this).data('typeid');
    let prompt=$(this).data('prompt');
      $('#id').val(id);
      $('#promptTextarea1').val(prompt);
      $("#fastmenuSelect1").empty();
       $("#promptsave").modal("show");
        getDataByCondition(911111116).then(resultsch => {
          //创建快捷提示菜单
          if(resultsch.data.length>0){
             resultsch.data.forEach(li=>{
                  if(li.id===typeid){
                        $('#fastmenuSelect1').append(`<option value="${li.id}" selected >${li.name}</option>`);
                  }else{
                      $('#fastmenuSelect1').append(`<option value="${li.id}" >${li.name}</option>`);
                  }
                
             });
          }
        }).catch(error => {
          
        });
  });


  // Add new item
  $(document).on('click','#addBtn',function(){
    $("#promptsave").modal("show");
      $('#promptTextarea1').val('{{input}}');
      $('#id').val("");
      $("#fastmenuSelect1").empty();
     getDataByCondition(911111116).then(resultsch => {
          //创建快捷提示菜单
          if(resultsch.data.length>0){
             resultsch.data.forEach(li=>{
            $('#fastmenuSelect1').append(`<option value="${li.id}" >${li.name}</option>`);
             });
          }
        }).catch(error => {
          
        });
    // var count = $(".list-group").children("li").length+1;
    // addData({typeid:id,prompt:'{{input}}',sort:count,reply:'',oldprompt:''},'prompttask').then(insertid=>{
    //     var newItem = `
    //     <li class="list-group-item">
    //         <div class="d-flex justify-content-between">
    //         <div class="content" data-id="${insertid}" data-sort="${count}" placeholder="" >{{input}}</div>
    //         <div class="buttons">
                  
                   
    //                 <button type="button"  data-id="${insertid}"   class="border-0 bg-transparent delete" >
    //                     <i class="bi bi-trash bottom-btn "  data-bs-toggle="tooltip" title="删除"  ></i>
    //                 </button>
    //             </div>
    //             </div>
    //     </li>
    //     `;
    //     $("#list").prepend(newItem);
       
    // } )
 
  })

    $('#savefast').on('click',function(){
      //保存提示快捷
      let cid=$('#fastmenuSelect1').val();
      let id=$('#id').val();
      if(id!==''){
          
          let promptcon=$('#promptTextarea1').val();
          updataprompt(Number(id),{prompt:promptcon,typeid:`${cid}`});
          $("#promptsave").modal("hide");
          window.location.href =  `fast.html?id=${cid}`;
      }else{
             let promptcon=$('#promptTextarea1').val();
                  // console.log(cid)
                  if(cid==null){
                    //如果不存在分类则自动创建分类
                            addData({ name:'newfast', prid:911111116,asktype:'fast',show:'2'},'menutaben').then(insertid => {
                              cid=insertid;
                              console.log(insertid)
                              addData({typeid:`${insertid}`,prompt:promptcon,sort:999,reply:'',oldprompt:''},'prompttask').then(insertid1=>{
                                $("#promptsave").modal("hide");
                                window.location.href =  `fast.html?id=${cid}`;
                                
                              } );
                            })
                  }else{
                    addData({typeid:cid,prompt:promptcon,sort:999,reply:'',oldprompt:''},'prompttask').then(insertid=>{
                      $("#promptsave").modal("hide");
                      window.location.href =  `fast.html?id=${cid}`;
                    } );
                  }
      }
     
   
    });
})();



