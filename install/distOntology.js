var rdflib = require('rdflib'),
    jsonld = require('jsonld'),
    fs = require('fs'),
    path = require('path');

var ontologiesDir = path.join(__dirname, '..', 'ontologies');

var jsonldStr = fs.readFileSync(
   path.join(ontologiesDir, 'spa.jsonld'),
   { encoding: 'UTF-8' });

var jsonldObj = JSON.parse(jsonldStr);

// serialize the ontoly to RDF/XML
jsonld.toRDF(jsonldObj, {format: 'application/nquads'}, function(err, nquads) {
  var store = rdflib.graph();
  if (err) {
    console.log(err);
  } else {
    try {
      rdflib.parse(nquads, store, null, 'application/n-quads', function(err) {
        if (err) {
          console.log(err);
        } else {
          rdflib.serialize(
            null, store, 'http://www.swows.org/2016/spa', 'application/rdf+xml',
            function(err, rdfXml) {
              if (err) {
                console.log(err);
              } else {
                fs.writeFileSync(path.join(ontologiesDir, 'spa.owl'), rdfXml);
                console.log('Ontology in RDF/XML regenerated successfully.');
              }
            });
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
});
