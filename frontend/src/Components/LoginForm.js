import React, { useState } from "react";
import { Form, Input, Button, Card, CardBody, CardTitle } from "reactstrap";
import "./Styles/LoginForm.css";

const LoginForm = ({ login }) => {
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
        await login(formData);
    };

    return (
        <div className="LoginForm">
            <Card>
                <CardTitle>Login</CardTitle>
                <CardBody>
                    <Form id="login-form" onSubmit={handleSubmit}>
                        <Input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <Button color="primary" id="login-btn">Log In</Button>
                    </Form>
                </CardBody>
            </Card>
        </div>
    );


}

export default LoginForm;