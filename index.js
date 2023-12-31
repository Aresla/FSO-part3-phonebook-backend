const express = require('express')
const app = express()

const cors = require('cors')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())
app.use(requestLogger)
app.use(cors())
app.use(express.static('dist'))

const today = new Date();

let persons = [
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
    response.send('<h1>The phonebook</h1>')
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${today.toString()}</p> `)
  })

  
app.get('/api/persons', (request, response) => {
response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
const id = Number(request.params.id)
const person = persons.find(person => person.id === id)
if (person) {
    response.json(person)
    } else {
    response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
}

app.post('/api/persons', (request, response) => {
    console.log('getting person post: ', request.body);
    const body = request.body
  
    if (!body) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }

    if (!body.name) {
      return response.status(400).json({ 
        error: 'name is missing' 
      })
    }

    if (!body.number) {
      return response.status(400).json({ 
        error: 'number is missing' 
      })
    }

    const sameName = persons.find(person => person.name === body.name)
    if (sameName) {
      return response.status(400).json({ 
        error: 'Name must be unique' 
      })
    }

  
    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
})

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})