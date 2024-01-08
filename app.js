//add modules
const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')

//set veiw Engine to ejs
app.set('view engine', 'ejs')
app.set('views', 'views')
app.use(bodyParser.urlencoded({ extended: false }));
// set path for view folder 
// const filePath = path.join(__dirname, 'views', 'form.html');


//set public folder to static for rendering css files 
app.use(express.static(path.join(__dirname, 'public')));

//route for add products form
app.get('/add-products', (req, res) => {
    res.render('add-products');
});

//route handler for post request when product is posted in form the route handeler passed this route to next middleware
app.post('/submit', async (req, res, next) => {
    try {
        const formData = req.body;
        //set path to data folder and formData.JSON file
        const dataFilePath = path.join(__dirname, 'data', 'formData.json');

        let existingData
        const fileContent = await fs.promises.readFile(dataFilePath);
           if(fileContent==='')
            {existingData = [];
                res.redirect('/')
            }
            else{
            existingData = JSON.parse(fileContent);
        existingData.push(formData);
        await fs.promises.writeFile(dataFilePath, JSON.stringify(existingData));
        res.redirect('/');}
    }
    catch (error) {
        console.log('Error:', error.message);
        res.status(500).send('Internal Server Error');
    }
});


//this route handler gets JSON data from data folder then renders shop.ejs file with products
 app.get('/',async(req, res,next) => {
     try {
         const dataFilePath = path.join(__dirname, 'data', 'formData.json');
         let fileContent = await fs.promises.readFile(dataFilePath, 'utf-8');
         let data
         if(fileContent.trim() === ''){
            data=[]
            res.render('shop',{data})
         }
         else{
         data=JSON.parse(fileContent)
        data.forEach(item => {
            console.log(item.data)}
            )
            console.log(data)
            res.render('shop',{data})
     }} catch (error) {
         console.log('Error:', error.message);
         res.status(500).send('Internal Server Error');
     }
 });
app.use((req,res)=>{
    res.render('404')
})

app.listen(3000,
    (err) => {
        err ? console('err')
            : console.log('Server Listening on port 3000...')
    })
