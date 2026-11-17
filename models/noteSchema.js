const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Note title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Note description is required"],
      trim: true,
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
    link: {
      type: String,
      trim: true,
      default: "",
    },
    author: {
      type: String,
      trim: true,
      default: "Prachi Manwal (2501730365)",
    },
    createdOn: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
    // Optional file field (left optional as multer is not yet integrated)
    file: {
      type: String,
      required: false,
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
