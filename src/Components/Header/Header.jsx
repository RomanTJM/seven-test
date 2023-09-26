import React from "react";
import "./Header.css"
import BentoMenu from "../../Icon/BentoMenu.png"
import ArrowBack from "../../Icon/ArrowBack.png"

export default function Header() {
    return(
        <div className="header">
            <img className="header_img-bento-menu" src={BentoMenu} alt=""/>
            <img className="header_img-arrow-back" src={ArrowBack} alt=""/>
            <h1 className="header_title">Просмотр</h1>
            <h1 className="header_title">Управление</h1>
        </div>
    )
}