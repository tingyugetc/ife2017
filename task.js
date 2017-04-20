phantom.outputEncoding = "gb2312";

var page = require('webpage').create();
var system = require('system');

if (system.args.length === 1) {
    console.log('usage: task.js <key>');
    phantom.exit();
}

var word = system.args[1];
var time = Date.now();
var url = 'https://www.baidu.com/s?wd=' + encodeURIComponent(word);

//打开搜索页面
page.open(url, function (status) {
    var res;
    if (status !== 'success') {
        res = {
            code: 0,
            msg: '抓取失败',
            word: word,
            time: Date.now() - time,
            dataList: []
        };
    } else {
        var dataList = page.evaluate(function () {
            var dataList = [];
            var containers = document.querySelectorAll('.c-container');
            for (var i = 0, len = containers.length; i < len; i++) {
                var container = containers[i];
                var data = {
                    title: '',
                    info: '',
                    link: '',
                    pic: ''
                };

                var title;
                if (title = container.querySelector('h3.t')) {
                    data.title = title.innerText;
                }

                var info;
                if (info = container.querySelector('.c-row')) {
                    data.info = info.innerText;
                }

                var link;
                if (link = container.querySelector('h3.t>a')) {
                    data.link = link.href;
                }

                var pic;
                if (pic = container.querySelector('img.c-img')) {
                    data.pic = pic.src;
                }

                dataList.push(data);
            }
            return dataList;
        });

        res = {
            code: 1,
            msg: '抓取成功',
            word: word,
            time: Date.now() - time,
            dataList: dataList
        };
    }

    console.log(JSON.stringify(res,undefined,4));

    phantom.exit();
});

//打开页面异常处理
page.onError=function(msg,trace){
    var msgStack=['Error: '+msg];

    if(trace && trace.length){
        msgStack.push('TRACE:');
        trace.forEach(function(t){
            msgStack.push('->'+t.file+': '+t.line+(t.function?'in function '+t.function:''));
        });
    }

    console.log(msgStack.join('\n'));
}
