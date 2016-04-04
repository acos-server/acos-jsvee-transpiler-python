var fs = require('fs');
var python = require('python-shell');
var htmlencode = require('htmlencode').htmlEncode;

var pythonTranspiler = function() {};

pythonTranspiler.register = function(handlers, app, config) {

  handlers.tools['jsvee-transpiler-python'] = pythonTranspiler;

  app.get('/jsvee-transpiler-python', function(req, res) {
    res.set('Content-Type', 'text/html');
    fs.readFile(__dirname + '/form.html', function(err, data) {
      if (!err) {
        data = (data + '').replace('{{ url }}', htmlencode(config.serverAddress + 'html/jsvee/jsvee-python-json/transpiler') + '?url=http://pathtothetranspiledcode/file.json</code>');
        data = (data + '').replace('{{ kelmu }}', htmlencode(config.serverAddress + 'html/jsvee/jsvee-python-json/transpiler') + '?url=http://pathtothetranspiledcode/file.json&kelmuUrl=http://pathtothedefinitionfile/file.jsonp</code>');
        res.send(data);
      } else {
        res.send("Error");
      }
    });
  });

  app.post('/jsvee-transpiler-python', function(req, res) {
    var code = { 'code': req.body.code };
    var options = {
      mode: 'json',
      pythonPath: config.pythonPath || '/usr/bin/python3',
      pythonOptions: ['-u'], // -u is unbuffered output
      scriptPath: __dirname
    };

    var pyshell = new python('parser.py', options);
    pyshell.send(code);

    var response = '';

    pyshell.on('message', function(message) {
      response = message;
    });

    pyshell.end(function(err) {
      if (err) {
        res.json({ status: 'ERROR', message: 'Transpilation failed.' });
      } else {
        res.json(response);
      }
    });
  });

};

pythonTranspiler.namespace = 'jsvee-transpiler-python';
pythonTranspiler.packageType = 'tool';

pythonTranspiler.meta = {
  'name': 'jsvee-transpiler-python',
  'shortDescription': 'Transpiles the given Python code into form that Jsvee understands.',
  'description': '',
  'author': 'Teemu Sirkiä',
  'license': 'MIT',
  'version': '0.1.0',
  'url': ''
};

module.exports = pythonTranspiler;
