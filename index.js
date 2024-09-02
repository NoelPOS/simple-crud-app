const express = require('express')
const mongoose = require('mongoose')
const Product = require('./models/product.model.js')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.json({ message: 'Hello World' })
})

app.post('/post', (req, res) => {
  const data = req.body
  res.json(data)
})

app.post('/api/products', async (req, res) => {
  const data = req.body

  const product = {
    name: data.name,
    quantity: data.quantity,
    price: data.price,
  }

  const createdProduct = await Product.create(product)

  res.json(createdProduct)
})

app.put('/api/products/:id', async (req, res) => {
  const id = req.params.id
  const product = await Product.findById(id)
  if (product) {
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    })
    res.json(updatedProduct)
  } else {
    res.status(404).json({ message: 'Product not found' })
  }
})

app.delete('/api/products/:id', async (req, res) => {
  const id = req.params.id

  const product = Product.findById(id)
  if (product) {
    await Product.findByIdAndDelete(id)
    res.json({ message: 'Product removed' })
  } else {
    res.status(404).json({ message: 'Product not found' })
  }
})

app.get('/api/getProducts', async (req, res) => {
  const products = await Product.find()
  res.json(products)
})

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('Database Connected!'))
  .catch(() => console.log('Database Connection Failed!'))
