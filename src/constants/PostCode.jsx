import React from 'react';
import { useTranslation } from 'react-i18next';
import DaumPostcode from "react-daum-postcode";
 
const PopupPostCode = (props) => {
    const { onSetAddress, onSetPostCode, onClose } = props;
    const { t } = useTranslation();
	// 우편번호 검색 후 주소 클릭 시 실행될 함수, data callback 용
    const handlePostCode = (data) => {
        console.log('\thandlePostCode called~~~~~');
        let fullAddress = data.address;
        let extraAddress = ''; 
        
        if (data.addressType === 'R') {
          if (data.bname !== '') {
            extraAddress += data.bname;
          }
          if (data.buildingName !== '') {
            extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
          }
          fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }
        // console.log(data)
        onSetAddress(fullAddress);
        onSetPostCode(data.zonecode);
        onClose();
    }
 
    const postCodeStyle = {
        display: "block",
        position: "absolute",
        top: "10%",
        width: "600px",
        height: "600px",
        padding: "7px",
        zIndex: "9999",
      };
 
    return(
        <div>
            <DaumPostcode style={postCodeStyle} onComplete={handlePostCode} />
            {/* <button type='button' onClick={() => {onClose()}} className='postCode_btn'>{t('common.close')}</button> */}
        </div>
    )
}
 
export default PopupPostCode;