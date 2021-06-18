import React from "react";
import style from "./ErrorPage.module.css"
import {NavLink} from "react-router-dom";

export const Error: React.FC = () => {
    return (
        <div className={style.error}>
            <div>ERROR 404</div>
            <div>The cat couldn't find a page!</div>
            <div className={style.errorCat}>—ฅ/ᐠ.̫ .ᐟ\ฅ—</div>
            <div className={style.item}>
                <NavLink to={"/"}>GO HOME</NavLink>
            </div>
        </div>
    );
}