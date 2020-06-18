const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function testId(request, response, next) {
  const { id } = request.params;

  if (isUuid(id)) {
    return next();
  } else {
    response.status(400).json("Id not exists or params ");
  }
}

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { body } = request;

  if (
    typeof body.title === "string" &&
    typeof body.url === "string" &&
    typeof body.techs === "object"
  ) {
    const newRepositorie = {
      id: uuid(),
      title: body.title,
      url: body.url,
      techs: body.techs,
      likes: 0,
    };

    repositories.push(newRepositorie);

    response.status(201).json(newRepositorie);
  }
});

app.put("/repositories/:id", testId, (request, response) => {
  const { body } = request;
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex((e) => e.id === id);

  repositories[repositorieIndex] = {
    ...repositories[repositorieIndex],
    ...body,
    likes: repositories[repositorieIndex].likes,
  };

  response.status(202).json(repositories[repositorieIndex]);
});

app.delete("/repositories/:id", testId, (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex((e) => e.id === id);

  repositories.splice(repositorieIndex, 1);

  response.status(204).json({ message: "Removido com sucesso!" });
});

app.post("/repositories/:id/like", testId, (request, response) => {
  const { id } = request.params;
  const repositorieIndex = repositories.findIndex((e) => e.id === id);

  repositories[repositorieIndex].likes += 1;

  response.status(202).json(repositories[repositorieIndex]);
});

module.exports = app;
