import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import productRoutes from './routes/products.js'
import categoryRoutes from './routes/categories.js'


dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)


mongoose.connect(process.env.MONGO_URI, { autoIndex: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch(err => {
    console.error('Mongo connection error:', err)
  })
