const express = require('express');
require('dotenv').config();
const authRoutes = require("./routes/auth");

const app = express();

const PORT = process.env.PORT || 3000;

app.use("/auth", authRoutes);

app.listen(PORT, () => {
	console.log(`Serveur en ecoute sur le port ${PORT}`);
})