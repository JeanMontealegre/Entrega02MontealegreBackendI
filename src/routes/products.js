import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    req.app.get('io').emit('newProduct', newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ error: 'No se pudo crear el producto' });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(pid);
    if (deletedProduct) {
      req.app.get('io').emit('deleteProduct', deletedProduct);
      res.status(200).json(deletedProduct);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ error: 'No se pudo eliminar el producto' });
  }
});

export default router;
