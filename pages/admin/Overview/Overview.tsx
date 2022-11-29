import { LeanDuckSchemaType } from '@models/Duck';
import Image from 'next/future/image';
import React, { useEffect } from 'react';
import styles from './Overview.module.scss'

type Props = {
    mostRecent: LeanDuckSchemaType;
    mostLiked: LeanDuckSchemaType;
    random: LeanDuckSchemaType;
    mostViewed: LeanDuckSchemaType
}

const Overview = ({ mostRecent, mostViewed, mostLiked, random }: Props) => {

    return (
        <div className={styles.contentWrapper}>
            <section>
                <div className={styles.sectionWrapper}>

                    <h2>Top Viewed</h2>
                    <div className={styles.sectionContent}>
                        <div className={styles.imageWrapper}>
                            <Image src={mostLiked.images[0].secure_url} alt={`The top viewed duck is: ${mostLiked.name}`} width={200} height={200} />
                        </div>
                        <div className={styles.sectionText}>
                            <span>{mostViewed.name}</span>
                            <span>{mostLiked.views} Views</span>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className={styles.sectionWrapper}>

                    <h2>Most Liked</h2>
                    <div className={styles.sectionContent}>
                        <div className={styles.imageWrapper}>
                            <Image src={mostLiked.images[0].secure_url} alt={''} width={200} height={200} />
                        </div>
                        <div className={styles.sectionText}>
                            <span>{mostLiked.name}</span>
                            <span>{mostLiked.likes} Likes</span>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className={styles.sectionWrapper}>

                    <h2>Most Recent</h2>

                    <div className={styles.sectionContent}>
                        <div className={styles.imageWrapper}>
                            <Image src={mostRecent.images[0].secure_url} alt={''} width={200} height={200} />
                        </div>
                        <div className={styles.sectionText}>
                            <span>{mostRecent.name}</span>
                            <span>{mostRecent.createdAt + ''}</span>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className={styles.sectionWrapper}>

                    <h2>Random Duck</h2>
                    <div className={styles.sectionContent}>
                        <div className={styles.imageWrapper}>
                            <Image src={random.images[0].secure_url} alt={''} width={200} height={200} />
                        </div>
                        <div className={styles.sectionText}>
                            <span>{random.name}</span>
                            <span>${random.price}</span>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}

export default React.memo(Overview, (prevProps, nextProps) => {
    if (prevProps.mostRecent._id !== nextProps.mostRecent._id) return false;
    if (prevProps.random._id !== nextProps.random._id) return false;
    if (prevProps.mostLiked._id !== nextProps.mostLiked._id) return false;
    if (prevProps.mostViewed._id !== nextProps.mostViewed._id) return false;
    return true
});