import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardText, CardTitle, CardSubtitle, CardBody, Col, Row } from "reactstrap";
import "./Styles/SongCard.css"

const SongCard = ({ title, data, remove, setSave }) => {
    const navigate = useNavigate();
    const removeCard = async (evt) => {
        await remove(title);
    }

    //Should add route to backend that only returns title for optimization
    //Currently data is sent anyway
    const loadSong = () => {
        setSave(()=>({title, data}));
        navigate("/");
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