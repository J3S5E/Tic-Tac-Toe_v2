import React from "react";

const NameEnter = (props: {
    playerName: string;
    setPlayerName: (arg0: string) => void;
}) => {
    return (
        <div className="OptionsList">
            <label className="OptionsItem label">Display Name</label>
            <label className="OptionsItem text">
                <input
                    type="text"
                    name="playerName"
                    value={props.playerName}
                    onChange={(e) => props.setPlayerName(e.target.value)}
                />
            </label>            
        </div>
    );
};

export default NameEnter;
