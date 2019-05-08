var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RabbitSchema = new Schema({
    id: String,
    name: String,
    age: Number
});

module.exports = mongoose.model('Rabbit', RabbitSchema);