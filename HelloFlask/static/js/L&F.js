//Mary Cottier
function filterItems() {
    const filterType = document.getElementById('filterType').value;  // Get the selected filter type
    const sort = new URLSearchParams(window.location.search).get('sort') || 'oldest';  // Get the current sort value or default to "oldest"
    const building = new URLSearchParams(window.location.search).get('building');  // Get the building parameter

    if (building) {
        // Redirect to the L&F page with filterType, sort, and building as query parameters
        window.location.href = `/L&F?filterType=${filterType}&sort=${sort}&building=${building}`;
    } else {
        console.error('Building parameter is missing in the URL.');
    }
}



function toggleImage(element) {
    const imageContainer = element.querySelector('.image-container');
    if (imageContainer.style.display === 'none') {
        imageContainer.style.display = 'block';
        } else {
        imageContainer.style.display = 'none';
        }
    }

function sortItems() {
    const sort = document.getElementById('sort').value;  // Get the selected sort value
    const filterType = document.getElementById('filterType').value;  // Get the current filter
    const building = new URLSearchParams(window.location.search).get('building');  // Get the building parameter

    if (building) {
        window.location.href = `/L&F?filterType=${filterType}&sort=${sort}&building=${building}`;
    } else {
        console.error('Building parameter is missing in the URL.');
    }
}