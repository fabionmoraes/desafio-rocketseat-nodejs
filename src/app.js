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
  const { url, title, techs } = request.body;

  const repositorie = { id: uuid(), url, title, techs, likes: 0 }

  repositories.push(repositorie);

  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { url, techs, title } = request.body;

  const repositorieIndex = repositories.findIndex(item => item.id === id);

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not found' });
  }

  const { likes } = repositories.find(item => item.id === id);

  const repositorie = { id, url, title, techs, likes};

  repositories[repositorieIndex] = { ...repositorie, likes };
  
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

  const repositorieIndex = repositories.findIndex(item => item.id === id);

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not found' });
  }

  const { url, title, techs, likes } = repositories.find(item => item.id === id);

  const count = 1 + likes;

  const repositorie = { id, url, title, techs, likes: count };

  repositories[repositorieIndex] = repositorie;
  
  return response.json({ likes: count });
});

module.exports = app;
