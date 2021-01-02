const fs = require('fs');

/* // klasördeki dosyaları liste halinde gösterir.
const files = fs.readdir('./', function(error, data) {

    if(error) {
        console.log(error);
    }else {
        console.log(data);
    }

});
*/

/* // gönderilen dosyanın içeriğini utf-8 formatında okur.
const data =fs.readFile('index.html', 'utf-8', function(error,data) {
    if(error) {
        console.log(error);
    }else {
        console.log(data);
    }
})
*/

/* // deneme.txt diye bir dosya yaratır ve içine Hello World yazar (Eğer dosya varsa içindeki tüm içerik temizlenir ve içerisine gönderilen data ile tekrar oluşturulur)
fs.writeFile('deneme.txt', 'Hello World', function(error) {
    if(error) {
        console.log(error);
    }else {
        console.log('Dosya oluşturuldu.');
    }
})
*/

/* // deneme.txt diye bir dosya yaratır ve içine Hello World yazar (Eğer dosya yoksa oluşturur varsa içerisine gönderilen içeriği temizlemez gönderilen datayı ekler.)
fs.appendFile('deneme1.txt', 'Hello World...', function(error) {
    if (error) {
        console.log(error);
    } else {
        console.log('Dosya oluşturuldu.');
    }
});
*/

/* // deneme1.txt dosyasını siler.
fs.unlink('deneme1.txt', function(error) {
    console.log('Dosya silindi.')
});
*/

/* // deneme.txt dosyasının adını deneme1.txt olarak değiştirir.
fs.rename('deneme.txt','deneme1.txt', function (error) {
    console.log('Dosya ismi değiştirildi.')
})
*/

/*
fs.rename('deneme.txt','deneme1.txt', function (error) {
    if (error) {
        console.log(error)
    } else {
        console.log('Dosya ismi değiştirildi.')
    }
})
*/