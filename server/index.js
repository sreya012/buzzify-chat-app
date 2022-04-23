const express = require('express');
const cors = require('cors');
//We now have the express

const authRoutes = require("./routes/auth.js");

//Creating an instance of that express application
const app = express();
const PORT = process.env.PORT || 5000;//specifying the PORT for our backend

//This will allow us to call the environment variables right inside of our node application
require('dotenv').config();

//setting up our middlewares. 
//cors() will allow us to make Cross Origin Requests
app.use(cors());
//This will allow us to pass JSON payloads from the frontend to the backend
app.use(express.json());
app.use(express.urlencoded());

//creating our first route
app.get('/', (req, res) => {
    res.send('Hello, World !');//Trying this out just to know that our backend server is running
});

//adding the routes to our whole server
app.use('/auth', authRoutes);

//We want to run our server on a specific port and we need to listen for it.
app.listen(PORT, () => console.log(`Server running on PORT : ${PORT}`));
