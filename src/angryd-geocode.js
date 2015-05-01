angular.module('angryd')
    .directive('angrydGeocode', [function () {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            countryModel: '=?',
            regionModel: '=?',
            stateModel: '=?',
            cityModel: '=?',
            addressModel: '=?',
            postalCodeModel: '=?',
            streetNumberModel: '=?'
        },
        link: function (scope, element, attrs, modelCtrl) {
            console.log(element);
            var opt = {};

            switch (attrs.angrydGeocode) {
                case 'country':
                    opt.types = ['(regions)'];
                    break;
                case 'city':
                    opt.types = ['(cities)'];
                    if (attrs.countryFilter) {
                        opt.componentRestrictions = { country: attrs.countryFilter };
                    }
                    break;
                case 'address':
                    opt.types = ['geocode'];
                    break;
            }

            scope.gPlace = new google.maps.places.Autocomplete(element[0], opt);
            google.maps.event.addListener(scope.gPlace, 'place_changed', function () {
                scope.$apply(function () {
                    var result = scope.gPlace.getPlace();
                    scope.countryModel = '';
                    scope.regionModel = '';
                    scope.stateModel = '';
                    scope.cityModel = '';
                    scope.addressModel = '';
                    scope.streetNumberModel = '';
                    scope.postalCodeModel = '';

                    console.log(result.address_components);

                    for (var comp in result.address_components) {
                        if (!result.address_components[comp].types)
                            continue;

                        if (result.address_components[comp].types.indexOf('country') >= 0)
                            scope.countryModel = result.address_components[comp].long_name;

                        else if (result.address_components[comp].types.indexOf('administrative_area_level_1') >= 0)
                            scope.regionModel = result.address_components[comp].long_name;

                        else if (result.address_components[comp].types.indexOf('administrative_area_level_2') >= 0)
                            scope.stateModel = result.address_components[comp].short_name;

                        else if (result.address_components[comp].types.indexOf('locality') >= 0)
                            scope.cityModel = result.address_components[comp].long_name;

                        else if (result.address_components[comp].types.indexOf('route') >= 0)
                            scope.addressModel = result.address_components[comp].long_name;

                        else if (result.address_components[comp].types.indexOf('street_number') >= 0)
                            scope.streetNumberModel = result.address_components[comp].long_name;

                        else if (result.address_components[comp].types.indexOf('postal_code') >= 0)
                            scope.postalCodeModel = result.address_components[comp].long_name;
                    }
                });
            });
        }
    };
}]);