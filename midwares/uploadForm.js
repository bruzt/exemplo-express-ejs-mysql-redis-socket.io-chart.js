const formidable = require('formidable');
var path = require('path');


module.exports = (req, res, next) => {

    if(req.method == 'POST'){
  
      let form = formidable.IncomingForm({
  
        uploadDir: path.join(__dirname, '../public/images'),
        keepExtensions: true
    
      });
    
      form.parse(req, (error, fields, files) => {
    
        req.body = fields;
        req.fields = fields;
        req.files = files;

        next();
    
      });

      
  
    } else {
  
      next();
  
    }
}