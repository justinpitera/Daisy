document.addEventListener('DOMContentLoaded', function() {
    const directories = document.querySelectorAll('.directory');
    const forms = document.querySelectorAll('.directory-form');
    const customMenu = document.getElementById('customMenu');
    const formCustomMenu = document.getElementById('formCustomMenu');

    const showDirectoryCustomMenu = function(e, encodedDir) {
        // Prevent the default action if it's not a navigation click
        if (!e.target.closest('.text-group a')) {
            e.preventDefault();

            // Position the custom menu at the click location
            customMenu.style.display = 'block';
            customMenu.style.left = `${e.pageX}px`;
            customMenu.style.top = `${e.pageY}px`;

            // Populate and show the custom menu based on the clicked directory
            customMenu.innerHTML = `   

                <button onclick="renameDirectory('encodedDirPlaceholder', '${encodedDir}')">Rename</button>
                <button onclick="moveDirectory('${encodedDir}');">Move</button>
                <button onclick="deleteDirectory('${encodedDir}');">Delete</button>
            `;
        }
    };

    directories.forEach(directory => {
        directory.addEventListener('click', function(e) {
            const encodedDir = this.getAttribute('data-enc-dir');
            showDirectoryCustomMenu(e, encodedDir);
        });
    });

    forms.forEach(form => {
        form.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent triggering click on the parent directory
            e.preventDefault(); // Prevent form submission

            // Position the form custom menu at the click location
            formCustomMenu.style.display = 'block';
            formCustomMenu.style.left = `${e.pageX}px`;
            formCustomMenu.style.top = `${e.pageY}px`;

            // Populate and show the form custom menu
            formCustomMenu.innerHTML = `
                Form-specific actions<br>
                <button onclick="alert('Form Action 1');">Action 1</button>
                <button onclick="alert('Form Action 2');">Action 2</button>
            `;
        });
    });

    // Hide the custom menus when clicking elsewhere
    document.addEventListener('click', function(e) {
        if (!customMenu.contains(e.target)) {
            customMenu.style.display = 'none';
        }
        if (!formCustomMenu.contains(e.target)) {
            formCustomMenu.style.display = 'none';
        }
    }, true);
});

function deleteDirectory(encodedDir) {
    // Find the form that matches the directory to be deleted
    const form = document.querySelector(`form[action*='${encodedDir}'][method='post']`);
    if (form) {
        // Confirm deletion with the user
        const confirmed = confirm('Are you sure you want to delete this directory?');
        if (confirmed) {
            // Submit the form to delete the directory
            form.submit();
        }
    }
}

function renameDirectory(encodedDir, fileName) {
    // Decode the directory name if it's URL-encoded
    var decodedFileName = decodeURIComponent(fileName);

    // Assuming the ID of your modal is 'exampleModal'
    var exampleModal = new bootstrap.Modal(document.getElementById('exampleModal'));

    // Set the value of the modal's current name input to the file's current name
    document.getElementById('current_name').value = decodedFileName;

    // Optionally, set the action for the form within the modal if necessary
    // document.querySelector('#exampleModal form').action = `/path/to/rename/${encodedDir}`;

    exampleModal.show();
}


function moveDirectory(encodedDir) {
    alert('Move action for ' + encodedDir);
}


document.addEventListener('DOMContentLoaded', function() {
    // Assuming customMenu setup is correctly initialized here

    // Use event delegation from a parent that exists at page load
    document.body.addEventListener('click', function(e) {
        // Check if the clicked element or one of its parents is a .file element
        const fileElement = e.target.closest('.file');
        if (fileElement) {
            const fileName = fileElement.getAttribute('data-file-name');
            // Prevent the default action if it's not a navigation click
            if (!e.target.closest('.text-group a')) {
                e.preventDefault();

                // Position and display the custom menu for the file
                customMenu.style.display = 'block';
                customMenu.style.left = `${e.pageX}px`;
                customMenu.style.top = `${e.pageY}px`;

                // Populate and show the custom menu based on the clicked file
                customMenu.innerHTML = `
                    <button onclick="renameFile('${fileName}')">Rename</button>
                    <button onclick="moveFile('${fileName}');">Move</button>
                    <button onclick="deleteFile('${fileName}');">Delete</button>
                `;
            }
        } else {
            // Hide the custom menus if the click is outside
            if (!customMenu.contains(e.target)) {
                customMenu.style.display = 'none';
            }
        }
    }, true); // Capture phase to ensure the event is caught as it propagates down
});

// Function to handle file rename
function renameFile(fileName) {
    // Decode the directory name if it's URL-encoded
    var decodedFileName = decodeURIComponent(fileName);

    // Assuming the ID of your modal is 'exampleModal'
    var exampleModal = new bootstrap.Modal(document.getElementById('exampleModal'));

    // Set the value of the modal's current name input to the file's current name
    document.getElementById('current_name').value = decodedFileName;

    // Optionally, set the action for the form within the modal if necessary
    // document.querySelector('#exampleModal form').action = `/path/to/rename/${encodedDir}`;

    exampleModal.show();
}

// Placeholder functions for move and delete actions
function moveFile(fileName) {
    alert(`Move file: ${fileName}`);
}


function slugify(fileName) {
    return fileName.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}


function deleteFile(fileName) {
    // Confirm before deleting
    if (!confirm('Are you sure you want to delete this file?')) return;

    // Use slugify-like logic or a mapping to find the form ID for non-trivial filenames
    const formId = 'delete-file-' + slugify(fileName); // Simplified slugify
    const form = document.getElementById(formId);
    
    if (form) {
        form.submit(); // Submit the deletion form
    } else {
        alert('Error: Could not find the deletion form for the file.');
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const customMenu = document.getElementById('customMenu');
    const generalContextMenu = document.getElementById('generalContextMenu');

    // Directory-specific custom menu
    document.querySelectorAll('.directory').forEach(directory => {
        directory.addEventListener('click', function(e) {
            // Custom logic for directories
        });
    });

    // File-specific custom menu
    document.body.addEventListener('click', function(e) {
        const fileElement = e.target.closest('.file');
        if (fileElement) {
            // Custom logic for files
        }
    });

    // General context menu for the entire page
    document.addEventListener('contextmenu', function(e) {
        // Prevent the default right-click menu
        e.preventDefault();

        // Show the custom general context menu
        generalContextMenu.style.display = 'block';
        generalContextMenu.style.left = `${e.pageX}px`;
        generalContextMenu.style.top = `${e.pageY}px`;
    });

    // Hide custom menus when clicking elsewhere
    document.addEventListener('click', function(e) {
        if (!customMenu.contains(e.target)) {
            customMenu.style.display = 'none';
        }
        if (!generalContextMenu.contains(e.target)) {
            generalContextMenu.style.display = 'none';
        }
    }, true);
});

// Functions for general context menu actions
function performAction1() {
    console.log("Action 1 triggered");
    // Implement action 1
}

function performAction2() {
    console.log("Action 2 triggered");
    // Implement action 2
}


