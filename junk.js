document.getElementById("initial-list").addEventListener("input", function () {
    // Reconcile the taskMap with the textarea content
    reconcileTaskMapWithTextarea();

    let content = this.value;

    let viewTab = document.getElementById("view");
    let titleTemplate = document.getElementById("title-template");

    if (content.startsWith("TITLE:")) {
        let title = content.split("\n")[0].replace("TITLE:", "").trim();

        // Clone the template
        let titleClone = document.importNode(titleTemplate.content, true);

        // Get the title element from the cloned content
        let titleElement = titleClone.firstElementChild;
        titleElement.textContent = title;

        // Check if an existing title element is already present, if so replace it, otherwise add it
        let existingTitleElement = viewTab.querySelector(".text-uppercase");
        if (existingTitleElement) {
            viewTab.replaceChild(titleClone, existingTitleElement);
        } else {
            viewTab.prepend(titleClone);
        }
    } else {
        // If the content does not start with "TITLE:", remove the existing title element if present
        let existingTitleElement = viewTab.querySelector(".text-uppercase");
        if (existingTitleElement) {
            existingTitleElement.remove();
        }
    }

    reconcileTaskMapWithTextarea();
    displayTaskCounts();
});
