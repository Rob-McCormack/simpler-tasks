document.addEventListener('DOMContentLoaded', function () {
    //... your existing code ...

    // Function to resize textarea
    function autoExpandTextarea(textarea) {
        textarea.style.height = 'inherit'; // Reset the height
        textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to scroll height
    }

    // Event listener for input on textarea to auto resize
    tasksTextArea.addEventListener('input', function () {
        autoExpandTextarea(this);
    });

    // Initial resize
    autoExpandTextarea(tasksTextArea);

    // ... the rest of your code ...
});
