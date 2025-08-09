




const express=require('express')
const path = require('path');
const app=express()
const port=7000

const mysql = require('mysql2');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
const methodOverride = require('method-override');
app.use(methodOverride('_method'));


const ejs=require('ejs');
const { faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');

app.use(express.urlencoded({ extended: true }));
app.set('view engine','ejs')
app.set('views', path.join(__dirname, 'views'));


// Create the connection pool. The pool-specific settings are the defaults
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password:'Skill@123',
  database: 'fakerdata',
});

app.get('/show',(req,res)=>{
  const q=`SELECT * FROM fakerfile`;
  connection.query(q,(err,result)=>{
    if(err){
      console.log('database error',err)
      return res.status(500).send('Database error');
    }
    res.render('alldata',{data: result})
  })
})
//get form
app.get('/insert',(req,res)=>{
    res.render('data')
})


// app.get('/fix-id-column', (req, res) => {
//   const alterQuery = `ALTER TABLE fakerfile MODIFY id VARCHAR(36)`;

//   connection.query(alterQuery, (err, result) => {
//     if (err) {
//       console.error('Error altering table:', err);
//       return res.status(500).send('Failed to alter table');
//     }
//     console.log('Table altered successfully');
//     res.send('Table column "id" modified to VARCHAR(36) successfully');
//   });
// });

//post form data
app.post('/insert',(req,res)=>{
  const id= uuidv4();
  const {name,message}=req.body;
  const q=`INSERT INTO fakerfile (id,name,message) VALUES (?,?,?)`;
  connection.query(q,[id,name,message],(err,result)=>{
    if(err){
      console.error('insert into data error',err)
      return res.status(500).send('Insert into data error');
    }
    res.redirect('/show')

  })
})


app.get('/show/:id', (req, res) => {
    const { id } = req.params;
    const q = `SELECT * FROM fakerfile WHERE id='${id}'`;
    connection.query(q, (err, result) => {
        if (err) throw err;
        res.render('view', {element: result[0] });  // Just send one user
    });
});

app.get('/show/:id/update', (req, res) => {
    const { id } = req.params;
    // const q = `SELECT * FROM users WHERE id = ?`;

    // connection.query(q, [id], (err, results) => {
        // if (err) throw err;
    //     if (element) {
    //         res.render('update', { id: results});
    // //     } else {
    // //         res.send('User not found');
    //     }
    // });
    res.render('update',{id})
});

app.post('/show/:id/update', (req, res) => {
    const { name, message } = req.body;
    const { id } = req.params;

    const q = `UPDATE fakerfile SET name = ?, message = ? WHERE id = ?`;
    const values = [name, message,id];

    connection.query(q, values, (err, results) => {
        if (err) throw err;
        res.redirect('/show');
    });
});

app.get('/show/:id/delete', (req, res) => {
  const { id } = req.params;
  let q = `DELETE FROM fakerfile WHERE id = '${id}'`;

  connection.query(q, [id], (err, result) => {
    if (err) throw err;
    console.log(`Deleted user with id: ${id}`);
    res.redirect('/show');
  });
});

app.listen(port,()=>{
    console.log('server started',port)
})