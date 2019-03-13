import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from "./views/base";

/* Global state of the app
* - Search object
* - Current recipe object
* - Shopping list object
* -Liked recipes

 */

const state = {};

/*
* SEARCH CONTROLLER
 */

const controlSearch = async () => {
    // 1) Get query from view
    const query = searchView.getInput();
    //const query = 'pizza';

    if(query) {
        // 2) New search object and add to state
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {

            // 4) Search for recipes
            await state.search.getResults();

            // 5) render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (err) {
            alert('Something wrong with the search...');
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

//TESTING
// window.addEventListener('load', e => {
//     e.preventDefault();
//     controlSearch();
// });

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn) {
        const goToPage = parseInt(btn.dataset.goto, 10); // handy way to access the data
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);

    }
});


/*
* RECIPE CONTROLLER
 */

const controlRecipe = async () => {
    //get ID from url
    const id = window.location.hash.replace('#', ''); //getting id from url and replace # with space
    console.log(id);

    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //highlight selected search item
        if (state.search) searchView.highlightSelected(id);

        //Create new recipe object
        state.recipe = new Recipe(id); //create new recipe object and save it in state

        //TESTING
        // window.r = state.recipe;

        try {
            //Get recipe data and parse ingredients
            await state.recipe.getRecipe(); //call getRecipe , it is an async function so it will return promise
            state.recipe.parseIngredients();

            //Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch (err) {
            alert('Error processing recipe!');
        }

    }
};


// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


/*
LIKE CONTROLLER
 */




//Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
   if (e.target.matches('.btn-decrease, .btn-decrease *')) {//* means any child element of button decrease
        //Decrease button is clicked
       if(state.recipe.servings > 1) {
           state.recipe.updateServings('dec');
           recipeView.updateServingsIngredients(state.recipe);
       }
   } else if (e.target.matches('.btn-increase, .btn-increase *')) {
       //Increase button is clicked
       state.recipe.updateServings('inc');
       recipeView.updateServingsIngredients(state.recipe);
   } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
       // Add ingredients to shopping list
       controlList();
   }
});

window.l = new List();