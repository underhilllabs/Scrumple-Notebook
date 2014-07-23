(function() {
  var app = angular.module('notebook', []);
  // Controller
  app.controller("NotebookController", function($scope, $http, $location) {
    // Update Note, send update to api
    $scope.updateNote = function(note) {
      console.log("updating: " + note.id);
      $http.put('http://notes.scrumple.net\:8081/api/note/' + idx, note).
      success(function(data) {
        console.log("note updated some.how..");
        this.error = '';
        $location.path('/');
      }).
      error(function(data, status) {
        this.error = 'Error: ' + status;
        console.log(this.error);
      });
    };
    $scope.updateBody = function(note) {
      console.log("updateBody: " + note.body);
      console.log("updating: " + note.id);
      $http.put('http://notes.scrumple.net\:8081/api/note/' + note.id, note).
      success(function(data) {
        console.log("successful update: whoot!");
      });
    }
    // Add Note
    $scope.addNote = function() {
      var idx = $scope.notes.length;
      console.log("length is " + idx);
      $scope.notes.push( {title: $scope.newnote.title,
                          body: $scope.newnote.body,
                          classes: $scope.newnote.classes,
                          index: idx});
      console.log("note here: " + $scope.newnote.title);
      console.log("note body: " + $scope.newnote);
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
          $scope.body = $scope.note.body;
          $scope.isEditable = 1;
        };
        $scope.unsetEditable = function() {
          console.log($scope.body);
          $scope.note.body = $scope.body;
          $scope.updateBody($scope.note);
          $scope.isEditable = 0;
        };
      },
    }
  });
})();
