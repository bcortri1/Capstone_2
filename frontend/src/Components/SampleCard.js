import React, { useState } from "react";
import { Button, Card, CardText, CardTitle, CardSubtitle, CardBody, Col, Row } from "reactstrap";
import "./Styles/SampleCard.css";

const SampleCard = ({ name, sound, remove }) => {
    const removeCard = async (evt) => {
        await remove(name);
    }

    return (
        <div className="SampleCard">
            <Card color="dark" inverse>
                <CardBody>
                    <Row>
                        <Col>
                            <CardText>Sample: {name}</CardText>
                        </Col>
                        <Col>
                            <audio controls><source src={sound}/></audio>
                        </Col>
                        <Col>
                            <Button color="danger" onClick={removeCard}>&#x0058;</Button>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </div>
    );
}

export default SampleCard;