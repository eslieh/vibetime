import React from "react";

const Ringer = () => {
    return (
        <div className="ringer-pop">
            <div className="call-details">
                <div className="image-place-ic">
                    <div className="Inititalplat">E</div>
                </div>
                <div className="caller-details">
                    <div className="about-coall">vibetime</div>
                    <div className="user-full-names">Eslieh Victor</div>
                </div>
                <div className="action-buttons">
                    <button className="action-det" id="decline"><i class="fa-solid fa-phone-flip"></i></button>
                    <button className="action-det" id="accept"><i class="fa-solid fa-phone"></i></button>
                </div>
            </div>
        </div>
    )
}
export default Ringer