'use strict';

myApp.controller('TwetController', function($scope,$location,$http) {


    var testArray = [
      {i:1,p:22,a:5,b:3,pia:4.4,pib:7.33},
      {i:2,p:5,a:2,b:7,pia:2.5,pib:0.71},
      {i:3,p:15,a:6,b:6,pia:2.5,pib:2.5},
      {i:4,p:10,a:7,b:7,pia:1.43,pib:1.43},
      {i:5,p:4,a:3,b:5,pia:1.33,pib:0.8},
    ];
    var T=[];
    var E=[];
    var line ={type:"warning",norm:1,p:0};
    
    $scope.pall=0;
    $scope.done=false;
    $scope.show=false;
    $scope.resulttest=[];
    $scope.showtest=false;
    $scope.resultarray=[];
    $scope.wrong=false;
    var asum=0;
    var bsum=0;
    var war1=1;
    var K=0;
    var Kmax=0;
    var choose=9999999999;
    var temp=0;
    var suma=0;


    $scope.getNumber = function(num) {
        var arr = [];
        for (var i = 0; i < num; i++) {
            var b={value:''};
            arr.push(b);
        }
            $scope.taskarray = arr; 
            $scope.tablelabel = arr;  
    };
    $scope.getTest =function(){
      $scope.resulttest=[];
      $scope.resulttest.push(test1(testArray,0,0));
      $scope.resulttest.push(test1(testArray,4,20));
      $scope.resulttest.push(test2(testArray,0,34));
      $scope.resulttest.push(test2(testArray,4,0));
      $scope.resulttest.push(test3(testArray,[],0,0));
      $scope.resulttest.push(test3(testArray,[],4,0));
      $scope.resulttest.push(test4(testArray,[],0,0));
      $scope.resulttest.push(test4(testArray,[],4,0));
      $scope.resulttest.push(test5(testArray,0,0,0,0,34,104));
      $scope.resulttest.push(test5(testArray,4,20,0,0,0,60));
      $scope.showtest=true;
    };
    $scope.getResult = function(){
      $scope.done=false;
      $scope.show=false;
      $scope.wrong=false;
      suma=0;
      $scope.alerts = [];
      $scope.resultarray=[];
      $scope.T=[];
      T=[];
      for (var i = 0; i < $scope.resultarray.length; i++)
      {
        $scope.resultarray[i]={};
      }

    	for (var i = 0; i < $scope.taskarray.length; i++) {
            $scope.taskarray[i].pia = $scope.taskarray[i].p/$scope.taskarray[i].a;
            $scope.taskarray[i].pib = $scope.taskarray[i].p/$scope.taskarray[i].b;
            $scope.taskarray[i].i = i+1;
            $scope.pall+=$scope.taskarray[i].p;
            asum+=$scope.taskarray[i].a;
            E[i]=$scope.taskarray[i];
            suma+=$scope.taskarray[i].p;
        }
      
      // E=$scope.taskarray;
      if(suma>$scope.D)
      {
          $scope.wrong=true;
          $scope.alerts = [{ type: 'danger', msg: "Nieprawidłowe dane problem nierestryktywny." }];
      }
      else
      {
        E.sort(function(a,b) { return parseFloat(b.pia) - parseFloat(a.pia) } );
        while(1)
        {
            for (var i = 0; i < E.length; i++) 
            {
               if(asum-E[i].a>=bsum+E[i].b)
               {
                  war1=0;
                  var ak=0;
                  var pk=0;
                  var bpk=0;
                  var bk=0;
                  ak=calcAk(E,i);
                  pk=calcPk(E,i);
                  var tempb=calcB(E,T,i);
                  bpk=tempb[0];
                  bk=tempb[1];

                  K=calcK(E,ak,bk,bpk,pk,i);
                  if(K>Kmax)
                  {
                    Kmax=K;
                    choose=i;
                  }

               }
            }
            if(war1==1 || choose==9999999999)
            {
              break;
            }
            else
            {
              T.push(E[choose]);
              T.sort(function(a,b) { return parseFloat(a.pib) - parseFloat(b.pib) } );
              asum-=E[choose].a;
              E.splice(choose, 1);
              choose=9999999999;
              Kmax=0;

            }
        }
        $scope.resultarray=E.concat(T);
        $scope.E=E;
        $scope.T=T;
        for (var i = 0; i < E.length-1; i++) {
          E[i].d=$scope.D-E[i+1].p;

        }
        E[E.length-1].d=$scope.D;

        for (var i = 0; i < T.length; i++) {
          T[i].d=$scope.D+T[i].p;

        }
        for (var i = 0; i < $scope.resultarray.length; i++) {
  	 		$scope.resultarray[i].norm=Math.floor($scope.resultarray[i].p/$scope.pall*10000)/100-1;		
             if(i%3==0)
             {
             		$scope.resultarray[i].type='success';
             }
             if(i%3==1)
             {
             		$scope.resultarray[i].type='info';
             	}
             if(i%3==2)
             {
             		$scope.resultarray[i].type='danger';
             }
           }
          // $scope.resultarray[resultarray.length-1].norm=$scope.resultarray[resultarray.length-1].norm-1;
          $scope.resultarray.splice(E.length,0,line);

          $scope.done=true;
         // $scope.dsad=[];
         $scope.koszt=0;
         $scope.Eleng=E.length;
       }

    };
    /**
    * Funkcja obliczająca sumę współczynników wczesności zadań w zbiorze E 
    * wykonywanych przed aktualnie analizowanym zadaniem
    *
    * @method calcAk
    * @param {Array} E Tablica zadań znajdujących się w zbiorze E 
    * @param {Integer} i Pozycja na której znajduje sie analizowane zadanie w zbiorze E
    * @return {Integer} temp Suma współczynników wczesności zadań.
    * @for TWET
    */
    function calcAk(E, i) {
      temp=0;
      for (var j = 0; j < i; j++) 
      {
        temp+=E[j].a;
      }
      return temp;
    }; 
    /**
    * Funkcja obliczająca sumę czasów trwania zadań wykonywanych po 
    * aktualnie analizowanym zadaniu
    * @method calcPk
    * @param {Array} E Tablica zadań znajdujących się w zbiorze E 
    * @param {Integer} i Pozycja na której znajduje sie analizowane zadanie w zbiorze E
    * @return {Integer} temp Suma czasów trwania zadań.
    * @for TWET
    */
    function calcPk(E, i) {
      temp=0;
      for(var j=i+1;j<E.length;j++)
      {
          temp+=E[j].p;
      }
      return temp;
    };
    /**
    * Funkcja obliczająca sumę czasów trwania zadan wykonywanych przed 
    * aktualnie analizowanym zadaniu oraz suma współczynników opóźnienia
    * po aktualnie analizowanym zadaniu 
    * @method calcB
    * @param {Array} E Tablica zadań znajdujących się w zbiorze E  
    * @param {Array} T Tablica zadań znajdujących się w zbiorze T
    * @param {Integer} i Pozycja na której znajduje sie analizowane zadanie w zbiorze E
    * @return {Array} .
    * @for TWET
    */
    function calcB(E,T,i) {
      var tempbpk=0;
      var tempbk=0;
      for(var j=0;j<T.length;j++)
      {
          if(E[i].pib>T[j].pib)
          {
            tempbpk+=T[j].p;
          }
          else
          {
            tempbk+=T[j].b;
          }
      }
      return [tempbpk,tempbk];
    };
    /**
    * Funkcja obliczająca całkowity zysk z przeniesienia zadania i 
    * do zbioru T.
    *
    * @method calcK
    * @param {Array} E Tablica zadań znajdujących się w zbiorze E 
    * @param {Integer} ak Suma współczynników wczesności zadań w zbiorze E 
    * wykonywanych przed aktualnie analizowanym zadaniem
    * @param {Integer} bk Suma współczynników opóźnienia
    * po aktualnie analizowanym zadaniu 
    * @param {Integer} bpk Suma czasów trwania zadan wykonywanych przed 
    * aktualnie analizowanym zadaniu
    * @param {Integer} pk Suma czasów trwania zadań wykonywanych po 
    * aktualnie analizowanym zadaniu
    * @param {Integer} i Pozycja na której znajduje sie analizowane zadanie w zbiorze E
    * @return {Integer} Całkowity zysk z przeniesienia zadania i do zbioru T.
    * @for TWET
    */
    function calcK(E,ak,bk,bpk,pk,i) {
      temp=E[i].p*(ak-bk)+pk*E[i].a-E[i].b*(bpk+E[i].p);
      return temp;              
    };
    /**
    * Funkcja sprawdzająca poprawność działania funkcji calcAk
    *
    * @method test1
    * @param {Array} Array1 Tablica zadań znajdujących się w zbiorze E 
    * @param {Integer} range Pozycja na której znajduje sie analizowane zadanie w zbiorze E
    * @param {Integer} result Oczekiwany wynik
    * @for TWET
    */
    function test1(Array1,range,result){
      var test=calcAk(Array1,range);
      if(test==result)
      {
        return true;
      }
      else
        return false;
    };
  /**
    * Funkcja sprawdzająca poprawność działania funkcji calcPk
    *
    * @method test2
    * @param {Array} Array1 Tablica zadań znajdujących się w zbiorze E 
    * @param {Integer} range Pozycja na której znajduje sie analizowane zadanie w zbiorze E
    * @param {Integer} result Oczekiwany wynik
    * @for TWET
    */
    function test2(Array1,range,result){
      var test=calcPk(Array1,range);
      if(test==result)
      {
        return true;
      }
      else
        return false;
    };
    /**
    * Funkcja sprawdzająca poprawność działania funkcji calcB - wartosci bpk
    *
    * @method test3
    * @param {Array} Array1 Tablica zadań znajdujących się w zbiorze E  
    * @param {Array} Array2 Tablica zadań znajdujących się w zbiorze T
    * @param {Integer} range Pozycja na której znajduje sie analizowane zadanie w zbiorze E
    * @param {Integer} result Oczekiwany wynik
    * @for TWET
    */
    function test3(Array1,Array2,range,result)
    {
      var test=calcB(Array1,Array2,range);
      if(test[0]==result)
      {
        return true;
      }
      else
        return false;
    } 
    /**
    * Funkcja sprawdzająca poprawność działania funkcji calcB - wartosci bk
    *
    * @method test4
    * @param {Array} Array1 Tablica zadań znajdujących się w zbiorze E  
    * @param {Array} Array2 Tablica zadań znajdujących się w zbiorze T
    * @param {Integer} range Pozycja na której znajduje sie analizowane zadanie w zbiorze E
    * @param {Integer} result Oczekiwany wynik
    * @for TWET
    */
    function test4(Array1,Array2,range,result)
    {
      var test=calcB(Array1,Array2,range);
      if(test[1]==result)
      {
        return true;
      }
      else
        return false;
    } 
    /**
    * Funkcja sprawdzająca poprawność działania funkcji calcK
    *
    * @method test5
    * @param {Array} Array1 Tablica zadań znajdujących się w zbiorze E 
    * @param {Integer} Eak Suma współczynników wczesności zadań w zbiorze E 
    * wykonywanych przed aktualnie analizowanym zadaniem
    * @param {Integer} Ebk Suma współczynników opóźnienia
    * po aktualnie analizowanym zadaniu 
    * @param {Integer} Ebpk Suma czasów trwania zadan wykonywanych przed 
    * aktualnie analizowanym zadaniu
    * @param {Integer} Epk Suma czasów trwania zadań wykonywanych po 
    * aktualnie analizowanym zadaniu
    * @param {Integer} range Pozycja na której znajduje sie analizowane zadanie w zbiorze E
    * @param {Integer} result Oczekiwany wynik
    * @for TWET
    */
    function test5(Array1,range,Eak,Ebk,Ebpk,Epk,result){
      var test=calcK(Array1,Eak,Ebk,Ebpk,Epk,range);
      if(test==result)
      {
        return true;
      }
      else
        return false;
    };
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };



});