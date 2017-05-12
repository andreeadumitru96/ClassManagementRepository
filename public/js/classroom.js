/**
 * Created by Andreea on 4/18/2017.
 */

classManagement.Entities.Classroom = function (className, classPrinciple) {
    this.className = className;
    this.classPrinciple = classPrinciple;
    this.classStudents = [];
    this.init();
};

classManagement.Entities.Classroom.prototype.init = function() {
    this.calculateAverageClass();
    this.loadData();
};

classManagement.Entities.Classroom.prototype.loadData = function() {
    this.render();
    this.bind();
};

classManagement.Entities.Classroom.prototype.render = function() {
};

classManagement.Entities.Classroom.prototype.bind = function() {

};

classManagement.Entities.Classroom.prototype.addStudent = function(firstName, lastName, englishGrade, mathGrade, id){
    this.classStudents.push(new classManagement.Entities.Student(firstName, lastName, englishGrade, mathGrade, id));
};


classManagement.Entities.Classroom.prototype.calculateAverageClass = function(){
    this.averageClass = 0;
    for (var index = 0; index < this.classStudents.length; index++){
        this.classStudents[index].calculateAverage();
        this.averageClass = this.averageClass + this.classStudents[index].averageGrade;
    }
    this.averageClass = this.averageClass / this.classStudents.length;
};

classManagement.Entities.Classroom.prototype.sortStudents = function(){
    this.classStudents.sort(function(student1, student2) {
        return parseFloat(student2.averageGrade) - parseFloat(student1.averageGrade)
    });
}

