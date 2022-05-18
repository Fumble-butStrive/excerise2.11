const mysql = require('mysql'); //where our data base is stored 
const express = require('express'); // a module ideal for routing and template engines
const bodyparser = require('body-parser'); // gives direct access to the req.body
const ejs = require('ejs');

 //assigning a path and rounter for our application
 const path = require('path');
 const router = express.Router();
 
 //Setup Express
 var app = express();

 //Configuring express server
//  app.use(bodyparser.json()); -- updated to info below
    app.use(express.json());
    app.use(express.urlencoded({extended:false}));
    // app.use('/css', express.static('css'));// code to use scripts, this is route specific which means it can be used only on specified routes
    app.use( express.static(__dirname));// code to use scripts, this is route specific which means it can be used only on specified routes
    app.use('/', router);
    
    app.set('view engine', 'ejs'); //here we say what we are setting which is view engine and which engine which is ejs it looks for a folder called views by default

    
 var conn = mysql.createConnection({
    host: "localhost",   
    user: "root",    
    password: "Kristine@2018",   
    database: "cafeteria_lunch_system"  
  });

  
  conn.connect((err)=> {
    if(!err)
        console.log('Connected to database Successfully');
    else
        console.log('Connection Failed!'+ JSON.stringify(err,undefined,2));
    });


//Specify the Port to listen on
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));


// router.get('/',function(req,res){
//     res.sendFile(path.join(__dirname+'/index.html'));
//     //__dirname : It will resolve to your project folder.
//   });

router.get('/',function(req,res){
    res.render('../views/index');
   });

   router.get('/counter',function(req,res){
    res.render('../views/placeOrder');
   });





//POST Router to Add Projects from the form
app.post('/placeOrder' , (req, res) => {
    let data = {    meal_option_id: req.body.meats, 
                    trainee_id: req.body.trainee_nm, 
                    date: req.body.dated, 
                };

        let sqlQuery = "INSERT INTO lunch_table SET ?";
        let vQuery = conn.query(sqlQuery, data,(err, results) => {
        // if(err) throw err;
        // res.send(JSONResponse(results));
        });
        res.redirect('/')
    }); 



//Display all Orders
router.get('/all_Orders', function(req, res) { //must be router.get or app.get or whatever else i choose but it has to be a get http verb
    var varSQL = "select l.id, tr.fname, tr.lname, mo.option_name, l.date ";
        varSQL += " FROM lunch_table l, meal_options_table mo, trainees_table tr";
        varSQL += " WHERE l.meal_option_id = mo.id";
        varSQL += " AND l.trainee_id = tr.id";
    //console.log(varSQL);
    conn.query(varSQL, function(err,row) {
       
        if(err){
            //req.flash('error', err); 
            res.render('../views/admin',
            {
                data: ''
            });   
        }
        else{ 
            res.render('../views/admin',
            {
                data: row
            });
        }
    });
});



    // router.get('/all_Orders', function(req, res) { //must be router.get or app.get or whatever else i choose but it has to be a get http verb
    //     conn.query('SELECT trainees_table.fname, trainees_table.lname, meal_options_table.option_name, lunch_table.* FROM trainees_table, meal_options_table, lunch_table WHERE trainees_table.id = lunch_table.trainee_id AND meal_option_id.id = lunch_table.meal_option_id ORDER BY trainees_table.id', function(err,row){
    //         if(err) {
    //             res.render('../views/admin', {data:''});
    //         } else {
    //             res.render('../views/admin', {data:row});
    //         }
    //     });
    // });


    // router.get('/all_Order/edit/:id', function(req, res, next) {
    
    //     conn.query('SELECT * FROM cafeteria_lunch_system.lunch_table WHERE id='+ req.params.id, function(err,row)     {
        
    //         if(err){
    //             //req.flash('error', err); 
    //             res.render('../views/order-edit',
    //             {
    //                 page_title: "Order Listing",
    //                 order: ''
    //             });   
    //         }
    //         else{ 
    //             res.render('../views/order-edit',
    //             {
    //                 page_title: "Order Listing",
    //                 order: row
    //             });
    //         }
                                
    //         });
                
    //     });
    
    
    router.get('/all_Order/edit/:id', function(req, res, next) {

        var info = "select l.id, tr.fname, tr.lname, mo.option_name, l.date";
                info += " FROM lunch_table l, meal_options_table mo, trainees_table tr";
                info += " WHERE l.meal_option_id = mo.id";
                info += " AND l.trainee_id = tr.id";
                info += " AND tr.id = " + req.params.id;
            //console.log(varSQL);
        
        conn.query(info, function(err,row) {
    
            console.log(row);
        
            if(err){
                //req.flash('error', err); 
                res.render('../views/order-edit',
                {
                    page_title: "Order Listing",
                    order: ''
                });   
            }
            else{ 
                res.render('../views/order-edit',
                {
                    page_title: "Order Listing",
                    order: row
                });
            }
                                
            });
                
        });


    router.post('/all_order/update',(req, res) => {
            
        let sqlQuery = "UPDATE cafeteria_lunch_system.lunch_table SET trainee_id ='" + req.body.trainee_id + 
        "', meal_option_id ='" + req.body.meal_option_id + 
        "', date ='" +  req.body.date + 
        "' WHERE id =" + req.body.id;
    
     query = conn.query(sqlQuery,(err,rows) => {
                if(err) throw err;
                console.log(err)
                //req.flash('error', err); 
                res.redirect('/all_Orders');                  
            });
            
        });
    
    router.get('/all_Order/delete/:id', function(req, res, next){
        conn.query('DELETE FROM lunch_table WHERE id =' + req.params.id, function(err, row){
            // if(err)  throw err;
            //req.flash('error', err); //must install additionals 'flash messages and others from to do list for these to work;
    
           //req.flash('success', 'Deleted Successfully') ///must install additionals 'flash messages and others from to do list for these to work;
                // alert('Delete Successful');
                res.redirect('/');
                next();
        });
    });