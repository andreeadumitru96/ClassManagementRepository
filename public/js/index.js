/**
 * Created by Andreea on 4/18/2017.
 */

classManagement.Main = function() {
    this.init();
};

classManagement.Main.prototype.init = function() {
    this.loadData();
};

classManagement.Main.prototype.loadData = function() {
    $.ajax({
        method: 'GET',
        url: 'students',
        contentType: 'application/json',
        success: $.proxy(this.onSuccessfullyLoadStudents, this),
        error: $.proxy(this.onFailureLoadStudents, this)
    });

};

classManagement.Main.prototype.renderClassInfo = function(){
    this.$className = '<span id="className">' + myClass.className + '</span>';

    this.$classPrinciple = '<span id="principleName">' + myClass.classPrinciple + '</span>';

    this.$classAverage = '<span id="classAverage">' + myClass.averageClass + '</span>';

    $("#className").append(this.$className);
    $("#principleName").append(this.$classPrinciple);
    $("#classAverage").append(this.$classAverage);
}

classManagement.Main.prototype.onSuccessfullyLoadStudents = function(response) {
  for(var index = 0; index < response.length; index++) {
      myClass.addStudent(response[index].firstName, response[index].lastName, response[index].englishGrade, response[index].mathGrade, response[index]._id);
  }


  myClass.calculateAverageClass();
  this.renderClassInfo();

  this.render();
  this.bind();
};

classManagement.Main.prototype.render = function() {
    this.showTable();
};

classManagement.Main.prototype.bind = function() {
    $('#addSt').on('click', $.proxy(this.addStudent, this));

    $('.editButton').on('click', $.proxy(this.editStudentFromTable, this));

    $('.deleteButton').on('click', $.proxy(this.deleteRowInTable, this));

    $('input[type="text"]').on('keydown', this.checkKeyBinding);

    $("#addSt").on('click', function(){
        $("#addSt").attr('value', 'Add Student');
    });


    $('input[type="text"]').each($.proxy(function() {
        var element = $('input[type="text"]');
        $(element).on('blur', $.proxy(function(e) {
            this.validationBlank($(e.currentTarget));
        },this));
    }, this));

};

classManagement.Main.prototype.checkKeyBinding = function(e){
    if(e.keyCode === 16) { // shift
        $(this).val('');
    }
    if(e.keyCode === 13) { // enter
        var keyBindingIndex = $('input[type="text"]').index(this) + 1;
        $('input[type="text"]').eq(keyBindingIndex).focus();
        if(keyBindingIndex === 4){
            $("#addSt").trigger('click');
        }
    }
    if(e.keyCode === 27){ //esc
        $('input[type="text"]').each(function() {
            $(this).val('');
        });
    }

};

classManagement.Main.prototype.addStudent = function(){
    if(this.validationFields()){
        if($('#addSt').val() == "Add Student") {
            this.addStudentFromForm(myClass.classStudents.length);

        }
        if($('#addSt').val() == "Save Changes") {
            this.editData(event);
        }

        $('input[type="text"]').each(function() {
            $(this).val('');
            $('input[type="text"]').eq(0).focus();
        });
    }

};


classManagement.Main.prototype.showTable = function(){

    for (var index = 0; index < myClass.classStudents.length; index++) {
        this.putInTable(index);
    }
}

classManagement.Main.prototype.addStudentFromForm = function(studentPositionInClass){
    var thisObj = this;

    var content = this.returnContentFields();
    var proccessedObject = {
        firstName: content.fn,
        lastName: content.ln,
        englishGrade: content.engG,
        mathGrade: content.mathG
    };


    $.ajax({
        method: 'POST',
        url: 'saveStudent',
        contentType: 'application/json',
        data: JSON.stringify(proccessedObject),
        success: function(response){
            thisObj.onSuccessSaveStudent(response, studentPositionInClass);
        },
        error: function () {
            console.log('error');
        }

    });

};

classManagement.Main.prototype.onSuccessSaveStudent = function (response, studentPositionInClass) {
    myClass.addStudent(response.firstName, response.lastName, response.englishGrade, response.mathGrade, response._id);
    myClass.classStudents[studentPositionInClass].calculateAverage();
    this.updateAverageClassAfterEdit();
    this.putInTable(myClass.classStudents.length - 1);
    $('.editButton').off().on('click', $.proxy(this.editStudentFromTable, this));
    $('.deleteButton').off().on('click', $.proxy(this.deleteRowInTable, this));
};


classManagement.Main.prototype.validationBlank = function(element){
    if (element.val() == "") {
        $(element).css('border-color', 'red');
    }
    else{
        $(element).css('border-color', '');
    }
}

classManagement.Main.prototype.validationFields = function(){
    var isValid = true;
    $('input[type="text"]').each(function() {
        var element = $(this);
        if (element.val() == "") {
            isValid = false;
        }

        var verifyEnglishGrade = parseFloat($('#eng').val());
        var verifyMathGrade = parseFloat($('#math').val());

        if(!((verifyEnglishGrade >= 1 && verifyEnglishGrade <= 10) && (verifyMathGrade >= 1 && verifyMathGrade <= 10)))
            isValid = false;

    });
    return isValid;
}

classManagement.Main.prototype.returnContentFields = function(){
    var content = {};
    content.fn = $('#fname').val();
    content.ln = $('#lname').val();
    content.engG = parseFloat($('#eng').val());
    content.mathG = parseFloat($('#math').val());

    return content;
}

classManagement.Main.prototype.drawTable = function(studentPositionInTable){
    var elementsTable = {};
    elementsTable.number = "<tr id =" + studentPositionInTable + "><td>"+ (studentPositionInTable+1) + "</td>";
    elementsTable.name = "<td>" + myClass.classStudents[studentPositionInTable].firstName + " " + 	myClass.classStudents[studentPositionInTable].lastName + "</td>";
    elementsTable.englishGrade = "<td>" + myClass.classStudents[studentPositionInTable].englishGrade + "</td>";
    elementsTable.mathGrade = "<td>" + myClass.classStudents[studentPositionInTable].mathGrade + "</td>";
    elementsTable.averageGrade = "<td>" + myClass.classStudents[studentPositionInTable].averageGrade + "</td>";
    elementsTable.editButton = "<td>" + '<button type = "button" class = "editButton" id = ' + studentPositionInTable +  '> <span class = "glyphicon glyphicon-pencil"></span> Edit </button>';
    elementsTable.deleteButton = '<button type = "button" class = "deleteButton" id =' + studentPositionInTable + '> <span class = "glyphicon glyphicon-remove "></span> Delete </button>' + '</td></tr>';

    return elementsTable;

}

classManagement.Main.prototype.putInTable = function(studentPositionInTable){

    var elements = this.drawTable(studentPositionInTable);

    $("#table tbody").append(elements.number + elements.name + elements.englishGrade + elements.mathGrade + elements.averageGrade +  elements.editButton + elements.deleteButton);

}

classManagement.Main.prototype.editStudentFromTable = function(e){

    if($('#fname')[0].style.borderColor == "red"){
        $('#fname').css('border-color', '');
    }

    currentIndex = $(e.currentTarget).parent().parent()[0].rowIndex - 1;

    $("#addSt").attr('value', 'Save Changes');

    var fName = myClass.classStudents[currentIndex].firstName;
    var lName = myClass.classStudents[currentIndex].lastName;
    var eGrade = myClass.classStudents[currentIndex].englishGrade;
    var mGrade = myClass.classStudents[currentIndex].mathGrade;

    $("#fname").val(fName);
    $("#lname").val(lName);
    $("#eng").val(eGrade);
    $("#math").val(mGrade);


    if(('.deleteButton').click == true){
        this.deleteAfterEdit();
    }
}

classManagement.Main.prototype.editDataInClass = function(updatedStudent){

    myClass.classStudents[currentIndex].firstName = updatedStudent.firstName;
    myClass.classStudents[currentIndex].lastName = updatedStudent.lastName;
    myClass.classStudents[currentIndex].englishGrade = updatedStudent.englishGrade;
    myClass.classStudents[currentIndex].mathGrade = updatedStudent.mathGrade;

}

classManagement.Main.prototype.editData = function(event){
    thisObj = this;

    var proccessedData = {
        id: myClass.classStudents[currentIndex].id
    };

    var content = this.returnContentFields();
    var proccessedObject = {
        firstName: content.fn,
        lastName: content.ln,
        englishGrade: content.engG,
        mathGrade: content.mathG
    };

    $.ajax({
        method: 'PUT',
        url: 'editStudent/'+ proccessedData.id,
        contentType: 'application/json',
        data: JSON.stringify(proccessedObject),
        success: function(response){
            thisObj.onSuccessEditStudent(response);
        },
        error: function () {
            console.log('error');
        }
    });
}


classManagement.Main.prototype.onSuccessEditStudent = function (response) {
    this.editDataInClass(response);
    myClass.classStudents[currentIndex].calculateAverage();
    this.editRowInTable();
    this.updateAverageClassAfterEdit();
    $('.editButton').off().on('click', $.proxy(this.editStudentFromTable, this));
}


classManagement.Main.prototype.deleteRowInTable = function(e){

    var thisObj = this;

    var updatingIndex = $(e.currentTarget).parent().parent()[0].rowIndex - 1;

    var proccessedData = {
        id: myClass.classStudents[updatingIndex].id
    };

    $.ajax({
        method: 'DELETE',
        url: 'deleteStudent/' + proccessedData.id,
        contentType: 'application/json',
        success: function(response){
            thisObj.onSuccessDeleteStudent(response, e, updatingIndex);
        },
        error: function () {
            console.log('error');
        }
    });

}

classManagement.Main.prototype.onSuccessDeleteStudent = function (response, e, updatingIndex) {
    var deleteRow = $(e.currentTarget).parent().parent()[0];
    $(deleteRow).remove();
    this.updateClassStudents(updatingIndex);
    this.updateIndexInRow(updatingIndex);
    this.updateAverageClassAfterEdit();

    $('input[type="text"]').each(function() {
        $(this).val('');
    });

    $("#addSt").attr('value', 'Add Student');

};


classManagement.Main.prototype.editRowInTable = function(){

    var elementsEdited = this.drawTable(currentIndex);

    var $number = "<td>" + elementsEdited.number;
    var $name = " " + elementsEdited.name;
    var $englishGrade = " " + elementsEdited.englishGrade;
    var $mathGrade = " " + elementsEdited.mathGrade;
    var $averageGrade = " " + elementsEdited.averageGrade;
    var $editButton = " " + elementsEdited.editButton;
    var $deleteButton = elementsEdited.deleteButton + "</td>";

    $('#table tr').eq(currentIndex+1).html($number + $name + $englishGrade + $mathGrade + $averageGrade + $editButton + $deleteButton);
}


classManagement.Main.prototype.updateAverageClassAfterEdit = function(){
    myClass.calculateAverageClass();
    $("#classAverage").text("Class Average: " + myClass.averageClass);
}

classManagement.Main.prototype.updateClassStudents = function(updatingIndexInClass){
    myClass.classStudents.splice(updatingIndexInClass, 1);

}

classManagement.Main.prototype.updateIndexInRow = function(updatingIndexInTable){
    $('#table tr').each(function(updatingIndexInTable) {
        $(this).find('td:eq(0)').text(updatingIndexInTable);
    });
}


classManagement.Main.prototype.deleteAfterEdit = function () {
    $('input[type="text"]').each(function() {
        $(this).val('');
    });
}