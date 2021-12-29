export class Enemy {
  constructor(cointeiner, intervalTime, enemyClass, explosionClass, lives = 1) {
    this.cointeiner = cointeiner;
    this.element = document.createElement("div");
    this.enemyClass = enemyClass;
    this.explosionClass = explosionClass;
    this.interval = null;
    this.intervalTime = intervalTime;
    this.lives = lives;
  }

  init() {
    this.#setEnemy();
    this.#changePosition();
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

  #setNewPosition() {
    this.element.style.top = `${this.element.offsetTop + 1}px`;
  }

  hit() {
    this.lives--;
    if (!this.lives) {
      this.explode();
    }
  }

  explode() {
    this.element.classList.remove(this.enemyClass);
    this.element.classList.add(this.explosionClass);
    clearInterval(this.interval);
    const animationTime = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--explosions-animation-time"
      )
    );
    setTimeout(() => this.element.remove(), animationTime);
  }
}
