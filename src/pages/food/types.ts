export interface VendorInfo {
    vendor: string;
    dishes: Dish[];
}

interface Dish {
    title: string;
    items: Item[]
}

interface Item {
    description?: string;
    allergens: string[];
    halal?: boolean;
    gluten_free?: boolean;

}
