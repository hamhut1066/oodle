/// <reference path="calc.ts" />
/// <reference path="../typings/angularjs/angular.d.ts" />

angular.module("fma2eng", [])
    .controller("fma2angcontroller", ['$scope', function($scope: any){
        $scope.calc = new oodle.Calc({
            "M": new oodle.EngQ(12, "kg", {
                min: {inclusive: false, val: 0}
            }),
            "A": new oodle.EngQ(3, "m/s^2"),
        }, function (calc) {
            return new oodle.EngQ(calc.A.val * calc.M.val, "N")
        }
                                    )

        $scope.do_it = function() {
            $scope.calc.run().then(function() {
                $scope.$apply();
            })
        }
    }])
