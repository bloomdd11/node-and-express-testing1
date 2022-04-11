const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const { result } = require('lodash');

// express app
const app = express();

// connect to mongodb
const dbURI = 'mongodb+srv://kaung:kaung12345@cluster0.9m7sm.mongodb.net/note-tuts?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log('connected to dbURL'))
    .then((result) => app.listen(3000))
    .catch((err) => console.log('connection to dbURL fail:\n', err))

// set view engine
app.set('view engine', 'ejs')


// morgan and static
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));


app.get('/', (req, res) => {
    res.redirect('blogs');
})
app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create' });
});

app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
        .then(result => {
            res.render('details', { blog: result, title: 'blog details' })
        })
        .catch(err => {
            console.log(err);
        })
});

app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/blogs' });
        })
        .catch(err => {
            console.log('server error : \n ', err);
        })
});

// blog route
app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('index', { title: 'All blogs', myblogs: result })
        })
        .catch((err) => {
            console.log('blog route : ', err);
        })
});

app.post('/blogs', (req, res) => {
    const blog = new Blog(req.body);
    blog.save()
        .then((result) => {
            res.redirect('blogs');
        })
        .catch((err) => {
            console.log(err);
        })
});
// 404
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
})