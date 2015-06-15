'use strict';

myApp.controller('TwetController', function($scope,$location,$http) {


    var testArray = [
      {i:1,p:22,a:5,b:3,pia:4.4,pib:7.33},
      {i:2,p:5,a:2,b:7,pia:2.5,pib:0.71},
      {i:3,p:15,a:6,b:6,pia:2.5,pib:2.5},
      {i:4,p:10,a:7,b:7,pia:1.43,pib:1.43},
      {i:5,p:4,a:3,b:5,pia:1.33,pib:0.8},
    ];
    var testresult1 = [
    {i:2},
    {i:3},
    {i:4},];
    var testresult2 = [
    {i:5},
    {i:1},];
    var T=[];
    var E=[];
    var T2=[];
    var E2=[];
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
    var war2=1;
    var K=0;
    var Kmax=0;
    var choose=9999999999;
    var temp=0;
    var suma=0;
    var koszt=0;
    var Tall=0;
    var Eall=0;

    



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
      $scope.resulttest.push(test6(testArray,testresult1,testresult2));
      $scope.showtest=true;
    };
    $scope.getResult = function(){
      $scope.done=false;
      $scope.show=false;
      $scope.wrong=false;
      $scope.showtest=false;
      suma=0;
      $scope.alerts = [];
      $scope.resultarray=[];
      $scope.T=[];
      T=[];
      T2=[];
      $scope.pall=0;
      var war1=1;
      var K=0;
      var Kmax=0;
      var choose=9999999999;
      var koszt2=0;
      

    	for (var i = 0; i < $scope.taskarray.length; i++) {
            $scope.taskarray[i].pia = $scope.taskarray[i].p/$scope.taskarray[i].a;
            $scope.taskarray[i].pib = $scope.taskarray[i].p/$scope.taskarray[i].b;
            $scope.taskarray[i].i = i+1;
            $scope.taskarray[i].d = 0;
            $scope.pall+=$scope.taskarray[i].p;
            asum+=$scope.taskarray[i].a;
            E[i]=$scope.taskarray[i];
            E2[i]=$scope.taskarray[i];
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
        var min=99999999999999;
        var tempT=[];
        var tempE=[];
        for (var i = 0; i < $scope.taskarray.length; i++) {
            
            T.push(E[i]);
            asum-=E[i].a;
            bsum+=E[i].b;
            E.splice(i, 1);
            var prev=main(E,T);
            if(prev[1]<min)
            {
              for (var i = 0; i < E.length; i++) {
                tempE[i]=E[i].i;
              };
              for (var i = 0; i < T.length; i++) {
                tempT[i]=T[i].i;
              };
              min=prev[1];
            }
            for (var i = 0; i < $scope.taskarray.length; i++) {
            asum+=$scope.taskarray[i].a;
            E[i]=$scope.taskarray[i];
     
        }
        bsum=0;
        T=[];


        }
        E=[];
          for (var i = 0; i < tempE.length; i++) {
              E[i]=$scope.taskarray[tempE[i]-1];
            }
            for (var i = 0; i < tempT.length; i++) {
              T[i]=$scope.taskarray[tempT[i]-1];
            } 
    
          $scope.E=E;
          $scope.T=T;
          $scope.resultarray=E.concat(T);
          $scope.koszt=prev[1];
          for (var i = 0; i < T.length; i++) {
            if(i==0)
            {
                T[i].d=$scope.D+T[i].p;
            }
            else
            {
              T[i].d=T[i-1].d+T[i].p
            }
          }
         for (var i = E.length-2; i >=0; i--) {
            if(i==E.length-1)
            {
              E[i].d=$scope.D-E[i+1].p;
            }
            else
            {
              E[i].d=E[i+1].d-E[i+1].p;
            }
          }
        
            
        
        // $scope.resultarray=E.concat(T);
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
         line.d=$scope.D;
         
         $scope.Eleng=E.length;
       }

    };

    function main(Arr1,Arr2)
    {
      var prevchoose={};
      Arr1.sort(function(a,b) { return parseFloat(b.pia) - parseFloat(a.pia) } );
        while(1)
        {
            var tablica=[];
            // var temptab ={i:-1,k:-1};
            for (var i = 0; i < Arr1.length; i++) 
            {
               if(asum-Arr1[i].a>=bsum+Arr1[i].b)
               {
                  war1=0;
                  var ak=0;
                  var pk=0;
                  var bpk=0;
                  var bk=0;
                  ak=calcAk(Arr1,i);
                  pk=calcPk(Arr1,i);
                  var tempb=calcB(Arr1,Arr2,i);
                  bpk=tempb[0];
                  bk=tempb[1];
                  // if(T.length==0)
                  // {
                  //     var prevchoose=choose;
                  // }
                  K=calcK(Arr1,ak,bk,bpk,pk,i);
                  if(K>0)
                  {
                    war2=0;
                  }
                  // temptab.k=K;
                  // temptab.i=i;
                  // tablica.push(temptab);
                  tablica.splice(0, 0, {i:i,k:K});
                  // if(K>Kmax)
                  // {
                    
                  //   Kmax=K;
                  //   choose=i;
                  // }

               }
            }
            if(war1==1 || war2==1)
            {
              break;
            }
            else
            {

              tablica.sort(function(a,b) { return parseFloat(b.k) - parseFloat(a.k) } );
              choose=tablica[0].i;
              Arr2.push(Arr1[choose]);
              Arr2.sort(function(a,b) { return parseFloat(a.pib) - parseFloat(b.pib) } );
              asum-=Arr1[choose].a;
              Arr1.splice(choose, 1);
              choose=9999999999;
              Kmax=0;
              war2=1;

            }
        }
        
        
        koszt=0;
        Tall=0;
        Eall=Arr1[Arr1.length-1].p;
        for (var i = 0; i < Arr2.length; i++) {
          Tall+=Arr2[i].p;          
          koszt+=Arr2[i].b*Tall;
          
        }
        for (var i = Arr1.length-2; i >=0; i--) {
          
          koszt+=Arr1[i].a*Eall;
          Eall+=Arr1[i].p;
        }
        Arr1[Arr1.length-1].d=$scope.D;
       
        return [prevchoose,koszt];

    }
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
    function test6(Array1,result1,result2){
      var good=true;
      $scope.taskarray=[];
      $scope.D=100;
      $scope.task=Array1.length;
      for (var i = 0; i <Array1.length; i++) {
        $scope.taskarray[i]=Array1[i];
      }
      $scope.getResult();
      $scope.done=false;
      if($scope.E.length==result1.length)
      {
      for (var i = 0; i <result1.length; i++) {
        if($scope.E[i].i!=result1[i].i)
        {
          good=false;
        }
      }
       for (var i = 0; i <result2.length; i++) {
        if($scope.T[i].i!=result2[i].i)
        {
          good=false;
        }
      }

      return good
      }
      else
      {
        return false;
      }
    };
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };



});