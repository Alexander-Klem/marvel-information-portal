import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => { 
    const { loading, request, error, clearError } = useHttp();

    const _apiBase = 'https://marvel-server-zeta.vercel.app/';
    const _apiKey = 'apikey=d4eecb0c66dedbfae4eab45d312fc1df';
    const _baseOffset = 0;
    const _comBase = 'https://marvel-server-zeta.vercel.app/comics?';
    const _comKey = 'apikey=d4eecb0c66dedbfae4eab45d312fc1df';

    const getAllCharacters = async (offset = _baseOffset) => { 
        const res = await request(`${_apiBase}characters?limit=6&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacterByName = async (charName) => {
		const res = await request(`${_apiBase}characters?name=${charName}&${_apiKey}`);
		return res.data.results.map(_transformCharacter);
	};

    const getCharacter = async (id) => { 
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getAllComics = async (offset = _baseOffset) => { 
        const res = await request(`${_comBase}comics&limit=8&offset=${offset}&${_comKey}`)
        return res.data.results.map(_transformComics);
    }

    const getComic = async (id) => { 
        const str = _comBase.slice(0, -1) + '/';
        const res = await request(`${str}${id}?${_comKey}`);
        return _transformComics(res.data.results[0]);
    }

    const _transformCharacter = (character) => { 
        return {
            id: character.id,
            name: character.name,
            description: character.description ? `${character.description.slice(0, 42)}... follow for more in (HOMEPAGE)` : 'There is no description for this character' ,
            thumbnail: character.thumbnail.path + `.` + character.thumbnail.extension,
            homepage: character.urls[0].url,
            wiki: character.urls[1].url,
            comics: character.comics.items,
        }
    }

    const _transformComics = (comics) => { 
        return {
            id: comics.id,
            title: comics.title,
            description: comics.description || 'There is no description for this character',
            pageCount: comics.pageCount,
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
            language: comics.textObjects.languages,
            prices: comics.prices[0].price

        }
    } 

    return {loading, error, getAllCharacters, getCharacterByName, getCharacter, clearError, getAllComics, getComic}
}

export default useMarvelService;