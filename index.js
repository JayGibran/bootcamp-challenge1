const express = require("express");

const server = express();

server.use(express.json());

let projects = [];

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(pj => pj.id == id);
  if (!project) {
    return res.status(400).json("Project doesn't exist");
  }
  next();
}

server.use((req, res, next) => {
  console.count();
  next();
});

server.post("/projects", (req, res) => {
  const id = Math.random()
    .toString(36)
    .substr(2, 9);
  const { title } = req.body;
  projects.push({ id, title, tasks: [] });
  res.json(projects);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  projects = projects.map(pj => {
    return pj.id == id ? { ...pj, title: title } : pj;
  });
  res.json(projects);
});

server.put("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  projects = projects.map(pj => {
    return pj.id == id ? { ...pj, tasks: [...pj.tasks, title] } : pj;
  });
  res.json(projects);
});

server.get("/projects", (req, res) => {
  res.json(projects);
});

server.get("/project/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const project = projects.find(pj => pj.id == id);
  res.json(project);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  projects.splice(projects.findIndex(pj => pj.id == id), 1);
  return res.send();
});

server.listen(3000);
