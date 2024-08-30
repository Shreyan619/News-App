import React from 'react'
import "../../styles/scrolltext.css"

const ScrollText = () => {

    const text = "GET LATEST NEWS OF ANY LANGUAGE AT ONE PLACE";
    const repeatedText = `${text} `.repeat(2);

    return (
        <div className='scroll'>
            <div className="scroll-left">
                <span>{repeatedText}</span>
                <span>{repeatedText}</span>
            </div>
            <div className="scroll-left">
                <span>{repeatedText}</span>
                <span>{repeatedText}</span>
            </div>
        </div>
    )
}

export default ScrollText
