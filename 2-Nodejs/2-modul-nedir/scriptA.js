// // browser

// // IIFE

// var controllerA = (function(){

//     // scope A
//     // private
//     var age = 20;
//     var firstName = "Murat";

//     var log = function(){
//         console.log(this.firstName)
//     }

//     // public
//     return {
//         firstName,
//         log,
//     }


// })();




// // node js

// private members
var age = 30;

// public members
var firstName = "Murat";
var log = function(name){
    console.log(name);
}

// module.exports.log = log;
// module.exports.name = firstName;

module.exports = { // tek tek yazmak yerine bu şekilde bir arada export edebiliriz.
    firstName,
    log
}