var app = angular.module('foundationDemoApp', ['mm.foundation']);


angular.module('foundationDemoApp').controller('OffCanvasDemoCtrl', function ($scope, $http) {

    // Partials
    $scope.templates =
    [
        { name: 'addnote.html', url: 'addnote.html' },
        { name: 'mynotes.html', url: 'mynotes.html' },
        { name: 'servernotes.html', url: 'servernotes.html' },
        { name: 'sync.html', url: 'sync.html' }
    ];
    $scope.template = $scope.templates[0];

    $scope.showNote = false;

    //Local db
    $scope.db = new PouchDB("example");

    $scope.remote = config.remoteUrl;
    $scope.opts = {
            continuous: false
        };

    $scope.docs = { all: [] };
    $scope.remoteDocs = { all: [] };

    $scope.note = { value: null };       

    //db.info().then(function(info) {
    //    console.log(info);
    //});         

    $scope.addNote = function () {

        $scope.db.post({
            note: $scope.note
    }, function (err, response) {
            console.log(err || response);
    });

        $scope.showNote = !$scope.showNote;
        setTimeout(function() {
            $scope.showNote = !$scope.showNote;
            $scope.note = null;
            $scope.$apply();
        }, 1500);
    }

    
    $scope.loadAddNotePartial = function () {
        $scope.template = $scope.templates[0];
    };

    $scope.loadMyNotesPartial = function () {

        $scope.db.allDocs({
            include_docs: true,
            attachments: false
        }).then(function (result) {
            // handle result
            $scope.docs.all = result.rows;
            $scope.template = $scope.templates[1];
            $scope.$apply();
        }).catch(function (err) {
            console.log(err);
        });
    };

    $scope.loadViewServerNotesPartial = function () {

        var req = {
            method: 'GET',
            url: config.allDocs
            + '?include_docs=true',
            headers: {
                'Authorization': 'Basic ' + config.key
            }
        }

        $http(req)
          .then(function (response) {
              $scope.remoteDocs.all = response.data.rows;
              $scope.template = $scope.templates[2];
          })
          .catch(function (response) {
              console.error('Error', response.status, response.data);
          });

    };

    $scope.sync = function () {
        $scope.db.replicate.to($scope.remote, $scope.opts);
        $scope.db.replicate.from($scope.remote, $scope.opts);

        //$scope.template = $scope.templates[3];
    }

    $scope.alert = { type: 'success round', msg: "Note added!" };

    
        
    

});