const express = require('express')
const uuid = require('uuid')
const port = 3001
const app = express()
app.use(express.json())

//=> just for illustration of a database
const orders = []
//=> Middleware
const checkOrdersId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {
        return response.status(404).json({ message: 'order not found' })
    }

    request.orderIndex = index
    request.orderId = id

    next()
}
//=> Middleware   
const shippingMeans = (request, response, next) => {

    const method = request.method
    const url = request.path
    console.log('Method:', method, '***', 'URL', url)

    next()
}

app.post('/orders', shippingMeans, (request, response) => {
    const { clientName, order, price } = request.body

    const orderNumbers = { id: uuid.v4(), clientName, order, price, status: 'PREPARING order' }

    orders.push(orderNumbers)

    return response.status('201').json(orderNumbers)
})

app.get('/orders', shippingMeans, (request, response) => {
    return response.status('201').json(orders)
})

app.put('/orders/:id', checkOrdersId, shippingMeans, (request, response) => {
    const { clientName, order, price } = request.body
    const index = request.orderIndex
    const id = request.orderId

    const orderChange = { id, clientName, order, price, status: 'change in order... WILL DELAY' }

    orders[index] = orderChange

    return response.status('208').json(orderChange)
})

app.delete('/orders/:id', checkOrdersId, shippingMeans, (request, response) => {
    const index = request.orderIndex

    orders.splice(index, 1)

    return response.status('204').json(orders)
})

app.get('/orders/:id', checkOrdersId, shippingMeans, (request, response) => {
    
    const index = request.orderIndex
    const order = orders[index]

    return response.status('208').json(order)
})

app.patch('/orders/:id', checkOrdersId, shippingMeans, (request, response) => {
    const index = request.orderIndex

    const { id, clientName, order, price } = orders[index]
    const orderReady = { id, clientName, order, price, status: 'READY !!!'}

    orders[index] = orderReady

    return response.status('200').json(orderReady)
})

app.listen(port, () => {
    console.log(`⚡🏆 Server started on port ${port}🏆⚡`)
})