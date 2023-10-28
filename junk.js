document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        let task = checkbox.nextElementSibling.wholeText.trim(); // Try using nextElementSibling
        updateCheckboxStatus(task, checkbox.id);
    });
});

function () {
    sortAndGroup();
    displayTaskCounts();
});

