var mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/lol", {
        useNewUrlParser: true
    },
    function (err) {
        if (err) {
            console.log("数据库连接失败");
        } else {
            console.log("数据库连接成功");
        }
    });

// 用户表
var registerSchema = new mongoose.Schema({
    email: String,
    name: String,
    password: String,
    img: String,
    hero: [],
    sex: String,
    hobby: String,
    signature: String
});

var User = {
    Register: mongoose.model("Register", registerSchema),
};

module.exports = User;