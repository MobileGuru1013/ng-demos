(function () {
    'use strict';

    var serviceId = 'datacontext';
    angular.module('app')
        .factory(serviceId, ['$http', 'common', datacontext]);

    function datacontext($http, common) {
        var $q = common.$q;

        var service = {
            getAvengersCast: getAvengersCast,
            getAvengerCount: getAvengerCount,
            getMAA: getMAA
        };

        return service;

        function getMAA() {
            return $http({ method: 'GET', url: '/api/maa'})
                .then(function(data, status, headers, config) {
                    return data.data[0].data.results;
                }, function(error){
                    console.log(error);
                    return error;
                });
//            return $q.when(results);
//            var results = {data: null};
//            $http({ method: 'GET', url: '/maa'})
//                .success(function(data, status, headers, config) {
//                    results.data = data[0].data.results;
//                })
//            return $q.when(results);
        }

        function getAvengerCount() {
            var count = 0;
            return getAvengersCast().then(function (data) {
                count = data.length;
                return $q.when(count);
            });
        }

        function getAvengersCast() {
            var cast = [
                {name: 'Robert Downey Jr.', character: 'Tony Stark / Iron Man'},
                {name: 'Chris Hemsworth', character: 'Thor'},
                {name: 'Chris Evans', character: 'Steve Rogers / Captain America'},
                {name: 'Mark Ruffalo', character: 'Bruce Banner / The Hulk'},
                {name: 'Scarlett Johansson', character: 'Natasha Romanoff / Black Widow'},
                {name: 'Jeremy Renner', character: 'Clint Barton / Hawkeye'},
                {name: 'Gwyneth Paltrow', character: 'Pepper Potts'},
                {name: 'Samuel L. Jackson', character: 'Nick Fury'},
                {name: 'Paul Bettany', character: 'Jarvis'},
                {name: 'Tom Hiddleston', character: 'Loki'},
                {name: 'Clark Gregg', character: 'Agent Phil Coulson'}
            ];
            return $q.when(cast);
        }
    }
})();