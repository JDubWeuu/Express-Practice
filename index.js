const express = require('express')
const morgan = require('morgan')

const app = express();

let data = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.json(data);
})

app.get('/info', (request, response) => {
    // obtain the time information for when this get request was made and show it on the screen
    const date = new Date();
    response.send(`<p>Phone book has info for ${data.length}</p><p>${date}</p>`).end();
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
    response.status(400).send({message: "Unable to access specified id; specified id doesn't exist"}).end();

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

// need this in order to conduct post request
app.use(express.json())

function generateRandomID() {
    let ids = data.map((object) => {
        return object.id
    })
    let id = null
    do {
        id = Math.round(Math.random()*1000)
    } while(ids.includes(id))
    console.log(id)
    return id
}

morgan.token('req-body', (req) => {
    // Convert the request body to a JSON string
    // Be cautious with logging sensitive information
    return JSON.stringify(req.body);
});

app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens['req-body'](req, res)
    ].join(' ')
}))

app.post('/api/persons/', (request, response) => {
    const body = request.body;
    const headers = request.headers
    console.log(request.headers)
    if (!body.name && !body.number) {
        response.status(400).send({message: "missing name and number"}).end()
    }
    const template = {
        "id": generateRandomID(),
        "name": body.name ? body.name : "",
        "number": body.number ? body.number : ""
    }
    data = [...data, template]
    response.json(data)
})

// middleware function, it's called if no routes handle the http requests, meaning the user most likely navigated to an unknown endpoint
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// if all the other routes aren't satisfied based on the user request, then the app will call the unknownEndpoint function which is middleware
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

// middleware is used as a means of handling requests and responses. With post requests, you need a way to handle the request body, and so you utilize a built in json-parser middleware function to do that
// you can also create your own middleware functions as a means of showing specific data for each route, so then put app.use(...) before your routes
// you can also use middleware functions after all your routes as a means of shwoing a message for an unknown endpoint

/*
setCountries((currCountries) => {
    const newCountry = {id: 1, name:"placeholder", population: 3204005}
    return [...currCountries, newCountry]
})
 */