// iNoteBook - Notes Controller attached with Mongoose noteSchema (migrated from Array to MongoDB Schema CRUD)
const Note = require("../models/noteSchema");

// GET: Retrieve all notes from MongoDB
const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (err) {
    console.error(err, "Error retrieving notes");
    next(err);
  }
};

// GET: Retrieve a single note by MongoDB _id
const getNoteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const element = await Note.findById(id);

    if (!element) {
      return res.status(404).json({ message: "Data Not found" });
    }

    res.status(200).json(element);
  } catch (err) {
    next(err);
  }
};

// POST: Create a new note in MongoDB (file field is optional until multer is added)
const createNote = async (req, res, next) => {
  try {
    const { title, description, link, author, createdOn, note, file, user } = req.body;

    const newNote = await Note.create({
      title,
      description,
      link,
      author,
      createdOn,
      note,
      file: file || null, // Optional field for future multer integration
      user: user || undefined,
    });

    res.status(201).json({
      message: "note created successfully",
      data: newNote,
    });
  } catch (err) {
    next(err);
  }
};

// PUT: Update an existing note by ID using Mongoose schema
const updateNote = async (req, res, next) => {
  try {
    const { id } = req.params;

    const note = await Note.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!note) {
      return res.status(404).json({ message: "Data Not Found" });
    }

    res.status(200).json({
      message: "Notes Updated",
      data: note,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE: Delete a note by ID from MongoDB
const deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const note = await Note.findByIdAndDelete(id);

    if (!note) {
      return res.status(404).json({ message: "Data Not Found" });
    }

    res.status(200).json({
      message: "Deleted successfully",
      id: note._id,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};
