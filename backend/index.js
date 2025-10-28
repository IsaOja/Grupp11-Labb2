import express from 'express';
import path from 'path';
import { getClient } from './db.js';

// const express = require('express'),
//   path = require('path');
// const {} = require('./db');

const app = express(),
  port = process.env.PORT || 3000;

app.get('/api/', async (_req, res) => {});

app.use(express.static(path.join(path.resolve(), 'dist')));

app.listen(port, () => {
  console.log(`Redo på http://localhost:${port}/`);
});
