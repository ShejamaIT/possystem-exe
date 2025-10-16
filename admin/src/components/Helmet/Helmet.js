import React from "react";

const Helmet = (props) =>{

    document.title = 'Shejama Group-V1.1 - '+props.title
    return (
        <div className="w-100">{props.children}</div>
    );
};

export default Helmet;
