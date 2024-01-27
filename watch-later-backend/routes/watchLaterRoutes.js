// watchLaterRoutes.js (routes/watchLaterRoutes.js)
const express = require('express');
const router = express.Router();
const WatchLater = require('../models/watchLaterModel');

// Create a new watch later record
router.post('/', async (req, res) => {
  try {
    const watchLater = new WatchLater(req.body);
    await watchLater.save();
    res.status(201).send(watchLater);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all watch later records
router.get('/', async (req, res) => {
  try {
    const watchLaterRecords = await WatchLater.find();
    res.send(watchLaterRecords);
  } catch (error) {
    res.status(500).send(error);
  }
});


router.put('/:id', async (req, res) => {
    try {
  
      const watchLater = await WatchLater.findByIdAndUpdate(req.params.id, req.body, { new: true });
  
      if (!watchLater) {
        return res.status(404).send({ error: 'Watch Later item not found' });
      }
  
      res.send(watchLater);
    } catch (error) {
      console.error('Error updating watch later item:', error);
      res.status(500).send(error);
    }
  });
  
router.delete('/:id', async (req, res) => {
    try {
    
      const watchLater = await WatchLater.findByIdAndDelete(req.params.id);
  
      if (!watchLater) {
        return res.status(404).send({ error: 'Watch Later item not found' });
      }
  
      res.send(watchLater);
    } catch (error) {
      console.error('Error deleting watch later item:', error);
      res.status(500).send(error);
    }
  });
  
module.exports = router;
