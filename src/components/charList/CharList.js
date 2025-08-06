import { useState, useEffect, useRef, createRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';

const CharList = (props) => {

    const [characters, setCharacters] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [charactersEnded, setCharactersEnded] = useState(false);

    const {loading, error, getAllCharacters} =  useMarvelService();

    useEffect(() => { 
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => { 
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharactersLoaded)
    }

    const onCharactersLoaded = (newCharacters) => { 
        let ended = false;
        if (newCharacters.length < 3) { 
            ended = true;
        }

        setCharacters(characters => [...characters, ...newCharacters])
        setNewItemLoading(false)
        setOffset(offset => offset + 6)
        setCharactersEnded(ended)
    }

    const focusFirstItem = (ref) => { 
        ref.current.classList.add("char__item_selected");
        ref.current.focus();
    }

    const blurOnItem = (ref) => {
        ref.current.classList.remove("char__item_selected");
    };

    const renderCharacters = (arr) => { 
        const items = arr.map((item) => { 
             const itemRef = createRef(null);
            return (
                <CSSTransition
                key={item.id}
                in={true}
                timeout={500}
                classNames="char__item"
                nodeRef={itemRef}
                >
                    <li className="char__item"
                        ref={itemRef}
                        tabIndex={0}
                        key={item.id}
                        onClick={() => {
                            props.onCharacterSelected(item.id);
                            focusFirstItem(itemRef)
                        }}
                        onBlur={() => blurOnItem(itemRef)}>
                        <img src={item.thumbnail} alt={item.name} />
                        <div className="char__name">{item.name}</div>
                    </li>
                </CSSTransition>
            );
        })

        return (
            <TransitionGroup component={'ul'} className="char__grid">
                    {items}
            </TransitionGroup>
            // Вместо 
            // <ul className="comics__grid">
            //     </TransitionGroup component={'null'}>{items}</TransitionGroup>
            // </ul>
        );
    }

        const items = renderCharacters(characters);

        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading && !newItemLoading ? <Spinner /> : null;
        
    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {items}
            <button className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charactersEnded ? 'none' : 'block'}}
                    onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharacterSelected: PropTypes.func
}

export default CharList;
