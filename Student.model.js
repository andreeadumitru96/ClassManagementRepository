/**
 * Created by Andreea on 4/22/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StudentSchema = new Schema({
    firstName: String,
    lastName: String,
    englishGrade: Number,
    mathGrade: Number,
    averageGrade: Number

});

module.exports = mongoose.model('Student', StudentSchema);