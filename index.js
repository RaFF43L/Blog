const express = require("express");
const app = express();
const session = require("express-session");
const connection = require("./database/database");
const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArtidesController");
const userController = require("./user/UserController");
const Category = require("./categories/Category");
const Article = require("./articles/Article");
const User = require("./user/User");

// DATABASE
connection.
authenticate()
.then(()=>{
    console.log("Conexão feita com sucesso");
}).catch((error)=>{
    console.log(error);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//SESSION
app.use(session({
    secret: "uahsduasdiasdkaisdk",
    cookie: {maxAge: 30000}
}))

app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/",userController);

// View Engine
app.set('view engine', 'ejs');


//STATIC
app.use(express.static('public'));


app.get("/",(req, res) => {
    Article.findAll({
        order:[
            ['id','DESC']
        ] 
    }).then(articles =>{
        Category.findAll().then(categories =>{
            res.render("index",{articles: articles, categories: categories});
        })
    });
});
app.get("/:slug", (req, res)=>{
    var slug = req.params.slug;
    Article.findOne({
        where:{
            slug: slug
        }
    }).then(article =>{
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("article",{article: article, categories: categories});
            })  
        }else{
            res.redirect("/");
        }
    }).catch(error => {
        res.redirect("/");
    })
});

app.get("/category/:slug", (req, res)=>{
    var slug = req.params.slug;
    Category.findOne({
        where:{
            slug: slug
        }, 
        include: [{
             model: Article
            }]
    }).then(category => {     
        if(category != undefined){
            Category.findAll().then(categories =>{
                    res.render("index",{
                    articles: category.articles,
                    categories: categories
                });
            });
        }else{
            res.redirect("/");
        }
    }).catch(error =>{

        res.redirect("/");
    })
});
app.listen(8080,() => {
    console.log('Server on');
});

