import { useState } from "react";
import {BrowserRouter as Router, Route} from 'react-router-dom'

import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";

import decoration from '../../resources/img/vision.png';
import ComicsList from "../comicsList/ComicsList";
import AppBanner from "../appBanner/AppBanner";

const App = () => {

    const [choicedChar, setChar] = useState(null)

    const onCharChoiced = (id) => {
        setChar(id)
    }

    return (
        <Router>
            <div className="app">   
                <AppHeader/>
                <main>
                    <Route path="/">
                        <ErrorBoundary>
                            <RandomChar/>
                        </ErrorBoundary>
                        <div className="char__content">
                            <ErrorBoundary>
                                <CharList onCharChoiced={onCharChoiced}/>
                            </ErrorBoundary>
                            <ErrorBoundary>
                                <CharInfo charId={choicedChar}/>
                            </ErrorBoundary>
                        </div>
                        <img className="bg-decoration" src={decoration} alt="vision"/>
                    </Route>
                    <Route path="/comics">
                        <AppBanner/>
                        <ComicsList/>
                    </Route>
                </main>
            </div>
        </Router>
    )
}

export default App;