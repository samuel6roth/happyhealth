const router = require("express").Router();
const User = require("../../models/User");
const session = require('express-session');


const userInput = {
      username: "spenserlogan",
      password: "password12345"
}

// const user = new User(userInput);

// user.save((err, document) => {
//   if(err)
//     console.log(err);
//   console.log(document);
// })

router.post('/', async (req, res) => {
    console.log("the route is working");
    console.log(req.body)
    User.create(req.body)
      .then((user) => {
        console.log(user)
        // if there's product tags, we need to create pairings to bulk create in the ProductTag model
        // if (req.body.tagIds.length) {
        //   const productTagIdArr = req.body.tagIds.map((tag_id) => {
        //     return {
        //       product_id: product.id,
        //       tag_id,
        //     };
        //   });
        //   return ProductTag.bulkCreate(productTagIdArr);
        // }
        // if no product tags, just respond
        res.status(200).json(user);
      })
    //   .then((productTagIds) => res.status(200).json(productTagIds))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
    });
});

router.post('/login', (req, res) => {
  User.findOne({
      username: req.body.username
    }
)
    .then(dbUserData => {
      console.log(req.body)
      if(!dbUserData) {
        res.status(400).json({message: "No user with that username!" });
        return;
      }
      const validPassword = dbUserData.comparePassword(req.body.password);
      if (!validPassword) {
        res.status(400).json({message: "Incorrect password!" });
        return;
      }
      req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;
        res.json({user: dbUserData, message: "You are now logged in!" });
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
});

module.exports = router;