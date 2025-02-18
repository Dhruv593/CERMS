class Subcategory {
    constructor(id, category, subcategory, description, rent, deposit, imagePath, createdAt) {
        this.id = id;
        this.category = category; // Should reference a category
        this.subcategory = subcategory;
        this.description = description;
        this.rent = rent;
        this.deposit = deposit;
        this.imagePath = imagePath || null; // Optional field
        this.createdAt = createdAt || new Date(); // Default to current timestamp
    }
}

export default Subcategory;
