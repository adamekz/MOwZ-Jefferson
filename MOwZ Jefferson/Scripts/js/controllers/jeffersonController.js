'use strict';

myApp.controller('JeffersonController', function($scope,$location,$http) {
    $scope.file = {};
    $scope.empty=true;
    $scope.p=[];   
    $scope.list = []; 
    $scope.labels = [];
    $scope.show = false;
    $scope.Submitting = false;

    $scope.getResult = function(){
        $scope.Submitting = true;
        $scope.labels = [];
        $scope.alerts = [];
 
        if($scope.jeffersonFile.$valid) {

            var fd = new FormData();
            fd.append('Upload', $scope.file);
            fd.append('Submit','Wyślij');
                  

            var promise = $http.post('http://jefferson-mowz.azurewebsites.net/Home/Upload',fd,{
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            });

            promise.then(
                function(data) {
                   if(data.data.success == true) {

                        $scope.list=[];
                        $scope.result = data.data;
                        $scope.PlacmentsList=data.data.PlacmentsList;
                        $scope.correct=true;
                        $scope.empty=false;
                        for (var i = 0; i < $scope.PlacmentsList[0].SeatsPerStateList.length; i++) {
                            var j=i+1;          
                            $scope.labels.push('State '+j);
                        };  
                        $scope.tablelabel = $scope.PlacmentsList[0].SeatsPerStateList;
                        $scope.Submitting = false;
                    }else {
                        $scope.list=[];
                        $scope.result = data.data; 
                        $scope.correct =false;
                        $scope.empty=false; 
                        $scope.alerts = [{ type: 'danger', msg: data.data }];
                        $scope.Submitting = false;
                    }
                },
                function(data) {
                    $scope.list=[];
                    $scope.result = 'Błąd komunikacji z serwerem';
                    $scope.Submitting = false;
                    $location.path('/');
                });
        }
    };
    $scope.getResultFromForm = function(){

        $scope.Submitting = true;
        $scope.result=[];
        $scope.PlacmentsList=[];
        $scope.labels = [];
        $scope.alerts = [];
  
        
        $scope.jeffersonForm.number.$setDirty(); 
        $scope.jeffersonForm.number.$setTouched();
        $scope.jeffersonForm.H.$setDirty(); 
        $scope.jeffersonForm.H.$setTouched();

        if($scope.jeffersonForm.$valid) {

            for (var i = 0; i < $scope.n; i++) {
                $scope.list.push($scope.narray[i].value);
            };
                
    
            var promise = $http.post('http://jefferson-mowz.azurewebsites.net/Home/Send', { N: $scope.n, H: $scope.h,Populations:$scope.list });

            promise.then(
                function(data) {
                   if(data.data.success == true) {
                        $scope.list=[];
                        $scope.result = data.data;
                        $scope.PlacmentsList=data.data.PlacmentsList;
                        $scope.correct=true;
                        $scope.empty=false;
                        for (var i = 0; i < $scope.n; i++) {
                            var j=i+1;        
                            $scope.labels.push('State '+j);
                        };  
                        $scope.Submitting = false;
                    }else {
                        $scope.list=[];
                        $scope.result = data.data; 
                        $scope.correct =false;
                        $scope.empty=false; 
                        $scope.alerts = [{ type: 'danger', msg: data.data }];
                        $scope.Submitting = false;
                    }
                },
                function(data) {
                    $scope.list=[];
                    $scope.result = 'Błąd komunikacji z serwerem';
                    $scope.Submitting = false;
                    $location.path('/');
                });
            
        } 
    };
    $scope.getNumber = function(num) {
        var arr = [];
        for (var i = 0; i < num; i++) {
            var b={value:''};
            arr.push(b);
        }
            $scope.narray = arr; 
            $scope.tablelabel = arr;  
    };
    $scope.getTotal = function(seats){
        var total = 0;
        for(var i = 0; i < seats.length; i++){
            total += seats[i];
        }
        return total;
    };
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
});