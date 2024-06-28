import express from 'express';
import userRoute from './routes/auth.js';
import connectToMongoDB from './config/connect_mongo.js';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import productGetRoute from './routes/product_get.js';
import productPost from './routes/products_post.js';
import userCart from './routes/cart.js';
import serverless from 'serverless-http';
dotenv.config();
// Initialize Express app
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use("/auth", userRoute);
app.use("/productGet", productGetRoute);
app.use("/productPost", productPost);
app.use("/cart", userCart);
connectToMongoDB();

// app.get('/' , async(req,res) => {
//   res.send('Hi this is Test');
// });
const port = process.env.PORT;
// Connect to MongoDB and start server
export const handler = serverless(app);
//app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));