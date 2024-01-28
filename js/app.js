class CalorieTracker {
  constructor() {
    this._calorieLimit = 2000;
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];

    this._displayCaloriesLimit();
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCalorieProgress();
  }

  // Public Methods - APIs
  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    this._render();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    this._render();
  }

  // Private Methods

  _displayCaloriesTotal() {
    const totalCaloriesElement = document.getElementById("calories-total");
    totalCaloriesElement.innerHTML = this._totalCalories;
  }

  _displayCaloriesLimit() {
    const calorieLimitElement = document.getElementById("calories-limit");
    calorieLimitElement.innerHTML = this._calorieLimit;
  }

  _displayCaloriesConsumed() {
    const calorieConsumedElement = document.getElementById("calories-consumed");

    const consumed = this._meals.reduce(
      (total, meal) => total + meal.calories,
      0
    );

    calorieConsumedElement.innerHTML = consumed;
  }

  _displayCaloriesBurned() {
    const calorieBurnedElement = document.getElementById("calories-burned");

    const burned = this._workouts.reduce(
      (total, workout) => total + workout.calories,
      0
    );

    calorieBurnedElement.innerHTML = burned;
  }

  _displayCaloriesRemaining() {
    const calorieRemainingElement =
      document.getElementById("calories-remaining");
    const progressElement = document.getElementById("calorie-progress");

    const remaining = this._calorieLimit - this._totalCalories;

    calorieRemainingElement.innerHTML = remaining;

    if (remaining <= 0) {
      calorieRemainingElement.parentElement.parentElement.classList.remove(
        "bg-light"
      );
      calorieRemainingElement.parentElement.parentElement.classList.add(
        "bg-danger"
      );
      progressElement.classList.remove("bg-success");
      progressElement.classList.add("bg-danger");
    } else {
      calorieRemainingElement.parentElement.parentElement.classList.remove(
        "bg-danger"
      );
      calorieRemainingElement.parentElement.parentElement.classList.add(
        "bg-light"
      );
      progressElement.classList.remove("bg-danger");
      progressElement.classList.add("bg-success");
    }
  }

  _displayCalorieProgress() {
    const progressElement = document.getElementById("calorie-progress");
    const precentage = (this._totalCalories / this._calorieLimit) * 100;
    const width = Math.min(precentage, 100);
    progressElement.style.width = `${width}%`;
  }

  _render() {
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCalorieProgress();
  }
}

class Meal {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

class Workout {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

class App {
  constructor() {
    this._tracker = new CalorieTracker();

    document
      .getElementById("meal-form")
      .addEventListener("submit", this._newMeal.bind(this));
    document
      .getElementById("workout-form")
      .addEventListener("submit", this._newWorkout.bind(this));
  }

  _newMeal(e) {
    e.preventDefault();

    const name = document.getElementById("meal-name");
    const calorie = document.getElementById("meal-calories");

    // Validate User Data
    if (name.value === "" || calorie.value === "") {
      alert("Please Fill in All Feilds");
      return;
    }

    const meal = new Meal(name.value, +calorie.value);

    this._tracker.addMeal(meal);

    name.value = "";
    calorie.value = "";

    const collapseMeal = document.getElementById("collapse-meal");
    const bsCollapse = new bootstrap.Collapse(collapseMeal, {
      toggle: true,
    });
  }

  _newWorkout(e) {
    e.preventDefault();

    const name = document.getElementById("workout-name");
    const calorie = document.getElementById("workout-calories");

    // Validate User Data
    if (name.value === "" || calorie.value === "") {
      alert("Please Fill in All Feilds");
      return;
    }

    const workout = new Workout(name.value, +calorie.value);

    this._tracker.addWorkout(workout);

    name.value = "";
    calorie.value = "";

    const collapseWorkout = document.getElementById("collapse-workout");
    const bsCollapse = new bootstrap.Collapse(collapseWorkout, {
      toggle: true,
    });
  }
}

const app = new App();
