function sortItems() {
    const sort = document.getElementById('sort').value;  // Get the selected sort value
    const filterType = document.getElementById('filterType').value;  // Get the current filter
    const selectedBuilding = document.getElementById('location').value;  // Get the building parameter

    if (selectedBuilding) {
        window.location.href = `/claimedItems?filterType=${filterType}&sort=${sort}&building=${selectedBuilding}`;
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

function changeBuilding() {
    const filterType = document.getElementById('filterType').value;  // Get the selected filter type
    const sort = document.getElementById('sort').value;  // Get the current sort
    const selectedBuilding = document.getElementById('location').value; // Get the selected building

    // Redirect to the remove_item page with the selected building as a query parameter
    window.location.href = `/claimedItems?filterType=${filterType}&sort=${sort}&building=${selectedBuilding}`;
  
}