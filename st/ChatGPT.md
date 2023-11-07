I guess we need that on Edit and View events.
Should you use a function to remove duplicates?

```js
    editTab.addEventListener('click', () => {
        const textArea = document.getElementById('tasks');
        // Split the text area content into lines and remove blank lines
        const lines = textArea.value.split('\n').filter(line => line.trim() !== '');
        // Use a Set to remove duplicates and convert back to an array
        const uniqueLines = [...new Set(lines)];
        // Join the array back into a string with newline characters
        textArea.value = uniqueLines.join('\n');
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
```