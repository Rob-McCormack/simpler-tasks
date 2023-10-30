let taskMap = new Map();
let isFormatted = false;

// Event Listeners
document.getElementById("edit-tab").addEventListener("click", trimTrailingSpaces);
document.getElementById("view-tab").addEventListener("click", trimTrailingSpaces);

document.getElementById("view-tab").addEventListener("click", function () {
    let content = document.getElementById("initial-list").value;
    let trimmedContent = content.trim();

    // // Check if the first line starts with "TITLE:"
    // if (trimmedContent.startsWith("TITLE:")) {
    //     let title = trimmedContent.split("\n")[0].replace("TITLE:", "").trim();
    //     let viewTab = document.getElementById("view");
    //     let titleTemplate = document.getElementById("title-template");
    //     let titleClone = document.importNode(titleTemplate.content, true);
    //     let titleElement = titleClone.querySelector("p");
    //     titleElement.textContent = title.toUpperCase();

    //     // Check if an existing title element is already present, if so replace it, otherwise add it
    //     let existingTitleElement = viewTab.querySelector("p.text-uppercase");
    //     if (existingTitleElement) {
    //         existingTitleElement.replaceWith(titleElement);
    //     } else {
    //         viewTab.prepend(titleElement);
    //     }
    // } else {
    //     let viewTab = document.getElementById("view");
    //     let titleElement = viewTab.querySelector("p.text-uppercase");
    //     if (titleElement) {
    //         titleElement.remove();
    //     }
    // }

    // You can also include any other code that should run when the "View" tab is clicked.
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


// const specialChars = [
//     { char: "d", meaning: "done" },
//     { char: "!", meaning: "must-do" },
//     { char: "h", meaning: "high priority" },
//     { char: "l", meaning: "low priority" },
//     { char: "r", meaning: "recurring" }
// ];

const specialChars = [
    { char: "d", meaning: "done" },
    { char: "!", meaning: "must-do" },
    { char: "h", meaning: "high priority" },
    { char: "l", meaning: "low priority" },
    { char: "r", meaning: "recurring" },
    { char: "n", meaning: "note" }
];


// function wrapSpecialCharacter(task) {
//     for (let item of specialChars) {
//         if (task.startsWith(item.char + " ")) {
//             return `<sub>${item.char}</sub> ${task.slice(2)}`;
//         }
//     }
//     // If no special character is found at the start, treat as normal priority
//     return `<sub> </sub> ${task}`;
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




// function reconcileTaskMapWithTextarea() {
//     const textArea = document.getElementById("initial-list");
//     let content = textArea.value.trim();

//     // Separate tasks and notes
//     let tasks = content.split("NOTES:")[0].trim().split("\n");
//     let notes = content.includes("NOTES:") ? content.split("NOTES:")[1].trim() : null;

//     const newTaskMap = new Map();

//     tasks.forEach((task) => {
//         const checkboxStatus = task.startsWith("d ");
//         newTaskMap.set(task, checkboxStatus);
//     });

//     taskMap = newTaskMap;
// }


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
    console.log("Updated taskMap:", taskMap);

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


    // let extractionResult = extractNotes(document.getElementById("initial-list").value);
    // let notesContent = extractNotes(document.getElementById("initial-list").value).notes;

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
            task = formatUsernamesInTask(task);  // This function call was already here
            task = wrapSpecialCharacter(task);   // Add this new function call here
            return task;
        }).join('<br>');
    };


    let mustDoTask = [...taskMap.keys()].find(task => task.startsWith("! "));
    let mustDoHTML = "";
    // if (mustDoTask) {
    //     mustDoHTML = `<div class="alert alert-danger" role="alert">${mustDoTask}</div>`;
    // }

    sortedList.innerHTML = `



    ${buildHeader("Title")}
    ${processTasks([...taskMap.keys()].filter(task => task.toLowerCase().startsWith("title ")))}

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

    console.log("Notes Content:", notesContent);

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
TITLE: The Big list for BOB  
item normal 3 
title new format for title xxxxxxxxxxx
! item Must do single @robmcc 
h item high1 http://cnn.com #work
l item low1 #home
item normal1 @robmcc
r item recurring1 
t item today1
l item low2  (this is low2 note, note2, note3)
item normal2 @robmcc
r item recurring2  
r item recurring3
n NOtest out of order
l item low3 @james
h item high1

n Notes TITLE
n Notes line 2
n Notes line 3
n Notes END
t item today2
    `;
    let textArea = document.getElementById("initial-list");
    textArea.value = sampleTasks.trim();
}