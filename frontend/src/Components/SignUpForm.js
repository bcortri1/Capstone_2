import React, { useState } from "react";
import { Form, Input, Button, Card, CardBody, CardTitle } from "reactstrap";
import "./Styles/SignUpForm.css";

const SignUpForm = ({ signup }) => {
    const initialState = {
        username: "",
        password: "",
    };
    const [formData, setFormData] = useState(initialState);

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setFormData((data) => ({
            ...data,
            [name]: value
        }))
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        await signup(formData);
    };

    return (
        <div className="SignUpForm">
            <Card>
                <CardTitle>Sign Up</CardTitle>
                <CardBody>
                    <Form id="signup-form" onSubmit={handleSubmit}>
                        <Input
                            className="bg-secondary text-white"
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            className="bg-secondary text-white"
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <Button color="primary" id="signup-btn">Register</Button>
                    </Form>
                </CardBody>
            </Card>
        </div>
    );

}

export default SignUpForm;