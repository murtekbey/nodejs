const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');

app.set('view engine', 'pug');
app.set('views', './views');

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/shop');

const errorController = require('./controllers/errors');
const sequelize = require('./utility/database')

const Category = require('./models/category');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cartItem');
const Order = require('./models/order');
const OrderItem = require('./models/orderItem');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        });
});

// Routes
app.use('/admin', adminRoutes);
app.use(userRoutes);

app.use(errorController.get404Page);

// Product.hasOne(Category); belongsTo fonksiyonunun aynısı.
Product.belongsTo(Category, { foreignKey: { allowNull: false } }); // Ürünler kategoriye bağlı.
Category.hasMany(Product); // Kategorilerin birden fazla ürünü olabilir.

Product.belongsTo(User); // Ürünler kullanıcıya bağlı.
User.hasMany(Product); // Kullanıcıların birden fazla ürünü olabilir.

User.hasOne(Cart); // Kullanıcıların bir Sepeti var.
Cart.belongsTo(User); // Sepetler kullanıcıya bağlı.

// Çoka çok ilişki olduğu için belongsToMany ile bağladık.
Cart.belongsToMany(Product, { through: CartItem }); // Bir sepet içerisinde birden fazla ürün olabilir.
Product.belongsToMany(Cart, { through: CartItem }); // Bir ürün birden fazla sepet içerisinde olabilir.
// CartItem --> Sepetin ve ürünlerin birleşim tablosu olucak.

Order.belongsTo(User); // Siparişler kullanıcıya bağlı.
User.hasMany(Order); // Kullanıcıların birden fazla siparişi olabilir.

// Çoka çok ilişki olduğu için belongsToMany ile bağladık.
Order.belongsToMany(Product, { through: OrderItem }); // Bir sipariş içerisinde birden fazla ürün olabilir
Product.belongsToMany(Order, { through: OrderItem }); // Bir ürün birden fazla sipariş içerisinde olabilir.
// OrderItem --> Siparişin ve ürünlerin birleşim tablosu olucak.

let _user;
sequelize
    // .sync({ force: true }) // tüm tabloları temizler ve tekrar oluşturur. (yeni düzene göre)
    .sync()
    .then(() => {

        User.findByPk(1)
            .then(user => {
                if (!user) {
                    return User.create({ name: 'murtekbey', email: 'murtekbey@gmail.com' });
                }
                return user;
            })
            .then(user => {
                _user = user;
                return user.getCart();
            })
            .then(cart => {
                if (!cart) {
                    return _user.createCart();
                }
                return cart;
            })
            .then(() => {
                Category.count()
                    .then(count => {
                        if (count === 0) { // eğer Kategori tablosunda veri yoksa
                            Category.bulkCreate([ // her seferinde 3 test kategori database eklenir.
                                { name: 'Telefon', description: 'Telefon kategorisi' },
                                { name: 'Bilgisayar', description: 'Bilgisayar kategorisi' },
                                { name: 'Elektronik', description: 'Elektronik kategorisi' },
                            ]);
                        }
                    });
            });
    })
    .catch(err => {
        console.log(err);
    });

app.listen(3000, () => {
    console.log('Listening on port 3000...');
});
