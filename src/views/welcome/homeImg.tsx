import React, { } from 'react';
// import './userCenter.css';


interface HomeImgProps {
    homePng: string
}

const HomeImg: React.FC<HomeImgProps> = (props) => {
    const { homePng } = props;
    return (
        <img src={homePng} alt="" style={{ width: '100%' }} />
    );
};
HomeImg.defaultProps = {
};
export default HomeImg;