var express = require('express'),
    fs = require('fs'),
    path = require('path');

var router = express.Router();

var ontologiesDir = path.join(__dirname, '..', 'ontologies');
var dataDir = path.join(__dirname, '..', 'data');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render(
    'index',
    JSON.parse(fs.readFileSync(
       path.join(dataDir, 'home.json'),
       { encoding: 'UTF-8' })));
});

var mapExtension = function(format) {
  switch (format) {
  case 'rdf':
  case 'owl':
    return {  mimeType: 'application/rdf+xml',
              extension: 'owl' };
  case 'jsonld':
  case 'json':
    return {  mimeType: 'application/ld+json',
              extension: 'jsonld' };
  default:
    return { extension: format };
  }
};

router.get('/vocab/spa.:format?', function(req, res, next) {
  console.log(req.params.format);
  console.log(mapExtension(req.params.format));
  if (req.params.format && req.params.format !== '') {
    var extAndMime = mapExtension(req.params.format);
    if (extAndMime.mimeType) {
      res.type(extAndMime.mimeType);
    }
    if (extAndMime.extension) {
      res.sendFile(path.join( ontologiesDir,
                              'spa' + '.' + extAndMime.extension));
    }
  } else {
    res.format( {
      'application/rdf+xml, default': function() {
        res.sendFile(path.join(ontologiesDir, 'spa.owl'));
      },
      'application/ld+json': function() {
        res.sendFile(path.join(ontologiesDir, 'spa.jsonld'));
      },
      'text/html': function() {
        res.render(
          'ontology',
          { tree:
              JSON.parse(fs.readFileSync(
                path.join(ontologiesDir, 'spa.jsonld'),
                { encoding: 'UTF-8' })),
            path: '/vocab/spa'
          });
      }
      // 'application/owl+xml': function() {
      //   res.sendFile(ontologiesDir + '/spa.owx');
      // },
      // 'text/turtle': function() {
      //   res.sendFile(ontologiesDir + '/spa.ttl');
      // }
      // 'text/owl-manchester': function() {
      //   res.sendFile(ontologiesDir + '/spa.omn');
      // }
    });
  }
});

module.exports = router;
