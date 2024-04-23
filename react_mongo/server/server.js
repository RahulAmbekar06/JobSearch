// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');

app.use(cors());


mongoose.connect("mongodb://localhost:27017/dbjob", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error: '));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(bodyParser.json());

const JobSchema = new mongoose.Schema({
  jobTitle: String,
  companyName: String,
  salary: Number,
  jobDescription: String,
});

const JobModel = mongoose.model('Job', JobSchema);

app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await JobModel.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

app.post('/api/jobs', async (req, res) => {
  console.log(res);
  try {
    const { jobTitle, companyName, salary, jobDescription } = req.body;
    const newJob = new JobModel({
      jobTitle,
      companyName,
      salary,
      jobDescription,
    });
    await newJob.save();
    res.json({message: 'Job created successfully', job:newJob});
  } catch (err) {
    res.status(500).json({error:err.message});
  }
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
