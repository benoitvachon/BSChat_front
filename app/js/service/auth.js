studycom.factory('Auth', ['$http', '$localStorage', function ($http, $localStorage, $q, $mdDialog) {
    function urlBase64Decode(str) {
        var output = str.replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw 'Illegal base64url string!';
        }
        return window.atob(output);
    }

    function getClaimsFromToken() {
        var token = $localStorage.token;
        var user = {};
        if (typeof token !== 'undefined') {
            var encoded = token.split('.')[1];
            user = JSON.parse(urlBase64Decode(encoded));
        }
        return user;
    }

    var tokenClaims = getClaimsFromToken();

    function getUser() {
        if(typeof $localStorage.token !== 'undefined') {
            var tokenClaim = getClaimsFromToken();
            var userPromise = $http.get('https://api.bschat.guillaumeperes.fr/api/user/'+tokenClaim.sub).then(function (response) {
                return response.data;
            });
            return userPromise;
        }
        return null;

    }


    return {
        signup: function (data, success, error) {
            $http.post('https://api.bschat.guillaumeperes.fr/api/signup', data).then(function(response) {
                if(response.data == '') {
                    error();
                }
                else {
                    $localStorage.token = response.data.token;
                    window.location = 'https://bschat.guillaumeperes.fr/#/home';
                    success();
                }

            });
        },
        signin: function (data, success, error) {
            $http.post('https://api.bschat.guillaumeperes.fr/api/signin', data).then(function(response){
                if(response.data == false) {
                    error();
                }
                else {
                    $localStorage.token = response.data.token;
                    window.location = 'https://bschat.guillaumeperes.fr/#/home';
                    success();
                }

            });
        },
        logout: function (data) {
            tokenClaims = {};
            $http.post('https://api.bschat.guillaumeperes.fr/api/logout', data).then(function(response) {
                delete $localStorage.token;
                window.location = 'https://bschat.guillaumeperes.fr/#/';
            });

        },
        getTokenClaims: function () {
            return tokenClaims;
        },

        user: function () {
            return getUser();
        },

        isConnected : function () {
            if($localStorage.token) {
                return true;
            }
            return false;
        }
    };
}
]);