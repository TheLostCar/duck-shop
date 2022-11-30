import CreateDuck from "@components/CreateDuck";
import styles from '@styles/dashboard.module.scss'
import { VscMenu } from 'react-icons/vsc'
import { IoMdArrowDropright, IoMdNotificationsOutline } from 'react-icons/io'
import { IoSettingsOutline } from 'react-icons/io5'
import { AiOutlineUser } from 'react-icons/ai';

import { useState, MouseEvent } from "react";
import Overview from "@components/Overview/Overview";
import Duck, { DuckSchemaType, LeanDuckSchemaType } from "@models/Duck";
import dbConnect from "lib/dbConnect";
import { GetServerSideProps, NextPage } from "next";
import { LeanDocument } from "mongoose";
import ListAllDucks from "@components/ListAllDucks";
import EditDuck from "@components/EditDuck";
import { useSession } from "next-auth/react";
import { getToken } from "next-auth/jwt";
import Link from "next/link";

const SIDEBAR_BUTTONS = ['Overview', 'Create Duck', 'All Ducks', 'Edit Duck']

type OverviewData = {
    mostRecent: LeanDuckSchemaType;
    mostLiked: LeanDuckSchemaType;
    random: LeanDuckSchemaType;
    mostViewed: LeanDuckSchemaType;
}


type Props = {
    overview: OverviewData,
}

const Dashboard: NextPage<Props> = ({ overview }) => {
    const [sidebarClosed, setSidebarClosed] = useState(false);
    const [menuIndex, setMenuIndex] = useState(0)
    const [ducks, setDucks] = useState<LeanDuckSchemaType[]>([])
    const [selectedDuckId, setSelectedDuckId] = useState('')
    const { data: session, status } = useSession()

    const handleMouseDown = (e: MouseEvent) => {
        e.preventDefault();
    }

    return (
        <div className={styles.container}>
            <div className={styles.returnLink}>
                <Link href='/' passHref legacyBehavior>
                    <a>
                        <span>
                            Return
                            <IoMdArrowDropright size={20} />
                        </span>
                    </a>
                </Link>
            </div>
            <div className={styles.nav}>

                <button
                    onClick={e => setSidebarClosed(s => !s)}
                    onMouseDown={handleMouseDown}
                    className={styles.hamburger}
                >
                    <VscMenu size={30} />
                </button>

                <button
                    className={`${styles.marginLeftAuto} ${styles.fill}`}
                    onMouseDown={handleMouseDown}
                >
                    <IoSettingsOutline size={30} />
                </button>

                <button onMouseDown={handleMouseDown}>
                    <IoMdNotificationsOutline className={styles.stroke} size={30} />
                </button>

                <button onMouseDown={handleMouseDown}>
                    <AiOutlineUser className={styles.stroke} size={30} />
                </button>
            </div>

            <div className={styles.mainWrapper}>

                <div className={`${styles.sidebar} ${sidebarClosed && styles.closed || ''}`}>
                    <ul>
                        {
                            SIDEBAR_BUTTONS.map((v, i) => (
                                <li key={i}>
                                    <button
                                        type="button"
                                        className={menuIndex === i && styles.active || ''}
                                        onMouseDown={handleMouseDown}
                                        onClick={() => setMenuIndex(i)}
                                    >
                                        {v}
                                    </button>
                                </li>
                            ))
                        }
                    </ul>
                </div>

                { // Menu displayed depends on the button (index) chosen
                    [
                        <Overview key={'0'} mostRecent={overview.mostRecent} random={overview.random} mostViewed={overview.mostViewed} mostLiked={overview.mostLiked} />,
                        <CreateDuck key='1' />,
                        <ListAllDucks
                            key='2'
                            setselectedDuckId={setSelectedDuckId}
                            selectedDuckId={selectedDuckId}
                            ducks={ducks}
                            setDucks={setDucks}
                        />,
                        (selectedDuckId !== "" &&
                            <EditDuck key='3' _id={selectedDuckId} />
                            ||
                            <div key='3' className={styles.noDuckSelected}>
                                No duck selected
                            </div>
                        ),
                    ][menuIndex]
                }

            </div>
        </div>
    );
}



export const getServerSideProps: GetServerSideProps = async (context) => {
    await dbConnect();
    const req = context.req;
    const token = await getToken({ req })
    if (token === null) return {
        redirect: {
            permanent: false,
            destination: "/auth/signin"
        }
    };

    context.res.setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=10'
    )

    const callback = (res: LeanDocument<DuckSchemaType>[]) => {
        return res.map((obj) => Object.assign(obj, { _id: obj._id.toString(), price: obj.price.toString(), createdAt: new Date(obj.createdAt + '').toDateString() }))
    }

    const data = await Promise.all([
        Duck.find().lean().limit(1).sort({ views: -1 }).select('-__v -updatedAt').then(callback), // most viewed
        Duck.find().lean().limit(1).sort({ _id: -1 }).select('-__v -updatedAt').then(callback), // most recent
        Duck.find().lean().limit(1).sort({ likes: -1 }).select('-__v -updatedAt').then(callback), // most liked
        Duck.aggregate([{ $sample: { size: 1 } }, { $unset: ["updatedAt", "__v"] }]).then(callback), // random
    ]).then(([mostViewed, mostRecent, mostLiked, random]) => (
        {
            mostViewed: mostViewed[0],
            mostRecent: mostRecent[0],
            mostLiked: mostLiked[0],
            random: random[0]
        }
    ));

    return {
        props: { overview: data },
    }
}

export default Dashboard;