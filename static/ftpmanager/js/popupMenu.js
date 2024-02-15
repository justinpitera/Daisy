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

                <button onclick="renameDirectory('${encodedDir}');">Rename</button>
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

// Placeholder functions for rename and move actions
function renameDirectory(encodedDir) {
    var myModal = new bootstrap.Modal(document.getElementById('exampleModal'), options);
    myModal.show();

}

function moveDirectory(encodedDir) {
    alert('Move action for ' + encodedDir);
}