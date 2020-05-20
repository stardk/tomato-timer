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
        tomato: false,
        shortBreak: false,
        longBreak: false,
    },
    nextStatus: function () {
        if (this.currentStatus.tomato) {
            this.currentStatus.tomato = false;
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
            this.updateTime(this.tomatoTime);
        }
    },
    updateTime: function (mins) {
        this.currentMinutes = mins;
        this.currentSeconds = 60;
    },
    start: function () {
        if (TIMER.currentStatus.paused) return;
        if (TIMER.currentSeconds === 60) TIMER.currentMinutes--;
        TIMER.currentSeconds--;
        if (TIMER.currentSeconds < 0) {
            TIMER.currentMinutes--;
            if (TIMER.currentMinutes < 0) {
                TIMER.nextStatus();
                TIMER.start();
                return;
            }
        }
        minutesNode.textContent = TIMER.currentMinutes.toString().padStart(2, '0');
        secondsNode.textContent = TIMER.currentSeconds.toString().padStart(2, '0');
        timerID = setTimeout(TIMER.start, 1000);
    }
}

const toggleStatusButton = document.querySelector('.timer__toggle-status');
const skipStatusButton = document.querySelector('.timer__next-status')
const minutesNode = document.querySelector('.timer__minutes');
const secondsNode = document.querySelector('.timer__seconds');

document.addEventListener('DOMContentLoaded', function() {
    minutesNode.textContent = TIMER.tomatoTime.toString().padStart(2, '0');
    secondsNode.textContent = '00';
});

let timerID;

toggleStatusButton.addEventListener('click', () => {
    if (TIMER.currentStatus.paused) {
        TIMER.currentStatus.paused = false;
        TIMER.currentStatus.tomato = true;
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
