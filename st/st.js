document.addEventListener('DOMContentLoaded', function () {
    const editTab = document.getElementById('edit-tab');
    const viewTab = document.getElementById('view-tab');
    const tasksTextArea = document.getElementById('tasks');
    const viewTasksDiv = document.getElementById('viewTasks');

    // Event listener for 'edit-tab' click
    editTab.addEventListener('click', () => {
        tasksTextArea.style.display = 'block';
        viewTasksDiv.style.display = 'none';
    });

    // Event listener for 'view-tab' click
    viewTab.addEventListener('click', () => {
        const tasks = tasksTextArea.value;
        const tasksJSON = convertTasksToJSON(tasks);
        console.log(tasksJSON);
        viewTasksDiv.innerHTML = convertJSONToHTML(tasksJSON);
        tasksTextArea.style.display = 'none';
        viewTasksDiv.style.display = 'block';
    });

    // Function to convert tasks to JSON
    function convertTasksToJSON(tasks) {
        return tasks.split('\n').reduce((acc, task) => {
            if (task.trim() !== '') {
                const parts = task.split(' ');
                const taskType = parts.shift();
                acc.push({ type: taskType, content: parts.join(' ') });
            }
            return acc;
        }, []);
    }

    // Function to convert JSON to HTML
    function convertJSONToHTML(json) {
        return json.map(task => `<div><strong>${task.type}</strong>: ${task.content}</div>`).join('');
    }
});



