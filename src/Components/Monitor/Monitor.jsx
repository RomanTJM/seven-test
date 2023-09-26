import React from "react";
import "./Monitor.css"

export default function Monitor() {
    return(
        <div className="monitor">
            <div>
                <h1 className="monitor_title">Название проекта</h1>
                <p className="monitor_subtitle">Аббревиатура</p>
            </div>
            <h1 className="monitor_title">Строительно-монтажные работы</h1>
        </div>
    )
}

// Переделать как навбар (navbar) запилить только левую часть, в правой части основной код