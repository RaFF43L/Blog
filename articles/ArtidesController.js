const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Articles =  require("./Article");
const slugify = require("slugify");
const Article = require("./Article");
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/articles", adminAuth, (req, res) =>{
    Articles.findAll({
        include: [{model: Category}]
    }).then(articles =>{
        res.render("admin/articles/index",{
            articles: articles
        });
    });
});

router.get("/admin/articles/new",adminAuth, (req, res)=>{
    Category.findAll().then(categories =>{
        res.render("admin/articles/new",{categories: categories});
    }); 
});

router.post("/articles/save", (req, res) => {
    var title = req.body.titulo;
    var body = req.body.body;
    var idCategory = req.body.category;
    
    Articles.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: idCategory
    }).then(()=>{
        res.redirect("/admin/articles")
    });
});
router.post("/articles/delete", (req, res)=>{
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            Articles.destroy({
                where:{
                    id : id
                }
            }).then(()=>{
                res.redirect("/admin/articles");
            })
        }else{
            res.redirect("/admin/articles");
        }
    }else{
        res.redirect("/admin/articles");
    }
});
router.get("/admin/articles/edit/:id",adminAuth,(req, res) =>{
    var id = req.params.id;
    if(isNaN(id)){
        res.redirect("/admin/articles");
    }
    Articles.findByPk(id).then(article =>{
        if(article != undefined){   
            Category.findAll().then(categories =>{
                res.render("admin/articles/edit",{
                    article: article,
                    categories: categories
                });
            }) 
        }else{
            res.redirect("/admin/articles");
        }

    }).catch(error=>{
        res.redirect("/");
    });
})
router.post("/articles/edit", (req, res)=>{
   
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var idcategory = req.body.category;

    if( id!= undefined){
        Articles.update({
            title: title,
            slug: slugify(title),
            body: body,
            categoryId: idcategory
        },{
            where:{
                id: id
            }
        }).then(()=>{
            res.redirect("/admin/articles");
        })
    }else{
        res.redirect("/admin/articles");
    }
   
});

router.get("/articles/page/:num", (req, res) => {
    var page = req.params.num;
    var offset = 0;
    if(isNaN(page) || page == 1){
        offset = 0;
    }else{
        offset =(Number(page)-1) * 4
    }
        Article.findAndCountAll({
            order:[
                ['id','DESC']
            ] ,
            limit: 4,
            offset: offset
        }).then(articles =>{
            var next;
            if(offset + 4 >= articles.count){
                next = false;
            }else{
                next = true;
            }
            var result = {
                page: Number(page),
                next: next,
                articles: articles
            }
            Category.findAll().then(categories =>{
                res.render("admin/articles/page",{
                    categories: categories,
                    result: result
                })
            })
        });
});
module.exports = router;