import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

const setContent = (process, Component, newItemLoading) => {
	switch (process) {
		case 'waiting':
			return <Spinner/>;
			
		case 'loading':
			return newItemLoading ? <Component/> : <Spinner/>
			
		case 'confirmed':
			return <Component/>;
			
		case 'error':
			return <ErrorMessage/>;
			
		default:
			throw new Error('Unexpexted process state');
	}
}

const ComicsList = () => {
	const [comicsList, setComicsList] = useState([]);
	const [offset, setOffset] = useState(0);
	const [newComicsLoading, setNewComicsLoading] = useState(false);
	const [comicsEnded, setComicsEnded] = useState(false);

	const { loading, error, getAllComics, process, setProcess } = useMarvelService();

	useEffect(() => {
		onRequest(offset, true);
	}, [])

	const onRequest = (offset, initial) => {
		initial ? setNewComicsLoading(false) : setNewComicsLoading(true);
		getAllComics(offset)
			.then(onComicsListLoaded)
			.then(() => {setProcess('confirmed')});
	}

	const onComicsListLoaded = (newComicsList) => {
		let ended = false;
		if (newComicsList.length < 8) {
			ended = true;
		}

		setComicsList([...comicsList, ...newComicsList]);
		setOffset(offset + 8);
		setNewComicsLoading(false);
		setComicsEnded(ended);
	}

	const renderItems = (arr) => {
		const items = arr.map((item, i) => {
			return (
				<li key={i} className="comics__item">
						<Link to={`${item.id}`}>
							<img src={item.thumbnail} alt={item.name} className="comics__item-img"/>
							<div className="comics__item-name">{item.name}</div>
							<div className="comics__item-price">{item.price}</div>
						</Link>
				</li>
			)
		});
		return (
			<ul className="comics__grid">
				{items}
			</ul>
		)
	}

	return (
		<div className="comics__list">
			{setContent(process, () => renderItems(comicsList), newComicsLoading)}
			<button 
				className="button button__main button__long"
				onClick={() => onRequest(offset)}
				disabled={newComicsLoading}
				style={{display: comicsEnded ? 'none' : 'block'}}
			>
					<div className="inner">load more</div>
			</button>
		</div>
	)
}

export default ComicsList;