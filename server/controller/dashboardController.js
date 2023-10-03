const Note = require("../models/notes");
const mongoose = require("mongoose");

//@desc get dashboard (contain all the notes and the functionality of add new one )
//@route GET /dashboard
//@access /protected/(public)
exports.dashboard = async (req, res, next) => {
  const limit = 12; // 12 note for page
  const page = req.query.page || 1;
  const skip = limit * page - limit;

  try {
    const notes = await Note.aggregate([
      {
        $sort: {
          updatedAt: -1,
        },
      },
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
        },
      },
      {
        // to obtain less characters from the note
        $project: {
          title: { $substr: ["$title", 0, 30] },
          body: { $substr: ["$body", 0, 100] },
        },
      },
    ])
      .skip(skip)
      .limit(limit)
      // exec : Executes the aggregate pipeline on the currently bound Model.
      .exec();

    const notesCount = await Note.countDocuments();
    const pageEndIndex = page * limit;

    res.render("dashboard/index", {
      title: "Dashboard",
      layout: "../views/layouts/dashboard",
      description: "NodeJs Notes App",
      userName: req.user.fristName,
      notes,
      current: page,
      pages: Math.ceil(notesCount / limit),
      pageEndIndex,
      notesCount,
    });
  } catch (err) {
    console.log(err.message);
    res.redirect("/");
  }
};

exports.getNote = async (req, res, next) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
  if (note) {
    res.render("dashboard/view-note", {
      noteId: req.params.id,
      note,
      layout: "../views/layouts/dashboard",
    });
  } else {
    res.send("something went wrong");
  }
};

exports.updateNote = async (req, res, next) => {
  try {
    await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        title: req.body.title,
        body: req.body.body,
      }
    );
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err.message);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    await Note.deleteOne({ _id: req.params.id, user: req.user.id });
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err.message);
  }
};
exports.getAddNote = async (req, res, next) => {
  res.render("dashboard/add", {
    layout: "../views/layouts/dashboard",
  });
};
exports.postAddNote = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    await Note.create(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};

exports.searchForNote = async (req, res, next) => {
  try {
    res.render("dashboard/search", {
      searchResults: "",
      layout: "../views/layouts/dashboard",
    });
  } catch (err) {
    console.log(err.message);
  }
};
exports.searchForNoteSubmit = async (req, res, next) => {
  try {
    let searchTerm = req.body.searchTerm;
    const searchNOSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");
    const searchResults = await Note.find({
      $or: [
        { title: { $regex: new RegExp(searchNOSpecialChar, "i") } },
        { body: { $regex: new RegExp(searchNOSpecialChar, "i") } },
      ],
    }).where({user:req.user.id})

    res.render('dashboard/search',{
      searchResults,
      layout: "../views/layouts/dashboard",
    })

  } catch (err) {
    console.log(err.message);
  }
};
