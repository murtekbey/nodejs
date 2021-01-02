const path = require('path');

let result =  path.resolve('app.js');

result = path.extname('app.js');
result = path.parse(__filename);

console.log(result.root); // bulunduğu root --> C:\\
console.log(result.dir); // dosyanın tam yolu
console.log(result.base); // dosyanın tam ismi
console.log(result.ext); // dosyanın uzantısı
console.log(result.name); // dosyanın ismi

console.log(result); // yukardaki tüm sonuçları dict içinde verir.