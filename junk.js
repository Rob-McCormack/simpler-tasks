let processTasks = (tasks) => {
    return tasks.map(task => {
        task = formatUsernamesInTask(task);  // This function call was already here
        task = wrapSpecialCharacter(task);   // Add this new function call here
        return task;
    }).join('<br>');
};
