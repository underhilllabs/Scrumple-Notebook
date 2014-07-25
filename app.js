(function() {
  var app = angular.module('NotebookApp', []);

  // Controller
  app.controller("NotebookController", function($scope, $http, $location) {
    this.showForm = false;

    this.toggleForm = function() {
      this.showForm = !this.showForm;
      if(this.showForm == true)
        this.addNoteButtonTitle = "Hide Form";
      else
        this.addNoteButtonTitle = "Add Note";
    };

    // Text for add note button
    this.addNoteButtonTitle = "Add Note";

    // Update Note, send update to api
    $scope.updateNote = function(note) {
      $http.put('http://notes.scrumple.net\:8081/api/note/' + note.id, note).
      success(function(data) {
        this.error = '';
      }).
      error(function(data, status) {
        this.error = 'Error: ' + status;
        console.log(this.error);
      });
    };
    // Update the body of the node
    $scope.updateBody = function(note) {
      $http.put('http://notes.scrumple.net\:8081/api/note/' + note.id, note).
      success(function(data) {
      });
    }

    // Delete the note
    $scope.deleteNote = function(note) {
      console.log("notes index is " + note.index);
      $http.delete('http://notes.scrumple.net\:8081/api/note/' + note.id, note).
      success(function(data) {
        console.log("deleted note.");
      }).
      error(function(data) {
        console.log("Error: could not delete note");
      });
    }

    // Add Note
    $scope.addNote = function() {
      var idx = $scope.notes.length;
      $scope.notes.push( {title: $scope.newnote.title, body: $scope.newnote.body,
                          classes: $scope.newnote.classes, index: idx});
      $http.post('http://notes.scrumple.net\:8081/api/note', {title: $scope.newnote.title,
                                                              body: $scope.newnote.body,
                                                              classes: $scope.newnote.classes,
                                                              index: idx}).
      success(function(data) {
        this.error = '';
      }).
      error(function(data, status) {
        this.error = 'Error: ' + status;
        console.log(this.error);
      });
      $scope.newnote.title='';
      $scope.newnote.body = '';
      $scope.newnote.classes = '';
    };

    // Get all the Notes.
    this.getNotes = function() {
      $http({
        method: 'JSONP',
        url: 'http://notes.scrumple.net\:8081/api/notes?callback=JSON_CALLBACK'
      }).
      success(function(data) {
        $scope.notes = data.notes;
        this.error = '';
      }).
      error(function(data, status) {
        this.error = 'Error: ' + status;
      });
    };
    // Call Get Notes, to load notes into model
    this.getNotes();
  });

  // Note Form Widget
  app.directive('noteForm', function() {
    return {
      restrict: 'E',
      templateUrl: 'note-form.html',
      scope: false,
      controller: function($scope, $element) {
        $scope.colors = [
          {id: 'green', name: 'green'},
          {id: 'blue', name: 'blue'},
          {id: 'pink', name: 'pink'},
        ];
        //$scope.addTheNote = function() {
        //  $scope.addNote($scope.note);
        //};
      },
    }
  });

  // Note Widget
  app.directive('noteWidget', function() {
    return {
      restrict: 'E',
      templateUrl: 'note-widget.html',
      require: '?ngModel',
      scope: true,
      link: function(scope, element, attrs) {
        element.find('pre').on('click', function() {
          element.find('textarea')[0].focus();
        });
      },
      controller: function($scope, $element) {
        $scope.isEditable = 0;
        $scope.setEditable = function() {
          $scope.isEditable = 1;
        };
        $scope.tossNote = function() {
          $scope.deleted=1;
          $scope.deleteNote($scope.note);
        };
        $scope.unsetEditable = function() {
          $scope.updateBody($scope.note);
          $scope.isEditable = 0;
        };
      },
    }
  });
})();
