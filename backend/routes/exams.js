const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Get exams endpoint' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create exam endpoint' });
});

module.exports = router;