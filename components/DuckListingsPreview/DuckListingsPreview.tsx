import { LeanDocument } from "mongoose";
import { DuckSchemaType } from "@models/Duck";
import DuckListing from "../DuckListing";
import styles from './DuckListingsPreview.module.scss'

type Props = {
    listings: (LeanDocument<DuckSchemaType> & { price: string, _id: string })[],
}

const DuckListingsPreview = ({ listings }: Props) => {
    return (
        <div className={styles.container}>
            {
                listings.map(listing =>
                    <DuckListing
                        key={listing._id}
                        thumbnailUrl={listing.images[0].secure_url}
                        name={listing.name}
                        price={listing.price}
                        id={listing._id}
                    />
                )
            }
        </div>
    );
}



export default DuckListingsPreview;