module.exports = function(app) {
    var data = '/../../data/';
    var jsonfileservice = require('./utils/jsonfileservice')();

    app.get('/api/maa', getMaa);
    app.get('/api/customers', getCustomers);

    function getCustomers(req, res, next) {
        var json = jsonfileservice.getJsonFromFile(data + 'customers.json');
        res.send(json);
    }

    function getMaa(req, res, next) {
        var json = jsonfileservice.getJsonFromFile(data + 'maa.json');
        res.send(json);
    }
};