const express = require('express');
const fs = require('fs');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// GET endpoint to retrieve all users
app.get('/api/users', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading file');
            return;
        }
        const users = JSON.parse(data).users;
        res.json(users);
    });
});

// GET endpoint to search for a user by ID
app.get('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);

    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading file');
            return;
        }
        const users = JSON.parse(data).users;
        const user = users.find(u => u.id === userId);

        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        res.json(user);
    });
});

// POST api endpoint to add a new user
app.post('/api/users', (req, res) => {
    const newUser = req.body;

    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading file');
            return;
        }
        const users = JSON.parse(data).users;
        newUser.id = users.length ? users[users.length - 1].id + 1 : 1;
        users.push(newUser);

        fs.writeFile('data.json', JSON.stringify({ users }), (err) => {
            if (err) {
                res.status(500).send('Error writing file');
                return;
            }

            res.status(201).json(newUser);
        });
    });
});

// PUT endpoint to update an existing user
app.put('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const updatedUser = req.body;

    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading file');
            return;
        }
        const users = JSON.parse(data).users;
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            res.status(404).send('User not found');
            return;
        }

        users[userIndex] = { ...users[userIndex], ...updatedUser };

        fs.writeFile('data.json', JSON.stringify({ users }), (err) => {
            if (err) {
                res.status(500).send('Error writing file');
                return;
            }

            res.status(200).json(users[userIndex]);
        });
    });
});

// DELETE endpoint to remove an existing user
app.delete('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);

    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading file');
            return;
        }
        let users = JSON.parse(data).users;
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            res.status(404).send('User not found');
            return;
        }

        users = users.filter(u => u.id !== userId);

        fs.writeFile('data.json', JSON.stringify({ users }), (err) => {
            if (err) {
                res.status(500).send('Error writing file');
                return;
            }

            res.status(200).send('User deleted');
        });
    });
});

const port = process.env.port || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
