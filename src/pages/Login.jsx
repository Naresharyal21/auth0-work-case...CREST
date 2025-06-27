import { string, object } from 'yup';
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"

import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router';
import { verifyUserCredentials } from '../data/users';
import Auth0LoginButton from '../components/Auth0LoginButton';

const loginSchema = object({
    email: string()
        .required("Email is required."),

    password: string()
        .required("password is required.")


});

const Login = () => {
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(loginSchema),
    });

    const navigate = useNavigate();
    const { login } = useAuth();

    const onSubmit = async (data) => {

        // Mock API call
        const user = verifyUserCredentials(data.email, data.password);

        if (!user) {
            toast.error("Invalid email or password");

            return;
        }

        login(user);

        reset({ email: "", password: "" });

        toast.success("Login successful");
        navigate("/products");
    }

    return (
        <div className="login-container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex-col add-product-form" >

                <div className='form-control flex-col'>
                    <label>Email*</label>
                    <input className={`${errors.email && "is-invalid"}`} placeholder="Enter email id" type="email" {...register("email")} />

                    {errors.email && <span className='error-message'>{errors.email?.message}</span>}
                </div>
                <div className='form-control flex-col'>
                    <label>Password*</label>
                    <input className={`${errors.password && "is-invalid"}`} placeholder="Enter password" type="password" {...register("password")} />

                    {errors.password && <span className='error-message'>{errors.password?.message}</span>}
                </div>
                <button className="mb-20" type="submit" disabled={isSubmitting}>
                    {
                        isSubmitting ? "Logging in..." : "Login"
                    }
                </button>
            </form>
            <div className=" flex-col">
            <Auth0LoginButton/>
            </div>
        </div>
    )
}

export default Login