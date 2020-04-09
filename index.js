const fetch = require('node-fetch')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const port = 3004

const creditasUrl = 'http://localhost:3003'

const store = {
  '106': { // 11 Pro Prateado 512GB
    id: '6b7c0869-5052-4bf4-92b9-97aac9b216a8',
    name: 'iPhone 11 Pro Prateado 512GB',
    imageUrl: 'https://creditas.vteximg.com.br/arquivos/ids/155769/image-a87c513a1af942d89834ec11ea6d8021.jpg?v=637091096791000000',
    price: 1000,
  },
  '20': { // 11 Pro Max Verde Meia Noite 256
    id: 23456,
    name: 'iPhone 11 Pro Max Verde Meia Noite 256GB',
    imageUrl: 'https://creditas.vteximg.com.br/arquivos/ids/155467/image-dfb56aaf1492488b9f4eb868d616f98f.jpg?v=637091086249630000',
    price: 1500
  },
}

app.use(bodyParser.json())
app.options('*', cors())

app.post('/creditas-order', cors(), async (req, res) => {
  console.log('received from app front', req.body)
  const { skus } = req.body;

  const products = skus.map(sku => {
    const product = { ...store[sku] }
    delete product.id
    return product
  });

  const total = skus.reduce((acc, sku) => acc + store[sku].price, 0)
  const successUrl = 'http://localhost:3000/success'

  console.log('requesting order in creditas pay', { products, total, successUrl })

  const response = await fetch(`${creditasUrl}/order`, { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      products,
      total,
      successUrl,
    })
  })
  const { orderId } = await response.json()
  res.send({ orderId })
})

app.listen(port, () => console.log(`Ecommerce server app listening at http://localhost:${port}`))