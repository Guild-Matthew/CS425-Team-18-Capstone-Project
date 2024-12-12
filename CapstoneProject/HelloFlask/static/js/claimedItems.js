function sortItems() {
    const sort = document.getElementById('sort').value;  // Get the selected sort value
    const filterType = document.getElementById('filterType').value;  // Get the current filter
    const building = new URLSearchParams(window.location.search).get('building');  // Get the building parameter

    if (building) {
        window.location.href = `/claimedItems?filterType=${filterType}&sort=${sort}&building=${building}`;
    } else {
        console.error('Building parameter is missing in the URL.');
    }
}

function filterItemsClaimed() {
    const filterType = document.getElementById('filterType').value;  // Get the selected filter type
    const sort = document.getElementById('sort').value;  // Get the current sort
    const building = new URLSearchParams(window.location.search).get('building');  // Get the building parameter

    if (building) {
        window.location.href = `/claimedItems?filterType=${filterType}&sort=${sort}&building=${building}`;
    } else {
        console.error('Building parameter is missing in the URL.');
    }
}
