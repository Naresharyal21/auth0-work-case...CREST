import { useParams } from "react-router";
import { useState, useEffect } from "react";

import { fetchProductById } from "../api/productApi";

const ProductDetail = () => {
    const { productID } = useParams();

    const [product, setProduct] = useState({});

    const fetchProductDetails = async () => {
        const productDetails = await fetchProductById(productID);

        setProduct(productDetails);
    }

    useEffect(() => {
        fetchProductDetails()
    }, [productID]);

    return (
        <div className="flex-col">
            <h1>Product: {productID}</h1>

            <pre>{JSON.stringify(product, null, 2)}</pre>
        </div>
    )
}

export default ProductDetail


/**
 * Search - search bar (Input)
 * Filter by category - dropdown
 * Add sorting to products page
 * Design product detail page
 * Add delete and edit button on top of product detail page
 * Add delete functionality
 * Add edit functionality - can open a modal with form to edit product
 * Bonus: add pagination to products page
 * 
 * Form Library - react-hook-form, formik
 * 
 * 
 */