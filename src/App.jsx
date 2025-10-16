import './App.css'

import ModelSection from "./components/ModelSection.jsx";
import {useEffect, useState} from "react";
import ProductInfo from "./components/ProductInfo.jsx";

import shop from "./assets/images/shopping-cart-simple.svg";
import leftArrow from "./assets/images/move-left.svg";

function App() {
    const [matSelected, setMatSelected] = useState("WHITE GOLD");
    const [stoneSelected, setStoneSelected] = useState("Oval");
    const [withDiamond, setWithDiamond] = useState("With Diamond Pavé");
    const [price, setPrice] = useState(489);
    const [modelColor, setModelColor] = useState("white");

    useEffect(() => {
        let basePrice = 489;

        switch (matSelected) {
            case "ROSE GOLD":
                basePrice += 50;
                break;
            case "YELLOW GOLD":
                basePrice += 100;
                break;
            case "WHITE GOLD":
                basePrice += 0;
                break;
            default:
                break;
        }

        switch (stoneSelected) {
            case "Cushion":
                basePrice += 80;
                break;
            case "Round":
                basePrice += 120;
                break;
            case "Oval":
                basePrice += 0;
                break;
            default:
                break;
        }

        if (withDiamond !== "With Diamond Pavé") {
            basePrice -= 200;
        }

        setPrice(basePrice);
    }, [matSelected, stoneSelected, withDiamond]);

    return (
        <>
            <header>
                <div className="headerContainer">
                    <a className="backLink">
                        <img src={leftArrow} alt="img" height={24}/>
                    </a>
                    <p className='headerText'>ARbling 3D Viewer</p>
                </div>
            </header>
            <main className="main">
                <div className="mainContainer">
                    <ModelSection modelColor={modelColor}
                                  withDiamond={withDiamond}
                                  stoneSelected={stoneSelected}
                                  price={price}
                    />

                    <section className="section productInfo">
                        <ProductInfo matSelected={matSelected}
                                     setMatSelected={setMatSelected}
                                     stoneSelected={stoneSelected}
                                     setStoneSelected={setStoneSelected}
                                     withDiamond={withDiamond}
                                     setWithDiamond={setWithDiamond}
                                     setModelColor={setModelColor}
                        />

                        <button type="button" className="addButton"
                                onClick={() => {
                                    console.log("clicked")
                                }}>
                            <img src={shop} alt="img"/>
                            Add to cart (${price})
                        </button>
                    </section>
                </div>

            </main>
        </>
    )
}

export default App
