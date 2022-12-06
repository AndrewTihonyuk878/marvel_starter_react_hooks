import { useState, useEffect, useRef } from 'react'

import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage'
import useMarvelService from '../../services/MarvelService'

import './charList.scss';
import abyss from '../../resources/img/abyss.jpg'

const CharList = (props) => {

    const [charList, setCharList] = useState([])
    const [newItemsLoading, setNewItemsLoading] = useState(false)
    const [offset, setOffset] = useState(1451)
    const [charEnded, setCharEnded] = useState(false)

    const {loading, error, getAllCharacters} = useMarvelService()

    useEffect(() => {
        onRequest(offset, true)
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemsLoading(false) : setNewItemsLoading(true)
        getAllCharacters(offset)
            .then(onCharListLoaded)
    }

    const onCharListLoaded = (newcharList) => {
        let ended = false
        if (newcharList.length < 9) {
            ended = true
        }
        
        setCharList(charList => [...charList, ...newcharList])
        setNewItemsLoading(newItemsLoading => false)
        setOffset(offset => offset + 9)
        setCharEnded(charEnded => ended)
    }

    const itemRefs = useRef([])

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'))
        itemRefs.current[id].classList.add('char__item_selected')
        itemRefs.current[id].focus()

    }

    // Этот метод создан для оптимизации, 
    // чтобы не помещать такую конструкцию в метод render
    // треба зробити активний клас в елементів
    function renderItems(arr) {
        const items = arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'}
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }

            return (
                <li 
                    className="char__item"
                    tabIndex={0}
                    ref={el => itemRefs.current[i] = el}
                    key={item.id}
                    onClick={() => {props.onCharChoiced(item.id)
                    focusOnItem(i)
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onCharChoiced(item.id)
                            focusOnItem(i)
                        }
                    }}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                     <div className="char__name">{item.name}</div>
                </li>
            )
        })
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    const items = renderItems(charList)

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemsLoading ? <Spinner/> : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {items}
            <button
                className="button button__main button__long"
                disabled={newItemsLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default CharList;