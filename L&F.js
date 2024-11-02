//Claim item function
function claimItem(name) {

}

//Sorting logic based on `sortOption`
function sortItems() {
    const sortOption = document.getElementById('sort').value;
    alert(`Sorting items by ${sortOption}`);
}

//Filtering logic based on `filterType` and `filterBrand`
function filterItems() {
    const filterType = document.getElementById('filterType').value;
    const filterBrand = document.getElementById('filterBrand').value;
    alert(`Filtering items by Type: ${filterType}, Brand: ${filterBrand}`);
}