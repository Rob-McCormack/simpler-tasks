document.getElementById("initial-list").addEventListener("input", function () {
    // ... your existing code ...

    reconcileTaskMapWithTextarea();
    displayTaskCounts(); // <-- Add this line here to ensure count is updated on every input change

    // ... rest of your code ...
});
