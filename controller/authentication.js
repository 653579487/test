var util = require('util');
exports.index = function (req, res, next) {
    /*
    * 定义变量 $_$ 获取 用户访问地址
    * 定义变量 ll_key 默认为 英语  en
    * 判断 访问地址 url 中是否有 hl ?  并且 hl 是字符串   并且 支持的模板语言中有  这个语言
    * views 局部变量 添加自定义的方法
    * */

    res.locals.$_$ = {
        req_url: req.url,//请求url
    };
    let ll_key = 'en';
        //设置用户设置语言
    if(req.session.lang !== undefined){
        ll_key = req.session.lang
    }

    if (req.query.hl && util.isString(req.query.hl) && $CONFIG.support_template_language[req.query.hl]) {
        ll_key = $CONFIG.support_template_language[req.query.hl];
        req.session.lang =  ll_key;
        console.log(ll_key,'>>>>>>>>>>>');
    }
    //查找对应模板语言
    let locale = $CONFIG.support_template_locales[ll_key];
    let tl = locale.tl;
    //views闭包多语言模板数据
    (function (o, tl) {
        o.$GET = o.$_$.$GET = function (key) {
            if (arguments.length == 1) {
                return $CONFIG.text_language[tl][key];
            }
        };
    })(res.locals, tl);
    next();
};