import { useRef, useEffect } from 'react'

const UseRef_1 = () => {

    const refInput = useRef(null)

    useEffect(() => {
        if (refInput) {
            refInput.current.focus()
        }
    }, [])
    const sending = () => {
        if (refInput.current) {
            console.log(refInput.current.value)
        }
    }
    const focus = () => {
        if (refInput) {
            refInput.current.focus()
        }
    }

    return (
        <>
            <input type="text" ref={refInput} />
            <button onClick={focus}>再次聚焦输入框</button>
            <button onClick={sending}>控制台打印</button>
            <hr/>
        </>
    )
}

export default UseRef_1