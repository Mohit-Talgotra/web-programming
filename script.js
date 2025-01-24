document.addEventListener("DOMContentLoaded", function () {
    const repoOwner = "Mohit-Talgotra";
    const repoName = "web-programming";
    const branch = "main";

    function createFileList(files, parentElement) {
        const sortedFiles = files.sort((a, b) => {
            const alphaComparison = a.name.localeCompare(b.name);
            if (alphaComparison !== 0) return alphaComparison;

            const extractNumber = (name) => parseInt(name.match(/assignment(\d+)/)?.[1] || 0, 10);
            const numA = extractNumber(a.name);
            const numB = extractNumber(b.name);
        
            return numA - numB;
        });
        
        
        

        const container = document.createElement("div");
        container.className = "file-list-container";

        const style = document.createElement("style");
        style.textContent = `
            .file-list-container {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                padding: 30px;
                background: #f8f9fa;
                border-radius: 8px;
                max-width: 800px;
                margin: 0 auto;
            }
            .file-list-container ul {
                list-style-type: none;
                padding-left: 24px;
                margin: 0;
            }
            .file-list-container li {
                margin: 12px 0;
                transition: transform 0.2s ease;
            }
            .file-list-container li:hover {
                transform: translateX(5px);
            }
            .folder-name {
                font-weight: 600;
                color: #1a1a1a;
                margin: 16px 0 8px -24px;
                display: flex;
                align-items: center;
                padding: 8px 12px;
                background: #e9ecef;
                border-radius: 6px;
                cursor: pointer;
                transition: background 0.2s ease;
            }
            .folder-name:hover {
                background: #dee2e6;
            }
            .folder-name::before {
                content: '';
                display: inline-block;
                width: 20px;
                height: 20px;
                margin-right: 8px;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23495057' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z'%3E%3C/path%3E%3C/svg%3E");
                background-size: contain;
                background-repeat: no-repeat;
            }
            .file-link {
                color: #0366d6;
                text-decoration: none;
                display: flex;
                align-items: center;
                padding: 6px 12px;
                border-radius: 4px;
                transition: all 0.2s ease;
            }
            .file-link::before {
                content: '';
                display: inline-block;
                width: 16px;
                height: 16px;
                margin-right: 8px;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23495057' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'%3E%3C/path%3E%3Cpolyline points='14 2 14 8 20 8'%3E%3C/polyline%3E%3C/svg%3E");
                background-size: contain;
                background-repeat: no-repeat;
            }
            .file-link:hover {
                background: #f1f3f5;
                color: #0969da;
                text-decoration: none;
                transform: translateX(5px);
            }
            .file-list-container {
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            .folder-content {
                transition: max-height 0.3s ease-in-out;
                overflow: hidden;
            }
            .folder-content.collapsed {
                max-height: 0;
            }
            .file-link:hover {
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
        `;
        document.head.appendChild(style);

        function buildList(items, isRoot = false) {
            const ul = document.createElement("ul");
            
            items.forEach(item => {
                const li = document.createElement("li");
                
                if (item.type === "dir") {
                    const folderName = document.createElement("div");
                    folderName.className = "folder-name";
                    folderName.textContent = item.name;
                    
                    const folderContent = document.createElement("div");
                    folderContent.className = "folder-content collapsed";

                    folderName.addEventListener('click', () => {
                        folderContent.classList.toggle('collapsed');
                    });
                    
                    li.appendChild(folderName);
                    li.appendChild(folderContent);
                    
                    fetchFolderContents(item.path, folderContent);
                } else if (item.type === "file" && item.name.endsWith(".html") && item.name !== "index.html") {
                    const link = document.createElement("a");
                    link.href = `/${repoName}/${item.path}`;
                    link.className = "file-link";
                    link.textContent = item.name;
                    li.appendChild(link);
                }
                
                ul.appendChild(li);
            });
            
            return ul;
        }

        const fileList = buildList(sortedFiles, true);
        container.appendChild(fileList);
        parentElement.appendChild(container);
    }

    function fetchFolderContents(path, parentElement) {
        fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${path}?ref=${branch}`)
            .then(response => response.json())
            .then(data => createFileList(data, parentElement))
            .catch(error => console.error('Error fetching folder contents:', error));
    }

    fetchFolderContents('', document.getElementById("fileList"));
});