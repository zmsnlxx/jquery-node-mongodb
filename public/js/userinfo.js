
// 声明全局变量;
var user_email = window.localStorage.getItem("email")

$(document).ready(function(){
    $(".div").slideDown("slow");
    setUserInfo()
})
// 获取用户信息
function getUserInfo(){
    console.log('执行了getUserInfo');
    var data = {
        email:user_email
    }
    // 这里本可以直接把请求到的数据在页面进行展示；但是我想要这个方法只是用来获取数据的，不做其他的操作；
    // 所以我用到了promise函数，把页面展示功能放在promise函数的.then方法里操作！
    var promise = new Promise((resolve,reject) => {
        $.ajax({
            type: "GET", //请求方式
            async: true, //是否异步
            url: "http://localhost:3000/api/user/getUserinfo",
            data: data,
            success: function (data) {
                resolve(data)
            },
            error: function(err){
                reject(err)
            }
        })
    })
    return promise;
}
// 把用户信息进行展示
function setUserInfo(){
    console.log('执行了setUuserInfo');
    getUserInfo().then((data) => {
        console.log(data);
        $(".email").text(data.data.email)
        if(!data.data.signature){
            $(".signature").text("You're handsome and you haven't left anything ...")
        }else{
            $(".signature").text(data.data.signature)
        };
        if(!data.data.hobby){
            $(".hobby").text("say your hobbies ...")
        }else{
            $(".hobby").text(data.data.hobby)
        };
        if(!data.data.sex){
            $(".sex").text("boy or gril?")
        }else if(data.data.sex == "female"){
            $(".sex").text("女孩")
        }else{
            $(".sex").text("男孩")
        };
        if(!data.data.img){
            $(".head_img").attr("src",'./image/头像.png')
        }else{
            $(".head_img").attr("src",data.data.img)
        };
        if(!data.data.name){
            $(".name").text('your name ...')
        }else{
            $(".name").text(data.data.name)
        };
    })
}
function changeLabel(){
    $(".name").html("<input class='form-control name' type='text'></input>");
    $(".sex").html(`<div class='radio'>
                        <label>
                            <input type='radio' name="optionsRadios" id='male' value='male' checked>男
                        </label>
                        <label>                            
                            <input type='radio' name="optionsRadios" id='female' value='female'>女
                        </label>
                    </div>`);
    $(".hobby").html("<input class='form-control hobby' type='text'></input>");
    $(".signature").html("<textarea class='form-control signature' rows='1'></textarea>");
    $(".btn-default").hide();
    $(".btn-primary").show();
}
// 点击修改按钮
$(".btn-default").click(function(){
    // 获取用户信息值要放在修改标签方法之前;不然值为空
    var name = $(".name").text();
    var sex = $('.sex').text();
    var hobby = $(".hobby").text();
    var signature = $(".signature").text();
    var head_img = $(".head_img")[0].src;
    console.log(sex);
    console.log(head_img);
    changeLabel();
    $(".name").val(name);
    $(".hobby").val(hobby);
    $(".signature").val(signature);
    $(".head_img").attr("src",head_img);
    if(sex === "女孩"){
        $("input[id='female']").attr("checked",true)
    }else if(sex === "男孩"){
        $("input[id='male']").attr("checked",true)
    }else{
        $("input[id='male']").attr("checked",true)
    }
    $('input:radio:checked').val(sex);
    $(".btn-primary").text("提交")
})
// 点击提交按钮
$(".btn-primary").click(function(e){
    console.log('---');
    console.log($("input.name").val());
    var userInfo = {
        email: $(".email").text(),
        name: $("input.name").val(),
        img: $(".head_img")[0].src,
        sex: $('input:radio:checked').val(),
        hobby: $("input.hobby").val(),
        signature: $("textarea.signature").val(),
    }
    console.log(userInfo);
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/api/user/setUserInfo",
        data: userInfo,
        success: function (data) {
            layer.alert(data.message, {
                skin: 'layui-layer-molv' //样式类名
                ,closeBtn: 0
              });
            setUserInfo()
            $(".btn-primary").hide();
            $(".btn-default").show();
        },
        error: function(err){
            console.log(err);
        }
    })
})
// 
$(".form-control-static").on("click",".head_img",function(e){
    $("#exampleInputFile").click();
})
$("#exampleInputFile").change(function(e){
    console.log(e);
    var $target = e.target || e.srcElement;
  console.log($target);
  var file = $target.files[0];
  console.log(file);
  var type = file.type.split("/")[0];
  console.log(type);
  // console.log(type);
  if (type != "image") {
    console.log("请上传图片");
    return;
  }
  var size = Math.round(file.size / 1024 / 1024);
  if (size > 3) {
    alert("图片大小不得超过3M");
    return;
  }
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function(e) {
    head_img = this.result;
    $(".head_img").attr("src",this.result)
  };
})

