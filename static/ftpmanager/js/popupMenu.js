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
    // Existing setup for directories...
    
    // New setup for files
    const files = document.querySelectorAll('.file');

    const showFileCustomMenu = function(e, fileName) {
        // Prevent the default action
        e.preventDefault();

        // Position the custom menu at the click location
        customMenu.style.display = 'block';
        customMenu.style.left = `${e.pageX}px`;
        customMenu.style.top = `${e.pageY}px`;

        // Populate and show the custom menu based on the clicked file
        customMenu.innerHTML = `
            <button onclick="renameFile('${fileName}')">Rename</button>
            <button onclick="moveFile('${fileName}');">Move</button>
            <button onclick="deleteFile('${fileName}');">Delete</button>
        `;
    };

    files.forEach(file => {
        file.addEventListener('click', function(e) {
            const fileName = this.getAttribute('data-file-name');
            showFileCustomMenu(e, fileName);
        });
    });

    // Hide the custom menus when clicking elsewhere...
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

function deleteFile(fileName) {
    // Confirm with the user that they want to delete the file
    const confirmed = confirm(`Are you sure you want to delete the file: ${fileName}?`);
    if (!confirmed) {
        return; // Stop if the user cancels
    }

    // Assuming you have a hidden input field for CSRF token in your HTML
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const currentPath = document.getElementById('current_path').value; // Ensure you have a way to get the current path

    fetch(`/delete_file/${encodeURIComponent(fileName)}/`, { // Adjust URL as necessary
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
            'current_path': currentPath, // Assuming your backend needs the current path to delete the file
        }),
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    })
    .then(data => {
        console.log(data.message); // Assuming your backend sends a success message
        window.location.reload(); // Reload the page to update the file list
    })
    .catch((error) => {
        console.error('There was a problem with your fetch operation:', error);
    });
}