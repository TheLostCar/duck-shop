import Image, { ImageLoaderProps, ImageProps } from "next/future/image";

const CloudinaryImage = (props: Omit<ImageProps, 'loader'>) => {
    const loader = ({ src, width, quality }: ImageLoaderProps) => {
        const srcSplit = src.split('image/upload');
        if (srcSplit.length !== 2) return src;

        return srcSplit[0] + `image/upload/c_scale,q_${typeof quality === 'number' && 20 || 10},w_${width}` + srcSplit[1]
    }
    return (
        <Image
            {...props}
            alt={props.alt}
            loader={loader}
        />
    );
}

export default CloudinaryImage;