import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';

class CharList extends Component {

    state = {
        characters: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 7,
        charactersEnded: false
    }


    marvelService = new MarvelService();

    // componentWillUnmount() { 
    //     this.onRequest();
    // }

    componentDidMount() { 
        this.onRequest();
    }

    onRequest = (offset) => { 
        this.onCharacterListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharactersLoaded)
            .catch(this.onError)
    }

    onCharacterListLoading = () => { 
        this.setState({
            newItemLoading: true,
        })
    }

    onCharactersLoaded = (newCharacters) => { 

        let ended = false;
        if (newCharacters.length < 3) { 
            ended = true;
        }

        this.setState(({offset, characters}) => ({
            characters: [...characters, ...newCharacters],
            loading: false,
            newItemLoading: false,
            offset: offset + 3,
            charactersEnded: ended
        }))
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    renderCharacters = (arr) => { 
        const items = arr.map(item => { 
            return (
                <li className="char__item"
                    key={item.id}
                    onClick={() => this.props.onCharacterSelected(item.id)}>
                    <img src={item.thumbnail} alt={item.name} />
                    <div className="char__name">{item.name}</div>
                </li>
            );
        })

        return (
            <ul className="char__grid">
                {items}
            </ul>
        );
    }

    render() { 

        const { characters, loading, error, offset, newItemLoading, charactersEnded } = this.state;
        const items = this.renderCharacters(characters);

        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error) ? items : null;

      
    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {content}
            <button className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charactersEnded ? 'none' : 'block'}}
                    onClick={() => this.onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}
}

export default CharList;
