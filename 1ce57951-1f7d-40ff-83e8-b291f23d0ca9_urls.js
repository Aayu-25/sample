
// routes.js
const express = require('express');
const unknownEntityController = require('./unknown-entity');

const router = express.Router();

const unknownEntity = new unknownEntityController();

// Define URL patterns
const urlpatterns = [
  { method: 'GET', path: '/api/unknown-entity', handler: unknownEntity.getUnknownEntity },
  { method: 'POST', path: '/api/unknown-entity', handler: unknownEntity.createUnknownEntity },
  { method: 'PUT', path: '/api/unknown-entity/:id', handler: unknownEntity.updateUnknownEntity },
  { method: 'DELETE', path: '/api/unknown-entity/:id', handler: unknownEntity.deleteUnknownEntity },
];

module.exports = router;
