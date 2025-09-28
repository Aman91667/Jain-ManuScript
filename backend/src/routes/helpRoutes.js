const express = require('express');
const router = express.Router();

router.get('/faq', (req, res) => {
  res.json([
    { question: "How to sign up?", answer: "Use /signup/user or /signup/researcher." },
    { question: "How to apply for researcher?", answer: "Use /apply-for-researcher endpoint." }
  ]);
});

module.exports = router;
