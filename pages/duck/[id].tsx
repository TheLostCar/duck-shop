
import Duck, { DuckSchemaType, LeanDuckSchemaType } from "@models/Duck";
import dbConnect from "lib/dbConnect";
import { GetServerSideProps, NextPage } from "next";
import { Callback, LeanDocument } from "mongoose";
import NavBar from '@components/NavBar';
import Footer from '@components/Footer';
import Image from 'next/future/image';
import { useState } from 'react';

import styles from '@styles/DuckPage.module.scss'
import DuckListingsPreview from "@components/DuckListingsPreview";
import CloudinaryImage from "@components/CloudinaryImage";


type Props = {
    duck: LeanDuckSchemaType,
    listings: LeanDuckSchemaType[]
}

const DuckPage: NextPage<Props> = ({ duck, listings }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    return (
        <div className={styles.container}>
            <NavBar />
            <div className={styles.wrapper}>

                <div className={styles.images}>
                    <div className={styles.selectedImageWrapper}>
                        <Image src={duck.images[selectedImageIndex].secure_url} width={500} height={500} alt={''} className={styles.selectedImage} />
                    </div>

                    <div className={styles.imagePreviewWrapper}>
                        {
                            duck.images.map((v, i) => (
                                <button
                                    key={v.asset_id}
                                    onClick={() => setSelectedImageIndex(i)}
                                    className={styles.selectImageButton}
                                >

                                    <Image
                                        src={v.secure_url}
                                        alt={`Image preview number ${i} of ${duck.name}`}
                                        width={100}
                                        height={100}
                                        className={`${styles.imagePreview} ${selectedImageIndex === i && styles.selected || ''}`}
                                    />
                                </button>
                            ))
                        }
                    </div>

                </div>


                <div className={styles.duckDetails}>

                    <div className={styles.title}>
                        {duck.name}
                    </div>

                    <div className={styles.description}>
                        <span className={styles.descriptionText}>
                            {duck.description}
                        </span>
                    </div>

                    <div className={styles.buySection}>
                        <div className={styles.price}>
                            <span>
                                ${duck.price}
                            </span>
                        </div>

                        <div>
                            <button type="button" className={styles.addToCartButton}>
                                Add To Cart
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.moreDucks}>
                    <h2>More Ducks</h2>

                    <DuckListingsPreview listings={listings} />

                </div>
            </div>

            <Footer />
        </div>
    );
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    await dbConnect();
    context.res.setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=10'
    )
    const { id } = context.query
    if (typeof id !== 'string') return { props: {} };

    const callback = (res: LeanDocument<DuckSchemaType>) => {
        return Object.assign(res, { _id: res._id.toString(), price: res.price.toString() })
    }

    const duck = await Duck.findById(id).lean().sort({ _id: -1 }).select('-__v -updatedAt -createdAt').then(callback);
    const listings = await Duck.aggregate([{ $sample: { size: 8 } }, { $unset: ["updatedAt", "createdAt", "__v"] }]).then(r => r.map(callback));

    return {
        props: { duck, listings }
    }
}


export default DuckPage;