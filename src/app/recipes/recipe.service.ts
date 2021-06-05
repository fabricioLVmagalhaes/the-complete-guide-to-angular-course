import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { Recipe } from './recipe.model';
import * as ShoppinglistActions from '../shopping-list/store/shopping-list.actions';

import * as fromApp from '../store/app.reducer'

@Injectable({ providedIn: 'root' })
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [
    // new Recipe(
    //   'Tasty Schnitzel',
    //   'This is simply a test',
    //   'https://cdn.pixabay.com/photo/2017/10/05/12/53/schnitzel-2819330_1280.jpg',
    //   [new Ingredient('Meat', 1), new Ingredient('French Fries', 20)]
    // ),
    // new Recipe(
    //   'Big Fat Burger',
    //   'This is simply a test',
    //   'https://clientes.programaconsumer.com.br/wp-content/uploads/2020/02/underground-burger-goiania-go-2.jpg',
    //   [new Ingredient('Buns', 2), new Ingredient('Meat', 1)]
    // ),
  ];

  constructor(private store: Store<fromApp.AppState>) {}

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipeById(id: number) {
    return this.recipes[id];
  }

  addIngredientsToSpList(ingredients: Ingredient[]) {
    this.store.dispatch(new ShoppinglistActions.AddIngredients(ingredients));
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updatedRecipe(index: number, recipe: Recipe) {
    this.recipes[index] = recipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
