(function() {
  var app = angular.module('notebook', []);
  app.controller("NotebookController", function() {
    this.notes = [
      {
        id: "note1",
        title: 'First Note',
        body: 'First Note\nCheck it out!',
        classes: "green",
      },{
        id: "note2",
        title: 'Second Note',
        body: 'Second Note\nCheck it out!\nIt\'s even wordier!',
        classes: "pink",
      }];
  });
  app.directive('noteWidget', function() {
    return {
      restrict: 'E',
      templateUrl: 'note-widget.html',
      require: '?ngModel',
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
          $scope.note.body = $scope.body;
          $scope.isEditable = 0;
        };
      },
    }
  });
})();
