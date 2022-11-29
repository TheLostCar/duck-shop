import React, { Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState } from "react";
import styles from './CreateDuck.module.scss'
import ImagePreview from "../ImagePreview";
import { useCallback } from 'react'
import FilesDragAndDropArea from "../FilesDragAndDropArea";
import useMessage from "@hooks/useMessage";

const CreateDuck = () => {
    const [imagesPreview, setImageSrc] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);


    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [message, setMessage] = useMessage();
    const [loading, setLoading] = useState(false);

    const [cursor, setCursor] = useState<number | null>(null)
    const priceRef = useRef<HTMLInputElement | null>(null)
    const imgRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        const input = priceRef.current;
        if (input === null) return;
        if (cursor === null) return;

        if (input) input.setSelectionRange(cursor, cursor);
    }, [priceRef, cursor, price]);

    const deleteImage = useCallback((index: number) => {
        setImageFiles(prevState => prevState.filter((_, i) => i !== index))
        setImageSrc(prevState => prevState.filter((_, i) => i !== index))
    }, [imageFiles, imagesPreview])

    const shiftImage = useCallback((index: number, inc: number) => {
        if (index + inc < 0) return;
        if (index + inc > imageFiles.length - 1) return;
        const previousFiles = [...imageFiles]
        const previousPreview = [...imagesPreview]

        const file = previousFiles.splice(index, 1)[0]; // cut the element at index 'from'
        previousFiles.splice(index + inc, 0, file);            // insert it at index 'to'
        setImageFiles(previousFiles)

        const preview = previousPreview.splice(index, 1)[0];
        previousPreview.splice(index + inc, 0, preview);
        setImageSrc(previousPreview)
    }, [imageFiles, imagesPreview])


    const handleNewFiles = (files: FileList, setPreview?: Dispatch<SetStateAction<string[]>>, setFile?: Dispatch<SetStateAction<File[]>>) => {
        for (var i = 0; i < files.length; i++) {

            const file = files[i]
            const reader = new FileReader();
            if (!/\.(jpe?g|png)$/i.test(file.name)) continue;


            reader.onload = () => {
                const src = reader.result;
                if (typeof src !== 'string') return;

                setImageFiles(prevState => [...prevState, file])
                setImageSrc((prevState) => [...prevState, src]);
            }

            reader.readAsDataURL(file);
        }
    }
    const handleOnChange = (e: FormEvent<HTMLInputElement>, setPreview: Dispatch<SetStateAction<string[]>>, setFile: Dispatch<SetStateAction<File[]>>) => {
        const target = e.target as HTMLInputElement
        const files = target.files;
        if (files === null) return;
        handleNewFiles(files, setPreview, setFile);

    }

    const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
        if (loading) return;
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();

        for (let i = 0; i < imageFiles.length; i++) {
            const file = imageFiles[i];
            formData.append('images', file)
        }

        formData.append('name', name);
        formData.append('description', description)
        formData.append('price', price)


        fetch('/api/upload', {
            method: 'POST',
            body: formData,
        })
            .then(res => {
                if (!res.ok) return res.json().then(e => { throw new Error(e.message) })
                return res.json()
            })
            .then(r => {
                setMessage(r.message, false);
                setLoading(false);
                setImageSrc([])
                setImageFiles([])
                setName('')
                setPrice('')
                setDescription('')
                return r
            })
            .catch(e => {
                setMessage(e.message, true)
                setLoading(false)

            })
    }

    const handleLeftArrowClick = useCallback((index: number) => { shiftImage(index, -1) }, [shiftImage])
    const handleRightArrowClick = useCallback((index: number) => { shiftImage(index, 1) }, [shiftImage])
    const handleTrashClick = useCallback((index: number) => { deleteImage(index) }, [deleteImage])


    return (
        <div className={styles.container}>
            <h2>Create Duck</h2>
            <form className={styles.form} method="post" onSubmit={handleOnSubmit}  >
                <FilesDragAndDropArea classNameOnDragover={styles.dragAndDropArea} fileHandler={handleNewFiles} />
                <div className={styles.fileInputRow}>

                    <label htmlFor="images" className={styles.fileInputLabel}>
                        Add Image(s)
                        <input
                            type="file"
                            id="images"
                            name="images"
                            multiple
                            className={styles.fileInput}
                            placeholder="blur"
                            ref={imgRef}
                            onChange={(e) => handleOnChange(e, setImageSrc, setImageFiles)}
                        />
                    </label>

                    <div className={styles.imagePreviewContainer}>
                        {
                            imagesPreview.map((v, i, arr) => {
                                return (
                                    <ImagePreview
                                        key={i}
                                        src={v}
                                        index={i}
                                        leftArrowClick={i > 0 && handleLeftArrowClick || undefined}
                                        rightArrowClick={i < arr.length - 1 && handleRightArrowClick || undefined}
                                        trashClick={handleTrashClick}
                                        star={i === 0}
                                    />
                                )
                            })
                        }
                    </div>

                </div>

                <div className={styles.namePriceDescriptionWrapper}>

                    <div className={styles.row}>
                        <div className={`${styles.col} ${styles.nameColMargin}`}>
                            <label htmlFor="name">Name</label>
                            <input type="text" name="name" id='name' placeholder="name" className={styles.nameInput} minLength={4} value={name} onChange={(e) => setName(e.currentTarget.value)} required />
                        </div>

                        <div className={styles.col}>
                            <label htmlFor="price">Price</label>
                            <input type="text" inputMode="numeric" ref={priceRef} name="price" placeholder="price" id='price' value={price} step={0.01} min={0.01} required
                                className={styles.priceInput}
                                accept={'.png,.jpg,.jpeg'}
                                onChange={(e) => {
                                    setCursor(e.target.selectionStart);
                                    let value = e.currentTarget.value.replace(/[^0-9.]/g, "") // remove any characters that are not [0-9] or .
                                    value = value.replace(/^(\d+.?\d{0,2})\d*$/, '$1') // limit to two values after decimal
                                    setPrice(value)
                                }}
                                pattern='^[0-9]{0,7}\.[0-9][0-9]$'
                            />
                        </div>
                    </div>

                    <div className={`${styles.row} ${styles.noMargin}`}>
                        <div className={styles.col}>
                            <label htmlFor="description">Description</label>
                            <textarea name="description" id="description" placeholder="description" minLength={1} value={description} className={styles.descriptionInput} onChange={(e) => setDescription(e.currentTarget.value)} required />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <span className={`${styles.message} ${message?.isError && styles.isError || ''}`}>
                            {message?.message}
                        </span>
                    </div>
                </div>

                <button className={`${styles.submitButton} ${loading && styles.transparent || ''}`} type="submit" onClick={() => setMessage(null)} disabled={loading}>
                    {loading
                        &&
                        <span className={styles.spinner}></span>
                        ||
                        <>Upload</>

                    }
                </button>
            </form>

        </div>
    );
}


export default CreateDuck;