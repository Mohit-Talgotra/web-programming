const repoOwner = "Mohit-Talgotra";
const repoName = "web_programming";
const branch = "main";

fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents?ref=${branch}`)
    .then(response => response.json())
    .then(data => {
        const fileList = document.getElementById("fileList");
        data.forEach(item => {
            if (item.type === "file" && item.name.endsWith(".html")) {
                const li = document.createElement("li");
                const link = document.createElement("a");
                link.href = item.name;
                link.textContent = item.name;
                li.appendChild(link);
                fileList.appendChild(li);
            }
        });
    })
    .catch(error => console.error('Error fetching repository contents:', error));
