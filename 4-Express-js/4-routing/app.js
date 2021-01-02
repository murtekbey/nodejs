const express = require('express');
const app = express();

app.use('/',(req, res, next) => {
    console.log('loglama yapıldı...');
    next();
}); // middleware

app.use('/add-product',(req, res, next) => {
    res.send('<h1>Add Product Page</h1>');
    // ...
}); // middleware

app.use('/product-list',(req, res, next) => {
    res.send('<h1>Listing product page</h1>');
    // ...
}); // middleware

app.use('/',(req, res, next) => {
    res.send('<h1>hello from express.js</h1>');
}); // middleware

app.listen(3000, () => {
    console.log('Listening on port 3000...');
});
