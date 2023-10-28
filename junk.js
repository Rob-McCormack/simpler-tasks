document.getElementById('initial-list').addEventListener('input', function () {
    clearTimeout(timeout);  // Clear any existing timeouts
    timeout = setTimeout(() => {
        // Your existing code here
        let content = this.value;

        if (content.startsWith("TITLE:")) {
            let title = content.split('\n')[0].replace("TITLE:", "").trim();
            let fancyTab = document.getElementById('fancy');
            let titleElement = fancyTab.querySelector('h3.title');

            if (!titleElement) {
                titleElement = document.createElement('h3');
                titleElement.classList.add('title');
                fancyTab.prepend(titleElement);
            }

            titleElement.textContent = title;
        } else {
            let fancyTab = document.getElementById('fancy');
            let titleElement = fancyTab.querySelector('h3.title');
            if (titleElement) {
                titleElement.remove();
            }
        }

        // Call the updateCounts function or any other functions you'd like to run after the debounce
        // updateCounts();

    }, debounceTime);  // Set a new timeout
});
