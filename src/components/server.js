require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const morgan = require("morgan");

const { sendWhatsAppMessage } = require("./services/whatsappService");

const app = express();

// ---------------- MIDDLEWARE ----------------
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// ---------------- DB ----------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => {
    console.error("❌ DB Error:", err.message);
    process.exit(1);
  });

// ---------------- UPLOAD ----------------
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
app.use("/uploads", express.static(uploadPath));

// ---------------- AUTH ----------------
function auth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ success: false });
    }
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ success: false });
  }
}

// ---------------- MODELS ----------------
const User = mongoose.model("User", new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["admin", "employee"], default: "employee" }
}));

const Lead = require("./models/Lead");
const Task = require("./models/Task");
const Settings = require("./models/Settings");
const Invoice = require("./models/Invoice");

// ---------------- MULTER ----------------
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadPath),
    filename: (req, file, cb) =>
      cb(null, Date.now() + path.extname(file.originalname))
  })
});

// ================= ROUTER =================
const router = express.Router();

// -------- AUTH --------
router.post("/register", async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    email = email.toLowerCase().trim();
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ success: false });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

    res.json({ success: true, user, token });
  } catch {
    res.status(500).json({ success: false });
  }
});

router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.toLowerCase().trim();
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ success: false });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

    res.json({ success: true, user, token });
  } catch {
    res.status(500).json({ success: false });
  }
});

// -------- LEADS --------
router.get("/leads", auth, async (req, res) => {
  const leads = await Lead.find().sort({ createdAt: -1 });
  res.json({ success: true, leads });
});

router.post("/leads", auth, upload.single("file"), async (req, res) => {
  try {
    const lead = new Lead({
      ...req.body,
      user: req.user.id,
      assignedTo: req.user.id,
      file: req.file ? req.file.filename : ""
    });

    await lead.save();

    if (lead.phone) {
      await sendWhatsAppMessage(lead.phone, `Hello ${lead.name}`);
    }

    res.json({ success: true, lead });
  } catch {
    res.status(500).json({ success: false });
  }
});

// -------- SETTINGS --------
router.get("/settings", auth, async (req, res) => {
  let settings = await Settings.findOne({ user: req.user.id });
  if (!settings) settings = await Settings.create({ user: req.user.id });
  res.json({ success: true, settings });
});

router.put("/settings", auth, async (req, res) => {
  const settings = await Settings.findOneAndUpdate(
    { user: req.user.id },
    req.body,
    { new: true, upsert: true }
  );
  res.json({ success: true, settings });
});

// -------- FOLLOWUPS --------
router.get("/followups", auth, async (req, res) => {
  const leads = await Lead.find({ nextFollowUp: { $ne: null } });
  res.json({ success: true, leads });
});

// -------- TASKS --------
router.get("/tasks", auth, async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.json({ success: true, tasks });
});

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({ ...req.body, user: req.user.id });
  await task.save();
  res.json({ success: true, task });
});

router.put("/tasks/:id", auth, async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, task });
});

router.delete("/tasks/:id", auth, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// -------- INVOICES --------
router.get("/invoices", auth, async (req, res) => {
  const invoices = await Invoice.find().sort({ createdAt: -1 });
  res.json({ success: true, invoices });
});

router.post("/invoices", auth, async (req, res) => {
  const invoice = await Invoice.create(req.body);
  res.json({ success: true, invoice });
});

// -------- ROUTES --------
app.use("/api", router);

// -------- ERROR HANDLER --------
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ success: false });
});

// -------- START --------
app.listen(process.env.PORT || 5000, () => {
  console.log("🚀 Server running");
});