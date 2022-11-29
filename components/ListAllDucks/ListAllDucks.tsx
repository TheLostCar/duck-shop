import styles from './ListAllDucks.module.scss'
import { useEffect, useState, useRef, Dispatch, SetStateAction } from 'react'
import { LeanDuckSchemaType } from '@models/Duck'
import Image from 'next/future/image'
import { FaSearch } from 'react-icons/fa'


type Props = {
    setselectedDuckId: Dispatch<SetStateAction<string>>
    selectedDuckId: string,
    ducks: LeanDuckSchemaType[],
    setDucks: Dispatch<SetStateAction<LeanDuckSchemaType[]>>
}

const ListAllDucks = ({ setselectedDuckId, selectedDuckId, ducks, setDucks }: Props) => {
    const [loadingMore, setLoadingMore] = useState(false);
    const [allLoaded, setAllLoaded] = useState(false);
    const [searchText, setsearchText] = useState('');
    const query = useRef('');

    useEffect(() => {
        if (ducks.length !== 0) return
        fetch('/api/search', {
            method: 'POST',
            headers: new Headers({ 'content-type': 'application/json' }),
        })
            .then(r => r.json())
            .then(r => setDucks(r.ducks))
    }, [])

    const handleLoadMore = () => {
        setLoadingMore(true);

        fetch(`/api/search/${query.current}`, {
            method: 'POST',
            headers: new Headers({ 'content-type': 'application/json' }),
            body: JSON.stringify({
                _id: ducks[ducks.length - 1]?._id || ''
            })
        })
            .then(r => r.json())
            .then(r => {
                if (r.ducks.length === 0) return setAllLoaded(true);
                setDucks(prevProps => [...prevProps, ...r.ducks]);
                setLoadingMore(false);
            })
    }

    const handleSearch = () => {
        query.current = searchText;
        fetch(`/api/search/${searchText}`, {
            method: 'POST',
            headers: new Headers({ 'content-type': 'application/json' }),
        })
            .then(r => r.json())
            .then(r => {
                setDucks(r.ducks)
                setLoadingMore(false)
                setAllLoaded(false)
            })
    }


    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>

                <div className={styles.searchBarContainer}>
                    <div className={styles.searchBarWrapper}>

                        <input type="text" className={styles.searchBarInput} value={searchText} onChange={e => setsearchText(e.currentTarget.value)}
                            onKeyDown={e => {
                                switch (e.key) {
                                    case 'Enter':
                                        handleSearch()
                                }
                            }}
                            size={0}
                        />
                        <button
                            type='button'
                            className={styles.searchButton}
                            onClick={handleSearch}
                        >
                            <FaSearch size={30} className={styles.searchIcon} />
                        </button>
                    </div>
                </div>

                <table className={styles.ducksWrapper}>
                    <thead>
                        <tr>
                            <th>Thumbnail</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Likes</th>
                            <th>Views</th>
                            <th>_id</th>
                            {/* <th>createdAt</th>
                            <th>updatedAt</th> */}
                        </tr>
                    </thead>

                    <tbody>
                        {
                            ducks !== null
                            &&
                            ducks.map((duck, i) => (
                                <tr key={duck._id} onClick={() => setselectedDuckId(duck._id)} className={selectedDuckId === duck._id && styles.selectedRow || ''}>
                                    <td className={styles.tdImage} title='Image'><Image src={duck.images[0].secure_url} alt='' height={100} width={100} /></td>
                                    <td className={styles.tdName} title='Name'>{duck.name}</td>
                                    <td className={styles.tdDescription} title='Description'>
                                        <div className={styles.descriptionWrapper}>
                                            {duck.description}
                                        </div>
                                    </td>
                                    <td className={styles.tdPrice} title='Price'>{duck.price}</td>
                                    <td className={styles.tdLikes} title='Likes'>{duck.likes}</td>
                                    <td className={styles.tdViews} title='Views'>{duck.views}</td>
                                    <td className={styles.tdId} title='_id'>{duck._id}</td>
                                    {/* <td className={styles.tdCreatedAt} title='Creation Time'>{duck.createdAt}</td>
                                    <td className={styles.tdUpdatedAt} title='Last Updated'>{duck.updatedAt}</td> */}
                                </tr>

                            ))

                            ||

                            <div>
                                loading
                            </div>


                        }

                    </tbody>
                </table>

                {
                    (allLoaded === false && ducks.length > 0) &&
                    <div className={styles.loadMoreButtonWrapper}>

                        <button
                            type='button'
                            className={styles.loadMoreButton}
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                        >
                            Load More
                        </button>
                    </div>

                    ||
                    <div className={styles.statusText}>
                        {
                            allLoaded
                            &&
                            "No more ducks"
                            ||
                            "No results"
                        }
                    </div>
                }
            </div>
        </div>
    );
}

export default ListAllDucks;