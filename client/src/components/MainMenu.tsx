import React from "react";
import { Link } from "react-router-dom";


const MainMenu = () => {

    return (

        <>
            <div className="Menu text-center">
                <div className="MenuHeader GameTitle">
                    🪨📰✂<br></br>
                    ❌'s and ⭕'s
                </div>
                <div className="MenuItems">
                    <Link to="/local">
                        <button className="MenuItem btn-success">
                            Play Against a Friend Locally
                        </button>
                    </Link>
                    <Link to="/cpu">
                        <button className="MenuItem btn-default">
                            Play Against a Computer
                        </button>
                    </Link>
                    <Link to="/online">
                        <button className="MenuItem btn-danger">
                            Play Against a Person Online
                        </button>
                    </Link>
                </div>
            </div>
        </>

    );
};

export default MainMenu;