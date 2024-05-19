import express from "express";
import bodyParser from "body-parser";
import path from "path";
import multer from "multer";

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Set storage engine for Multer
const storage = multer.diskStorage({
  destination: "./public/images",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Initialize Multer upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1 MB limit
}).single("imageUrl");

// Default posts
const defaultPosts = [
  {
    id: 1,
    title: "Qabuli",
    description:
      "Qabeli Palow, sometimes known as Qabeli Zardak, is a beloved traditional Afghan dish that holds a special place in Afghan cuisine. It consists of aromatic long-grain rice, tender lamb or chicken, and a flavorful blend of spices such as cardamom, cumin, and coriander. The dish is typically topped with caramelized carrots and raisins, adding a delightful sweetness and crunch to each bite. Served on special occasions and gatherings, Qabeli Palow symbolizes hospitality and is a true example of Afghan culinary artistry. The intricate preparation process and the rich, complex flavors make this dish a favorite among Afghans and a must-try for those seeking to explore the diverse and delicious world of Afghan cuisine",
    imageUrl: "images/Qabuli1.jpg",
  },
  {
    id: 2,
    title: "Manto",
    description:
      "Manto, a traditional Afghan dish, is a dumpling filled with spiced ground meat (often beef or lamb) and onions. These dumplings are skillfully crafted by wrapping the filling in a thin dough pocket, which is then steamed to perfection. Once cooked, Manto is typically served with a generous topping of yogurt-infused with garlic and mint, and a sprinkle of ground beef or lentils. The result is a harmonious blend of savory flavors and textures, making Mantoo a favorite comfort food in Afghan households. Whether enjoyed as a hearty main course or as a satisfying snack, Manto embodies the essence of Afghan culinary heritage and is cherished for its delicious taste and cultural significance.",
    imageUrl: "images/Manto2.jpg",
  },
  {
    id: 3,
    title: "Pizza",
    description:
      "Pizza is a beloved traditional food that has captured the hearts and taste buds of people worldwide. Originating from Italy, pizza is a versatile dish that can be customized with various toppings to suit different preferences. The classic combination of dough, tomato sauce, cheese, and toppings such as pepperoni, mushrooms, and bell peppers continues to be a go-to choice for many. The process of making pizza has evolved over time, with different regions adding their own twist to the traditional recipe. Whether it's thin crust, thick crust, Neapolitan, or New York-style, the diversity of pizza styles ensures that there is something for everyone to enjoy. Pizza has become a universal comfort food that brings people together to savor its delicious flavors while creating lasting memories.",
    imageUrl: "images/Pizza3.jpg",
  },
  {
    id: 4,
    title: "Shorma",
    description:
      "Shorwa, a cherished traditional Afghan dish, is a hearty stew that showcases the rich flavors and aromatic spices of Afghan cuisine. This nourishing stew typically features tender pieces of lamb or beef simmered with a medley of vegetables such as carrots, potatoes, and tomatoes in a fragrant broth infused with garlic, onions, and a blend of seasonings like turmeric, coriander, and cumin. Served piping hot and often accompanied by freshly baked Afghan bread, Shorwa is a comforting and wholesome meal enjoyed by families across Afghanistan. Its warm and inviting flavors, along with its heartwarming appeal, make Shorwa a beloved culinary gem that represents the essence of Afghan hospitality and culinary heritage.",
    imageUrl: "images/Shorma4.jpg",
  },

];

let posts = [...defaultPosts];

app.get("/", (req, res) => {
  const edited = req.query.edited === 'true';
  const successMessage = edited ? 'Post edited successfully!' : null;
  res.render("index", { posts, successMessage });
});


app.get("/newpost", (req, res) => {
  res.render("newpost");
});

app.post("/newpost", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error(err);
      // Handle error
    } else {
      const { title, description } = req.body;
      const imageUrl = req.file ? `/images/${req.file.filename}` : null;
      const id = Date.now(); // Generate a unique ID for the post

      const newPost = { id, title, description, imageUrl };
      posts.push(newPost);

      res.redirect("/");
    }
  });
});

app.get("/edit/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find((post) => post.id === postId);
  res.render("edit", { post });
});

app.post("/edit/:id", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error(err);
      // Handle error
    } else {
      
     const postId = parseInt(req.params.id);
      const { title, description } = req.body;
      const imageUrl = req.file ? `/images/${req.file.filename}` : null;
      const id = Date.now(); // Generate a unique ID for the post

       const index = posts.findIndex((post) => post.id === postId);
  if (index !== -1) {
    posts[index].title = title;
    posts[index].description = description;
    if (imageUrl) {
      posts[index].imageUrl = imageUrl;
    }
  }
      res.redirect("/?edited=true");
    }
  });
});


app.post("/delete/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  posts = posts.filter((post) => post.id !== postId);

  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
