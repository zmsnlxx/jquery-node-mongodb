var user = require("./db");
var express = require("express");
var router = express.Router();


// 自定义一些方法
// cookie编码程序
function CodeCookie(str) {
    var strRtn = "";

    for (var i = str.length - 1; i >= 0; i--) {
        strRtn += str.charCodeAt(i);
        if (i) strRtn += "a"; //用a作分隔符
    }
    return strRtn;
}

// 注册
router.post("/api/user/register", (req, res) => {
    user.Register.findOne({
            email: req.body.email
        },
        (err, data) => {
            if (data) {
                res.send({
                    status: 1001,
                    message: '账号已注册!'
                })
            } else {
                var newUser = new user.Register({
                    email: req.body.email,
                    name: req.body.name,
                    password: req.body.password,
                    hobby: '',
                    img: req.body.head_img,
                    signature:'',
                    sex:req.body.sex,
                });
                newUser.save(function (err) {
                    if (!err) {
                        res.send({
                            status: 1000,
                            message: "账号注册成功!"
                        });
                    } else {
                        res.send({
                            status: 1002,
                            message: "账号注册失败!",
                            data: err
                        });
                    }
                });
            }
        }
    )
})

// 登录接口
router.get("/api/user/login", (req, res) => {
    user.Register.findOne({
            email: req.query.email
        },
        (err, data) => {
            if (data) {
                if (req.query.password === data.password) {
                    res.cookie("name", CodeCookie(data.name), {
                        //有效期，单位是秒
                        maxAge: 1000 * 24 * 60 * 60
                    });
                    res.send({
                        status: 1000,
                        message: '登录成功!'
                    })
                } else {
                    res.send({
                        status: 1001,
                        message: '密码错误!'
                    })
                }
            } else {
                res.send({
                    status: 1001,
                    message: '账号未注册,请注册!'
                })
            }
        }
    )
});

// 获取用户信息
router.get("/api/user/getUserinfo",(req, res) => {
    user.Register.findOne({
        email:req.query.email
    },(err,data) => {
        if(data){
            res.send({
                status:1000,
                data:data
            })
        }else{
           res.send(err)
        }
    })
})

// 获取所有英雄信息
router.get("/api/user/hero", (req, res) => {
    console.log(req.query.email);
    user.Register.findOne(
        {email: req.query.email},
        function (err, data) {
            if (data) {
                res.send(data.hero)
            }else{
                console.log(err);
            }
        }
    )
})



// 新增英雄
router.post("/api/user/addHero", (req, res) => {
    var hero = {
        id: req.body.id,
        hero_class: req.body.hero_class,
        name: req.body.name,
        synopsis: req.body.synopsis,
    }
    // console.log(hero);
    user.Register.updateOne({
        email: req.body.email
    }, {
        $push: {
            hero: hero
        }
    }, (err, data) => {
        if (data) {
            res.send({
                status: 1000
            });
        }
    })
})

// 删除英雄
router.post("/api/user/delHero", (req, res) => {
    // console.log(req.body);
    user.Register.updateOne({
            email: req.body.email
        }, {
            $pull: {
                hero: {
                    id: req.body.id
                }
            }
        },
        (err, data) => {
            if (data) {
                res.send({
                    status: 1000,
                    message: '删除成功!'
                })
            }
        }
    )
})

// 修改英雄信息
router.post("/api/user/setHero", (req, res) => {
    // console.log(req.body.id);
    user.Register.updateOne({
        email: req.body.email,
        "hero.id": req.body.id
    }, {
        $set: {
            "hero.$.name": req.body.name,
            "hero.$.hero_class": req.body.hero_class,
            "hero.$.synopsis": req.body.synopsis,
        }
    }, (err, data) => {
        if (data) {
            res.send({
                status: 1000,
                message: '修改成功!'
            })
        }
    })
})

// 修改用户信息
router.get("/api/user/setUserInfo", (req, res) => {
    user.Register.updateOne({
        email: req.query.email
    },{
        $set: {
            name: req.query.name,
            sex: req.query.sex,
            hobby: req.query.hobby,
            signature: req.query.signature,
            img: req.query.img
        }
    },(err,data) => {
        if(data){
            res.send({
                status: 1000,
                message: "修改成功!"
            })
        }else{
            res.send(err)
        }
    })
})


module.exports = router;