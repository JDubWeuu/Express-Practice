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

const checkID = (id) => {
    return data.find((entry) => entry.id === id)
}

app.get('/api/persons/:id',  (request, response) => {
    // use 'params' to access something within the url
    const id = Number(request.params.id);
    const res = checkID(id)
    if (res) {
        response.json(res)
    }
    response.status(400).end();

})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const res = checkID(id)

    if (!res) {
        response.status(400).end()
    }
    // return a new array where the id that's being deleted is filtered out
    data = data.filter((entry) => {
        return entry.id !== id
    })
    console.log(data)
    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

/*
setCountries((currCountries) => {
    const newCountry = {id: 1, name:"placeholder", population: 3204005}
    return [...currCountries, newCountry]
})
 */