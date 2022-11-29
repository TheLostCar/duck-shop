import { useState } from 'react'

type Message = {
    message: string;
    isError: boolean;
}

interface SetMessage {
    (reset: null): void
    (message: string, isError: boolean): void
}

const useMessage = (): [Message | null, SetMessage] => {
    const [message, _setM] = useState<Message | null>(null)

    const setMessage: SetMessage = (message: string | null, isError?: boolean) => {
        _setM(() => {
            if (message === null || isError === undefined) return null;
            return {
                message,
                isError
            }
        })
    }

    return [message, setMessage];
}

export default useMessage;