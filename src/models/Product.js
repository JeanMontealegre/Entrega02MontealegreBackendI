import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  code: String,
  stock: Number,
  category: String,
});

const Product = mongoose.model('Product', productSchema);

export default Product;
