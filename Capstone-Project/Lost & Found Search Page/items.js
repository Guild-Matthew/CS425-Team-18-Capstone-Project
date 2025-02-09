//Mary Cottier
// script.js
function toggleClothingFields() {
    const itemType = document.getElementById("itemType").value;
    const clothingFields = document.getElementById("clothingFields");

    if (itemType === "clothing") {
        clothingFields.style.display = "block";
    } else {
        clothingFields.style.display = "none";
    }
}
