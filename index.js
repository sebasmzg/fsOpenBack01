const http = require("http");
const express = require("express");
const cors = require("cors");
var morgan = require('morgan')

let persons = [
    {
        id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const app = express();
app.use(cors());
app.use(express.json());

const unknownEndpoint = (req,res)=>{
    res.status(404).send({error: "unknown endpoint"});
}

const generateId = () => {
    const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
    return maxId + 1;
}

app.get("/",(req,res)=>{
    res.send("<h1>API Phonebook</h1>");
})

app.get("/info",(req,res)=>{
    const date = new Date();
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`);
})

app.get("/api/persons",(req,res)=>{
    res.json(persons);
})

app.get("/api/persons/:id",(req,res)=>{
    const id = Number(req.params.id);
    const person = persons.find((person)=>person.id==id);
    if(person){
        res.json(person);
    } else {
        res.status(404).end();
    }
})

app.delete("/api/persons/:id",(req,res)=>{
    const id = Number(req.params.id);
    persons = persons.filter((person)=>person.id !== id);
    res.status(204).end();
})

app.post("/api/persons",(req,res)=>{
    const body = req.body;
    if(!body.name || !body.number){
        return res.status(400).json({
            error: "content missing",
        })
    }
    if(persons.find((person)=>person.name === body.name)){
        return res.status(400).json({
            error: "name must be unique",
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person);

    res.json(person);
})

app.use(morgan('tiny'));

const PORT = process.env.PORT || 3001