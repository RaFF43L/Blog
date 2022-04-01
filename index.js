const express = require("express");
const app = express();
const connection = require("./database/database");
const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArtidesController");

const Category = require("./categories/Category");
const Article = require("./articles/Article");


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


app.use("/", categoriesController);
app.use("/", articlesController);


app.set('view engine', 'ejs');
app.use(express.static('public'));
//body parser


app.get("/",(req, res) => {
    Article.findAll({
        include: [{model: Category}]
    }).then(articles =>{
        res.render("index",{articles: articles});
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
            res.render("article",{
                article: article
            });
        }else{
            res.redirect("/");
        }
    }).catch(error => {
        res.redirect("/");
    })
})
app.listen(8080,() => {
    console.log('Server on');
});

