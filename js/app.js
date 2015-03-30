var app = angular.module('foundationDemoApp', ['mm.foundation']);


angular.module('foundationDemoApp').controller('OffCanvasDemoCtrl', function ($scope, $http) {

    // Partials
    $scope.templates =
    [
        { name: 'addnote.html', url: 'addnote.html' },
        { name: 'mynotes.html', url: 'mynotes.html' },
        { name: 'servernotes.html', url: 'servernotes.html' }
    ];
    $scope.template = $scope.templates[0];

    //Local db
    $scope.db = new PouchDB("example");
    // Remove db
    $scope.cloudantDb = new PouchDB('landmark'),
        remote = "{remoteUrl}",
        opts = {
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
            url: '{remoteUrl}'
            + '?include_docs=true',
            headers: {
                'Authorization': ''
            }
        }

        $http(req)
          .then(function(response) {
              $scope.remoteDocs.all = response.data.rows;
              $scope.template = $scope.templates[2];
              $scope.$apply();
          })
          .catch(function(response) {
              console.error('Error', response.status, response.data);
          })
        
    };

    $scope.sync = function () {
        $scope.db.replicate.to(remote, opts);
        $scope.db.replicate.from(remote, opts);
    }
    

    

});