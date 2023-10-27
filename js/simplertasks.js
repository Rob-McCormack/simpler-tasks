let taskMap = new Map();
let isFormatted = false;

// Event Listeners
document.getElementById('copy-button').addEventListener('click', function () {
    copyTextToClipboard('initial-list');
    alert('Text copied to clipboard!');
});

document.getElementById('fancy-tab').addEventListener('click', sortAndGroup);
document.getElementById('plain-tab').addEventListener('click', showPlainText);
document.getElementById('email-tab').addEventListener('click', transferToEmailList);
document.getElementById('themeToggle').addEventListener('change', toggleTheme);

document.addEventListener("DOMContentLoaded", function () {
    initializeSampleTasks();
});



// const textArea = document.getElementById('initial-list');

// textArea.addEventListener('input', autoResizeTextArea);

// function autoResizeTextArea() {
//     this.style.height = 'auto'; // Reset height to auto first
//     this.style.height = (this.scrollHeight) + 'px'; // Then set it to its scroll height
// }

// // Initial resize (if you want to resize it on page load)
// autoResizeTextArea.call(textArea);


//  ---- This is mostly working Rob

// const textAreas = [
//     document.getElementById('initial-list'),
//     document.getElementById('email-list')
// ];

// textAreas.forEach(textArea => {
//     textArea.addEventListener('input', autoResizeTextArea);
//     autoResizeTextArea.call(textArea); // For initial resize on page load
// });

// // Initial resize (if you want to resize it on page load)
// autoResizeTextArea.call(textArea);

// function autoResizeTextArea() {
//     this.style.height = 'auto';
//     this.style.height = (this.scrollHeight) + 'px';
// }

//  ====

document.getElementById('initial-list').addEventListener('input', function () {
    // Get the content of the textarea
    let content = this.value;

    // Check if the first line starts with "TITLE:"
    if (content.startsWith("TITLE:")) {
        // Extract the title
        let title = content.split('\n')[0].replace("TITLE:", "").trim();

        // Display it in the Fancy tab
        let fancyTab = document.getElementById('fancy');
        let titleElement = fancyTab.querySelector('h3.title'); // Try to select an existing title element

        // If the title element doesn't exist, create it
        if (!titleElement) {
            titleElement = document.createElement('h3');
            titleElement.classList.add('title'); // Add a class for potential styling
            fancyTab.prepend(titleElement); // Add it to the start of the Fancy tab
        }

        // Update the content of the title element
        titleElement.textContent = title;
    } else {
        // If the TITLE: pattern is not found, remove any existing title element
        let fancyTab = document.getElementById('fancy');
        let titleElement = fancyTab.querySelector('h3.title');
        if (titleElement) {
            titleElement.remove();
        }
    }
});



// A function to extract NOTES from the task list
function extractNotes(content) {
    const notesRegex = /^NOTES:\n([\s\S]*)$/m;  // This regex matches "NOTES:" at the start of a line and captures everything after it
    const match = content.match(notesRegex);
    if (match) {
        return match[1].trim();  // Return the captured group (the actual notes)
    }
    return null;
}


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
TITLE: The Big list for BOB    
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






function sortAndGroup() {
    let notesContent = extractNotes(document.getElementById('initial-list').value);

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
        let lines = textArea.value.trim().split('\n').filter(line => !line.startsWith("NOTES:"));

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
        <h5 class="mt-3">Today</h5>
        ${buildGroup([...taskMap.keys()].filter(task => task.toLowerCase().includes('today') && !task.startsWith('TODAY')), 'today')}
        <h5 class="mt-3">High Priority</h5>
        ${buildGroup([...taskMap.keys()].filter(task => task.startsWith('!') && !task.toLowerCase().includes('today')), 'high')}
        <h5 class="mt-3">Normal</h5>
        ${buildGroup([...taskMap.keys()].filter(task => !task.startsWith('!') && !task.startsWith('-') && !task.startsWith('x') && !task.toLowerCase().includes('today')), 'normal')}
        <h5 class="mt-3">Low Priority</h5>
        ${buildGroup([...taskMap.keys()].filter(task => task.startsWith('-') && !task.toLowerCase().includes('today')), 'low')}
        <h5 class="mt-3">Done</h5>
        ${buildGroup([...taskMap.keys()].filter(task => task.startsWith('x')), 'done')}
    `;

    // Extract notes from the initial list and store in a variable
    let notes = extractNotes(document.getElementById('initial-list').value);

    // Append the notes to the sortedTasks div
    if (notes) {
        let formattedNotes = notes.replace(/(\r\n|\n|\r)/gm, '<br>');  // Convert newline characters to <br>
        sortedList.innerHTML += `
            <h5 class="mt-3">NOTES:</h5>
            <p>${formattedNotes}</p>
        `;
    }
}







// Append the notes to the sortedTasks div
if (notes) {
    let formattedNotes = notes.replace(/(\r\n|\n|\r)/gm, '<br>');  // Convert newline characters to <br>
    sortedList.innerHTML += `
            <h5 class="mt-3">NOTES:</h5>
            <p>${formattedNotes}</p>
        `;
}


function updateCheckboxStatus(task, id) {
    let checkbox = document.getElementById(id);
    taskMap.set(task, checkbox.checked);
}


function showPlainText() {
    let textArea = document.getElementById('initial-list');
    let plainTasks = [...taskMap.keys()].filter(task => !task.startsWith("This is") && !task.startsWith("will help") && !task.startsWith("things")).map(task => {
        if (taskMap.get(task)) {
            return `x ${task}`;
        }
        return task;
    });

    // Extract notes from the initial list and store in a variable
    let notes = extractNotes(document.getElementById('initial-list').value);
    console.log("Extracted Notes:", notes);


    // Append the notes to the sortedTasks div
    if (notes) {
        let formattedNotes = notes.replace(/(\r\n|\n|\r)/g, '<br>');
        console.log(formattedNotes);  // <-- Temporary debugging line
        sortedList.innerHTML += `
            <h5 class="mt-3">NOTES:</h5>
            <p>${formattedNotes}</p>
        `;
    }




    textArea.value = plainTasks.join('\n');
    isFormatted = false;
}
