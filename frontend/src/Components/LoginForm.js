import React, { useState } from "react";
import { Form, Input, Button, Card, CardBody, CardTitle } from "reactstrap";
import "./Styles/FormCard.css";

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
        <div className="FormCard">
            <Card color="dark" inverse>
                <CardTitle>Login</CardTitle>
                <CardBody>
                    <Form id="login-form" onSubmit={handleSubmit}>
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
                        <Button color="success" id="login-btn">Log In</Button>
                    </Form>
                </CardBody>
            </Card>
        </div>
    );


}

export default LoginForm;