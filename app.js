var fs = require('fs')
var path = require('path')
var express = require('express')
var app = express()

var PATH = path.join(__dirname, '/public');

app.use(express.static(PATH));
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, '/views'));

var cache = {};

var isDir = function(path) {
	if (!cache[path]) {
		cache[path] = fs.statSync(path).isDirectory();
	}
	return cache[path];
};

var getFiles = function(DIR, cur) {
	var names = fs.readdirSync(DIR);
	var files = [];
	for (var i = names.length - 1; i >= 0; i--) {
		files.push({
			name: names[i],
			ext: path.extname(names[i]).toLowerCase(),
			url: ((cur.length > 1 ? cur : '') + names[i]),
			isDir: isDir(path.join(DIR, names[i]))
		});
	}
	return files;
}

app.get('*', function(req, res, next) {
	var cur = decodeURI(req.path),
		last = path.join(cur, '../'),
		DIR = path.join(PATH, cur);
	try {
		res.render('index', {
			files: getFiles(DIR, cur),
			last: last
		});
	} catch (err) {
		// console.log(err.stack);
		next();
	}
});

app.listen(3000);
