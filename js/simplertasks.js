let taskMap = new Map();
let isFormatted = false;

// TODO: Rob, this cause focus trouble when in VS code
window.onload = function () {
    // document.getElementById('initial-list').focus();
};

// When the page loads, check if there's a "tasks" query parameter and populate the textarea:
window.onload = function () {
    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('tasks')) {
        let tasks = decodeURIComponent(urlParams.get('tasks'));
        document.getElementById("initial-list").value = tasks;
    }
}
document.getElementById('edit-tab').addEventListener('click', function () {
    setTimeout(() => {
        document.getElementById('initial-list').focus();
    }, 100);
});

document.addEventListener('keydown', function (event) {
    if (event.key === 'Tab') {
        event.preventDefault();

        // If the Edit tab is currently active, switch to the View tab
        if (document.getElementById('edit-tab').classList.contains('active')) {
            new bootstrap.Tab(document.getElementById('view-tab')).show();
        }
        // If any other tab is active, switch to the Edit tab and focus the textarea
        else {
            new bootstrap.Tab(document.getElementById('edit-tab')).show();
            setTimeout(() => {
                document.getElementById('initial-list').focus();
            }, 100);
        }
    }
});


// Event Listeners
document.getElementById("edit-tab").addEventListener("click", trimTrailingSpaces);
document.getElementById("view-tab").addEventListener("click", trimTrailingSpaces);

document.getElementById("view-tab").addEventListener("click", function () {
    let content = document.getElementById("initial-list").value;
    let trimmedContent = content.trim();
});

document.getElementById("copy-button").addEventListener("click", function () {
    copyTextToClipboard("initial-list");
    alert("Text copied to clipboard!");
});

document.getElementById("view-tab").addEventListener("click", function () {
    reconcileTaskMapWithTextarea();
    sortAndGroup();
    displayTaskCounts(); // Ensure count is updated
});

document.getElementById("edit-tab").addEventListener("click", showPlainText);
document.getElementById("themeToggle").addEventListener("change", toggleTheme);
document.addEventListener("DOMContentLoaded", function () {
    initializeSampleTasks();
    reconcileTaskMapWithTextarea();
    sortAndGroup();
    displayTaskCounts();
});

const specialCharsxxxx = [
    // TODO: moved to HTML document
];


// When you want to generate the URL for sharing:
function generateShareableURL() {
    let tasks = document.getElementById("initial-list").value;
    let encodedTasks = encodeURIComponent(tasks);
    let shareableURL = `https://SimplerTasks.com?tasks=${encodedTasks}`;
    return shareableURL;
}

// TODO: this was a duplicate.// When the page loads, check if there's a "tasks" query parameter and populate the textarea:
// window.onload = function () {
//     let urlParams = new URLSearchParams(window.location.search);
//     if (urlParams.has('tasks')) {
//         let tasks = decodeURIComponent(urlParams.get('tasks'));
//         document.getElementById("initial-list").value = tasks;
//     }
// }


function wrapSpecialCharacter(task) {
    for (let item of specialChars) {
        if (task.startsWith(item.char + " ")) {
            return `<sub>${item.char}</sub> ${task.slice(2)}`;
        }
    }
    // If no special character is found at the start, treat as normal priority
    return `<sub> </sub> ${task}`;
}

function convertToClickableURLs(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
}


const emoticonMappings = [
    { emoticon: ":\\)", symbol: "sentiment_satisfied" },  // Notice the double backslashes before )
    { emoticon: ":\\(", symbol: "sentiment_dissatisfied" }  // Notice the double backslashes before (
    //... add more mappings as needed
];

function stMarkDown(text) {
    // Replace **bold text** with <strong>bold text</strong>
    text = text.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');

    // Replace __italics text__ with <em>italics text</em>
    text = text.replace(/__([^_]+)__/g, '<em>$1</em>');

    // Replace ::highlight text:: with <mark>highlight text</mark>
    text = text.replace(/::([^:]+)::/g, '<mark>$1</mark>');

    // Convert 'image=URL' to '<img src="URL" alt="" style="max-width:100px; height:auto;">'
    text = text.replace(/image=([^\s]+)/g, '<img src="$1" alt="" style="max-width:100px; height:auto;">');

    // Convert '`code here`' to '<code>code here</code>'
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    // Replace emoticons with corresponding Google symbols
    for (let mapping of emoticonMappings) {
        const regex = new RegExp(mapping.emoticon, 'g');
        text = text.replace(regex, `<span class="material-symbols-outlined">${mapping.symbol}</span>`);
    }
    return text;
}
function reconcileTaskMapWithTextarea() {
    const textArea = document.getElementById("initial-list");
    let content = textArea.value.trim();
    let notesSegment = content.includes("NOTES:") ? content.split("NOTES:")[1].trim() : null;

    // Separate tasks and notes
    let tasks = notesSegment ? content.split("NOTES:")[0].trim().split("\n") : content.split("\n");
    const newTaskMap = new Map();

    tasks.forEach((task) => {
        const checkboxStatus = task.startsWith("d ");
        newTaskMap.set(task, checkboxStatus);
    });

    if (notesSegment) {
        newTaskMap.set("NOTES:", notesSegment);
    }

    taskMap = newTaskMap;
    // console.log("Updated taskMap:", taskMap);

}


document.getElementById("initial-list").addEventListener("input", function () {
    const textarea = document.getElementById("initial-list");
    const trimmedContent = textarea.value.trim();

    if (textarea.value !== trimmedContent) {
        textarea.value = trimmedContent; // Trim any leading/trailing spaces
    }

    // Reconcile the taskMap with the textarea content
    reconcileTaskMapWithTextarea();


    // Update the task counts
    displayTaskCounts();
});


function trimTrailingSpaces() {
    const textarea = document.getElementById("initial-list");
    textarea.value = textarea.value.split("\n").map(line => line.trimEnd()).join("\n");
}

function displayTaskCounts() {
    const tasks = [...taskMap.keys()];
    const doneTasks = tasks.filter((task) => task.startsWith("d ")).length;
    const totalTasks = tasks.length;
    const navTaskCount = totalTasks - doneTasks;

    const taskCountElement = document.getElementById("taskCount");
    if (taskCountElement) {
        taskCountElement.textContent = navTaskCount;
        taskCountElement.style.display = "inline";
    }
}

function extractUsernames(task) {
    const regex = /@(\w+)/g;
    let match;
    const usernames = [];

    while ((match = regex.exec(task)) !== null) {
        usernames.push(match[1]);
    }

    return usernames;
}

const colorClasses = [
    "bg-danger",
    "bg-success",
    "bg-info",
    "bg-warning",
    "bg-primary",
    "bg-secondary",
    "bg-dark",
];
const userColorMap = new Map();

function getBadgeColorForUser(username) {
    if (!userColorMap.has(username)) {
        const nextColor = colorClasses[userColorMap.size % colorClasses.length];
        userColorMap.set(username, nextColor);
    }

    return userColorMap.get(username);
}

const textColorClasses = [
    "text-danger",
    "text-success",
    "text-info",
    "text-warning",
    "text-primary",
    "text-secondary",
    "text-dark"
];

function formatContextInTask(task) {
    let contexts = task.match(/#\w+/g) || [];
    contexts.forEach((context) => {
        let colorClass = getBadgeColorForUser(context); // Reusing the function as it cycles through colors
        task = task.replace(
            context,
            `<span class="${colorClass} lighter-text">${context}</span>`
        );
    });
    return task;
}

function formatUsernamesInTask(task) {
    let usernames = extractUsernames(task);
    usernames.forEach((username) => {
        let badgeColor = getBadgeColorForUser(username);
        task = task.replace(
            `@${username}`,
            `<span class="badge rounded-pill ${badgeColor} lighter-text">@${username}</span>`
        );
    });
    return task;
}

function extractNotes(content) {
    const notesRegex = /^NOTES:\n([\s\S]*)$/m;
    const match = content.match(notesRegex);
    if (match && match[1]) {
        return { notes: match[1].trim() };
    }
    return { notes: null };
}


function copyTextToClipboard(elementId) {
    let textArea = document.getElementById(elementId);
    textArea.select();
    document.execCommand("copy");
}

function toggleTheme(event) {
    if (event.currentTarget.checked) {
        changeTheme("dark");
    } else {
        changeTheme("light");
    }
}

function changeTheme(mode) {
    const body = document.body;
    if (mode === "light") {
        body.classList.remove("bg-dark", "text-white");
        body.classList.add("bg-light", "text-dark");
    } else if (mode === "dark") {
        body.classList.remove("bg-light", "text-dark");
        body.classList.add("bg-dark", "text-white");
    } else {
        const hour = new Date().getHours();
        if (hour < 6 || hour > 18) {
            body.classList.remove("bg-light", "text-dark");
            body.classList.add("bg-dark", "text-white");
        } else {
            body.classList.remove("bg-dark", "text-white");
            body.classList.add("bg-light", "text-dark");
        }
    }
}



function sortAndGroup() {

    let content = document.getElementById("initial-list").value.trim();
    let specialTodayTask = [...taskMap.keys()].find((task) => /^TODAY\s*:?\s+/i.test(task));
    let todayElement = document.getElementById("specialTodayTask");
    let todayTextElement = todayElement.querySelector("#specialTodayText");

    // Convert tasks to lowercase for special characters
    const tasks = [...taskMap.keys()];
    tasks.forEach((task, index) => {
        for (let item of specialChars) {
            if (task.startsWith(item.char.toUpperCase() + " ")) {
                tasks[index] = task.charAt(0).toLowerCase() + task.slice(1);
            }
        }
    });

    if (specialTodayTask) {
        todayTextElement.textContent = specialTodayTask;
        todayElement.style.display = "block";
    } else {
        todayElement.style.display = "none";
    }

    if (!isFormatted) {
        let textArea = document.getElementById("initial-list");
        let lines = textArea.value.trim().split("\n").filter((line) => !line.startsWith("NOTES:"));
        taskMap.clear();
        lines.forEach((line) => {
            let checkboxStatus = taskMap.has(line) ? taskMap.get(line) : false;
            taskMap.set(line, checkboxStatus);
        });
    }

    isFormatted = true;
    let sortedList = document.getElementById("sortedTasks");

    let buildHeader = (title, colorClass = "") => {
        return `<h5 class="mt-3 ${colorClass}">${title}</h5>`;
    };


    let processTasks = (tasks) => {
        return tasks.map(task => {
            task = formatUsernamesInTask(task);  // Existing function call
            task = wrapSpecialCharacter(task);   // Existing function call
            task = stMarkDown(task);  // New function call for stMarkDown processing
            return task;
        }).join('<br>');
    };

    let mustDoTask = [...taskMap.keys()].find(task => task.startsWith("! "));
    let mustDoHTML = "";

    sortedList.innerHTML = `
    ${buildHeader("Title")}
    ${processTasks([...taskMap.keys()].filter(task => task.toLowerCase().startsWith("title ")))}
    ${buildHeader("Update")}
    ${processTasks([...taskMap.keys()].filter(task => task.toLowerCase().startsWith("update ")))}
    ${buildHeader("Must-Do", "text-info")}
    ${processTasks([...taskMap.keys()].filter(task => task.startsWith("! ") && !task.toLowerCase().startsWith("t ")))}
    ${buildHeader("Today", "text-danger")}
    ${processTasks([...taskMap.keys()].filter(task => task.toLowerCase().startsWith("t ")))}
        ${buildHeader("High Priority", "text-info")}
        ${processTasks([...taskMap.keys()].filter(task => task.toLowerCase().startsWith("h ") && !task.toLowerCase().startsWith("t ") && !task.startsWith("! ")))}

        ${buildHeader("Normal")}
        ${processTasks([...taskMap.keys()].filter(task =>
        !task.startsWith("! ") &&
        !task.toLowerCase().startsWith("d ") &&
        !task.toLowerCase().startsWith("h ") &&
        !task.toLowerCase().startsWith("l ") &&
        !task.toLowerCase().startsWith("t ") &&
        !task.toLowerCase().startsWith("r ") && // Exclude recurring tasks
        !task.startsWith("R ") && // Also exclude uppercase recurring tasks
        // !task.startsWith("TITLE: ") &&
        !task.toLowerCase().startsWith("n ")  // Exclude notes
    ))}
        


${buildHeader("Low Priority")}
${processTasks([...taskMap.keys()].filter(task => task.toLowerCase().startsWith("l ") && !task.toLowerCase().startsWith("t ")))}
${buildHeader("Recurring", "text-warning")}
${processTasks([...taskMap.keys()].filter(task => task.toLowerCase().startsWith("r ") && !task.startsWith("! ") && !task.startsWith("- ") && !task.startsWith("d ") && !task.toLowerCase().startsWith("h ") && !task.toLowerCase().startsWith("l ") && !task.toLowerCase().startsWith("t ")))}
${buildHeader("Done")}
${processTasks([...taskMap.keys()].filter(task => task.toLowerCase().startsWith("d ")))}
${buildHeader("NOTES")}
${processTasks([...taskMap.keys()].filter(task => task.toLowerCase().startsWith("n ")))}
`;

    let notes = extractNotes(document.getElementById("initial-list").value);

}

function updateCheckboxStatus(task, id) {
    let checkbox = document.getElementById(id);
    let isChecked = checkbox.checked;
    taskMap.set(task, isChecked);
    let updatedTasks = [...taskMap.keys()].map(t => {
        if (taskMap.get(t)) {
            return `x ${t}`;
        }
        return t;
    });
    document.getElementById("initial-list").value = updatedTasks.join("\n");
    displayTaskCounts(); // Ensure count is updated
}

function showPlainText() {
    let textArea = document.getElementById("initial-list");
    let plainTasks = [...taskMap.keys()]
        .filter(
            (task) =>
                !task.startsWith("This is") &&
                !task.startsWith("will help") &&
                !task.startsWith("things")
        )
        .map((task) => {
            if (taskMap.get(task)) {
                // return `x ${task}`;
                return `d ${task}`;

            }
            return task;
        });
    textArea.value = plainTasks.join("\n");
    isFormatted = false;
}

function initializeSampleTasks() {
    let sampleTasks = `
item normal 3
title new **format** for title xxxxxxxxxxx
updated Oct 23, 2023
l image=https://rob-mccormack.github.io/simpler-tasks/android-chrome-512x512.png
h this is code <code>hello world</code>
h this is code too with ticks \` this is code \`
h this is an image ???? image=https://rob-mccormack.github.io/simpler-tasks/stlogo.png 
! item Must do single @robmcc
h item high1 http://cnn.com #work *is it bold*
l item low1 #home
item normal1 @robmcc
r item recurring1
t item today1 with stMarkup **bold **  __ Italic__ ::highlight:: 
l item low2  (this is low2 note, note2, note3)
item normal2 @robmcc
r item recurring2
r item recurring3
n NOtest out of order
l item low3 @james
h item high1 with emoticons  :) and :(
n Notes TITLE
n Notes line 2
n Notes line 3 
n Notes END image=https://rob-mccormack.github.io/simpler-tasks/favicon-16x16.png
t item today2
    `;
    let textArea = document.getElementById("initial-list");
    textArea.value = sampleTasks.trim();
}