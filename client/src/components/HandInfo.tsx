import React from "react";
import { Player, GameColor } from "../shared/interfaces/game.interface";

type HandInfoProps = {
    player: Player;
    setSelected: (selected: number) => void;
    currentPlayer: GameColor;
    selected: number | null;
    waiting: boolean;
};

const HandInfo = (props: HandInfoProps) => {
    const { player, setSelected, currentPlayer, selected, waiting } = props;

    return (
        <div className="player-info">
            <div
                className={
                    currentPlayer === player.color
                        ? "player-name bold"
                        : "player-name"
                }
            >
                {waiting && currentPlayer === player.color ? `Waiting for ${player.label}` : player.label}
            </div>
            <div className="player-options big_emoji">
                {player.hand.map((action, i) => {
                    return (
                        <div
                            className={
                                selected === i && currentPlayer === player.color
                                    ? "player-action selected"
                                    : "player-action"
                            }
                            key={i}
                            onClick={(e) => currentPlayer === player.color && !waiting ? setSelected(i) : null}
                        >
                            {action}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HandInfo;
