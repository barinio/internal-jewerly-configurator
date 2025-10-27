

import Viewer from "./Viewer";

const ModelSection = ({environmentSettings, modelColor, withDiamond, stoneSelected, price}) => {

    return (
        <section className="section viewerSection">
            <div className="wrapperPrice">
                <p className="textPrice">Price:</p>
                <p className="textPrice priceValue">${price}</p>
            </div>
            <Viewer
                environmentSettings={environmentSettings}
                modelColor={modelColor}
                withDiamond={withDiamond}
                stoneSelected={stoneSelected}
            />
        </section>
    );
};

export default ModelSection;
