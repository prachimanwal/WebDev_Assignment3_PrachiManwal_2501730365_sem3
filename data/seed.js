const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Product = require("../models/Product");
const Note = require("../models/noteSchema");
const initialProducts = require("./initialProducts");
const initialNotes = require("./initialNotes");

const seedDatabase = async () => {
  try {
    await connectDB();
    await Product.deleteMany({});
    await Note.deleteMany({});
    console.log("Cleared existing products and notes collections.");

    const createdProducts = [];
    for (const item of initialProducts) {
      createdProducts.push(await Product.create(item));
    }
    console.log(`Successfully seeded ${createdProducts.length} products into database.`);

    const createdNotes = [];
    for (const note of initialNotes) {
      createdNotes.push(await Note.create(note));
    }
    console.log(`Successfully seeded ${createdNotes.length} iNoteBook notes into database.`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
