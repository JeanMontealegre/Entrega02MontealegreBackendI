import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const newCart = new Cart({ products: [] }); 
    const savedCart = await newCart.save(); 
    res.status(201).json(savedCart);
  } catch (error) {
    console.error('Error al crear el carrito:', error);
    res.status(500).json({ error: 'No se pudo crear el carrito' });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate('products.product');
    if (cart) {
      res.json(cart.products);
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).json({ error: 'No se pudo obtener el carrito' });
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    if (cart) {
      const product = await Product.findById(pid);
      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      const existingProduct = cart.products.find(p => p.product.equals(pid));
      if (existingProduct) {
        existingProduct.quantity += 1; 
      } else {
        cart.products.push({ product: pid, quantity: 1 }); 
      }

      await cart.save();
      res.status(201).json(cart);
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ error: 'No se pudo agregar el producto al carrito' });
  }
});

export default router;
