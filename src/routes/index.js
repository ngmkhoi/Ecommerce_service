const ProdcutRouter = require('./ProductRouter');
const UserRouter = require('./UserRouter')

const routes = (app) => {
    app.use('/api/user', UserRouter)
    app.use('/api/product', ProdcutRouter)
}

module.exports = routes