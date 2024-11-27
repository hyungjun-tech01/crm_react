import React, { useEffect, useState } from 'react'
import { useCookies } from "react-cookie";
import { useRecoilValue } from 'recoil';
import { PDFViewer, Font, Page, Text, View, Document, StyleSheet, Svg, Rect, Image, Path } from '@react-pdf/renderer';
import { atomCurrentQuotation, defaultQuotation } from "../../atoms/atoms";
import { atomAllUsers, atomAccountInfo } from '../../atoms/atomsUser';
import { QuotationExpiry, QuotationDelivery, QuotationPayment, QuotationContentItems } from '../../repository/quotation';
import NotoSansRegular from "../../fonts/NotoSansKR-Regular.ttf";
import NotoSansBold from "../../fonts/NotoSansKR-Bold.ttf";
import NotoSansLight from "../../fonts/NotoSansKR-Light.ttf";
import { ConvertCurrency } from '../../constants/functions';
import Stamp from "../../files/company_stamp.jpg";
import Logo from "../../files/company_logo.jpg";

const ConvStrNumToKor = (digit) => {
    switch(digit)
    {
        case '1':
            return '일';
        case '2':
            return '이';
        case '3':
            return '삼';
        case '4':
            return '사';
        case '5':
            return '오';
        case '6':
            return '육';
        case '7':
            return '칠';
        case '8':
            return '팔';
        case '9':
            return '구';
        default:
            return '';
    }
};

const ConvertKoreanAmount = (amount) => {
    let temp_number = null;
    if(typeof amount === 'string'){
        temp_number = Number(amount);
    } else if(typeof amount === 'number')
    {
        temp_number = amount;
    };
    if(isNaN(temp_number)) {
        // console.log('\t[ ConvertKoreanAmount ] Wrong input');
        return "";
    };

    const input = temp_number.toString();
    let ret = "";
    let count = 0;
    for(let i = input.length - 1, m = 0; i >= 0; i--, m++){
        
        let temp_ret = "";
        const remainder = m % 4;

        if(input.at(i) !== '0'){
            temp_ret = ConvStrNumToKor(input.at(i));
            if(remainder === 1){
                temp_ret += '십';
            } else if(remainder === 2){
                temp_ret += '백';
            } else if(remainder === 3){
                temp_ret += '천';
            }
        };
        if(remainder === 0){
            if(count === 1){
                temp_ret += "만";
            } else if(count === 2){
                temp_ret += "억";
            };
            count++;
        };
        
        ret = temp_ret + ret;
    };
    return ret;
};

const ConvertComment = (comment) => {
    const splitted = comment.split('\r\n');
    return (
        <>
            { splitted.map((value, index) => 
                <Text key={index} style={Styles.textComment} >{value}</Text>
            )}
        </>
    );
};

// Create styles
const Styles = StyleSheet.create({
    body:{
        paddingTop: 25,
        paddingBottom: 35,
        paddingHorizontal: 20,
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        fontSize: 10,
        marginBottom: 20,
        textAlign: 'start',
        color: 'grey',
        fontFamily: 'Noto Sans',
    },
    type:{
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        textDecoration: 'underline',
        fontFamily: 'Noto Sans'
    },
    text:{
        marginHorizontal: 2,
        marginVertical: 0,
        fontSize: 10,
        textAlign: 'justify',
        textWrap: 'wrap',
        fontFamily: 'Noto Sans'
    },
    textBold:{
        marginHorizontal: 2,
        marginVertical: 0,
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'justify',
        textWrap: 'wrap',
        fontFamily: 'Noto Sans'
    },
    textComment:{
        marginHorizontal: 2,
        marginVertical: 0,
        fontSize: 9,
        fontWeight: 'light',
        textAlign: 'justify',
        textWrap: 'wrap',
        fontFamily: 'Noto Sans'
    },
    supplierRow:{
        margin: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'start',
    },
    supplierSubject:{
        width: 75,
        height: '100%',
        margin: 0,
        paddingLeft: 5,
        borderRight: 1,
    },
    supplierContent:{
        width: '100%',
        height: '100%',
        margin:0,
        paddingLeft: 5,
        border: 0,
    },
    supplierText:{
        margin: 0,
        paddingTop: 2,
        fontSize: 10,
        fontFamily: 'Noto Sans',
    },
});

Font.register({
    family: 'Noto Sans',
    fonts: [
        { src: NotoSansRegular },
        { src: NotoSansBold, fontWeight: 'bold' },
        { src: NotoSansLight, fontWeight: 'light' },
    ]
});


const QuotationView = ({columns, contents, viewData}) => {
    const [ cookies ] = useCookies(["myLationCrmAccountInfo"]);
    const currentQuotation = useRecoilValue(atomCurrentQuotation);
    const allUsers = useRecoilValue(atomAllUsers);
    const accountInfo = useRecoilValue(atomAccountInfo);
    const [ salesRespInfo, setSalesRespInfo ] = useState({});
    const [ quotationCondition, setQuotationCondition ] = useState({});
    const [ accountAddress, setAccountAddress ] = useState([]);
    const [ accountBusinessInfo, setBusinessInfo ] = useState([]);

    useEffect(() => {
        if(currentQuotation && currentQuotation !== defaultQuotation){
            // get info of sales representative -----------
            if(viewData.sales_representative !== ''){
                const salesman = allUsers.filter(item => item.userName === viewData.sales_representative);
                if(salesman.length > 0){
                    setSalesRespInfo({
                        userID: salesman[0].userId,
                        userName: salesman[0].userName,
                        mobileNumber: salesman[0].mobileNumber,
                    })
                };
            }

            // get info of quotation condition -----------
            const foundExpiryArray = QuotationExpiry.filter(item => item.value === viewData.quotation_expiration_date);
            const tempExpiry = (foundExpiryArray.length > 0) ? foundExpiryArray[0].label : viewData.quotation_expiration_date;
            const foundDeliveryArray = QuotationDelivery.filter(item => item.value === viewData.delivery_period);
            const tempDelivery = (foundDeliveryArray.length > 0) ? foundDeliveryArray[0].label : viewData.delivery_period;
            const foundPaymentArray = QuotationPayment.filter(item => item.value === viewData.payment_type);
            const tempPayment = (foundPaymentArray.length > 0) ? foundPaymentArray[0].label : viewData.payment_type;
            const foundTaxIncluded = viewData.tax_amount === 0 ? false : true;
            setQuotationCondition({expiry: tempExpiry, delivery: tempDelivery, payment: tempPayment, tax_included: foundTaxIncluded});

            // set address ---------------------------
            let companyAddress = '';
            if(!!cookies.myLationCrmAccountInfo && !!cookies.myLationCrmAccountInfo.company_address) {
                companyAddress = cookies.myLationCrmAccountInfo.company_address;
            } else {
                companyAddress = currentQuotation.company_address;
            };
            if(companyAddress !== ''){
                const maxTextLength = 25
                ;
                if(companyAddress.length > maxTextLength) {
                    let count = 0;
                    let tempAddress = [];
                    let tempAddressPart = '';
                    const splittedAddress = companyAddress.split(' ');
                    while(count < splittedAddress.length) {
                        const checkAddress = tempAddressPart + ' ' + splittedAddress[count];
                        if(checkAddress.length > maxTextLength) {
                            tempAddress.push(tempAddressPart);
                            tempAddressPart = splittedAddress[count];
                        } else {
                            tempAddressPart = checkAddress;
                        }
                        count++;
                    };
                    if(tempAddressPart !== '') {
                        tempAddress.push(tempAddressPart);
                    };
                    setAccountAddress(tempAddress);
                } else {
                    setAccountAddress([companyAddress]);
                }
            };

            // set business item -----------------------------
            let businessInfo = '';
            if(!!cookies.myLationCrmAccountInfo && !!cookies.myLationCrmAccountInfo.business_type && !!cookies.myLationCrmAccountInfo.business_item) {
                businessInfo = cookies.myLationCrmAccountInfo.business_type + ' / ' + cookies.myLationCrmAccountInfo.business_item;
            } else {
                businessInfo = currentQuotation.business_type + ' / ' + currentQuotation.business_item;
            };
            if(businessInfo !== ''){
                const maxTextLength = 25
                ;
                if(businessInfo.length > maxTextLength) {
                    let count = 0;
                    let tempBusinessInfo = [];
                    let tempBusinessInfoPart = '';
                    const splittedAddress = businessInfo.split(' ');
                    while(count < splittedAddress.length) {
                        const checkAddress = tempBusinessInfoPart + ' ' + splittedAddress[count];
                        if(checkAddress.length > maxTextLength) {
                            tempBusinessInfo.push(tempBusinessInfoPart);
                            tempBusinessInfoPart = splittedAddress[count];
                        } else {
                            tempBusinessInfoPart = checkAddress;
                        }
                        count++;
                    };
                    if(tempBusinessInfoPart !== '') {
                        tempBusinessInfo.push(tempBusinessInfoPart);
                    };
                    setBusinessInfo(tempBusinessInfo);
                } else {
                    setBusinessInfo([businessInfo]);
                }
            };
        }
    }, [ viewData, currentQuotation, cookies.myLationCrmAccountInfo ]);

    return (
        <PDFViewer style={{width: '100%', minHeight: '320px', height: '640px'}}>
            <Document>
                <Page wrap size="A4" style={Styles.body}>
                    {currentQuotation.sales_representative &&
                        <Text style={{fontSize: 10, marginBottom: 20, textAlign: 'start', color: 'grey', fontFamily: 'Noto Sans',}} fixed>
                            담당자: {accountInfo.company_name} {salesRespInfo.userName} ({salesRespInfo.mobileNumber}) {salesRespInfo.userID}
                        </Text>
                    }
                    {/*----- Header ---------------------------------------------*/}
                    <View style={{width: '100%', flexGrow: 0}} >
                        <View style={{width: '100%',height: '20',flexDirection: 'column',flexGrow:0}}>
                            <Text style={{fontSize:10,textAlign:'right',fontFamily:'Noto Sans'}}>
                                견적번호: {currentQuotation.quotation_number}
                            </Text>
                        </View>
                        <Svg width="100%" height="60" viewBox='0 0 555 80' >
                            <Text x="225" y="30" style={{fontSize: 26,fontWeight: 'bold',fontFamily: 'Noto Sans'}}>
                                {currentQuotation.quotation_type}
                            </Text>
                            <Image x="500" y="0" style={{width: 125, height: 66}} src={Logo}/>
                        </Svg>
                        <Text style={{fontSize: 16,textAlign: 'left',textDecoration: 'underline',marginLeft: 20,marginBottom: 10,fontFamily: 'Noto Sans'}}>
                            {currentQuotation.company_name} 귀중
                        </Text>
                        <View style={{marginBottom: 20,padding:0,flexDirection:'row',flexGrow:0}}>
                            <View style={{width:'50%',margin:0,padding:5}}>
                                <Text style={Styles.text}>받으실 분:  {currentQuotation.department} {currentQuotation.lead_name} {currentQuotation.position}</Text>
                                <Text style={Styles.text}>견적 일자:  {new Date(currentQuotation.quotation_date).toLocaleDateString('ko-KR', {year:'numeric', month:'short', day:'numeric'})}</Text>
                                <Text style={Styles.text}>지불 조건:  {quotationCondition.payment}</Text>
                                <Text style={Styles.text}>납품 기간:  {quotationCondition.delivery}</Text>
                                <Text style={Styles.text}>유효 기간:  {quotationCondition.expiry}</Text>
                            </View>
                            <Svg width="300" height="160" viewBox='0 0 300 160' >
                                <Image x="130" y="30" style={{width: 40, height: 40}} src={Stamp} />
                                <Rect x="0" y="0" width="25" height="160" stroke="black" fill="#cccccc" />
                                <Path d="M25 0 H300 V160 H25 M100 0 V160 M25 20 H300 M25 40 H300 M25 60 H300 M25 90 H300 M25 120 H300 M25 140 H300 " stroke='black' fill='none'/>
                                <Text x="8" y="50" style={Styles.text}>공</Text>
                                <Text x="8" y="80" style={Styles.text}>급</Text>
                                <Text x="8" y="110" style={Styles.text}>자</Text>

                                <Text x="43" y="15" style={Styles.supplierText}>등록번호</Text><Text x="110" y="15" style={Styles.supplierText}>{cookies.myLationCrmAccountInfo.business_registration_code}</Text>
                                <Text x="53" y="35" style={Styles.supplierText}>상호</Text><Text x="110" y="35" style={Styles.supplierText}>{cookies.myLationCrmAccountInfo.company_name}</Text>
                                <Text x="43" y="55" style={Styles.supplierText}>대표자명</Text><Text x="110" y="55" style={Styles.supplierText}>{cookies.myLationCrmAccountInfo.ceo_name}</Text>
                                <Text x="53" y="80" style={Styles.supplierText}>주소</Text>
                                { accountAddress.length > 1 ? 
                                    <>
                                        <Text x="110" y="73" style={Styles.supplierText}>{accountAddress.at(0)}</Text>
                                        <Text x="110" y="86" style={Styles.supplierText}>{accountAddress.at(1)}</Text>
                                    </> :
                                        <Text x="110" y="80" style={Styles.supplierText}>{accountAddress.at(0)}</Text>
                                }
                                <Text x="41" y="110" style={Styles.supplierText}>업태/종목</Text>
                                { accountBusinessInfo.length > 1 ?
                                    <>
                                        <Text x="110" y="103" style={Styles.supplierText}>{accountBusinessInfo.at(0)}</Text>
                                        <Text x="110" y="116" style={Styles.supplierText}>{accountBusinessInfo.at(1)}</Text>
                                    </> :
                                        <Text x="110" y="110" style={Styles.supplierText}>{accountBusinessInfo.at(0)}</Text>
                                }
                                <Text x="45" y="135" style={Styles.supplierText}>회사전화</Text><Text x="110" y="135" style={Styles.supplierText}>{cookies.myLationCrmAccountInfo.phone_number}</Text>
                                <Text x="45" y="155" style={Styles.supplierText}>회사팩스</Text><Text x="110" y="155" style={Styles.supplierText}>{cookies.myLationCrmAccountInfo.fax_number}</Text>
                            </Svg>
                        </View>
                        <Text style={Styles.text}>{currentQuotation.upper_memo}</Text>
                        <View style={{width:'100%',height:20,margin:0,padding:1,borderTop:1,borderLeft:1,borderRight:1,flexGrow:0}}>
                            <Text style={Styles.textBold}>
                                    견적합계: 일금{ConvertKoreanAmount(viewData.total_quotation_amount)}원정
                                    ({ConvertCurrency(viewData.total_quotation_amount)})
                                    ({quotationCondition.tax_included ? 'VAT포함' : 'VAT별도'})
                            </Text>
                        </View>
                    </View>
                    {/*----- Table ---------------------------------------------*/}
                    <View style={{width:'100%',height:20,margin:0,padding:0,border:1,backgroundColor:"#cccccc",flexDirection:'row',flexGrow:0}} fixed>
                        { columns && columns.map((column, index) => {
                            if(!QuotationContentItems[column.dataIndex].view) return null;
                            if(index !== (columns.length - 1)) {
                                return (
                                    <View key={column.dataIndex} style={{width: column.viewWidth, margin:0,padding:0,borderRight:1}} >
                                        <Text style={Styles.text}>{column.title}</Text>
                                    </View>
                                )
                            } else {
                                return (
                                    <View key={column.dataIndex} style={{width: column.viewWidth,margin:0,padding:0,border:0}} >
                                        <Text style={Styles.text}>{column.title}</Text>
                                    </View>
                                )
                            }
                        })}
                    </View>
                    { contents.map((content, index) => 
                        <View key={index} style={{width:'100%',margin:0,padding:0,borderRight:1,borderLeft:1,flexDirection:'row',flexGrow: 1}}>
                            { columns && columns.map((item, index) => {
                                if(!QuotationContentItems[item.dataIndex].view) return null;
                                if(index !== (columns.length - 1)) {
                                    return (
                                        <View key={item.dataIndex} wrap style={{width: item.viewWidth,margin:0,padding:0,borderRight:1}}>
                                            { content[item.dataIndex] && <Text style={Styles.text}>{
                                                QuotationContentItems[item.dataIndex].type === 'price'
                                                    ? ConvertCurrency(content[item.dataIndex])
                                                    : content[item.dataIndex]
                                                }</Text>}
                                            { item.dataIndex === '5' && content['998'] && ConvertComment(content['998'])}
                                        </View>
                                    )
                                } else {
                                    return (
                                        <View key={item.dataIndex} wrap style={{width: item.viewWidth,margin:0,padding:0,border:0}}>
                                            { content[item.dataIndex] && <Text style={Styles.text}>{ConvertCurrency(content[item.dataIndex])}</Text>}
                                        </View>
                                    )
                                }
                            })}
                        </View>
                    )}
                    {columns.length > 0 &&
                        <View style={{width:'100%',margin:0,padding:0,border:1,flexDirection:'column',flexGrow:0}}>
                            <View style={{width:'100%',height:24,margin:0,padding:0,border:0,flexDirection:'row',flexGrow:0}}>
                                <View style={{margin:0,padding:0,borderRight:1,flexGrow:1}}>
                                    <Text style={Styles.text}>{}</Text>
                                </View>
                                
                                <View key={columns.at(-2).dataIndex} style={{width: columns.at(-2).viewWidth,margin:0,padding:0,borderRight:1,borderBottom:1,flexGrow:0, backgroundColor: '#aaaaaa'}} >
                                    <Text style={Styles.text}>중간합계</Text>
                                </View>
                                <View key={columns.at(-1).dataIndex} style={{width: columns.at(-1).viewWidth,margin:0,padding:0,borderBottom:1,flexGrow:0}} >
                                    <Text style={Styles.text}>{ConvertCurrency(viewData.sub_total_amount)}</Text>
                                </View>
                            </View>
                            { quotationCondition.tax_included &&
                                <View style={{width:'100%',height:24,margin:0,padding:0,border:0,flexDirection:'row',flexGrow:0}}>
                                    <View style={{margin:0,padding:0,borderRight:1,flexGrow:1}}>
                                        <Text style={Styles.text}>{}</Text>
                                    </View>
                                    <View key={columns.at(-2).dataIndex} style={{width: columns.at(-2).viewWidth,margin:0,padding:0,borderRight:1,borderBottom:1,flexGrow:0,backgroundColor: '#aaaaaa'}} >
                                        <Text style={Styles.text}>부가세합계</Text>
                                    </View>
                                    <View key={columns.at(-1).dataIndex} style={{width: columns.at(-1).viewWidth,margin:0,padding:0,borderBottom:1,flexGrow:0}} >
                                        <Text style={Styles.text}>{ConvertCurrency(currentQuotation.tax_amount)}</Text>
                                    </View>
                                </View>}
                            <View style={{width:'100%',height:24,margin:0,padding:0,border:0,flexDirection:'row',flexGrow:0}}>
                                <View style={{margin:0,padding:0,borderRight:1,flexGrow:1}}>
                                    <Text style={Styles.text}>{}</Text>
                                </View>
                                { columns.length > 0 && <>
                                    <View key={columns.at(-2).dataIndex} style={{width: columns.at(-2).viewWidth,margin:0,padding:0,borderRight:1,flexGrow:0, backgroundColor: '#aaaaaa'}} debug>
                                        <Text style={Styles.text}>견적합계</Text>
                                    </View>
                                    <View key={columns.at(-1).dataIndex} style={{width: columns.at(-1).viewWidth,margin:0,padding:0,flexGrow:0}} debug>
                                        <Text style={Styles.text}>{ConvertCurrency(currentQuotation.total_quotation_amount)}</Text>
                                    </View>
                                </>}
                            </View>
                        </View>
                    }
                    <View style={{width:'100%',height:25,margin:0,padding:0,borderLeft:1,borderRight:1,flexDirection:'row',flexGrow:0}}>
                        <View style={{height:'100%',margin:0,padding:0,flexGrow:1}}>
                            <Text style={Styles.text}>{currentQuotation.lower_memo}</Text>
                        </View>
                    </View>
                    <View style={{width:'100%',height:1,margin:0,padding:0,borderTop:1,flexGrow:0}} fixed>
                        {}
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    );
};

export default QuotationView;