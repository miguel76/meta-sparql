var express = require('express'),
    // negotiate = require('express-negotiate'),
    path = require('path');
// require('express-negotiate');

var router = express.Router();

var ontologiesDir = path.join(__dirname, '..', 'ontologies');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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
        res.sendFile(path.join(ontologiesDir, '/spa.owl'));
      },
      'application/ld+json': function() {
        res.sendFile(path.join(ontologiesDir, '/spa.jsonld'));
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
