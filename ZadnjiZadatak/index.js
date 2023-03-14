const express = require('express');
const fs = require('fs');
const app = express();
const cors = require('cors');
app.use(cors());


app.use(express.json());

function saveData(data) {
  const jsonString = JSON.stringify(data, null, 2);
  console.log("Data to be saved:", jsonString);
  fs.writeFileSync('./data.json', jsonString);
}


// Get user by id
app.get('/users/:id', (req, res) => {
  fs.readFile('./data.json', 'utf8', (err, data) => {
    if (err) throw err;
    const users = JSON.parse(data).users;
    const user = users.find((user) => user.id === parseInt(req.params.id));
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.send(user);
  });
});

// Get post by id
app.get('/posts/:id', (req, res) => { 
  fs.readFile('./data.json', 'utf8', (err, data) => {
    if (err) throw err;
    const posts = JSON.parse(data).posts;
    const post = posts.find((post) => post.id === parseInt(req.params.id));
    if (!post) {
      return res.status(404).send('Post not found');
    }
    res.send(post);
  });
});
// Get all posts
app.get('/posts', (req, res) => {
  fs.readFile('./data.json', 'utf8', (err, data) => {
    if (err) throw err;
    const posts = JSON.parse(data).posts;
    res.send(posts);
  });
});

// Get all posts in range of 2 dates
/* app.get('/posts', (req, res) => {
  fs.readFile('./data.json', 'utf8', (err, data) => {
    if (err) throw err;
    const posts = JSON.parse(data).posts;
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);
    const filteredPosts = posts.filter((post) => {
      const postDate = new Date(post.last_update);
      return postDate >= startDate && postDate <= endDate;
    });
    res.send(filteredPosts);
  });
}); */
app.get('/users', (req, res) => {
  fs.readFile('./data.json', 'utf8', (err, data) => {
    if (err) throw err;
    const users = JSON.parse(data).users;
    res.send(users);
  });
});
// Get all posts
app.get('/posts', (req, res) => {
  fs.readFile('./data.json', 'utf8', (err, data) => {
    if (err) throw err;
    const posts = JSON.parse(data).posts;
    res.send(posts);
  });
});



// Post method to change email by user id
app.post('/users/:id/email', (req, res) => {
  fs.readFile('./data.json', 'utf8', (err, data) => {
    if (err) throw err;
    const parsedData = JSON.parse(data);
    const user = parsedData.users.find((user) => user.id === parseInt(req.params.id));
    if (!user) {
      return res.status(404).send('User not found');
    }
    user.email = req.body.email;
    saveData(parsedData); // save updated data to disk
    res.send(user);
  });
});

// Post method that allows creating a new post
app.post('/posts', (req, res) => {
  fs.readFile('./data.json', 'utf8', (err, data) => {
    if (err) throw err;
    const parsedData = JSON.parse(data);
    const { user_id ,title, body} = req.body;
    const last_update = new Date().toISOString();
    const newPost = { id: parsedData.posts.length + 1, user_id, title, body, last_update };
    parsedData.posts.push(newPost);
    saveData(parsedData); // save updated data to disk
    res.send(newPost);
  });
});

// Post method that allows creating a new user
app.post('/users', (req, res) => {
  fs.readFile('./data.json', 'utf8', (err, data) => {
    if (err) throw err;
    const parsedData = JSON.parse(data);
    const { name, email } = req.body;
    const newUser = { id: parsedData.users.length + 1, name, email };
    parsedData.users.push(newUser);
    saveData(parsedData); // save updated data to disk
    res.send(newUser);
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
