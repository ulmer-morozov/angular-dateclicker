# angular-dateclicker
Very simple angular basef angular based datepicker for birthdate.
Ordinary input date completes in four clicks.

#How to use

Link dateclicker to your app
`angular.module('app', ['dateclicker'])`

Change path to datepicker template in datecliker.js
`templateUrl: "YOUT_ANGULAR_TEMPLATES_FOLDER/dateclicker.html"`

use it in html:
`<dateclicker ng-model="persona.dateOfBirth" required name="dateOfBirth"></dateclicker>`
