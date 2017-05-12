/**
 * Created by Andreea on 4/18/2017.
 */

classManagement.Entities.Student = function (firstName, lastName, englishGrade, mathGrade, id) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.englishGrade = englishGrade;
    this.mathGrade = mathGrade;
    this.id = id;
    this.init();
};

classManagement.Entities.Student.prototype.init = function() {
    this.calculateAverage();
    this.loadData();
};

classManagement.Entities.Student.prototype.loadData = function() {
    this.render();
    this.bind();
};

classManagement.Entities.Student.prototype.render = function() {

};

classManagement.Entities.Student.prototype.bind = function() {

};

classManagement.Entities.Student.prototype.calculateAverage = function() {
    this.averageGrade = (this.mathGrade + this.englishGrade) / 2;
};
