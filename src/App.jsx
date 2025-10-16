import './App.css'

import ModelSection from "./components/ModelSection.jsx";
import {useState} from "react";
import ProductInfo from "./components/ProductInfo.jsx";

import shop from "./assets/images/shopping-cart-simple.svg";
import leftArrow from "./assets/images/move-left.svg";

function App() {
    const [matSelected, setMatSelected] = useState("WHITE GOLD");
    const [stoneSelected, setStoneSelected] = useState("Oval");
    const [withDiamond, setWithDiamond] = useState("With Diamond Pavé");

    const [modelColor, setModelColor] = useState("white");


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
                <ModelSection modelColor={modelColor} withDiamond={withDiamond} />

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
                            onClick={() => {console.log("clicked")}}>
                        <img src={shop} alt="img" />
                        Add to cart ($489)
                    </button>
                </section>
                </div>

            </main>
        </>
    )
}

export default App
