const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 4001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const dataFilePath = path.join(__dirname, 'data.json');

// Initialize data file if not exists
if (!fs.existsSync(dataFilePath)) {
  const initialData = {
    skills: [],
    projects: []
  };
  fs.writeFileSync(dataFilePath, JSON.stringify(initialData, null, 2));
}

// Helper to read data
function readData() {
  const jsonData = fs.readFileSync(dataFilePath);
  return JSON.parse(jsonData);
}

// Helper to write data
function writeData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

// Routes for skills
app.get('/api/skills', (req, res) => {
  const data = readData();
  res.json(data.skills);
});

app.post('/api/skills', (req, res) => {
  const data = readData();
  const { name, level } = req.body;
  const newSkill = { id: Date.now(), name, level };
  data.skills.push(newSkill);
  writeData(data);
  res.json(newSkill);
});

app.put('/api/skills/:id', (req, res) => {
  const data = readData();
  const { id } = req.params;
  const { name, level } = req.body;
  const skillIndex = data.skills.findIndex(s => s.id == id);
  if (skillIndex === -1) return res.status(404).json({ error: 'Skill not found' });
  data.skills[skillIndex] = { id: Number(id), name, level };
  writeData(data);
  res.json(data.skills[skillIndex]);
});

app.delete('/api/skills/:id', (req, res) => {
  const data = readData();
  const { id } = req.params;
  data.skills = data.skills.filter(s => s.id != id);
  writeData(data);
  res.json({ message: 'Skill deleted' });
});

// Routes for projects
app.get('/api/projects', (req, res) => {
  const data = readData();
  res.json(data.projects);
});

app.post('/api/projects', (req, res) => {
  const data = readData();
  const { title, description } = req.body;
  const newProject = { id: Date.now(), title, description };
  data.projects.push(newProject);
  writeData(data);
  res.json(newProject);
});

app.put('/api/projects/:id', (req, res) => {
  const data = readData();
  const { id } = req.params;
  const { title, description } = req.body;
  const projectIndex = data.projects.findIndex(p => p.id == id);
  if (projectIndex === -1) return res.status(404).json({ error: 'Project not found' });
  data.projects[projectIndex] = { id: Number(id), title, description };
  writeData(data);
  res.json(data.projects[projectIndex]);
});

app.delete('/api/projects/:id', (req, res) => {
  const data = readData();
  const { id } = req.params;
  data.projects = data.projects.filter(p => p.id != id);
  writeData(data);
  res.json({ message: 'Project deleted' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
