let processTasks = (tasks) => {
    return tasks.map(task => {
        task = formatUsernamesInTask(task);  // Existing function call
        task = wrapSpecialCharacter(task);   // Existing function call
        task = stMarkDown(task);  // New function call for stMarkDown processing
        return task;
    }).join('<br>');
};
