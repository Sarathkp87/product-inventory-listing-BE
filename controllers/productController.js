import Product from '../models/Product.js'
import Category from '../models/Category.js'
import mongoose from 'mongoose'

export async function getAllProducts(req, res) {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      minStock,
      maxStock,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query

    const filter = {}

    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        filter.category = category
      } else {
        const cat = await Category.findOne({ name: category })
        if (cat) filter.category = cat._id
      }
    }

    if (search) {
      const regex = new RegExp(search, 'i')
      const catIds = await Category.find({ name: regex }).distinct('_id')
      filter.$or = [{ name: regex }, { category: { $in: catIds } }]
    }

    if (minStock || maxStock) {
      filter.stock = {}
      if (minStock) filter.stock.$gte = Number(minStock)
      if (maxStock) filter.stock.$lte = Number(maxStock)
    }

    const sort = { [sortBy]: order === 'asc' ? 1 : -1 }
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10)

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit, 10)),
      Product.countDocuments(filter),
    ])

    res.json({ products, total })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function getProductById(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid product ID' })
  }
  try {
    const product = await Product.findById(req.params.id).populate('category')
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

function validateFields(data) {
  const errors = {}
  if (!data.name || data.name.trim().length < 3) {
    errors.name = 'Name must be at least 3 characters'
  }
  if (data.price == null || data.price === '') {
    errors.price = 'Price is required'
  } else if (Number(data.price) <= 0) {
    errors.price = 'Price must be greater than 0'
  }
  if (!data.category) {
    errors.category = 'Category is required'
  }
  if (data.stock == null || data.stock === '') {
    errors.stock = 'Stock is required'
  } else if (Number(data.stock) < 0) {
    errors.stock = 'Stock cannot be negative'
  }
  return errors
}

export async function createProduct(req, res) {
  const errors = validateFields(req.body)
  if (Object.keys(errors).length) {
    return res.status(400).json({ errors })
  }
  if (!mongoose.Types.ObjectId.isValid(req.body.category) || !(await Category.findById(req.body.category))) {
    return res.status(400).json({ message: 'Invalid category' })
  }
  try {
    const product = await Product.create(req.body)
    const populated = await product.populate('category')
    res.status(201).json(populated)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export async function updateProduct(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid product ID' })
  }
  const errors = validateFields(req.body)
  if (Object.keys(errors).length) {
    return res.status(400).json({ errors })
  }
  if (!mongoose.Types.ObjectId.isValid(req.body.category) || !(await Category.findById(req.body.category))) {
    return res.status(400).json({ message: 'Invalid category' })
  }
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!product) return res.status(404).json({ message: 'Product not found' })
    const populated = await product.populate('category')
    res.json(populated)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export async function deleteProduct(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid product ID' })
  }
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json({ message: 'Product deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
