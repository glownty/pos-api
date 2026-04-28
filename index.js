const express = require('express');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productsRoutes');
const salesRoutes = require('./routes/salesRoutes');
const cashRegisterRoutes = require('./routes/cashRegisterRoutes');
const errorHandler = require('./middlewares/errorHandler');
const path = require('path');


const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/sales', salesRoutes);
app.use('/cashRegister', cashRegisterRoutes);

app.use(express.static(path.join(__dirname, 'front')));

app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));