require('./../util/time')
let express = require('express');
let md5 = require('md5');
let fs = require('fs');
let router = express.Router();
let app = express()

let Article = require('./../models/articles')
let User = require('./../models/users')
let Tags = require('./../models/tags')

app.use(express.static('public'));

console.log(test);
// 获取后台管理页面
router.get('/index.html', function(req, res) {
        console.log(req)
    })
    // 文章列表
router.get("/api/articleList_admin", function(req, res) {
    let page = parseInt(req.param("page")) //浏览器参数第几页
    let pageSize = parseInt(req.param("pageSize")) //当前一页多少个
    let skip = (page - 1) * pageSize
    let ArticleModal = Article.find().skip(skip).limit(pageSize).sort({ _id: -1 }).lean()

    ArticleModal.exec(function(err, doc) {
        if (err) {
            res.json({
                status: "1",
                msg: err.message,
            })
        } else {
            res.json({
                status: '0',
                msg: '',
                result: {
                    count: doc.length,
                    list: doc
                }
            })
        }
    })
})

// 发布文章
router.post("/api/articleSub", function(req, res) {
    let title = req.body.title
    let tag = req.body.tag
    let describtion = req.body.describtion
    let content = req.body.content

    let random = Math.floor(Math.random() * 10)
    let sysDate = new Date().Format('yyyMMddhhmmss')
    let createDate = new Date().Format('yyyy-MM-dd hh:mm:ss')
    let articleId = sysDate + random

    let article = {
        "articleId": articleId,
        "title": title,
        "tag": tag,
        "describtion": describtion,
        "createDate": createDate,
        "content": content
    }
    Article.create(article, function(err, doc) {
        if (err) {
            res.json({
                status: "1",
                msg: err.message,
                result: ''
            })
        } else {
            res.json({
                status: '0',
                msg: '',
                result: 'suc'
            })
        }
    })
})

// 删除文章
router.post("/api/articleDelete", function(req, res) {
    let articleId = req.body.articleId
    Article.remove({ articleId: articleId }, function(err, doc) {
        if (err) {
            res.json({
                status: "1",
                msg: err.message,
                result: ''
            })
        } else {
            res.json({
                status: '0',
                msg: '',
                result: 'suc'
            })
        }
    })
})

// 修改文章
router.post("/api/articleModify", function(req, res) {
    let content = req.body.content
    let articleId = req.body.articleId
    let title = req.body.title
    let tag = req.body.tag
    let desc = req.body.describtion

    Article.findOneAndUpdate({ articleId: articleId }, { $set: { content: content, tag: tag, title: title, describtion: desc } }, function(err, doc) {
        if (err) {
            res.json({
                status: "1",
                msg: err.message,
                result: ''
            })
        } else {
            res.json({
                status: '0',
                msg: '',
                result: 'suc'
            })
        }
    })
})

// 创建管理远账号
router.post("/api/createAccount", function(req, res) {
        console.log(req.body.data.account);
        let account = req.body.data.account
        let pwd = md5(req.body.data.password);
        let newAccount = {
            account: account,
            password: pwd
        };
        console.log(newAccount);
        User.create(newAccount, function(err, doc) {
            if (err) {
                res.json({
                    status: "1",
                    msg: err.message,
                    result: ''
                })
            } else {
                res.json({
                    status: '0',
                    msg: '',
                    result: 'suc'
                })
            }
        })
    })
    // 登录管理界面
router.get("/api/login", function(req, res) {
    let account = req.query.account
    let password = req.query.password
    User.findOne({ account: account }).lean().exec(function(err, doc) {
        if (err) {
            res.json({
                status: "1",
                msg: err.message,
                result: ''
            })
        } else {
            if (!doc.password) {
                res.json({
                    status: "1",
                    msg: '',
                    result: '无此用户'
                })
            } else {
                let pwd = doc.password;
                console.log(password, pwd, doc.password);
                if (password == pwd) {
                    res.json({
                        status: '0',
                        msg: '',
                        result: doc
                    })
                } else {
                    res.json({
                        status: '1',
                        msg: '',
                        result: doc
                    })
                }
            }
        }
    })
})

// 标签列表
router.get("/api/tags", function(req, res) {
    Tags.find(function(err, doc) {
        if (err) {
            res.json({
                status: "1",
                msg: err.message,
            })
        } else {
            res.json({
                status: '0',
                msg: '',
                result: {
                    count: doc.length,
                    list: doc
                }
            })
        }
    })
})

// 删除标签
router.post("/api/tagsDelete", function(req, res) {
    let tagDel = req.body.tagDel
    Tags.remove({ name: tagDel }, function(err, doc) {
        if (err) {
            res.json({
                status: "1",
                msg: err.message,
                result: ''
            })
        } else {
            res.json({
                status: '0',
                msg: '',
                result: 'suc'
            })
        }
    })
})

// 添加标签
router.post("/api/tagsAdd", function(req, res) {
    let tagAdd = req.body.tagAdd
    Tags.create({ name: tagAdd }, function(err, doc) {
        if (err) {
            res.json({
                status: "1",
                msg: err.message,
                result: ''
            })
        } else {
            res.json({
                status: '0',
                msg: '',
                result: 'suc'
            })
        }
    })
})
module.exports = router