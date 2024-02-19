export interface ApiMeal {
  calorie: number;
  description: string;
  mealTime: string;
}

export interface Meal extends ApiMeal {
  id: string;
}

export interface ApiMeals {
  [id: string]: ApiMeal;
}