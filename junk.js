sortedList.innerHTML = `
    ${mustDoHTML}
    ${buildHeader("Today", "text-danger")}
    ${processTasks([...taskMap.keys()].filter(task => task.toLowerCase().startsWith("t ") && task !== mustDoTask))}
    
    ${buildHeader("High Priority", "text-info")}
    ${processTasks([...taskMap.keys()].filter(task => task.startsWith("h ") && task !== mustDoTask))}
    // ... your other categories go here ...
`;
