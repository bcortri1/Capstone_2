import React, { useState } from "react";
import { Button, Card, CardText, CardTitle, CardSubtitle, CardBody, Col, Row } from "reactstrap";
import "./Styles/SongCard.css"

const SongCard = ({ title, data, remove }) => {
    const removeCard = async (evt) => {
        await remove(title);
    }

    const loadSong = () => {
        //data in here?
    }

    return (
        <div className="SongCard">
            <Card color="dark" inverse>
                <CardBody>
                    <Row>
                        <Col>
                            <CardText>Song: {title}</CardText>
                        </Col>
                        <Col>
                            <Button color="success" onClick={loadSong}>&#128449;</Button>
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

export default SongCard;