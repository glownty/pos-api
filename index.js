// server.js
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productsRoutes');
const salesRoutes = require('./routes/salesRoutes');



const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/products',productRoutes);
app.use('/sales', salesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));