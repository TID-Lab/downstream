/**
 * A simple web server to run our fruit API
 */

 const express = require('express');

 const app = express();
 
 const fruits = [
     'apple',
     'orange',
     'strawberry',
     'watermelon',
     'blueberry',
     'raspberry',
     'blackberry',
     'banana',
     'kiwi',
     'dragonfruit',
     'pear',
     'pineapple',
     'cherry',
     'plum',
     'peach'
 ]
 
 // our fruit API endpoint
 app.get('/api/fruits', (req, res) => {
     const fruit = fruits.shift();
     fruits.push(fruit);
 
     res.status(200).send({ fruit });
 });
 
 module.exports = function start() {
     app.listen(3000);
 }