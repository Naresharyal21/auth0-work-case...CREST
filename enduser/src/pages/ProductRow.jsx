import React from "react";
import { utcToLocal } from "../utils/dateUtils";

const ProductRow = ({ products, onViewProduct }) => {
  return (
    <>
      {products.map((product) => (
        <tr
          key={product.id}
          onClick={() => onViewProduct(product.id)}
          className="cursor-pointer"
        >
          <td>{utcToLocal(product.meta.createdAt)}</td>
          <td>{product.title}</td>
          <td>
            <img
              src={product.thumbnail}
              alt={product.title}
              style={{ width: "50px", height: "50px" }}
            />
          </td>
          <td>${product.price}</td>
          <td>{product.category}</td>
          <td>{product.availabilityStatus}</td>
          <td>{product.rating}</td>
          <td>{product.brand}</td>
        </tr>
      ))}
    </>
  );
};

export default React.memo(ProductRow);
