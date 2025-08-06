import { useState, useEffect, useRef, createRef } from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

const ComicsList = () => {

    const [comics, setComics] = useState([]);
    const [newComicsLoading, setNewComicsLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);

    const { loading, error, getAllComics } = useMarvelService();

    useEffect(() => { 
        onRequest(offset, true)
    }, [])
    

    const onRequest = (offset, initial) => { 
        initial ? setNewComicsLoading(false) : setNewComicsLoading(true);
        getAllComics(offset)
            .then(onComicsLoaded)
    }

    const onComicsLoaded = (newComics) => { 
        let ended = false;
        if (newComics.length < 8) { 
            ended = true;
        }
        setComics(comics => [...comics, ...newComics])
        setNewComicsLoading(false)
        setOffset(offset => offset + 8)
        setComicsEnded(ended)
    }

    const focusFirstComics = (ref) => { 
        ref.current.classList.add("char__item_selected");
        ref.current.focus();
    }

    const blurOnItem = (ref) => {
        ref.current.classList.remove("char__item_selected");
    };

    const renderComics = (arr) => {
        const items = arr.map((item) => {
            const itemRef = createRef(null);
            return (
                <CSSTransition
                key={item.id}
                in={true}
                timeout={500}
                classNames="comics__item"
                nodeRef={itemRef}
                >
                <li className="comics__item"
                    ref={itemRef}
                    tabIndex={0}
                    key={item.id}
                    onClick={() => {
                        focusFirstComics(itemRef)
                        }}
                    onBlur={() => blurOnItem(itemRef)}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.thumbnail} className="comics__item-img" />
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.prices}$</div>
                    </Link>
                    </li>
                </CSSTransition>
            )
        })

        return (
            
           <TransitionGroup component={'ul'} className="comics__grid">
                    {items}
            </TransitionGroup>
            
        )
    }

    
    const items = renderComics(comics);
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading && !newComicsLoading ? <Spinner /> : null;

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            <button className="button button__main button__long"
                    disabled={newComicsLoading}
                    style={{'display': comicsEnded ? 'none' : 'block'}}
                    onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
        
    )
    
}

export default ComicsList;