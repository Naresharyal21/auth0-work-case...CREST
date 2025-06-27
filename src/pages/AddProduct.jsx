import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { string, object, number } from 'yup';
import { yupResolver } from "@hookform/resolvers/yup"

import { addProduct } from "../api/productApi";
import withAuthorization from '../hoc/withAuthorization';

const productSchema = object({
    title: string()
        .required("Title is required.")
        .min(5, "Title must be at least 3 characters long.")
        .max(50, "Title must be at most 50 characters long."),

    description: string()
        .required("Description is required.")
        .min(5, "Description must be at least 10 characters long.")
        .max(50, "Description must be at most 100 characters long."),

    price: number()
        .required("Price is required.")
        .positive("Price must be a positive number.")
        .min(0, "Price must be at least 1.")
        .max(100000, "Price must be at most 10000."),

    brand: string()
        .required("Brand is required.")
        .oneOf(["Apple", "Samsung", "Sony", "LG", "Nokia"], "Brand must be one of the predefined options.")
});

const AddProduct = () => {
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(productSchema),
    });

    const onSubmit = async (data) => {
        const response = await addProduct(data);

        reset({ price: 0 });

        if (response) {
            toast.success("Product added successfully");
        } else {
            toast.error("Failed to add product");
        }
    }

    return (
        <div>
            <div className="flex ">
                <h1 className="">Add Product</h1>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex-col add-product-form" >
                <div className='form-control flex-col'>
                    <label>Title*</label>
                    <input className={`${errors.title && "is-invalid"}`} placeholder="Enter product title" type="text" {...register("title")} />

                    {errors.title && <span className='error-message'>{errors.title?.message}</span>}
                </div>

                <div className='form-control flex-col'>
                    <label>Description*</label>
                    <input className={`${errors.description && "is-invalid"}`} placeholder="Enter product description" type="text" {...register("description")} />

                    {errors.description && <span className='error-message'>{errors.description?.message}</span>}
                </div>

                <div className='form-control flex-col'>
                    <label>Price*</label>
                    <input className={`${errors.price && "is-invalid"}`} placeholder="Enter product price" defaultValue={0} type="number" {...register("price")} />

                    {errors.price && <span className='error-message'>{errors.price?.message}</span>}
                </div>

                <div className='form-control flex-col'>
                    <label>Brand*</label>

                    <select className={`${errors.brand && "is-invalid"}`} {...register("brand")}>
                        <option value="">Select a brand</option>
                        <option value="Apple">Apple</option>
                        <option value="Samsung">Samsung</option>
                        <option value="Sony">Sony</option>
                        <option value="LG">LG</option>
                        <option value="Nokia">Nokia</option>
                    </select>

                    {errors.brand && <span className='error-message'>{errors.brand?.message}</span>}
                </div>

                <button className="" type="submit" disabled={isSubmitting}>
                    {
                        isSubmitting ? "Adding..." : "Add Product"
                    }
                </button>
            </form>
        </div>
    )
}

export default withAuthorization(AddProduct, "ADMIN");