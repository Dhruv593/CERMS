class Subcategory {
    constructor(id, category, subcategory, description,imagePath, createdAt) {
        this.id = id;
        this.category = category; // Should reference a category
        this.subcategory = subcategory;
        this.description = description;

        this.imagePath = imagePath || null; // Optional field
        this.createdAt = createdAt || new Date(); // Default to current timestamp
    }
}

export default Subcategory;
