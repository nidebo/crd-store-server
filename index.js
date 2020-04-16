const fetch = require('node-fetch')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const port = 3004

const creditasUrl = 'http://localhost:3003'
const PaymentMethodType = {
  EMPTY: 'EMPTY',
  FULL: 'FULL',
  BALLOON: 'BALLOON',
  BALLOON_RETURN: 'BALLOON_RETURN',
}
const store = {
  '106': { // 11 Pro Prateado 512GB
    id: '6b7c0869-5052-4bf4-92b9-97aac9b216a8',
    name: 'iPhone 11 Pro',
    imageUrl: 'https://creditas.vteximg.com.br/arquivos/ids/155769/image-a87c513a1af942d89834ec11ea6d8021.jpg?v=637091096791000000',
    displayExtraItem: false,
    price: 1000,
    variation:     {
      id: 'bd263b9b-ab44-4149-8ac3-623dcdf18fd4',
      sku: '111',
      color: {
        code: '#FAD7BD',
        nameLiteral: 'BACKEND.PRODUCT.CONFIGURATION.COLOR.SILVER',
      },
      capacity: '512GB',
      minimumMonthlyPrice: 'R$ 289,90',
      paymentMethods: [
        {
          id: '84badd6b-cf1c-4080-b5ca-78d94356aa82',
          type: PaymentMethodType.FULL,
          installment: 24,
          monthlyPrice: 'R$ 374,96',
          interestPercentage: '1.155187482',
          totalPrice: 'R$ 8.999,00',
        },
        {
          id: '2aef1bcc-0c33-4ad0-9225-5b5a90c80448',
          type: PaymentMethodType.BALLOON,
          installment: 24,
          balloonPercentage: 30.0,
          interestPercentage: '1.389913429',
          monthlyPrice: 'R$ 289,90',
          totalPrice: 'R$ 9.657,30',
          balloonPrice: 'R$ 2.699,70',
        },
      ],
      sellerPrice: 'R$ 7.820,13',
    },
  },
  '27': { // 11 Pro Verde meia-noite 64GB
    id: '0fe022a6-a6a3-4cc9-b2f1-8a8ade6d9366',
    name: 'iPhone 11 Pro',
    imageUrl: 'https://creditas.vteximg.com.br/arquivos/ids/155495/image-9efbf1afb11c4583819024ea2a2db464.jpg?v=637091088392730000',
    displayExtraItem: true,
    price: 1000,
    variation:     {
      id: 'bd263b9b-ab44-4149-8ac3-623dcdf18fd4',
      sku: '111',
      color: {
        code: '#4E5851',
        nameLiteral: 'BACKEND.PRODUCT.CONFIGURATION.COLOR.MIDNIGHT_GREEN',
      },
      capacity: '64GB',
      minimumMonthlyPrice: 'R$ 229,90',
      paymentMethods: [
        {
          id: '84badd6b-cf1c-4080-b5ca-78d94356aa82',
          type: PaymentMethodType.FULL,
          installment: 24,
          monthlyPrice: 'R$ 832,54',
          interestPercentage: '1.155187482',
          totalPrice: 'R$ 19.981,13',
        },
        {
          id: '2aef1bcc-0c33-4ad0-9225-5b5a90c80448',
          type: PaymentMethodType.BALLOON,
          installment: 24,
          balloonPercentage: 30.0,
          interestPercentage: '1.389913429',
          monthlyPrice: 'R$ 832,54',
          totalPrice: 'R$ 19.981,13',
          balloonPrice: 'R$ 8.423,10',
        },
      ],
      sellerPrice: 'R$ 6.082,13',
    },
  },
  '20': { // 11 Pro Max Verde Meia Noite 256
    id: 23456,
    displayExtraItem: true,
    name: 'iPhone 11 Pro Max',
    imageUrl: 'https://creditas.vteximg.com.br/arquivos/ids/155467/image-dfb56aaf1492488b9f4eb868d616f98f.jpg?v=637091086249630000',
    price: 1500,
    variation:     {
      id: 'bd263b9b-ab44-4149-8ac3-623dcdf18fd4',
      sku: '111',
      color: {
        code: '#FAD7BD',
        nameLiteral: 'BACKEND.PRODUCT.CONFIGURATION.COLOR.MIDNIGHT_GREEN',
      },
      capacity: '512GB',
      minimumMonthlyPrice: 'R$ 289,90',
      paymentMethods: [
        {
          id: '84badd6b-cf1c-4080-b5ca-78d94356aa82',
          type: PaymentMethodType.FULL,
          installment: 24,
          monthlyPrice: 'R$ 374,96',
          interestPercentage: '1.155187482',
          totalPrice: 'R$ 8.999,00',
        },
        {
          id: '2aef1bcc-0c33-4ad0-9225-5b5a90c80448',
          type: PaymentMethodType.BALLOON,
          installment: 24,
          balloonPercentage: 30.0,
          interestPercentage: '1.389913429',
          monthlyPrice: 'R$ 289,90',
          totalPrice: 'R$ 9.657,30',
          balloonPrice: 'R$ 2.699,70',
        },
      ],
      sellerPrice: 'R$ 7.820,13',
    },
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