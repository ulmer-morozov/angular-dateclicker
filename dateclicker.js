(function (angular, path, string) {
    //приложение
    var moduleName = "dateclicker";
    var module = angular.module(moduleName, []);
    //
    module.directive(moduleName, function () {
        return {
            restrict: "EA",
            scope: { date: "=ngModel" },
            templateUrl: "dateclicker.html",
            require: "ngModel",
            link: function ($scope, $element, $attrs, ngModelController) {
                ngModelController.$render = function () {
                    $scope.updateFromModel();
                };
                //
                $scope.updateModel = function (newDate) {
                    ngModelController.$setViewValue(newDate);
                    ngModelController.$render();
                    //если указана дата
                    if ($scope.required) {
                        if (Object.prototype.toString.call(newDate) === "[object Date]") {
                            ngModelController.$setValidity("required", true);
                        } else {
                            ngModelController.$setValidity("required", false);
                        }
                    }
                }
                if ($attrs["required"]) {
                    $scope.required = true;
                }
                $scope.yearOnly = $attrs["yearOnly"] == "true";
            },
            controller: ["$scope", "$element", "$attrs", "$compile", "$http", "$routeParams", "$location",
                function ($scope, $element, $attrs, $compile, $http, $routeParams, $location) {
                    var generationYearsRange = 10;
                    var maxGenerationsCount = 10;

                    function calculateGenerations() {
                        var currentYear = new Date().getFullYear();
                        var ceilDecadeYear = Math.ceil(currentYear / 10) * 10;
                        var yearStart = ceilDecadeYear - maxGenerationsCount * generationYearsRange;
                        var generations = [];
                        //
                        for (var generation = 0; generation < maxGenerationsCount; generation++) {
                            var currentRangeYearStart = yearStart + generation * generationYearsRange;
                            var currentRangeYearEnd = currentRangeYearStart + generationYearsRange - 1;
                            if (currentRangeYearEnd > currentYear) {
                                currentRangeYearEnd = currentYear;
                            }
                            generations.push({
                                start: currentRangeYearStart,
                                end: currentRangeYearEnd
                            });
                        }
                        return generations;
                    }
                    function calculateYears(generation) {
                        var years = [];
                        for (var year = generation.start; year <= generation.end; year++) {
                            years.push(year);
                        }
                        return years;
                    }
                    //
                    //добавим вотчер, чтобы следить за изменениями даты
                    $scope.$watch("date", function (newValue, oldValue) {
                        $scope.updateFromModelAndUpdateView();
                    });

                    $scope.initialize = function () {
                        $scope.allGenerations = calculateGenerations();
                        $scope.updateFromModelAndUpdateView();
                    }

                    $scope.updateFromModel = function () {
                        var date = $scope.date;
                        if (Object.prototype.toString.call(date) === "[object Date]") {
                            var selectedGenerationYearStart = Math.floor(date.getFullYear() / generationYearsRange) * generationYearsRange;
                            var selectedGenerationYearEnd = selectedGenerationYearStart + generationYearsRange - 1;
                            $scope.day = date.getDate();
                            $scope.month = date.getMonth();
                            $scope.generation = {
                                start: selectedGenerationYearStart,
                                end: selectedGenerationYearEnd
                            }
                            $scope.year = date.getFullYear();
                        }
                    }

                    $scope.updateFromModelAndUpdateView = function () {
                        $scope.updateFromModel();
                        if (Object.prototype.toString.call($scope.date) === "[object Date]") {
                            $scope.gotoComplete();
                            return;
                        }
                        if ($scope.yearOnly) {
                            $scope.day = 1;
                            $scope.month = 0;
                            $scope.gotoGenerationSelector();
                            return;
                        }
                        $scope.gotoDaySelector();
                    }

                    $scope.clearDate = function () {
                        if ($scope.date != undefined && $scope.updateModel != undefined) {
                            $scope.date = undefined;
                            $scope.updateModel(undefined);
                        }
                    }

                    $scope.setDay = function (newDay) {
                        $scope.day = newDay;
                        $scope.gotoMonthSelector();
                    }

                    $scope.setMonth = function (newMonth) {
                        $scope.month = newMonth;
                        $scope.gotoGenerationSelector();
                    }

                    $scope.setGeneration = function (newGeneration) {
                        $scope.generation = newGeneration;
                        $scope.gotoYearSelector();
                    }

                    $scope.setYear = function (newYear) {
                        $scope.year = newYear;
                        var utcDate = Date.UTC($scope.year, $scope.month, $scope.day);
                        $scope.date = new Date(utcDate);
                        $scope.updateModel($scope.date);
                        $scope.gotoComplete();
                    }


                    $scope.gotoDaySelector = function () {
                        $scope.day = undefined;
                        $scope.month = undefined;
                        $scope.generation = undefined;
                        $scope.year = undefined;
                        //
                        $scope.showComplete = false;
                        $scope.showDays = true;
                        $scope.showMonths = false;
                        $scope.showGenerations = false;
                        $scope.showYears = false;
                        $scope.clearDate();
                    }

                    $scope.gotoMonthSelector = function () {
                        $scope.month = undefined;
                        $scope.generation = undefined;
                        $scope.year = undefined;
                        $scope.showComplete = false;
                        $scope.showDays = false;
                        $scope.showMonths = true;
                        $scope.showGenerations = false;
                        $scope.showYears = false;
                        $scope.clearDate();
                    }

                    $scope.gotoGenerationSelector = function () {
                        $scope.generation = undefined;
                        $scope.year = undefined;
                        $scope.showComplete = false;
                        $scope.showDays = false;
                        $scope.showMonths = false;
                        $scope.showGenerations = true;
                        $scope.showYears = false;
                        $scope.clearDate();
                    }

                    $scope.gotoYearSelector = function () {
                        $scope.year = undefined;
                        $scope.allYears = calculateYears($scope.generation);
                        $scope.showComplete = false;
                        $scope.showDays = false;
                        $scope.showMonths = false;
                        $scope.showGenerations = false;
                        $scope.showYears = true;
                        $scope.clearDate();
                    }

                    $scope.gotoComplete = function () {
                        $scope.showComplete = true;
                        $scope.showDays = false;
                        $scope.showMonths = false;
                        $scope.showGenerations = false;
                        $scope.showYears = false;
                    }

                    $scope.initialize();
                }]
        };
    });
    //
}(angular, path, string));
