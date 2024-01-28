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
    this._displayNewMeal(meal);
    this._render();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    this._displayNewWorkout(workout);
    this._render();
  }

  removeMeal(id) {
    const index = this._meals.findIndex((meal) => meal.id === id);

    if (index !== -1) {
      const meal = this._meals[index];
      this._totalCalories -= meal.calories;
      this._meals.splice(index, 1);
      this._render();
    }
  }

  removeWorkout(id) {
    const index = this._workouts.findIndex((workout) => workout.id === id);

    if (index !== -1) {
      const workout = this._workouts[index];
      this._totalCalories += workout.calories;
      this._workouts.splice(index, 1);
      this._render();
    }
  }

  resets() {
    this._totalCalories = 0;
    this._workouts = [];
    this.meal = [];
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

  _displayNewMeal(meal) {
    const mealsElement = document.getElementById("meal-items");
    const mealDiv = document.createElement("div");
    mealDiv.classList.add("card", "my-2");
    mealDiv.setAttribute("data-id", meal.id);

    mealDiv.innerHTML = `
      <div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
          <h4 class="mx-1">${meal.name}</h4>
          <div
            class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
          >
          ${meal.calories}
          </div>
          <button class="delete btn btn-danger btn-sm mx-2">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
    `;
    mealsElement.appendChild(mealDiv);
  }

  _displayNewWorkout(workout) {
    const workoutsElement = document.getElementById("workout-items");
    const workoutDiv = document.createElement("div");
    workoutDiv.classList.add("card", "my-2");
    workoutDiv.setAttribute("data-id", workout.id);

    workoutDiv.innerHTML = `
      <div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
          <h4 class="mx-1">${workout.name}</h4>
          <div
            class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
          >
          ${workout.calories}
          </div>
          <button class="delete btn btn-danger btn-sm mx-2">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
    `;
    workoutsElement.appendChild(workoutDiv);
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
      .addEventListener("submit", this._newItem.bind(this, "meal"));
    document
      .getElementById("workout-form")
      .addEventListener("submit", this._newItem.bind(this, "workout"));
    document
      .getElementById("meal-items")
      .addEventListener("click", this._removeItem.bind(this, "meal"));
    document
      .getElementById("workout-items")
      .addEventListener("click", this._removeItem.bind(this, "workout"));
    document
      .getElementById("filter-meals")
      .addEventListener("keyup", this._filterItems.bind(this, "meal"));
    document
      .getElementById("filter-workouts")
      .addEventListener("keyup", this._filterItems.bind(this, "workout"));
    document
      .getElementById("reset")
      .addEventListener("click", this._resets.bind(this));
  }

  _newItem(type, e) {
    e.preventDefault();

    const name = document.getElementById(`${type}-name`);
    const calorie = document.getElementById(`${type}-calories`);

    // Validate User Data
    if (name.value === "" || calorie.value === "") {
      alert("Please Fill in All Feilds");
      return;
    }

    if (type === "meal") {
      const meal = new Meal(name.value, +calorie.value);
      this._tracker.addMeal(meal);
    } else {
      const workout = new Workout(name.value, +calorie.value);
      this._tracker.addWorkout(workout);
    }

    name.value = "";
    calorie.value = "";

    const collapseItem = document.getElementById(`collapse-${type}`);
    const bsCollapse = new bootstrap.Collapse(collapseItem, {
      toggle: true,
    });
  }

  _removeItem(type, e) {
    if (
      e.target.classList.contains("delete") ||
      e.target.classList.contains("fa-xmark")
    ) {
      if (confirm("Are you sure?")) {
        console.log("Delete");
        const id = e.target.closest(".card").getAttribute("data-id");

        type === "meal"
          ? this._tracker.removeMeal(id)
          : this._tracker.removeWorkout(id);

        e.target.closest(".card").remove();
      }
    }
  }

  _filterItems(type, e) {
    const text = e.target.value.toLowerCase();

    document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
      const name = item.firstElementChild.firstElementChild.textContent;

      if (name.toLowerCase().indexOf(text) !== -1) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }

  _resets() {
    this._tracker.resets();
    document.getElementById("meal-items").innerHTML = "";
    document.getElementById("workout-items").innerHTML = "";
    document.getElementById("filter-meals").value = "";
    document.getElementById("filter-workouts").value = "";
    console.log("reset");
  }
}

const app = new App();
