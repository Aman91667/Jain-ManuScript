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

// Updates an existing annotation.
// A user can only update their own annotations.
exports.updateAnnotation = async (req, res) => {
  try {
    const annotation = await Annotation.findById(req.params.id);
    if (!annotation) {
      return res.status(404).json({ message: 'Annotation not found' });
    }

    // Security check: Ensure the logged-in user owns this annotation.
    if (annotation.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: You can only update your own annotations' });
    }

    const { text, pageNumber, position } = req.body;
    if (text) annotation.text = text;
    if (pageNumber) annotation.pageNumber = pageNumber;
    if (position) annotation.position = position;

    await annotation.save();
    res.json(annotation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Deletes an existing annotation.
// A user can only delete their own annotations.
exports.deleteAnnotation = async (req, res) => {
  try {
    const annotation = await Annotation.findById(req.params.id);
    if (!annotation) {
      return res.status(404).json({ message: 'Annotation not found' });
    }

    // Security check: Ensure the logged-in user owns this annotation.
    if (annotation.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: You can only delete your own annotations' });
    }

    await annotation.deleteOne();
    res.json({ message: 'Annotation deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};