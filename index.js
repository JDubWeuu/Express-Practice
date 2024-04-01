const express = require('express')

const app = express();

let data = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.json(data);
})

app.get('/info', (request, response) => {
    // obtain the time information for when this get request was made and show it on the screen
    const date = new Date();
    response.send(`<p>Phone book has info for ${data.length}</p><p>${date}</p>`);
})

app.get('/api/persons/:id',  (request, response) => {
    // use 'params' to access something within the url
    const id = Number(request.params.id);
    data.map((entry) => {
        if (entry.id === id) {
            response.json(entry);
        }
    })
    response.status(400).end();

})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})