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
        let tasksArray = convertTasksToJSON(tasksTextArea.value).map(taskObj => {
            const specialCharObj = specialChars.find(sc => sc.meaning.toLowerCase() === taskObj.type.toLowerCase());
            const prefix = specialCharObj && taskObj.type !== 'normal' ? specialCharObj.char + ' ' : '';
            return prefix + taskObj.content;
        });
        tasksTextArea.value = tasksArray.join('\n');
        tasksTextArea.style.display = 'block';
        viewTasksDiv.style.display = 'none';
    });

    viewTab.addEventListener('click', () => {
        const tasks = tasksTextArea.value;
        let tasksJSON = convertTasksToJSON(tasks);
        tasksJSON = sortTasks(tasksJSON);
        viewTasksDiv.innerHTML = convertJSONToHTML(tasksJSON);
        tasksTextArea.style.display = 'none';
        viewTasksDiv.style.display = 'block';
    });

    // Get the FAB element
    const fab = document.getElementById('scrollFab');

    // Function to show FAB when scrolling down
    window.onscroll = function () {
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            fab.classList.add('fab-visible');
        } else {
            fab.classList.remove('fab-visible');
        }
    };



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
        const linesSet = new Set(); // Initialize a new Set to store unique lines
        return text.split('\n')
            .filter(line => {
                const trimmedLine = line.trim();
                if (trimmedLine === '' || linesSet.has(trimmedLine)) {
                    // Skip empty lines or duplicates
                    return false;
                }
                linesSet.add(trimmedLine); // Add the line to the Set
                return true;
            })
            .map(trimmedLine => {
                const firstWord = trimmedLine.split(' ')[0];
                const specialChar = specialChars.find(sc => sc.char.toLowerCase() === firstWord.toLowerCase());
                if (specialChar) {
                    return { type: specialChar.meaning, content: trimmedLine.substring(firstWord.length).trim() };
                } else {
                    return { type: 'normal', content: trimmedLine };
                }
            });
    }



    // function convertJSONToHTML(json) {
    //     return json.map(task => {
    //         const formattedContent = applySpecialFormats(task.content);
    //         return `<div><strong>[${task.type}]</strong> ${formattedContent}</div>`;
    //     }).join('');
    // }


    // function convertJSONToHTML(tasks) {
    //     // First, create an object to hold the groups
    //     const groupedTasks = tasks.reduce((acc, task) => {
    //         // Initialize the array if this is the first task of this type
    //         if (!acc[task.type]) {
    //             acc[task.type] = [];
    //         }
    //         // Add the task to the appropriate type array
    //         acc[task.type].push(task.content);
    //         return acc;
    //     }, {});

    //     // Then, generate the HTML
    //     return Object.entries(groupedTasks).map(([type, tasks]) => {
    //         // Sort or manipulate tasks if needed
    //         const tasksHTML = tasks.map(content => `<div>${applySpecialFormats(content)}</div>`).join('');
    //         return `<div><strong>[${type}]</strong>${tasksHTML}</div>`;
    //     }).join('');
    // }

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




    // function convertJSONToHTML(json) {
    //     let typeCounts = json.reduce((acc, task) => {
    //         acc[task.type] = (acc[task.type] || 0) + 1;
    //         return acc;
    //     }, {});

    //     let groupedHTML = json.reduce((acc, task) => {
    //         if (!acc[task.type]) {
    //             acc[task.type] = `<div><strong>[${task.type} <sup>${typeCounts[task.type]}</sup>]</strong></div>`;
    //         }
    //         const formattedContent = applySpecialFormats(task.content);
    //         acc[task.type] += `<div>${formattedContent}</div>`;
    //         return acc;
    //     }, {});

    //     return Object.values(groupedHTML).join('');
    // }

    function convertJSONToHTML(json) {
        const typeCounts = countItems(json);
        let totalItems = 0;

        let groupedHTML = json.reduce((acc, task) => {
            if (!acc[task.type]) {
                acc[task.type] = `<div><strong>[${task.type} <sup>${typeCounts[task.type]}</sup>]</strong></div>`;
            }
            totalItems += 1;
            const formattedContent = applySpecialFormats(task.content);
            acc[task.type] += `<div>${formattedContent}</div>`;
            return acc;
        }, {});

        document.getElementById('view-tab').innerHTML = `<span class="material-symbols-outlined fs-1">
                  visibility
                </span> View <sup>${totalItems}</sup>`;

        return Object.values(groupedHTML).join('');
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
