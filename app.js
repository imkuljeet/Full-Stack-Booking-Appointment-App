const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const User = require('./models/User');
var cors = require('cors');

const app = express();
app.use(cors());

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.post('/user/add-user',async (req,res,next)=>{
  const name = req.body.Name;
  const email = req.body.Email;
  const Phone_No = req.body.Phone_No;

  const data = await User.create({name: name,email:email,Phn:Phone_No});
  res.status(201).json({newUserDetail: data});
});

app.get('/user/get-users', async (req, res, next) => {
  try {
    const users = await User.findAll(); 
    res.status(200).json({ allUsers: users });
  } catch (error) {
    res.status(500).json({error: error})
    console.log('Get user not working for debug',JSON.stringify(error));
  }
});

app.delete('/user/delete-user/:id', async (req, res) => {
  try {
    if (!req.params.id) {
      console.log("Id is missing");
      return res.status(400).json({ err: 'Id is missing' }); // Return a response and exit the function
    }
    
    const uId = req.params.id;
    await User.destroy({ where: { id: uId } });

    res.status(200).json({ message: 'User deleted successfully' }); // Sending a success response
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.use(errorController.get404);

sequelize
  .sync()
  .then(result => {
    // console.log(result);
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
