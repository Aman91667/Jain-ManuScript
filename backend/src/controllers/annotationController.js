// annotationController.js - Handles business logic for annotations.

const Annotation = require('../models/Annotation');

// Gets all annotations for a specific manuscript.
exports.getManuscriptAnnotations = async (req, res) => {
  try {
    const annotations = await Annotation.find({ manuscriptId: req.params.id });
    res.json(annotations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Adds a new annotation to a manuscript.
exports.addAnnotation = async (req, res) => {
  try {
    const { text, pageNumber, position } = req.body;
    const newAnnotation = new Annotation({
      manuscriptId: req.params.id,
      userId: req.user.id,
      userName: req.user.name,
      text,
      pageNumber,
      position,
    });
    await newAnnotation.save();
    res.status(201).json(newAnnotation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// TODO: Add functions for updating and deleting annotations here.