import express from 'express';
import { Server as SocketServer } from 'socket.io';
import http from 'http';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);

app.set('io', io);

mongoose.connect('mongodb://localhost:27017/miBaseDeDatos', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conexión a MongoDB exitosa'))
  .catch((err) => console.log('Error al conectar a MongoDB:', err));

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { title: 'Productos en Tiempo Real' });
});

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

server.listen(8080, () => {
  console.log('Servidor escuchando en el puerto 8080');
});
