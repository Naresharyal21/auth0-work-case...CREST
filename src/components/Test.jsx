import React from 'react'

const Test = ({ products }) => {

    console.log("Test Rendered");

    // O(n)

    return (
        <div>
            {
                products.length > 0 ? (
                    <ul>
                        {
                            products.map((product) => (
                                <li key={product.id}>
                                    {product.title} - {product.price}
                                </li>
                            ))
                        }
                    </ul>
                ) : (
                    <p>No products available</p>
                )
            }
        </div>
    )
}

export default React.memo(Test);