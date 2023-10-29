let taskMap = new Map();
let isFormatted = false;

// Event Listeners
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
document
    .getElementById("email-tab")
    .addEventListener("click", transferToEmailList);
document.getElementById("themeToggle").addEventListener("change", toggleTheme);

document.addEventListener("DOMContentLoaded", function () {
    initializeSampleTasks();
    reconcileTaskMapWithTextarea();
    sortAndGroup();
    displayTaskCounts();
    transferToEmailList();
});

function reconcileTaskMapWithTextarea() {
    const textArea = document.getElementById("initial-list");
    const lines = textArea.value.trim().split("\n");
    const newTaskMap = new Map();

    lines.forEach((line) => {
        const checkboxStatus = line.startsWith("x");
        newTaskMap.set(line, checkboxStatus);
    });

    taskMap = newTaskMap;
}

document.addEventListener("DOMContentLoaded", function () {
    transferToEmailList();
});

// document.getElementById("initial-list").addEventListener("input", function () {
//     // Reconcile the taskMap with the textarea content
//     reconcileTaskMapWithTextarea();
//     let content = this.value;

//     // Check if the first line starts with "TITLE:"
//     if (content.startsWith("TITLE:")) {
//         let title = content.split("\n")[0].replace("TITLE:", "").trim();
//         let viewTab = document.getElementById("view");
//         let titleElement = viewTab.querySelector("h3.title");
//         if (!titleElement) {
//             titleElement = document.createElement("h3");
//             titleElement.classList.add("title");
//             viewTab.prepend(titleElement);
//         }
//         titleElement.textContent = title;
//     } else {
//         let viewTab = document.getElementById("view");
//         let titleElement = viewTab.querySelector("h3.title");
//         if (titleElement) {
//             titleElement.remove();
//         }
//     }

//     reconcileTaskMapWithTextarea();
//     displayTaskCounts();
// });


document.getElementById("initial-list").addEventListener("input", function () {
    // Reconcile the taskMap with the textarea xcontent
    reconcileTaskMapWithTextarea();

    let content = this.value;

    let viewTab = document.getElementById("view");
    let titleTemplate = document.getElementById("title-template");

    if (content.startsWith("TITLE:")) {
        let title = content.split("\n")[0].replace("TITLE:", "").trim();

        // Clone the template
        let titleClone = document.importNode(titleTemplate.content, true);

        // Get the title element from the cloned content
        let titleElement = titleClone.firstElementChild;
        titleElement.textContent = title;

        // Check if an existing title element is already present, if so replace it, otherwise add it
        let existingTitleElement = viewTab.querySelector(".text-uppercase");
        if (existingTitleElement) {
            viewTab.replaceChild(titleClone, existingTitleElement);
        } else {
            viewTab.prepend(titleClone);
        }
    } else {
        // If the content does not start with "TITLE:", remove the existing title element if present
        let existingTitleElement = viewTab.querySelector(".text-uppercase");
        if (existingTitleElement) {
            existingTitleElement.remove();
        }
    }

    reconcileTaskMapWithTextarea();
    displayTaskCounts();
});


function displayTaskCounts() {
    const tasks = [...taskMap.keys()];
    const doneTasks = tasks.filter((task) => task.startsWith("x")).length;
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
    if (match) {
        return match[1].trim();
    }
    return null;
}

function copyTextToClipboard(elementId) {
    let textArea = document.getElementById(elementId);
    textArea.select();
    document.execCommand("copy");
}

function emailList() {
    let textArea = document.getElementById("initial-list");
    let lines = textArea.value.trim().split("\n").join("%0D%0A");
    window.location.href = `mailto:?subject=Your To-Do List&body=${lines}`;
}

function transferToEmailList() {
    let initialList = document.getElementById("initial-list");
    let emailAlert = document.getElementById("emailAlert");
    emailAlert.innerText = initialList.value;
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
    let notesContent = extractNotes(document.getElementById("initial-list").value);
    let specialTodayTask = [...taskMap.keys()].find((task) => /^TODAY\s*:?\s+/i.test(task));
    let todayElement = document.getElementById("specialTodayTask");
    let todayTextElement = todayElement.querySelector("#specialTodayText");

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
            task = formatUsernamesInTask(task);
            task = formatContextInTask(task);  // <-- Place it here
            return task;
        }).join('<br>');
    };





    let mustDoTask = [...taskMap.keys()].find(task => task.startsWith("! "));
    let mustDoHTML = "";
    if (mustDoTask) {
        mustDoHTML = `<div class="alert alert-danger" role="alert">${mustDoTask}</div>`;
    }

    sortedList.innerHTML = `
    ${mustDoHTML}
    ${buildHeader("Today", "text-danger")}
    ${processTasks([...taskMap.keys()].filter(task => task.toLowerCase().includes("t ") && !task.startsWith("t ")))}

        

        ${buildHeader("Must-Do", "text-info")}
        ${processTasks([...taskMap.keys()].filter(task => task.startsWith("! ") && !task.toLowerCase().startsWith("t ")))}

        ${buildHeader("High Priority", "text-info")}
        ${processTasks([...taskMap.keys()].filter(task => task.toLowerCase().startsWith("h ") && !task.toLowerCase().startsWith("t ") && !task.startsWith("! ")))}

        ${buildHeader("Normal")}
        ${processTasks([...taskMap.keys()].filter(task => !task.startsWith("! ") && !task.startsWith("- ") && !task.startsWith("x ") && !task.toLowerCase().startsWith("h ") && !task.toLowerCase().startsWith("l ") && !task.toLowerCase().startsWith("t ") && !task.startsWith("TITLE: ")))}

        ${buildHeader("Low Priority")}
        ${processTasks([...taskMap.keys()].filter(task => task.toLowerCase().startsWith("l ") && !task.toLowerCase().startsWith("t ")))}

        ${buildHeader("Done")}
        ${processTasks([...taskMap.keys()].filter(task => task.toLowerCase().startsWith("x ")))}
    `;



    let notes = extractNotes(document.getElementById("initial-list").value);
    if (notes) {
        let formattedNotes = notes.replace(/(\r\n|\n|\r)/gm, "<br>");
        sortedList.innerHTML += `
            <h5 class="mt-3">NOTES:</h5>
            <p>${formattedNotes}</p>
        `;
    }
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
                return `x ${task}`;
            }
            return task;
        });
    textArea.value = plainTasks.join("\n");
    isFormatted = false;
}

function initializeSampleTasks() {
    let sampleTasks = `
TITLE: The Big list for BOB   
! Drive Debbie 
h Buy groceries for the week. http://cnn.com
l Finish editing a short film. #home
!Call mom for her birthday. @robmcc
Fix that annoying bug in the Python script.
l Go for a 30-minute jog.
Water the plants.@debbie
l Prepare slides for tomorrow's meeting.@james
Cook dinner for friends coming over tonight.@debbie
[3] Meditate for 10 minutes #daily 
h Go to Walmart #home Today (jam, milk, return pants)
ltake out garbage @doug
NOTES:
Notes line 1
Notes line 2
Notes line 3
Notes END
    `;
    let textArea = document.getElementById("initial-list");
    textArea.value = sampleTasks.trim();
}
