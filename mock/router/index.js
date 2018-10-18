var path = require('path');
var conf = require('./config.api');
var express = require('express');
var router = express.Router();

conf.apis.forEach(item => {

    var isObj = typeof item === 'object' ? true : false,
        api = isObj ? item.api : item;

    router.all(api, (req, res, next) => {
        var url = '',
            filename = req.params.filename;

        isObj && Array.isArray(item.alias) && item.alias.forEach(item2 => {
            filename = item2.split('.')[0] === req.params.filename ? item2 : filename;
        });

        url = path.join(conf.baseDir, filename);

        delete require.cache[require.resolve(url)];
        res.json(require(url));
    });
});

module.exports = router;
