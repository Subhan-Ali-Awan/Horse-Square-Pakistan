const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Blog = require('./models/Blog');
require('dotenv').config();

const clearBlogs = async () => {
    try {
        await connectDB();
        await Blog.deleteMany({});
        console.log('Successfully cleared blogs collection. It will reseed automatically.');
        process.exit(0);
    } catch (err) {
        console.error('Error clearing blogs:', err);
        process.exit(1);
    }
};

clearBlogs();
