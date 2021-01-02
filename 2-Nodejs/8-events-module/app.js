const Logger = require('./logger');
const logger = new Logger(); // bize gelen class üzerinden bir obje ürettik.
// ürettiğimiz obje üzerinden emittera ulaşabiliyoruz.

// listener kayıt et
logger.on('connection', function(args) {
    console.log('Bağlantı kuruldu.', args);
});

logger.log('Murat Altınpınar Login oldu.');  
// Logger classından ürettiğimiz obje üzerinden log fonksiyonuna ulaştık.
// HttpServer'ında bir EventEmitter olduğunu bilmeniz gerekiyor.