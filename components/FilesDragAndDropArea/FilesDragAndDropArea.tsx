import { DragEvent as ReactDragEvent, ReactNode, useEffect, useRef, useState } from "react";
import styles from './FilesDragAndDropArea.module.scss'

type Props = {
    fileHandler: (files: FileList) => void;
    classNameOnDragover?: string;
    children?: ReactNode[];

}

const FilesDragAndDropArea = ({ fileHandler, children = [], classNameOnDragover = '' }: Props) => {
    const [dragging, setDragging] = useState(false)
    const dropAreaRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const dropArea = dropAreaRef.current;
        if (dropArea === null) return;
        const startDragging = (e: DragEvent) => {
            e.stopPropagation()
            e.preventDefault()
            setDragging(true)
        };

        window.addEventListener('dragover', startDragging);


        return () => {
            window.removeEventListener('dragover', startDragging);
        };
    }, []);

    const handleDragOver = (e: ReactDragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.add(classNameOnDragover, styles.active)
    };

    const handleDrop = (e: ReactDragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer === null) return

        const files = e.dataTransfer.files;
        fileHandler(files)
        setDragging(false)
        e.currentTarget.classList.remove(classNameOnDragover, styles.active)
    };
    const handleDragLeave = (e: ReactDragEvent) => {
        setDragging(false)
        e.currentTarget.classList.remove(classNameOnDragover, styles.active)

    }

    return (
        <div
            ref={dropAreaRef}
            className={styles.dropArea}
            style={{
                pointerEvents: dragging && 'all' || 'none'
            }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragLeave={handleDragLeave}
        >
            {children}
        </div>
    );
}

export default FilesDragAndDropArea;