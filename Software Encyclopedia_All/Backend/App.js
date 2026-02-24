const express = require("express");
const cors = require("cors");


require("dotenv").config();

// const rateLimit = require("express-rate-limit")

const app = express();
const ImageKit = require("imagekit");

const communityRoutes = require("./routes/ManageCommunity");
app.use(cors({
  origin: "https://software-encyclopedia-yqun.vercel.app/", // Allow your React app
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});
app.use("/api/users", require("./routes/Manageusers"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/softwares", require("./routes/softwares"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/reviewslist", require("./routes/reviewslist"));
app.use("/api/ratings", require("./routes/ratings"));
app.use("/api/ai", require("./routes/ai"));

//admin
app.use("/api/adminprofile", require("./routes/AdminProfile"))

app.use("/api/news", require("./routes/news"));

//for quiz
app.use("/api/quiz", require("./routes/quiz"));




const imagekit = new ImageKit({
  publicKey: "public_1sXBATopv1zxz/4K7xvCea2XG3o=",
  privateKey: "private_hAS4vZI1Bctwo0OiDiSPywy71OI=", // 🔴 from ImageKit dashboard
  urlEndpoint: "https://ik.imagekit.io/afzi3jtsq",
});

app.get("/auth", (req, res) => {
  console.log("Auth request received from frontend!"); // Add this line
  const result = imagekit.getAuthenticationParameters();
  res.json(result);
});
// // for community
// app.use("/api/community", communityRoutes);

//for community
app.use("/api/community", require("./routes/ManageCommunity"));

// const PORT = 5000;
// app.listen(PORT, () =>
//   console.log(`Server running on port ${PORT}`)
// );
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});


