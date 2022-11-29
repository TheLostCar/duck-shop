import React from 'react';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';
import { FaStar, FaTrash } from "react-icons/fa";
import { TbLetterT } from 'react-icons/tb'
import styles from './imagePreview.module.scss'
import Image from 'next/future/image';

import { useEffect } from 'react'
type Props = {
    src: string;
    index: number;
    star: boolean
    trashClick?: (index: number) => void
    leftArrowClick?: (index: number) => void
    rightArrowClick?: (index: number) => void
}

const ImagePreview = ({ src, index, star, trashClick, leftArrowClick, rightArrowClick }: Props) => {

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (document.activeElement === e.currentTarget) return;
        e.currentTarget.blur()
    }
    return (

        <div
            className={styles.imagePreviewWrapper}

        >
            {star && <TbLetterT className={styles.thumbnailStar} size={25} title='Thumbnail' />}

            {trashClick &&
                <button
                    className={styles.deleteImage}
                    onClick={() => trashClick(index)}
                    onMouseLeave={handleMouseLeave}
                    type='button'
                >
                    <FaTrash className={styles.trash} size={25} />
                </button>
            }

            {leftArrowClick &&
                <button
                    className={styles.imageToLeft}
                    onClick={() => leftArrowClick(index)}
                    onMouseLeave={handleMouseLeave}
                    type='button'
                >
                    <SlArrowLeft size={50} />
                </button>
            }

            {rightArrowClick &&
                <button
                    className={styles.imageToRight}
                    onClick={() => rightArrowClick(index)}
                    onMouseLeave={handleMouseLeave}
                    type='button'
                >
                    <SlArrowRight size={50} />
                </button>
            }
            <Image src={src} alt='an image to be added' height={800} width={800} className={styles.imagePreview} />
        </div>
    );
}

export default React.memo(ImagePreview);