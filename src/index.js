const express = require("express");

const { v4: uuid, validate }  = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checksExistsRepository(request, response, next) {
  const {id} = request.params;
  if (!validate(id)) {
    return response.status(404).json({ error: "Not Found" });
  }
  
  const repository = repositories.find(repositorie => repositorie.id === id);
  if (!repository) {
    return response.status(404).json({ error: "Not Found" });
  } 
  request.repository = repository;
  return next();
}


app.get("/repositories", (request, response) => {

  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };
  repositories.push(repository);
  return response.status(200).json(repository);
});

app.put("/repositories/:id",checksExistsRepository, (request, response) => {
  const { repository } = request;
  const {title, url, techs} = request.body;

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.json(repository);
});

app.delete("/repositories/:id", checksExistsRepository, (request, response) => {
  //const { id } = request.params;
  const { repository } = request;

 // repositoryIndex = repositories.findIndex(repository => repository.id === id);

  //if (repositoryIndex > 0) {
   // return response.status(404).json({ error: "Repository not found" });
  //}
  repositoryIndex = repositories.indexOf(repository);
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checksExistsRepository, (request, response) => {
  const { repository } = request;
  const likes = repository.likes++;
  
  console.log(repository.likes);
  return response.json(repository);
});

module.exports = app;
