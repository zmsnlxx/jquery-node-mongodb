// 声明全局变量
var head_img;
$(document).ready(function () {
    $("#myModal").modal('show');
    $('#myModal').on('hide.bs.modal', function () {
        $(".user_login").fadeIn(1000);
    })
})
// 登录
$(".login").click(function () {
    var user = {
        email: $("#LoginEmail1").val(),
        password: $("#LoginPassword").val()
    }
    console.log(user);
    $.ajax({
        type: "GET", //请求方式
        async: true, //是否异步
        url: "http://localhost:3000/api/user/login",
        data: user, //请求参数
        success: function (data) {
            //请求成功处理，和本地回调完全一样
            console.log('===');
            console.log(data);
            layer.alert(data.message, {
                skin: 'layui-layer-molv' //样式类名
                ,closeBtn: 0
              }, function(){
                if (data.status === 1000) {
                    window.localStorage.setItem("email", $("#LoginEmail1").val())
                    window.location = 'home.html'
                }
              });
        },
        error: function (err) {
            //请求出错处理
            console.log('---');
            console.log(err);
        }
    })
})
// 去注册
$(".go_register").click(function () {
    $(".user_login").fadeOut(1000);
    setTimeout(function () {
        $(".user_register").slideDown("slow");
    }, 1000)
})
// 注册
$(".register").click(function () {
    if ($("#RegisterPassword").val() != $("#RegisterPsw").val()) {
        alert('密码不一致!')
    } else if ($("#RegisterPassword").val().length == 0) {
        alert('请输入密码!')
    } else if (head_img == undefined) {
        alert('上传头像!')
    } else {
        var from_data = {
            email: $("#RegisterEmail").val(),
            password: $("#RegisterPassword").val(),
            name: $("#RegisterName").val(),
            head_img: head_img,
            sex: $('input:radio:checked').val(),
        }
        console.log(from_data);
        $.ajax({
            type: "POST", //请求方式
            async: true, //是否异步
            url: 'http://localhost:3000/api/user/register',
            data: from_data, //请求参数
            success: function (data) {
                layer.alert(data.message, {
                    skin: 'layui-layer-molv' //样式类名
                    ,closeBtn: 0
                  }, function(){
                    var index = layer.alert();
                    layer.close(index);
                    if (data.status == 1000) {
                        $("#RegisterEmail").val('');
                        $("#RegisterPassword").val('');
                        $("#RegisterName").val('');
                        $("#RegisterPsw").val('');
                        $(".user_register").slideUp("slow");
                        setTimeout(function () {
                            $(".user_login").fadeIn(1000);  
                        }, 1000)
                    }
                  });
            },
            error: function (err) {
                //请求出错处理
                console.log('---');
                console.log(err);
            }
        })
    }
})
$(".form-control-static").click(function(){
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
    $(".form-control-static").children().replaceWith(`
        <img class="head_img" style="border-radius: 50%;" src="${head_img}" alt="">
    `);
  };
})