document.addEventListener('DOMContentLoaded', function () {
    const editTab = document.getElementById('edit-tab');
    const viewTab = document.getElementById('view-tab');
    const tasksTextArea = document.getElementById('tasks');
    const viewTasksDiv = document.getElementById('viewTasks');

    editTab.addEventListener('click', () => {
        tasksTextArea.style.display = 'block';
        viewTasksDiv.style.display = 'none';
    });

    viewTab.addEventListener('click', () => {
        const tasks = tasksTextArea.value;
        const tasksJSON = convertTasksToJSON(tasks);
        console.log(tasksJSON);
        viewTasksDiv.innerHTML = convertJSONToHTML(tasksJSON);
        tasksTextArea.style.display = 'none';
        viewTasksDiv.style.display = 'block';
    });

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

    function convertJSONToHTML(json) {
        return json.map(task => {
            return `<div><strong>${task.type}</strong>: ${task.content}</div>`;
        }).join('');
    }
});
