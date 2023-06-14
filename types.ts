import { RouteProp } from '@react-navigation/native'
export type CategoryStackParamList = {
    "All Category": undefined
    "Edit Category": {
        data: {
            id: number
            title: string,
            image: string,
            description: string
        }
    }
};


export type EditCategoryScreenRouteProp = RouteProp<CategoryStackParamList, "Edit Category">;
export type ProductStackParamList = {
    "All Product": undefined
    "Edit Product": {
        data: {
            id: number
            title: string,
            image: string,
            description: string,
            category: string,
            quantity: string,
            weight: string,
            dimensions: string,
            

        }
    }
};

export type EditProductScreenRouteProp = RouteProp<ProductStackParamList, "Edit Product">;