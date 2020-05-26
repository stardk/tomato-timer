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

function syncSettings (reset = false) {
    if (inputTomato.value) {
        TIMER.tomatoTime = inputTomato.value;
    } else inputTomato.value = TIMER.tomatoTime;
    if (inputShortBreak.value) {
        TIMER.shortBreakTime = inputShortBreak.value;
    } else inputShortBreak.value = TIMER.shortBreakTime;
    if (inputLongBreak.value) {
        TIMER.longBreakTime = inputLongBreak.value;
    } else inputLongBreak.value = TIMER.longBreakTime;
    if (inputTimes.value) {
        TIMER.timesToLongBreak = inputTimes.value;
    } else inputTimes.value = TIMER.timesToLongBreak;

    if (reset) {
        TIMER.currentStatus.tomato = true;
        TIMER.currentStatus.paused = true;
        TIMER.updateTime(TIMER.tomatoTime);
        resetNodesValues();
    }

    settingsNode.classList.add('hidden');
}

function resetNodesValues() {
    minutesNode.textContent = TIMER.tomatoTime.toString().padStart(2, '0');
    secondsNode.textContent = '00';
    toggleStatusButton.textContent = 'Start';
    document.title = 'Timer';
}

const toggleStatusButton = document.querySelector('.timer__toggle-status');
const skipStatusButton = document.querySelector('.timer__next-status');
const settingsButton = document.querySelector('.timer-settings__icon');
const minutesNode = document.querySelector('.timer__minutes');
const secondsNode = document.querySelector('.timer__seconds');
const settingsNode = document.querySelector('.timer-settings__container');
const inputTomato = document.querySelector('.input-tomato');
const inputShortBreak = document.querySelector('.input-short-break');
const inputLongBreak = document.querySelector('.input-long-break');
const inputTimes = document.querySelector('.input-times');

const workAudio = new Audio('./sounds/work.mp3');
const relaxAudio = new Audio('./sounds/relax.mp3');
workAudio.volume = 0.3;
relaxAudio.volume = 0.3;

document.addEventListener('DOMContentLoaded', function() {
    resetNodesValues();
    syncSettings();
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

settingsButton.addEventListener('click', () => {
    settingsNode.classList.toggle('hidden');
});

settingsNode.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        e.preventDefault();
        syncSettings(true);
    }
})