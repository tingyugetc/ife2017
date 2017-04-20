var page = require('webpage').create();
page.open('http://baidu.com', function(status) {
	if (status === 'success') {
		page.render('baidu.png');
	}
	phantom.exit()
});

