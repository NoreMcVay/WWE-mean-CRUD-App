const express = require('express');
const multer = require('multer');
const Post = require('../models/post'); 
const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('invalid mime type');
        if (isValid) {
            error = null;
        }
        cb(error, "../backend/images/");
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

router.post("", multer({storage: storage}).array("imagesUploaded"), (req, res, next) => { // changed to array from single.
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
      name: req.body.name,
      brand: req.body.brand,
      finisher: req.body.finisher,
      imagePath: url + "/images/" + req.files[0].filename,
      modalImagePath: url + "/images/" + req.files[1].filename,
    });
    post.save().then(createdPost => {
      res.status(201).json({
        message: "post added successfully",
        post: {
            ...createdPost,
            id: createdPost._id,
        }
      });
    });
});
  
  router.put(
    "/:id", 
    multer({ storage: storage }).array("imagesUploaded"),
    (req, res, next) => {
      let imagePath = req.body.imagePath; // if imagePath is a string and wasnt updated with new image
      let modalImagePath = req.body.modalImagePath;
      const url = req.protocol + '://' + req.get("host");

      if (!!imagePath && !modalImagePath) {
        modalImagePath = url + "/images/" + req.files[0].filename
      } else if (!imagePath && !!modalImagePath) {
        imagePath = url + "/images/" + req.files[0].filename 
      } else if (!imagePath && !modalImagePath) {
        imagePath = url + "/images/" + req.files[0].filename
        modalImagePath = url + "/images/" + req.files[1].filename
      }

      const post = new Post({ // creating new mongodb document with updated values.......
        _id: req.body.id, // reverting back to _id: as this is how id property stored in mongo
        name: req.body.name,
        brand: req.body.brand,
        finisher: req.body.finisher,
        imagePath: imagePath, // actual image path now. File was converted to string line 54
        modalImagePath: modalImagePath
      });
    console.log('incoming update', post);
    Post.updateOne({ _id: req.params.id}, post).then(result => {
      console.log(result);
      res.status(200).json({ message: "update successful!"})
    });
  });
  
  router.get("", (req, res, next) => {
    let fetchedPosts;
    const postQuery = Post.find();
    postQuery.then(documents => {
        fetchedPosts = documents;
        res.status(200).json({ posts: fetchedPosts });
    })
  });

  router.get("/:id", (req, res, next) => {
    Post.findOne({_id: req.params.id}).then(post => {
      if (post) {
       res.status(200).json(post);
      } else {
       res.status(404).json({message: 'post not found!'});
      }
    })
  });
  
  
  router.delete("/:id", (req, res, next) => {
    Post.deleteOne({_id: req.params.id}).then(result => {
     console.log(result);
     res.status(200).json({ message: "Post deleted!" });
    });
  });
  

  module.exports = router;