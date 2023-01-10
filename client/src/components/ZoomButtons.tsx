import React from "react";

type ZoomButtonsProps = {
    zoom: number;
    setZoom: (zoom: number) => void;
};

const ZoomButtons = (props: ZoomButtonsProps) => {

    const { zoom, setZoom } = props;

    const maxZoom = 10;
    const minZoom = 2;

    return (
        <>
            <button className="zoom-out" onClick={(e) => zoom > minZoom ? setZoom(zoom - 1) : null}>
                🔍-
            </button>
            <button className="zoom-in" onClick={(e) => zoom < maxZoom ? setZoom(zoom + 1) : null}>
                +🔎
            </button>
        </>
    );
};

export default ZoomButtons;
