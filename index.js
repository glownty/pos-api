const express = require('express');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productsRoutes');
const salesRoutes = require('./routes/salesRoutes');
const cashRegisterRoutes = require('./routes/cashRegisterRoutes');

const cors = require('cors');

app.use(cors());

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// FRONTEND
/*
app.use(express.static(path.join(__dirname, 'front')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'front', 'index.html'));
});
*/

// API
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/sales', salesRoutes);
app.use('/cashRegister', cashRegisterRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));