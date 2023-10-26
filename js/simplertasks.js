let taskMap = new Map();
let isFormatted = false;

// Event Listeners
document.getElementById('copy-button').addEventListener('click', function() {
    copyTextToClipboard('initial-list');
    alert('Text copied to clipboard!');
});

document.getElementById('fancy-tab').addEventListener('click', sortAndGroup);
document.getElementById('plain-tab').addEventListener('click', showPlainText);
document.getElementById('email-tab').addEventListener('click', transferToEmailList);
document.getElementById('themeToggle').addEventListener('change', toggleTheme);

document.addEventListener("DOMContentLoaded", function() {
    initializeSampleTasks();
});

function copyTextToClipboard(elementId) {
    let textArea = document.getElementById(elementId);
    textArea.select();
    document.execCommand('copy');
}

function emailList() {
    let textArea = document.getElementById('email-list');
    let lines = textArea.value.trim().split('\n').join('%0D%0A');
    window.location.href = `mailto:?subject=Your To-Do List&body=${lines}`;
}

function transferToEmailList() {
    let initialList = document.getElementById('initial-list');
    let emailList = document.getElementById('email-list');
    emailList.value = initialList.value;
}

function toggleTheme(event) {
    if (event.currentTarget.checked) {
        changeTheme('dark');
    } else {
        changeTheme('light');
    }
}

function changeTheme(mode) {
    const body = document.body;
    if (mode === 'light') {
        body.classList.remove('bg-dark', 'text-white');
        body.classList.add('bg-light', 'text-dark');
    } else if (mode === 'dark') {
        body.classList.remove('bg-light', 'text-dark');
        body.classList.add('bg-dark', 'text-white');
    } else {
        const hour = new Date().getHours();
        if (hour < 6 || hour > 18) {
            body.classList.remove('bg-light', 'text-dark');
            body.classList.add('bg-dark', 'text-white');
        } else {
            body.classList.remove('bg-dark', 'text-white');
            body.classList.add('bg-light', 'text-dark');
        }
    }
}

function initializeSampleTasks() {
    let sampleTasks = `
 Buy groceries for the week. http://cnn.com
Finish editing a short film. #home
!Call mom for her birthday.
Fix that annoying bug in the Python script.
-Go for a 30-minute jog.
Water the plants.
-Prepare slides for tomorrow's meeting.
Cook dinner for friends coming over tonight.
[3] Meditate for 10 minutes #daily
Go to Walmart #home Today (jam, milk, return pants)
    `;
    let textArea = document.getElementById('initial-list');
    textArea.value = sampleTasks.trim();
}

// Your other functions for sortAndGroup, showPlainText, updateCheckboxStatus, etc. 
// I've kept them mostly the same as the initial code you provided.
function sortAndGroup() {
    let specialTodayTask = [...taskMap.keys()].find(task => /^TODAY\s*:?\s+/i.test(task));
    console.log("Detected TODAY task:", specialTodayTask);

    let todayElement = document.getElementById('specialTodayTask');
    let todayTextElement = todayElement.querySelector('#specialTodayText');

    if (specialTodayTask) {
        todayTextElement.textContent = specialTodayTask;
        todayElement.style.display = 'block';
    } else {
        todayElement.style.display = 'none';
    }

    if (!isFormatted) {
        let textArea = document.getElementById('initial-list');
        let lines = textArea.value.trim().split('\n');
        taskMap.clear();

        lines.forEach((line) => {
            let checkboxStatus = taskMap.has(line) ? taskMap.get(line) : false;
            taskMap.set(line, checkboxStatus);
        });
    }

    isFormatted = true;

    let buildGroup = (tasks, status) => {
        return tasks.map((task, index) => {
            let checkedAttribute = taskMap.get(task) ? 'checked' : '';
            let noteMatch = task.match(/\(([^)]+)\)/);
            let note = noteMatch ? `<div class="note">${noteMatch[1]}</div>` : '';
            let taskWithoutNote = noteMatch ? task.replace(noteMatch[0], '') : task;

            let urlMatch = taskWithoutNote.match(/https?:\/\/[^\s]+/);
            let taskContent = urlMatch ? taskWithoutNote.replace(urlMatch[0], `<a href="${urlMatch[0]}" target="_blank">${urlMatch[0]}</a>`) : taskWithoutNote;

            return `<input type="checkbox" id="${status}-${index}" ${checkedAttribute} 
                    onchange="updateCheckboxStatus('${task}', '${status}-${index}')"> ${taskContent}<br>${note}`;
        }).join('');
    };

    let sortedList = document.getElementById('sortedTasks');
    sortedList.innerHTML = `
        <h2 class="mt-3">Today</h2>
        ${buildGroup([...taskMap.keys()].filter(task => task.toLowerCase().includes('today') && !task.startsWith('TODAY')), 'today')}
        <h2 class="mt-3">High Priority</h2>
        ${buildGroup([...taskMap.keys()].filter(task => task.startsWith('!') && !task.toLowerCase().includes('today')), 'high')}
        <h2 class="mt-3">Normal</h2>
        ${buildGroup([...taskMap.keys()].filter(task => !task.startsWith('!') && !task.startsWith('-') && !task.startsWith('x') && !task.toLowerCase().includes('today')), 'normal')}
        <h2 class="mt-3">Low Priority</h2>
        ${buildGroup([...taskMap.keys()].filter(task => task.startsWith('-') && !task.toLowerCase().includes('today')), 'low')}
        <h2 class="mt-3">Done</h2>
        ${buildGroup([...taskMap.keys()].filter(task => task.startsWith('x')), 'done')}
    `;
}

function updateCheckboxStatus(task, id) {
    let checkbox = document.getElementById(id);
    taskMap.set(task, checkbox.checked);
}

function showPlainText() {
    let textArea = document.getElementById('initial-list');
    let plainTasks = [...taskMap.keys()].map(task => {
        if (taskMap.get(task)) {
            return `x ${task}`;
        }
        return task;
    });
    textArea.value = plainTasks.join('\n');
    isFormatted = false;
}
