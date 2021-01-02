const EventEmitter = require('events');

class Logger extends EventEmitter { // classa EventEmitter özelliği kazandırabilmek için extend EventEmitter dedik.

    log(message) { // classın içerisinde function keywordu olmaz.
        console.log(message);

        // event'i tetikle
        this.emit('connection', { id: 1, message: 'Hello' });
        // this diyerek Logger'dan bir nesne ürettiğinizde  o nesneyi kastetmiş oluyoruz.

    }
}

module.exports = Logger; // Logger Classını dışarıya açmamız gerekiyor. App.js'e yollamak için