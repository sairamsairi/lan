const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/lan_chat', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const messageSchema = new mongoose.Schema({
    username: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

app.post('/api/messages', async (req, res) => {
    try {
        const newMessage = new Message({
            username: req.body.username,
            message: req.body.message
        });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: 'Error sending message' });
    }
});

app.get('/api/messages', async (req, res) => {
    try {
        const messages = await Message.find()
            .sort({ timestamp: 1 })
            .limit(100);
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching messages' });
    }
});

app.get('/extension', (req, res) => {
    // const filePath = path.join(__dirname, 'Allow-Right-Click-Chrome-Web-Store.crx'); 
    res.download('C:\\Users\\siddh\\OneDrive\\Desktop\\Full Stack Web Development\\QASystem\\backend\\Allow-Right-Click-Chrome-Web-Store.crx', 'Allow-Right-Click.crx', (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Error downloading file.');
        }
    });
});

app.get('/text', (req, res) => {
    // const filePath = path.join(__dirname, 'text.txt'); 
    res.sendFile('C:\\Users\\siddh\\OneDrive\\Desktop\\Full Stack Web Development\\QASystem\\backend\\text.txt');
});

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});