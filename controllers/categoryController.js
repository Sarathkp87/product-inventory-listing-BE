import mongoose from 'mongoose'
import Category from '../models/Category.js'

export async function getAllCategories(_req, res) {
  try {
    const categories = await Category.find().sort({ name: 1 })
    res.json(categories)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function getCategoryById(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid category ID' })
  }
  try {
    const category = await Category.findById(req.params.id)
    if (!category) return res.status(404).json({ message: 'Category not found' })
    res.json(category)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function createCategory(req, res) {
  if (!req.body.name || req.body.name.trim() === '') {
    return res.status(400).json({ message: 'Name is required' })
  }
  try {
    const category = await Category.create({ name: req.body.name.trim() })
    res.status(201).json(category)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export async function updateCategory(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid category ID' })
  }
  if (!req.body.name || req.body.name.trim() === '') {
    return res.status(400).json({ message: 'Name is required' })
  }
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name.trim() },
      { new: true, runValidators: true }
    )
    if (!category) return res.status(404).json({ message: 'Category not found' })
    res.json(category)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export async function deleteCategory(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid category ID' })
  }
  try {
    const category = await Category.findByIdAndDelete(req.params.id)
    if (!category) return res.status(404).json({ message: 'Category not found' })
    res.json({ message: 'Category deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
