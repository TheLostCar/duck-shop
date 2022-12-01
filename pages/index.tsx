import type { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/future/image'
import Carousel from '@components/Carousel'
import NavBar from '@components/NavBar'
import DuckListingsPreview from '@components/DuckListingsPreview'
import dbConnect from '@lib/dbConnect'
import Duck, { DuckSchemaType } from '@models/Duck'
import { LeanDocument } from 'mongoose'
import Footer from '@components/Footer'
import { IoMdArrowDropright } from 'react-icons/io'

import NewsletterSection from '@components/NewsletterSection'
import styles from '@styles/Home.module.scss'

type Props = {
    listings: (LeanDocument<DuckSchemaType> & {
        _id: any;
        price: any;
    })[],
}

const Home: NextPage<Props> = ({ listings }) => {

    return (
        <div className={styles.container}>
            <Head>
                <title>Duck Shop</title>
                <meta name="description" content="A responsive rubber duck e-commerce site built with NextJS." />


                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#83d2fc" />
                <meta name="msapplication-TileColor" content="#83d2fc" />
                <meta name="theme-color" content="#83d2fc" />

            </Head>

            <main className={styles.main}>
                <div className={styles.exploreBackendLink}>
                    <Link href='/admin/dashboard' passHref legacyBehavior>
                        <a>
                            <span>
                                Explore the backend
                                <IoMdArrowDropright size={20} />
                            </span>
                        </a>
                    </Link>
                </div>
                <NavBar />

                <Carousel className={styles.carousel}>
                    <a href='#'>
                        <Image src="/images/FlawlessFloatingBanner.png" alt='' width={900} height={300} className={styles.image} />
                    </a>
                    <a href='#'>
                        <Image src="/images/DuckBanner2.png" alt='' width={900} height={300} className={styles.image} />
                    </a>
                    <a href='#'>
                        <Image src="/images/30PercentBanner2.png" alt='' width={900} height={300} className={styles.image} />
                    </a>
                    <a href='#'>
                        <Image src="/images/DucksDailyBanner3.png" alt='' width={900} height={300} className={styles.image} />
                    </a>
                </Carousel>

                <DuckListingsPreview listings={listings} />


                <div className={styles.welcomeSection}>
                    <h2>Welcome</h2>
                    <div>
                        Welcome to the world&apos;s most incredible source of rubber ducks!
                        Take your time and look around at our great selection of ducks.
                        Our list of ducks is continuously expanding, be sure to check in often.
                    </div>
                </div>


                <NewsletterSection />

            </main>

            <Footer />

        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {
    await dbConnect();
    const listings = (await Duck.find({}).select('-__v -createdAt -updatedAt').lean().limit(8)).map(obj => {
        return Object.assign(obj, { _id: obj._id.valueOf(), price: obj.price.toString() })
    })

    return {
        props: { listings },
    }
}

export default Home
