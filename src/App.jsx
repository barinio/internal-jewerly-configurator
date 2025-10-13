import './App.css'

import ModelSection from "./components/ModelSection.jsx";
import {useState} from "react";
import ProductInfo from "./components/ProductInfo.jsx";

import shop from "./assets/images/shopping-cart-simple.svg";
import leftArrow from "./assets/images/move-left.svg";

// import style from './App.css';

function App() {
    const [matSelected, setMatSelected] = useState("WHITE GOLD");
    const [stoneSelected, setStoneSelected] = useState("Oval");
    const [withDiamond, setWithDiamond] = useState("With Diamond Pavé");


    return (
        <>
            <header>
                <a className="back-link">
                    <img src={leftArrow} alt="img" height={24}/>
                </a>
                <p className='headerText'>ARbling 3D Viewer</p>
            </header>
            <main className="main">
                <ModelSection />

                <section className="section productInfo">
                    <ProductInfo matSelected={matSelected}
                                 setMatSelected={setMatSelected}
                                 stoneSelected={stoneSelected}
                                 setStoneSelected={setStoneSelected}
                                 withDiamond={withDiamond}
                                 setWithDiamond={setWithDiamond}
                    />

                    <button type="button" className="addButton"
                            onClick={() => {console.log("clicked")}}>
                        <img src={shop} alt="img" />
                        Add to cart ($489)
                    </button>
                </section>
            </main>
        </>
    )
}

export default App
