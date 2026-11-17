const express = require("express");
const {
  getNotes,
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
} = require("../controllers/notesController");
const { isAuthorized, isLoggedIn } = require("../middleware/isAuthorized");

const router = express.Router();

// iNoteBook Notes CRUD Routes (supports both /api/update-note/:id & /api/notes/:id)
router.get("/notes", isAuthorized, isLoggedIn, getNotes);
router.get("/notes/:id", isAuthorized, isLoggedIn, getNoteById);
router.post("/notes", createNote);
router.put("/update-note/:id", updateNote);
router.put("/notes/:id", updateNote);
router.delete("/delete-note/:id", deleteNote);
router.delete("/notes/:id", deleteNote);

module.exports = router;
