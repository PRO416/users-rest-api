var express = require('express');
const bcrypt = require('bcrypt');
var router = express.Router();
const usersModel = require('../models/usersModel');

/* GET users listing. */
router.get('/', async function(req, res) {
  const allUsers = await usersModel.find();
  res.status(200).send(allUsers);
});

//verify login of single user
router.get('/:username', async (req, res) => {
  try{
    const user = await usersModel.findOne({username: req.params.username});
    //login simulation
    if(!user){
      return res.status(404).send('user not found')
    }
    //true password
    const passwordValid = await bcrypt.compare(req.body.password, user.password)
    
    if(passwordValid) {
      res.status(200).send(`Welcome ${user.username}`);
    } else {
      res.status(401).send('wrong password');
    }
  }catch(e){
    res.status(400).json({'error': e.message});
  }
})

//add a new user 
router.post('/', async (req, res) => {
  try{
    await bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        const newUser = new usersModel({
          name: req.body.name,
          username: req.body.username,
          password: hash
        });

        newUser
          .save()
          .then(user => {
            res.status(201).send(`User ${user.username} created`);
          })
      });
    });
  }catch(e){
    res.status(400).send('User cannot be created');
    res.json({ 'error': e.message })
  }
})

//update user 
router.patch('/:username', async (req, res) => {
  try{
    if(req.body.name) {
      await usersModel.updateOne({ username: req.params.username }, {
        $set: {
          name: req.body.name
        }
      });
    }
    if(req.body.username) {
      await usersModel.updateOne({ username: req.params.username }, {
        $set: {
          username: req.body.username
        }
      });
    }
    // if(req.body.password) {
    //   await usersModel.updateOne({ _id: req.params.id }, {
    //     $set: {
    //       job: req.body.job
    //     }
    //   });
    // }
    // await usersModel
    //   .findOneAndUpdate(
    //     { username: req.params.username },
    //     {
    //       username: req.body.username
    //     })
    //   .then(user => {
        
    //   });
    res.status(201).send(`User updated`);
  }catch(e){
    res.status(400).send('User cannot be updated')
  }
})

//delete one existing user using the username
router.delete('/:username', async (req, res) => {
  try{
    await usersModel.deleteOne({username: req.params.username})
    res.status(200).send('User deleted')
  }catch(e){
    res.status(404).send('user not found')
  }
})

module.exports = router;