import React, { Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState } from "react";
import styles from './EditDuck.module.scss'
import ImagePreview from "../ImagePreview";
import { useCallback } from 'react'
import FilesDragAndDropArea from "../FilesDragAndDropArea";
import { LeanDuckSchemaType } from "@models/Duck";
import useMessage from "@hooks/useMessage";

type Props = {
    _id: string
}


const EditDuck = ({ _id }: Props) => {
    const [imagesPreview, setImageSrc] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [newIndex, setNewIndex] = useState<number[]>([])

    const [duck, setDuck] = useState<LeanDuckSchemaType | null>(null)

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [message, setMessage] = useMessage();

    const [cursor, setCursor] = useState<number | null>(null)
    const priceRef = useRef<HTMLInputElement | null>(null)
    const imgRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        const input = priceRef.current;
        if (input === null) return;
        if (cursor === null) return;

        if (input) input.setSelectionRange(cursor, cursor);
    }, [priceRef, cursor, price]);

    useEffect(() => {
        fetch('/api/duckById', {
            method: 'POST',
            headers: new Headers({ 'content-type': 'application/json' }),
            body: JSON.stringify({
                _id: _id
            })
        })
            .then((res) => res.json())
            .then(r => {
                const newIndex = new Array(r.duck.images.length).fill(0).map((_, i) => i);
                setDuck(r.duck);
                setName(r.duck.name);
                setDescription(r.duck.description)
                setPrice(r.duck.price)
                setNewIndex(newIndex);
            })
    }, [_id])

    // const deleteImage = useCallback((index: number) => {
    //     setImageFiles(prevState => prevState.filter((_, i) => i !== index))
    //     setImageSrc(prevState => prevState.filter((_, i) => i !== index))
    // }, [newIndex])

    const shiftImage = useCallback((index: number, inc: number) => {
        if (duck === null) return;
        if (index + inc < 0) return;
        if (index + inc > newIndex.length - 1) return;
        const previousIndex = [...newIndex]

        const indexToMove = previousIndex.splice(index, 1)[0];
        previousIndex.splice(index + inc, 0, indexToMove);
        setNewIndex(previousIndex)
    }, [newIndex, duck?._id])


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
        const files = target.files
        if (files === null) return;
        handleNewFiles(files, setPreview, setFile);

    }

    const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData();

        formData.append('name', name);
        formData.append('_id', _id);
        formData.append('description', description);
        formData.append('price', price);
        formData.append("newIndex", JSON.stringify(newIndex))

        const t = await fetch('/api/updateDuck', {
            method: 'POST',
            body: formData,
        })
            .then(r => r.json())
            .then(r => setMessage(r.message, false))
            .catch(e => setMessage(e.message, true))
        return
    }

    const handleLeftArrowClick = useCallback((index: number) => { shiftImage(index, -1) }, [shiftImage])
    const handleRightArrowClick = useCallback((index: number) => { shiftImage(index, 1) }, [shiftImage])

    return (
        <div className={styles.container}>
            <h2>Edit Duck</h2>
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
                            duck !== null &&
                            newIndex.map((v, i, arr) =>
                                <ImagePreview
                                    key={i}
                                    src={duck.images[v].secure_url}
                                    index={i}
                                    leftArrowClick={i > 0 && handleLeftArrowClick || undefined}
                                    rightArrowClick={i < arr.length - 1 && handleRightArrowClick || undefined}
                                    star={i === 0}
                                />
                            )
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
                        <span className={styles.errorMessage}>
                            {message?.message}
                        </span>
                    </div>
                </div>

                <button className={styles.submitButton} type="submit" onClick={() => setMessage(null)}>Upload!</button>
            </form>

        </div>
    );
}


export default EditDuck;