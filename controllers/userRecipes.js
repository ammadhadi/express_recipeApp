var db = require('../models/index');

// RecipeBook's UserRecipe's INDEX
app.get('/recipe_books/:recipe_book_id/user_recipes', routeHelpers.ensureLoggedIn, routeHelpers.ensureCorrectUser, function(req, res){
  db.RecipeBook.findById(req.params.recipe_book_id)
    .populate('userRecipes')
    .populate('owner')
    .exec(function(err, book){
        res.render('userRecipes/index', {recipeBook: book, recipes: book.userRecipes, owner: book.owner} );
    });
});

// NEW UserRecipe Form
app.get('/recipe_books/:recipe_book_id/user_recipes/new', routeHelpers.ensureLoggedIn, routeHelpers.ensureCorrectUser,function(req, res){
  db.RecipeBook.findById(req.params.recipe_book_id, function(err, book){
    res.render('userRecipes/new', {recipeBook: book});
  });
});

// CREATE a new UserRecipe for a specific RecipeBook
app.post('/recipe_books/:recipe_book_id/user_recipes', routeHelpers.ensureLoggedIn, routeHelpers.ensureCorrectUser,function(req, res){
  db.UserRecipe.create(req.body, function(err, recipe){
    if (err) {
      console.log(err);
      res.render('userRecipes/new');
    } else {
      db.RecipeBook.findById(req.params.recipe_book_id, function(err, book){
        book.userRecipes.push(recipe);
        recipe.book = book._id;
        recipe.save();
        book.save();
        res.redirect('/recipe_books/' + req.params.recipe_book_id + '/user_recipes');
      });
    }
  });
});

// SHOW A UserRecipe
app.get('/recipe_books/:recipe_book_id/user_recipes/:id', routeHelpers.ensureLoggedIn, routeHelpers.ensureCorrectUser,function(req, res){
  db.UserRecipe.findById(req.params.id)
    .populate('book')
    .exec(function(err, recipe){
      console.log(recipe.ingredients);
      var ingredients = recipe.ingredients.split('\n');
      var directions = recipe.directions.split('\n');
      res.render('userRecipes/show', {recipe: recipe, ingredients: ingredients, directions: directions});
    });
});

// EDIT form for a UserRecipe in a RecipeBook
app.get('/recipe_books/:recipe_book_id/user_recipes/:id/edit', routeHelpers.ensureLoggedIn, routeHelpers.ensureCorrectUser,function(req, res){
  db.UserRecipe.findById(req.params.id)
    .populate('book')
    .exec(function(err, recipe){
      if (err) {
         console.log(err);
      } else {
        res.render('userRecipes/edit', {recipe: recipe});
      }
    });
});

// UPDATE a UserRecipe
app.put('/recipe_books/:recipe_book_id/user_recipes/:id', routeHelpers.ensureLoggedIn, routeHelpers.ensureCorrectUser,function(req, res){
  db.UserRecipe.findByIdAndUpdate(req.params.id, req.body, function(err, recipe){
    if (err) {
      console.log(err);
    } else {
      res.redirect('/recipe_books/' + req.params.recipe_book_id + '/user_recipes/' + recipe.id);
    }
  });
});

// REMOVE a UserRecipe from RecipeBook
app.delete('/recipe_books/:recipe_book_id/user_recipes/:id', routeHelpers.ensureLoggedIn, routeHelpers.ensureCorrectUser,function(req, res){
  db.UserRecipe.findByIdAndRemove(req.params.id, req.body, function(err, recipe){
    if (err) {
      console.log(err);
    } else {
      res.redirect('/recipe_books/' + req.params.recipe_book_id +  '/user_recipes');
    }
  });
});
