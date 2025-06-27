import { useRef } from "react";


const Contact = () => {
    const contentRef = useRef(null);


    const handleForm = () => {
        contentRef.current.className = "bg-dark contact-form";

        console.log(contentRef.current.className);
    }

    return (
        <div>
            Contact Us

            <div ref={contentRef} className="contact-form" >

                <div className="form-control">
                    <label>Name*</label>

                    <input name="name" type="text" placeholder="Name" />
                </div>
                <div className="form-control">
                    <label>Email*</label>
                    <input type="email" placeholder="Email" />
                </div>
                <div className="form-control">
                    <label>Message*</label>
                    <textarea placeholder="Message"></textarea>
                </div>

                <button onClick={handleForm} type="submit">Send</button>

            </div>
        </div>
    )
}

export default Contact