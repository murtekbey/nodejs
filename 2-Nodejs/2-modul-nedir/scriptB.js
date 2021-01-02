// // tarayıcı


// var controllerB = (function () {

//     // scope B
//     var firstName = "Efe";

//     var log = function(){
//         console.log(this.firstName)
//     }


//     return {
//         firstName,
//         log,
//     }

// })();

// console.log(controllerA.firstName)
// console.log(controllerB.firstName)

const scriptA = require('./scriptA');

scriptA.log('Efe');
console.log(scriptA.name);
console.log(scriptA.age); // undefined --> private alana ulaşamazsın scriptA ya özel.