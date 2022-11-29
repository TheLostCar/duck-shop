import Image from "next/future/image";
import styles from './DuckListing.module.scss'

type Props = {
    name: string,
    thumbnailUrl: string,
    price: string,
    id: string,
}

const DuckListing = ({ name, thumbnailUrl, price, id }: Props) => {

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>

                <a href={`/duck/${id}`}>

                    <div className={styles.image}>
                        <Image src={thumbnailUrl} alt={`Duck Image for: ${name}`} width={200} height={200} />
                    </div>
                </a>

                <div className={styles.text}>
                    <a href="#">
                        <div className={styles.title}>
                            {name}
                        </div>
                    </a>

                    <div className={styles.price}>
                        ${price}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DuckListing;