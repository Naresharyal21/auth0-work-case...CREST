import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";

import Table from "../components/table/Table";
import useProducts from "../hooks/useProducts";
import { utcToLocal } from "../utils/dateUtils";
import withAuthorization from "../hoc/withAuthorization";
import Pagination from "./Pagination";
import ProductRow from "./ProductRow";

const headers = [
    { label: 'Created At', key: 'createdAt' },
    { label: 'Title', key: 'title' },
    { label: 'Thumbnail', key: 'thumbnail' },
    { label: 'Price', key: 'price' },
    { label: 'Category', key: 'category' },
    { label: 'Availability Status', key: 'availabilityStatus' },
    { label: 'Rating', key: 'rating' },
    { label: 'Brand', key: 'brand' }
];

const Products = () => {
    const navigate = useNavigate();

    const [count, setCount] = useState(1);
    const [page, setPage] = useState(1);

    const { loading, products, error, totalCount } = useProducts(page);

    // ✅ CHANGED: Memoize totalPages to prevent recalculation on every render
    const totalPages = useMemo(() => Math.ceil(totalCount / 5), [totalCount]);

    const handleAddProduct = () => {
        navigate('/products/add-product');
    };

    const handleViewProduct = (productId) => {
        navigate(`/products/${productId}`);
    };

    const getTotalCount = () => {
        return products.length;
    };

    const getTotalCountCached = useCallback(() => {
        return products.length;
    }, [products]);

    const getTotalPrice = () => {
        return products
            .reduce((acc, product) => acc + product.price, 0)
            .toFixed(2);
    };
   

   
    const totalPrice = useMemo(() => {
        return products
            .reduce((acc, product) => acc + product.price, 0)
            .toFixed(2);
    }, [products]);

    const prevCallbackRef = useRef();

    useEffect(() => {
        if (prevCallbackRef.current) {
            const isSame = Object.is(prevCallbackRef.current, getTotalCountCached);
            console.log(`🧠 Callback is ${isSame ? 'the same' : 'different'} as last render`);
        } else {
            console.log('🆕 First render, no previous callback to compare');
        }

        prevCallbackRef.current = getTotalCountCached;
    }, [getTotalCountCached]);

   

    // ✅ CHANGED: useMemo to memoize the product rows
    // const renderedRows = useMemo(() => {
    //     return products?.map((product) => (
    //         <tr key={product.id} onClick={() => handleViewProduct(product.id)} className="cursor-pointer">
    //             <td>{utcToLocal(product.meta.createdAt)}</td>
    //             <td>{product.title}</td>
    //             <td>
    //                 <img src={product.thumbnail} alt={product.title} style={{ width: '50px', height: '50px' }} />
    //             </td>
    //             <td>${product.price}</td>
    //             <td>{product.category}</td>
    //             <td>{product.availabilityStatus}</td>
    //             <td>{product.rating}</td>
    //             <td>{product.brand}</td>
    //         </tr>
    //     ));
    // }, [products, handleViewProduct]);


    return (
        <div className="">
            <div className="flex">
                <h1 onClick={() => setCount(count + 1)} className="">Products {count}</h1>
                <div className="flex align-items-center">
                    <button className="mr-15" onClick={handleAddProduct}>Add Product</button>
                </div>
            </div>

            <div className="flex p-20 gap-15">
                <p>Product Count: {getTotalCount()}</p>
                <p>Product Count (Cached): {getTotalCountCached()}</p>
                <p>Total Price: ${getTotalPrice()}</p>
                <p>Total Price (Memoized): ${totalPrice}</p>
            </div>

                <Table headers={headers}>
  {loading && (
    <tr>
      <td colSpan="6">Loading...</td>
    </tr>
  )}
  {error && (
    <tr>
      <td colSpan="6" className="error-message">{error}</td>
    </tr>
  )}
  {!loading && !error && (
    <ProductRow products={products} onViewProduct={handleViewProduct} />
  )}
 
</Table>


            <div className="flex gap-15 mt-4">
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(newPage) => setPage(newPage)}
                />
            </div>
        </div>
    );
};

export default withAuthorization(Products, ["ADMIN","SUPER_ADMIN" ,"USER"]);
