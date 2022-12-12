require('dotenv').config()
const express = require("express");
const app = express();
const port = 8000;
const path = require("path");
// const cors = require("cors");
const bodyParser = require('body-parser');
const mysql = require('mysql');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
// app.use(cors());
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
// app.get("/", (req,res)=>{
//   res.render("index",)
// })




var mysqlCOnnection = mysql.createConnection({
    host: 'localhost',
    user: 'khushboopal',
    password: 'hello123456',
    database: 'empData'
});

mysqlCOnnection.connect((err) => {
    if (!err)
        console.log("DB connection success");
    else
        console.log('DB connection failed' + JSON.stringify(err, undefined, 2));
})
let emp=[];
let editId;
let obj={

  "users":emp,
  "Name":"",
  "Job":"",
  "Salary":"",
//   "id":""
}

// /get all employees

app.get('/', (req, res) => {
    mysqlCOnnection.query('SELECT * FROM TableforEmpData', (err, rows, fields) => {
        if (err) throw err;
        // console.log(rows)
        emp = [...rows]
        obj ={...obj,"emp":emp}
        res.render('index.ejs', obj);
    })
})

//get employee by id
app.get('/edit/:id', (req, res) => {
    // emp=req.body;
    console.log(req.params.id);
    const id=req.params.id;
    emp=req.body;
    // console.log(emp)
    mysqlCOnnection.query('SELECT * FROM TableforEmpData  WHERE id= ?', [req.params.id], (err, rows, fields) => {
        if (err)  console.log(err);
            
        obj.Name=rows[0].Name;
        obj.Job=rows[0].Job;
        obj.Salary=rows[0].Salary;
        obj.id = id;
        editId=id;
        
        res.redirect('/');
        
            
    })
})

//delete employee by id

app.post('/emp/:id', (req, res) => {
    mysqlCOnnection.query('DELETE FROM TableforEmpData  WHERE id= ? ', [req.params.id], (err, rows, fields) => {
        if (err)  console.log(err);
        console.log("deleted");
        res.redirect('/');
        
            
    })
})

//insert 
app.post('/emp', (req, res) => {
    const params = req.body
    mysqlCOnnection.query('INSERT INTO TableforEmpData SET ?', params, (err, row, fields) => {
        if (!err)
            res.redirect('/');
        else
            console.log(err);
    })

    console.log(req.body);
})


//update employee by id
app.post('/save/:id', (req, res) => {
    // const params=req.body
    const { Name, Job, Salary } = req.body;
    mysqlCOnnection.query('UPDATE TableforEmpData SET Name=?, Job=?, Salary=?  WHERE id=?', [Name, Job, Salary, editId], (err, rows, fields) => {
        if (err) console.log(err)
        
        clear();
        res.redirect('/');
        
        
    })

})
function clear(){
    obj.Name="";
    obj.Job="";
    obj.Salary="";
}




// app.post("/emp",(req,res)=>{
//   var employee = {
//   id:empData.length+1,
//   names : req.body.names,
//   job : req.body.job,
//   salary :req.body.salary,
// }
// console.log(employee);
// empData.push(employee);
// res.redirect("/")
// });

// app.get('/emp/edit/:id' ,(req,res)=>{
//   const id=req.params.id;
//   console.log(id,"get by id")
//   let index=empData.findIndex(e=>Number(e.id)==Number(id));
//   console.log(empData[index]);
//   obj.names=empData[index].names;
//   obj.job=empData[index].job;
//   obj.salary=empData[index].salary;
//   obj.id=id
//   editId=id;
//   res.redirect('/');
// })

// app.post('/emp/save', (req,res)=>{
//   console.log(1);
//   let id=editId;
//   console.log(id ,"helooooooooooo")
//   let index=empData.findIndex((e)=>Number(e.id)==Number(id));
//     empData[index].names=req.body.names,
//     empData[index].job=req.body.job,
//     empData[index].salary=req.body.salary,

//   res.redirect('/')

//   })


// app.get("/emp/:id",(req,res)=>{
//   const id=req.params.id;
//   console.log(id,"here")
//   let newempData = empData.filter(el=>el.id!=id);
//   empData = newempData;
//   obj={...obj,"users":empData}
//   console.log(newempData)
//   console.log(empData);
//   res.redirect('/')
// })

app.listen(port, () => {
    console.log(`listening to the port ${port}`);
})