import { MissileEnemy } from "./MissileEnemy.js";

export class BigEnemy {
  missiles = [];
  #htmlElement = {
    modal: document.querySelector("[data-modal]"),
    scoreInfo: document.querySelector("[data-score-info]"),
  };

  constructor(cointeiner, intervalTime, enemyClass, explosionClass, lives = 1) {
    this.cointeiner = cointeiner;
    this.element = document.createElement("div");
    this.enemyClass = enemyClass;
    this.explosionClass = explosionClass;
    this.interval = null;
    this.intervalShoot = null;
    this.intervalTime = intervalTime;
    this.lives = lives;
    this.road = false;
  }

  init() {
    this.#setEnemy();
    this.#changePosition();
    this.#shootInterval();
  }

  #setEnemy() {
    this.element.classList.add(this.enemyClass);
    this.cointeiner.appendChild(this.element);
    this.element.style.top = "0px";
    this.element.style.left = `${this.randomPositionOfEnemy()}px`;
  }

  randomPositionOfEnemy() {
    return Math.floor(
      Math.random() * (window.innerWidth - this.element.offsetWidth)
    );
  }

  #changePosition() {
    this.interval = setInterval(
      () => this.#setNewPosition(),
      this.intervalTime
    );
  }

  #getPosition() {
    return this.element.offsetLeft + this.element.offsetWidth / 2;
  }

  #shot() {
    const missile = new MissileEnemy(
      this.#getPosition(),
      this.element.offsetTop,
      this.cointeiner
    );
    missile.init();
    this.missiles.push(missile);
  }

  #shootInterval() {
    this.intervalShoot = setInterval(() => this.#shot(), 1000);
  }

  #setNewPosition() {
    let topPosition = 100;
    if (this.element.offsetTop < topPosition) {
      this.element.style.top = `${this.element.offsetTop + 1}px`;
    }
    if (
      this.element.offsetLeft ==
      window.innerWidth - this.element.offsetWidth
    ) {
      this.element.style.top = `${this.element.offsetTop + 10}px`;
      this.road = true;
    } else if (this.element.offsetLeft == 0) {
      this.element.style.top = `${this.element.offsetTop + 10}px`;
      this.road = false;
    }
    if (this.road == false) {
      this.element.style.left = `${this.element.offsetLeft + 1}px`;
    }
    if (this.road == true) {
      this.element.style.left = `${this.element.offsetLeft - 1}px`;
    }
  }

  hit() {
    this.lives--;
    if (!this.lives) {
      this.explode();
      this.missiles.forEach((missile) => missile.remove());
      this.#endGame();
    }
  }

  explode() {
    this.element.classList.remove(this.enemyClass);
    this.element.classList.add(this.explosionClass);
    clearInterval(this.interval);
    clearInterval(this.intervalShoot);
    const animationTime = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--explosions-animation-time"
      )
    );
    setTimeout(() => this.element.remove(), animationTime);
  }

  #endGame() {
    this.#htmlElement.modal.classList.remove("hide");
    this.#htmlElement.scoreInfo.textContent = "You Win!";
  }
}
