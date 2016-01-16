var express = require('express');
var app = express();

app.use(express.static('../SpaceSettlersWeb/public_html'));

app.listen(3000, function() {
    
});