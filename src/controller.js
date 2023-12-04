export default class Controller {
    constructor(game, view) {
        this.game = game;
        this.view = view;
        this.intervalId = null;
        this.isPause = false;
        

        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));

        this.view.renderStartScreen();
    }

    update() {
        this.game.movePieceDown();
        this.updateView();
    }

    updateView() {
        const state = this.game.getState();
        if (state.isGameOver)
            this.view.renderEndScreen(state);
        else if (!this.isPause)
            this.view.renderPauseScreen();
        else
            this.view.renderMainScreen(state);
    }

    startTimer() {
        const speed = 1000 - this.game.getState().level * 100;
        if (!this.intervalId){
            this.intervalId = setInterval(() => {
                this.update();
            }, speed > 0 ? speed : 100);
    }   
    }

    stopTimer() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    play() {
        this.isPause = true;
        this.startTimer();
        this.updateView();
    }

    pause() {
        this.isPause = false;
        this.stopTimer();
        this.updateView();
    }

    reset() {
        this.game.reset();
        this.play();
    }

    handleKeyDown(event) {
        const state = this.game.getState();
        switch (event.keyCode) {
            case 13: // ENTER
                if (state.isGameOver)
                    this.reset();
                else if (this.isPause){
                    this.pause();
                } else {
                    this.play();
                }
                break;
            case 37: // LEFT ARROW
                if (this.isPause){
                    this.game.movePieceLeft();
                    this.updateView();
                }
                break;
            case 38: // UP ARROW
                if (this.isPause){
                    this.game.rotatePiece();
                    this.updateView();
                }
                break;
            case 39: // RIGHT ARROW
                if (this.isPause){
                    this.game.movePieceRight();
                    this.updateView();
                }
                break;
            case 40: // DOWN ARROW
                if (this.isPause){
                    this.stopTimer();
                    this.game.movePieceDown();
                    this.updateView();
                }
                break;
        }
    }

    handleKeyUp(event) {
        switch (event.keyCode) {
            case 40: // DOWN ARROW
                if (this.isPause)
                    this.startTimer();
                break;
        }
    }
}