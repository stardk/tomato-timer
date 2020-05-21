let TIMER = {
    tomatoTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    timesToLongBreak: 4,
    tomatoCount: 0,
    currentMinutes: 25,
    currentSeconds: 60,
    currentStatus: {
        paused: true,
        tomato: true,
        shortBreak: false,
        longBreak: false,
    },
    nextStatus: function () {
        if (this.currentStatus.tomato) {
            this.currentStatus.tomato = false;
            relaxAudio.play();
            this.tomatoCount++;
            if (this.tomatoCount < 4) {
                this.currentStatus.shortBreak = true;
                this.updateTime(this.shortBreakTime);
            }
            else {
                this.currentStatus.longBreak = true;
                this.updateTime(this.longBreakTime);
                this.tomatoCount = 0;
            }
        }
        else {
            this.currentStatus.tomato = true;
            this.currentStatus.shortBreak, this.currentStatus.longBreak = false;
            workAudio.play();
            this.updateTime(this.tomatoTime);
        }
    },
    updateTime: function (mins) {
        this.currentMinutes = mins;
        this.currentSeconds = 60;
    },
    updateTitle: function () {
        titleStatus = this.currentStatus.tomato ? 'Work' : 'Relax';
        document.title = this.currentMinutes.toString().padStart(2, '0') + ':' + this.currentSeconds.toString().padStart(2, '0') + ' — ' + titleStatus;
    },
    start: function () {
        if (TIMER.currentStatus.paused) return;
        if (TIMER.currentSeconds === 60) TIMER.currentMinutes--;
        TIMER.currentSeconds--;
        if (TIMER.currentSeconds < 0) {
            if (TIMER.currentMinutes === 0) {
                TIMER.nextStatus();
                setTimeout(TIMER.start(), 3000);
                return;
            }
            else {
                TIMER.currentSeconds = 60;
                TIMER.start();
                return;
            }            
        }
        minutesNode.textContent = TIMER.currentMinutes.toString().padStart(2, '0');
        secondsNode.textContent = TIMER.currentSeconds.toString().padStart(2, '0');
        TIMER.updateTitle();
        timerID = setTimeout(TIMER.start, 1000);
    }
}

const toggleStatusButton = document.querySelector('.timer__toggle-status');
const skipStatusButton = document.querySelector('.timer__next-status')
const minutesNode = document.querySelector('.timer__minutes');
const secondsNode = document.querySelector('.timer__seconds');

const workAudio = new Audio('./sounds/work.mp3');
const relaxAudio = new Audio('./sounds/relax.mp3');

document.addEventListener('DOMContentLoaded', function() {
    minutesNode.textContent = TIMER.tomatoTime.toString().padStart(2, '0');
    secondsNode.textContent = '00';
});

let timerID, titleStatus;

toggleStatusButton.addEventListener('click', () => {
    if (TIMER.currentStatus.paused) {
        TIMER.currentStatus.paused = false;
        TIMER.start();
        toggleStatusButton.textContent = 'Pause';
    }
    else {
        TIMER.currentStatus.paused = true;
        toggleStatusButton.textContent = 'Start';
    }
});

skipStatusButton.addEventListener('click', () => {
    TIMER.nextStatus();
});
