const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { url, techs } = request.body;

  const repositorie = { id: uuid(), url, techs, like: 0 }

  repositories.push(repositorie);

  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { url, techs } = request.body;

  const repositorieIndex = repositories.findIndex(item => item.id === id);

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not found' });
  }

  const { like } = repositories.find(item => item.id === id);

  const repositorie = { id, url, techs};

  repositories[repositorieIndex] = { ...repositorie, like };
  
  return response.json(repositorie);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(item => item.id === id);

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not found' });
  }

  repositories.splice(repositorieIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const { like } = request.body;

  const repositorieIndex = repositories.findIndex(item => item.id === id);

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not found' });
  }

  const repositorieLike = repositories.find(item => item.id === id);
  const { url, techs } = repositorieLike;

  const count = like + repositorieLike.like;

  const repositorie = { id, url, techs, like: count };

  repositories[repositorieIndex] = repositorie;
  
  return response.json(count);
});

module.exports = app;
