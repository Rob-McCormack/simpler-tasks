let content = document.getElementById("initial-list").value;
let lines = content.split("\n").map(line => line.trim()).join("\n");
document.getElementById("initial-list").value = lines;
