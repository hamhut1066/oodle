/// <reference path="calc.ts" />
/// <reference path="../typings/angularjs/angular.d.ts" />
angular.module("fma2eng", [])
  .controller("fma2angcontroller", ['$scope', 'calcService', function ($scope, calcService) {

    $scope.calc = calcService.calc


    $scope.do_it = function () {
      $scope.calc.run().then(function () {
        $scope.$apply();
      })
        .catch(function(data) {
          console.log(data.stack)
        })
    };

  }]);


angular.module('fma2eng').service('calcService', function() {
  // Data Service
  var calc = new oodle.Calc({

    M: new oodle.EngQ(12, "kg", {
      range: {
        min:{
          inclusive: false,
          val: 0
        }},
      name: "The Mass of the thing."
    }),

    A: new oodle.EngQ(3, "m/s^2")

  }, function (calc) {
    return new oodle.EngQ(calc.A.val * calc.M.val, "N");
  })


  return {
    calc: calc
  }
})
