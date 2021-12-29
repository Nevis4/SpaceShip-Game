import { Spaceship } from "./Spaceship.js";
import { Enemy } from "./Enemy.js";
import { BigEnemy } from "./BigEnemy.js";

class Game {
  #htmlElement = {
    spaceship: document.querySelector("[data-spaceship]"),
    container: document.querySelector("[data-container]"),
    score: document.querySelector("[data-score]"),
    lives: document.querySelector("[data-lives]"),
    modal: document.querySelector("[data-modal]"),
    scoreInfo: document.querySelector("[data-score-info]"),
    button: document.querySelector("[data-button]"),
  };

  #ship = new Spaceship(
    this.#htmlElement.spaceship,
    this.#htmlElement.container
  );
  bigEnemyElement = null;
  #enemys = [];
  #lives = 0;
  #score = 0;
  #enemysInterval = null;
  #checkPositionInterval = null;
  #createEenemyInterval = null;

  init() {
    this.#ship.init();
    this.#newGame();
    this.#htmlElement.button.addEventListener("click", () => this.#newGame());
  }

  #newGame() {
    this.#htmlElement.modal.classList.add("hide");
    this.#enemysInterval = 10; //enemy speed
    this.#lives = 3;
    this.#score = 0;
    this.#updateLivesText();
    this.#updateScoreText();
    this.#ship.element.style.left = "0px";
    this.#ship.setPosition();
    this.#createEenemyInterval = setInterval(
      () => this.#randomNewEnemy(),
      2000
    );
    this.#checkPositionInterval = setInterval(() => this.#checkPosition(), 1);
  }

  #endGame() {
    this.#htmlElement.modal.classList.remove("hide");
    this.#htmlElement.scoreInfo.textContent = `You loose your score is: ${
      this.#score
    }`;
    this.#enemys.forEach((enemy) => enemy.explode());
    this.#enemys.length = 0;
    clearInterval(this.#createEenemyInterval);
    clearInterval(this.#checkPositionInterval);
  }

  //Functions for create new enemys
  #randomNewEnemy() {
    const randomNumber = Math.floor(Math.random() * 5) + 1;
    randomNumber % 5
      ? this.#createNewEnemy(
          this.#htmlElement.container,
          this.#enemysInterval,
          "enemy",
          "explosion"
        )
      : this.#createNewEnemy(
          this.#htmlElement.container,
          this.#enemysInterval * 2,
          "enemy--big",
          "explosion--big",
          3
        );
  }

  #createBigEnemy() {
    this.#enemys.forEach((enemy) => enemy.explode());
    this.#enemys.length = 0;
    clearInterval(this.#createEenemyInterval);
    this.#createBoss(
      this.#htmlElement.container,
      10,
      "enemy--big--boss",
      "explosion--big",
      10
    );
    this.#checkPositionInterval = setInterval(
      () => this.#checkPositionBoss(),
      1
    );
  }

  #createBoss(...params) {
    this.bigEnemyElement = new BigEnemy(...params);
    this.bigEnemyElement.init();
    this.#enemys.push(this.bigEnemyElement);
  }

  #createNewEnemy(...params) {
    const enemy = new Enemy(...params);
    enemy.init();
    this.#enemys.push(enemy);
  }
  //End of functions

  #checkPosition() {
    this.#enemys.forEach((enemy, enemyIndex, enemiesArr) => {
      const enemyPosition = {
        top: enemy.element.offsetTop,
        right: enemy.element.offsetLeft + enemy.element.offsetWidth,
        bottom: enemy.element.offsetTop + enemy.element.offsetHeight,
        left: enemy.element.offsetLeft,
      };
      if (enemyPosition.top > window.innerHeight) {
        enemy.explode();
        enemiesArr.splice(enemyIndex, 1);
        this.#updateLives();
      }
      this.#ship.missiles.forEach((missile, missileIndex, missileArr) => {
        const missilePosition = {
          top: missile.element.offsetTop,
          right: missile.element.offsetLeft + missile.element.offsetWidth,
          bottom: missile.element.offsetTop + missile.element.offsetHeight,
          left: missile.element.offsetLeft,
        };
        if (
          missilePosition.bottom >= enemyPosition.top &&
          missilePosition.top <= enemyPosition.bottom &&
          missilePosition.right >= enemyPosition.left &&
          missilePosition.left <= enemyPosition.right
        ) {
          enemy.hit();
          if (!enemy.lives) {
            enemiesArr.splice(enemyIndex, 1);
          }
          missile.remove();
          missileArr.splice(missileIndex, 1);
          this.#updateScore();
        }
        if (missilePosition.bottom < 0) {
          missile.remove();
          missileArr.splice(missileIndex, 1);
        }
      });
    });
  }

  #checkPositionBoss() {
    const shipPosition = this.#ship.getSpaceShipPosition();
    this.bigEnemyElement.missiles.forEach(
      (missile, missileIndex, missileArr) => {
        const missilePosition = {
          top: missile.element.offsetTop,
          right: missile.element.offsetLeft + missile.element.offsetWidth,
          bottom: missile.element.offsetTop + missile.element.offsetHeight,
          left: missile.element.offsetLeft,
        };
        if (
          missilePosition.bottom >= shipPosition.top &&
          missilePosition.top <= shipPosition.bottom &&
          missilePosition.right >= shipPosition.left &&
          missilePosition.left <= shipPosition.right
        ) {
          this.#endGame();
        }
      }
    );
  }

  #updateScore() {
    this.#score++;
    if (!(this.#score % 5)) {
      this.#enemysInterval--;
    }
    this.#updateScoreText();
    if (this.#score == 20) {
      // score to boss

      this.#createBigEnemy();
    }
  }

  #updateScoreText() {
    this.#htmlElement.score.textContent = `Score: ${this.#score}`;
  }

  #updateLives() {
    this.#lives--;
    this.#updateLivesText();
    this.#htmlElement.container.classList.add("hit");
    setTimeout(() => this.#htmlElement.container.classList.remove("hit"), 100);
    if (!this.#lives) {
      this.#endGame();
    }
  }

  #updateLivesText() {
    this.#htmlElement.lives.textContent = `Lives: ${this.#lives}`;
  }
}

window.onload = function () {
  const game = new Game();
  game.init();
};
