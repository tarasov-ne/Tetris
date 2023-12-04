/**
 * @fileoverview Описание контроллера игры.
 * @module Controller
 */

/**
 * Класс, представляющий контроллер игры.
 * @class
 * @export
 */
export default class Controller {
    /**
     * Конструктор класса Controller.
     * @constructor
     * @param {Game} game - Объект игры.
     * @param {View} view - Объект представления.
     */
    constructor(game, view) {
        /**
         * Объект игры.
         * @member {Game}
         */
        this.game = game;

        /**
         * Объект представления.
         * @member {View}
         */
        this.view = view;

        /**
         * Идентификатор интервала для таймера.
         * @member {number|null}
         * @private
         */
        this.intervalId = null;

        /**
         * Флаг паузы в игре.
         * @member {boolean}
         * @private
         */
        this.isPause = false;

        // Обработчики событий клавиатуры
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));

        // Отображение стартового экрана
        this.view.renderStartScreen();
    }

    /**
     * Метод для обновления состояния игры.
     */
    update() {
        this.game.movePieceDown();
        this.updateView();
    }

    /**
     * Метод для обновления представления в зависимости от состояния игры.
     */
    updateView() {
        const state = this.game.getState();
        if (state.isGameOver)
            this.view.renderEndScreen(state);
        else if (!this.isPause)
            this.view.renderPauseScreen();
        else
            this.view.renderMainScreen(state);
    }

    /**
     * Метод для запуска таймера игры.
     */
    startTimer() {
        const speed = 1000 - this.game.getState().level * 100;
        if (!this.intervalId) {
            this.intervalId = setInterval(() => {
                this.update();
            }, speed > 0 ? speed : 100);
        }
    }

    /**
     * Метод для остановки таймера игры.
     */
    stopTimer() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    /**
     * Метод для начала игры.
     */
    play() {
        this.isPause = true;
        this.startTimer();
        this.updateView();
    }

    /**
     * Метод для приостановки игры.
     */
    pause() {
        this.isPause = false;
        this.stopTimer();
        this.updateView();
    }

    /**
     * Метод для сброса игры.
     */
    reset() {
        this.game.reset();
        this.play();
    }

    /**
     * Обработчик события нажатия клавиши.
     * @param {KeyboardEvent} event - Объект события клавиши.
     */
    handleKeyDown(event) {
        const state = this.game.getState();
        switch (event.keyCode) {
            case 13: // ENTER
                if (state.isGameOver)
                    this.reset();
                else if (this.isPause) {
                    this.pause();
                } else {
                    this.play();
                }
                break;
            case 37: // LEFT ARROW
                if (this.isPause) {
                    this.game.movePieceLeft();
                    this.updateView();
                }
                break;
            case 38: // UP ARROW
                if (this.isPause) {
                    this.game.rotatePiece();
                    this.updateView();
                }
                break;
            case 39: // RIGHT ARROW
                if (this.isPause) {
                    this.game.movePieceRight();
                    this.updateView();
                }
                break;
            case 40: // DOWN ARROW
                if (this.isPause) {
                    this.stopTimer();
                    this.game.movePieceDown();
                    this.updateView();
                }
                break;
        }
    }

    /**
     * Обработчик события отпускания клавиши.
     * @param {KeyboardEvent} event - Объект события клавиши.
     */
    handleKeyUp(event) {
        switch (event.keyCode) {
            case 40: // DOWN ARROW
                if (this.isPause)
                    this.startTimer();
                break;
        }
    }
}
    