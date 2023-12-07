import React, { useState } from "react";
import { Form, Input, Button, Card, CardBody, CardTitle } from "reactstrap";
import "./Styles/FormCard.css";

const ProfileForm = ({ editUser, currUser }) => {
    const initialState = {password:"", username: currUser};
    const [formData, setFormData] = useState(initialState);

    const handleChange = (evt) => {
        evt.preventDefault();
        const { name, value } = evt.target;
        setFormData((data) => ({
            ...data,
            [name]: value,
            username: currUser
        }))
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        await editUser(formData);
    };

    return (
        <div className="FormCard">

            <Card color="dark" inverse>
                <CardTitle>Edit Info</CardTitle>
                <CardBody>
                    <Form id="edit-form" onSubmit={handleSubmit}>
                        <Input
                            className="bg-dark text-white"
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Username"
                            value={currUser}
                            disabled
                        />
                        <Input
                            className="bg-secondary text-white"
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <Button color="success" id="signup-btn">Change</Button>
                    </Form>
                </CardBody>
            </Card>
        </div>
    );

}

export default ProfileForm;