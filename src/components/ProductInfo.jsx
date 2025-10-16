import {materials} from "../assets/materialsData.js";
import {stones} from "../assets/stonesData.js";
import {diamondPave} from "../assets/diamondPave.js";

const ProductInfo = ({matSelected, setMatSelected, stoneSelected, setStoneSelected, withDiamond, setWithDiamond, setModelColor}) => {

    function selectMaterial(name, color) {
        setMatSelected(name)
        setModelColor(color)
    }

    return (
        <>
            <div>
                <h1 className="productName">Wedding ring</h1>
                <p className="description">Create and personalize your own jewellery. View it in the 3D viewer and try
                    it on in AR.</p>
            </div>

            <div className="productMaterial">
                <h2>Select material:{" "}
                    <span className="colorMaterial">{matSelected}</span>
                </h2>

                <div className="materialSelectionBlock">
                    {materials.map((mat) => (
                        <div
                            key={mat.id}
                            className={`matLabelWrapper ${matSelected === mat.name ? "matSelected" : ""}`}
                        >
                            <input
                                type="radio"
                                name="material"
                                id={mat.id}
                                className="inputMaterial visually-hidden"
                                value={mat.name}
                                checked={matSelected === mat.name}
                                onChange={() => selectMaterial(mat.name,mat.id )}
                            />

                            <label htmlFor={mat.id}
                            >
                                <div
                                    className="materialCircle"
                                    style={{background: mat.gradient}}
                                ></div>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="selectContainer">
                <h2>Select stone</h2>

                <div className="selectionBlock">
                    {stones.map(({name}) => (
                        <div
                            key={name}
                            className={`stoneLabelWrapper ${stoneSelected === name ? "stoneSelected" : ""}`}
                        >
                            <input
                                type="radio"
                                name="stone"
                                id={name}
                                className="inputStone visually-hidden"
                                value={name}
                                checked={stoneSelected === name}
                                onChange={() => setStoneSelected(name)}
                            />

                            <label htmlFor={name} className="stoneLabel"
                            >
                                <p className="stoneName">{name}</p>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="selectContainer">
                <h2>Diamond Pavé</h2>

                <div className="selectionBlock">
                    {diamondPave.map(({name}) => (
                        <div
                            key={name}
                            className={`labelWrapper ${withDiamond === name ? "selected" : ""}`}
                        >
                            <input
                                type="radio"
                                name="withDiamond"
                                id={name}
                                className="inputStone visually-hidden"
                                value={name}
                                checked={withDiamond === name}
                                onChange={() => setWithDiamond(name)}
                            />

                            <label htmlFor={name}
                            >
                                <p className="withDiamondText">{name}</p>
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ProductInfo;
