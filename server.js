const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const app = express();
const PORT = 5000;
const SECRET_KEY = "your_secret_key";


app.use(express.json());
app.use(cors());


mongoose.connect('mongodb://localhost:27017/healthtreads', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String,
});


const ChatSchema = new mongoose.Schema({
    chatType: String, // "emergency" or "doctor"
    sender: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});


const PostSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String,
    comments: [{ commenter: String, text: String }]
});


const User = mongoose.model('User', UserSchema);
const Chat = mongoose.model('Chat', ChatSchema);
const Post = mongoose.model('Post', PostSchema);


// User Registration
app.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();
    res.json({ message: 'User registered successfully' });
});


// User Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ username, role: user.role }, SECRET_KEY);
        res.json({ token, role: user.role });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});


// Fetch Chat Messages
app.get('/chats/:type', async (req, res) => {
    const chats = await Chat.find({ chatType: req.params.type });
    res.json(chats);
});


// Post a Chat Message
app.post('/chats', async (req, res) => {
    const { chatType, sender, message } = req.body;
    const newChat = new Chat({ chatType, sender, message });
    await newChat.save();
    res.json({ message: 'Chat message saved' });
});


// Fetch Community Posts
app.get('/posts', async (req, res) => {
    const posts = await Post.find();
    res.json(posts);
});


// Create a Post
app.post('/posts', async (req, res) => {
    const { title, content, author } = req.body;
    const newPost = new Post({ title, content, author, comments: [] });
    await newPost.save();
    res.json({ message: 'Post created successfully' });
});


// Add a Comment
app.post('/posts/:id/comments', async (req, res) => {
    const { commenter, text } = req.body;
    await Post.findByIdAndUpdate(req.params.id, { $push: { comments: { commenter, text } } });
    res.json({ message: 'Comment added' });
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
