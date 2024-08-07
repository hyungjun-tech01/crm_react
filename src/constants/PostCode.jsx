import React from 'react';
import DaumPostcode from "react-daum-postcode";

const PopupPostCode = (props) => {
  const { onSetData, onClose } = props;
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
    onSetData({ address: fullAddress, zip: data.zonecode });
    onClose();
  }

  const postCodeStyle = {
    display: "block",
    position: "absolute",
    top: "10%",
    width: "600px",
    height: "600px",
    border: "1.4px solid #aaaaaa",
    zIndex: "9999",
  };

  return (
    <div>
      <DaumPostcode style={postCodeStyle} onComplete={handlePostCode} />
      {/* <button type='button' onClick={() => {onClose()}} className='postCode_btn'>{t('common.close')}</button> */}
    </div>
  )
}

export default PopupPostCode;