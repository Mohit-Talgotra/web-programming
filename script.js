document.addEventListener("DOMContentLoaded", function () {
    const repoOwner = "Mohit-Talgotra";
    const repoName = "web-programming";
    const branch = "main";

    function createFileList(files, parentElement) {
        const ul = document.createElement("ul");

        files.forEach(item => {
            if (item.type === "file" && item.name.endsWith(".html") && item.name !== "index.html") {
                const li = document.createElement("li");
                const link = document.createElement("a");
                link.href = `/${repoName}/${item.path}`;
                link.textContent = item.name;
                li.appendChild(link);
                ul.appendChild(li);
            }
            else if (item.type === "dir") {
                const li = document.createElement("li");
                const folderName = document.createElement("strong");
                folderName.textContent = item.name;
                li.appendChild(folderName);

                const nestedList = document.createElement("ul");
                li.appendChild(nestedList);

                fetchFolderContents(item.path, nestedList);
                ul.appendChild(li)
            }
        });

        parentElement.appendChild(ul);
    }
    function fetchFolderContents(path, parentElement) {
        fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${path}?ref=${branch}`)
            .then(response => response.json())
            .then(data => createFileList(data, parentElement))
            .catch(error => console.error('Error fetching folder contents:', error));
    }
    fetchFolderContents('', document.getElementById("fileList"));
});
