import {materials} from "../assets/materialsData.js";
import {stones} from "../assets/stonesData.js";
import {diamondPave} from "../assets/diamondPave.js";
import {environments} from "../assets/environmentsData.js";

const ProductInfo = ({environmentSettings, setEnvironmentSettings, matSelected, setMatSelected, stoneSelected, setStoneSelected, withDiamond, setWithDiamond, setModelColor}) => {

    const selectMaterial = (environmentName, materialName, materialColor, hdrPath) => {
        setMatSelected(materialName)
        setModelColor(materialColor)

        setEnvironmentSettings(() => ({

            [environmentName]: {
                materialName,
                materialColor,
                hdrPath
            }
        }));
    };
    // function selectMaterial(name, color) {
    //     setMatSelected(name)
    //     setModelColor(color)
    // }

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

                <ul>
                    {environments.map(environment => (
                        <li key={environment.name}>
                            <p>{environment.name}</p>
                            <ul className="materialSelectionBlock">
                                {materials.map((mat) => (
                                    <li
                                        key={`${environment.name}-${mat.color}`}
                                        className={`matLabelWrapper ${
                                            environmentSettings[environment.name]?.materialName === mat.name ? "matSelected" : ""
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name={`material-${environment.name}`}
                                            id={`${environment.name}-${mat.color}`}
                                            className="inputMaterial visually-hidden"
                                            value={mat.color}
                                            checked={environmentSettings[environment.name]?.materialName === mat.name}
                                            onChange={() => selectMaterial(environment.name, mat.name,mat.color, environment.path )}
                                        />

                                        <label htmlFor={`${environment.name}-${mat.color}`}
                                        >
                                            <div
                                                className="materialCircle"
                                                style={{background: mat.gradient}}
                                            ></div>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="selectContainer">
                <h2>Select stone</h2>

                <div className="selectionBlock">
                    {stones.map(({name}) => (
                        <label
                            key={name}
                            htmlFor={name}
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
                            <p className="stoneName">{name}</p>
                        </label>
                    ))}
                </div>
            </div>

            <div className="selectContainer">
                <h2>Diamond Pavé</h2>

                <div className="selectionBlock">
                    {diamondPave.map(({ name }) => (
                        <label
                            key={name}
                            htmlFor={name}
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
                            <p className="withDiamondText">{name}</p>
                        </label>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ProductInfo;
