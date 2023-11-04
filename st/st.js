document.addEventListener('DOMContentLoaded', function () {
    const specialChars = [
        { char: "!", meaning: "must-do", sortOrder: -2 },
        { char: "t", meaning: "today", sortOrder: 2 },
        { char: "h", meaning: "high priority", sortOrder: 3 },
        { char: "", meaning: "normal", sortOrder: 4 },
        { char: "l", meaning: "low priority", sortOrder: 5 },
        { char: "r", meaning: "recurring", sortOrder: 6 },
        { char: "n", meaning: "note", sortOrder: 7 },
        { char: "d", meaning: "done", sortOrder: 8 },
        { char: "title", meaning: "title", sortOrder: -2 },
        { char: "update", meaning: "update", sortOrder: -1 }

    ];
    const specialFormats = [
        { char: "@", formatStart: "<b>", formatEnd: "</b>" },
        { char: "#", formatStart: "<i>", formatEnd: "</i>" },
        { char: "+", formatStart: "<u>", formatEnd: "</u>" }
    ];
    const editTab = document.getElementById('edit-tab');
    const viewTab = document.getElementById('view-tab');
    const tasksTextArea = document.getElementById('tasks');
    const viewTasksDiv = document.getElementById('viewTasks');

    editTab.addEventListener('click', () => {
        // let tasksArray = convertTasksToJSON(tasksTextArea.value).map(taskObj => {
        //     const specialCharObj = specialChars.find(sc => sc.meaning.toLowerCase() === taskObj.type.toLowerCase());
        //     const prefix = specialCharObj && taskObj.type !== 'normal' ? specialCharObj.char + ' ' : '';
        //     return prefix + taskObj.content;
        // });
        // tasksTextArea.value = tasksArray.join('\n');
        // tasksTextArea.style.display = 'block';
        // viewTasksDiv.style.display = 'none';
    });


    viewTab.addEventListener('click', () => {
        // This is assuming you have a textarea with an id of 'tasksTextArea'
        const tasks = tasksTextArea.value;
        let tasksJSON = convertTasksToJSON(tasks);
        console.log('Tasks in JSON format:', JSON.stringify(tasksJSON, null, 2));

        // Sort tasks if the sortTasks function is available and working correctly
        //  TODO:   tasksJSON = sortTasks(tasksJSON);

        // Call convertJSONToHTML and set the innerHTML of viewTasksDiv
        viewTasksDiv.innerHTML = convertJSONToHTML(tasksJSON);

        // tasksTextArea.style.display = 'none';
        viewTasksDiv.style.display = 'block';
    });


    function applySpecialFormats(content) {
        let formattedContent = content;
        specialFormats.forEach(special => {
            const regex = new RegExp(`\\${special.char}\\w+`, 'g'); // Match the special character followed by any word characters
            formattedContent = formattedContent.replace(regex, match => {
                // Wrap the matched text with the specified formatting
                return `${special.formatStart}${match}${special.formatEnd}`;
            });
        });
        return formattedContent;
    }
    function autoExpandTextarea(textarea) {
        textarea.style.height = 'inherit';
        textarea.style.height = `${textarea.scrollHeight}px`;
    }

    tasksTextArea.addEventListener('input', function () {
        autoExpandTextarea(this);
    });

    autoExpandTextarea(tasksTextArea);
    function convertTasksToJSON(text) {
        const lines = text.split('\n').filter(line => line.trim() !== ''); // Filter out empty lines
        let tasksJSON = {};
        let taskId = 1;

        lines.forEach(line => {
            const words = line.trim().split(' ');
            const firstWord = words[0];
            const specialChar = specialChars.find(sc => sc.char === firstWord);

            let type, content;
            if (specialChar) {
                type = specialChar.meaning;
                content = words.slice(1).join(' ');
            } else {
                type = 'normal';
                content = line.trim();
            }

            tasksJSON[taskId] = { type: type, content: content };

            // If it's an update, we can extract mentions, locations, projects
            if (type === 'update') {
                tasksJSON[taskId].mentions = words.filter(word => word.startsWith('@')).map(mention => mention.substring(1));
                tasksJSON[taskId].locations = words.filter(word => word.startsWith('#')).map(location => location.substring(1));
                tasksJSON[taskId].projects = words.filter(word => word.startsWith('+')).map(project => project.substring(1));
            }

            taskId++;
        });

        return tasksJSON;
    }


    function groupTasksByType(tasks) {
        return tasks.reduce((acc, task) => {
            if (!acc[task.type]) {
                acc[task.type] = [];
            }
            acc[task.type].push(task.content);
            return acc;
        }, {});
    }

    function countItems(json) {
        return json.reduce((acc, task) => {
            acc[task.type] = (acc[task.type] || 0) + 1;
            return acc;
        }, {});
    }




    // function convertJSONToHTML(tasksJSON) {
    //     let html = '';
    //     let lastType = '';

    //     // Assuming tasksJSON is an array of task objects
    //     tasksJSON.forEach(task => {
    //         // Check if the current task's type is different from the last one
    //         if (task.type !== lastType) {
    //             // If so, we update the lastType and add a new type header to the HTML
    //             lastType = task.type;
    //             html += `<div class="task-group"><div class="type">${task.type}</div>`;
    //         }

    //         // Then we add the task content
    //         html += `<div class="task"><div class="content">${task.content}</div></div>`; // Changed from description to content

    //         // If the next task is of a different type, we close the current group div
    //         if (tasksJSON[tasksJSON.indexOf(task) + 1]?.type !== task.type) {
    //             html += `</div>`; // Close the task-group div
    //         }
    //     });

    //     return html;
    // }

    function convertJSONToHTML(tasksJSON) {
        let html = '';
        let lastType = '';

        // Convert the tasksJSON object into an array of task objects
        const tasksArray = Object.keys(tasksJSON).map(key => tasksJSON[key]);

        tasksArray.forEach(task => {
            if (task.type !== lastType) {
                lastType = task.type;
                html += `<div class="task-group"><div class="type">${task.type}</div>`;
            }
            html += `<div class="task"><div class="content">${task.content}</div></div>`;
            if (tasksArray[tasksArray.indexOf(task) + 1]?.type !== task.type) {
                html += `</div>`; // Close the task-group div
            }
        });

        return html;
    }






    function sortTasks(tasks) {
        const sortOrder = specialChars.reduce((acc, char) => {
            acc[char.meaning.toLowerCase()] = char.sortOrder;
            return acc;
        }, {});

        return tasks.sort((a, b) => {
            return (sortOrder[a.type.toLowerCase()] || 1000) - (sortOrder[b.type.toLowerCase()] || 1000);
        });
    }

});
