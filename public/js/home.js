// jQuery扩展全局函数
$.extend({
    // 解码cookie
    DecodeCookie: function (str) {
        var strArr;
        var strRtn = "";
        strArr = str.split("a");
        for (var i = strArr.length - 1; i >= 0; i--) {
            strRtn += String.fromCharCode(eval(strArr[i]));
        }
        return strRtn;
    },
    // 获取cookie
    getCookie: function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return (arr[2]);
        else
            return null;
    },
    // 删除cookie
    delCookie: function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = getCookie(name);
        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    },
    //随机生成id
    setRandomId: function () {
        return Date.now() + "" + Math.floor(Math.random() * 10000);
    },

})
// 声明全局变量;
var user_email = window.localStorage.getItem("email")
$(document).ready(function () {
    var msg = '加载完成!'
    // 进入页面获取登录信息
    getUser();
    // 获取登录用户的英雄信息
    getHero(msg)
})
// 获取登录信息
function getUser() {
    console.log("获取登录信息");
    $.ajax({
        type:"GET",
        url:'http://localhost:3000/api/user/getUserinfo',
        data: {
            email: user_email,
        },
        success: function(data){
            layer.load(0, {shade: false}); //0代表加载的风格，支持0-2
            setTimeout(function(){
                var index = layer.load();
                layer.close(index);
                if(data.data.img){
                    $(".head_img").attr("src",data.data.img)
                }else{
                    $(".head_img").attr("src","./image/头像.png")
                }
                $(".user_name>a").text(data.data.name);
            },1000)
        }
    })
    
}
// 获取英雄信息
function getHero(msg) {
    console.log("获取英雄信息");
    $.ajax({
        type: "GET", 
        url: "http://localhost:3000/api/user/hero",
        data: {
            email: user_email,
        }, 
        success: function (data) {
            console.log(data);
            setTimeout(function () {
                $(".container").show()
                if (data.length === 0) {
                    $(".fff").show()
                    $("tbody>tr").remove();
                } else {
                    $(".fff").hide()
                    $("tbody>tr").remove();
                    data.forEach((e, index) => {
                        $("tbody").append(
                            `<tr data-id="${e.id}">
                                    <td>${index + 1}</td>
                                    <td>${e.hero_class}</td>
                                    <td>${e.name}</td>
                                    <td>${e.synopsis}</td>
                                    <td class="btn-primary change">修改</td>
                                    <td class="btn-danger del">删除</td>
                                </tr>`
                        )
                    })
                }
                if(msg){
                    layer.alert(msg, {
                        skin: 'layui-layer-molv' //样式类名
                        ,closeBtn: 0
                      }, function(){
                        var index = layer.alert();
                        layer.close(index);
                    });
                }
            }, 2000)
        },
        error: function (err) {
            //请求出错处理
            console.log('请求失败');
            console.log(err);
        }
    })
}
// 新增按钮
$(".add").click(function () {
    console.log('新增');
    // 清空模态框内的值
    $('#myModal').modal('show');
    $("#modal-num").val($("tbody>tr").length + 1);
    $("#modal-class").val("");
    $("#modal-heroname").val('');
    $("#modal-synopsis").val('');
})
// 修改按钮
$("tbody").on("click", ".change", function () {
    console.log('修改数据');
    $('#myModal').modal('show');
    var tds = $(this).parent().children();
    // 把取到的值赋给模态框
    $("#modal-num").val(tds.eq(0).text());
    $("#modal-class").val(tds.eq(1).text())
    $("#modal-heroname").val(tds.eq(2).text());
    $("#modal-synopsis").val(tds.eq(3).text());
    // 把tds保存到myModal的data
    $('#myModal').data({
        'tds': tds
    })
})
// 关闭提交模态框时清空tds;如果不清空点一次修改之后再点添加会出错
$('#myModal').on('hide.bs.modal', function () {
    $('#myModal').removeData('tds');
})
// 提交按钮
$(".submit").click(function () {
    // 点击修改时第一步隐藏模态框
    $('#myModal').modal('hide');
    // 第二步从模态框内取值
    var tds = $('#myModal').data('tds');
    console.log(tds);
    if (tds === undefined) {
        var addData = {
            email: user_email,
            id: $.setRandomId(),
            hero_class: $("#modal-class").val(),
            name: $("#modal-heroname").val(),
            synopsis: $("#modal-synopsis").val()
        }
        console.log(addData);
        $.ajax({
            type: "POST", //请求方式
            async: true, //是否异步
            url: "http://localhost:3000/api/user/addHero",
            data: addData, //请求参数
            success: function (data) {
                var index = layer.load(1, {
                    shade: [0.1,'#fff'] //0.1透明度的白色背景
                });
                var msg = "添加成功!"
                getHero(msg);
                setTimeout(function(){
                    if (data.status === 1000) {
                        layer.close(index);
                    }
                },2000)    
                
            },
            error: function (err) {
                //请求出错处理
                console.log('---');
                console.log(err);
            }
        })
    } else {
        console.log('修改');
        var changeData = {
            email: user_email,
            id: tds.parent().data("id").toString(), // 取到每一个tr的id值，针对id值修改数据
            hero_class: $("#modal-class").val(),
            name: $("#modal-heroname").val(),
            synopsis: $("#modal-synopsis").val()
        }
        console.log(changeData);
        $.ajax({
            type: "POST", //请求方式
            async: true, //是否异步
            url: "http://localhost:3000/api/user/setHero",
            data: changeData, //请求参数
            success: function (data) {
                var index = layer.load(1, {
                    shade: [0.1,'#fff'] //0.1透明度的白色背景
                });
                var msg = "修改成功!"
                getHero(msg);
                setTimeout(function(){
                    if (data.status === 1000) {
                        layer.close(index);
                    }
                },2000)    
            },
            error: function (err) {
                //请求出错处理
                console.log('---');
                console.log(err);
            }
        })
    }
})

// 删除按钮
$("tbody").on("click", '.btn-danger', function () {
    console.log($(this).parent().data("id").toString());
    var data = {
        email: user_email,
        id: $(this).parent().data("id").toString()
    }
    console.log(data);
    $.ajax({
        type: "POST",
        url: "http://localhost:3000/api/user/delHero",
        data: data,
        success: function (data) {
            console.log(data);
            var index = layer.load(1, {
                shade: [0.1,'#fff'] //0.1透明度的白色背景
            });
            getHero(data.message);
            setTimeout(function(){
                if (data.status === 1000) {
                    layer.close(index);
                }
            },2000)            
        },
        error: function (err) {
            //请求出错处理
            console.log(err);
        }
    })
})
// 退出登录
$(".delCookie").click(function () {
    $.delCookie("name")
    window.location = "index.html";
})

// 查找
$(".search").click(function () {
    console.log($(".search_val").val());
    var search_text = $(".search_val").val()
    if (search_text.length === 0) {
        layer.alert('请输入关键字!', {
            skin: 'layui-layer-molv' //样式类名
            ,closeBtn: 0
        });
    } else {
        $('tbody tr').hide();
        $("tbody tr:contains(" + search_text + ")").show();
        $(".search_val").val('')
    }
})