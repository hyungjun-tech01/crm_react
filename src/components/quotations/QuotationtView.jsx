import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil';
import { PDFViewer, Font, Page, Text, View, Document, StyleSheet, Svg, Rect, Image, Path } from '@react-pdf/renderer';
import { atomCurrentQuotation, defaultQuotation } from "../../atoms/atoms";
import { atomAllUsers } from '../../atoms/atomsUser';
import { quotationExpiry, quotationDelivery, quotationPayment } from '../../repository/quotation';
import NotoSansRegular from "../../fonts/NotoSansKR-Regular.ttf";
import NotoSansBold from "../../fonts/NotoSansKR-Bold.ttf";
import NotoSansLight from "../../fonts/NotoSansKR-Light.ttf";
import { ConvertCurrency } from '../../constants/functions';
<<<<<<< HEAD
import Stamp from "../../files/company_stamp.jpg";
=======
import Stamp from '../../files/company_stamp.jpg';
>>>>>>> c5a7b4da54db9ae0e9a55e38f8fe9737f9e77db7

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

const ConvCurrencyMark = (currency) => {
    if(typeof currency !== 'string')
    {
        // console.log('\t[ ConvCurrencyMark ] Wrong Type : ', typeof currency);
        return;
    } 

    switch(currency)
    {
        case 'KRW':
            return String.fromCharCode(0x20A9);
        case 'USD':
            return 'US$';
        default:
            return '';
    }
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

const common_items = [
    "#. DX TOOL 제공 : 노드데이타 개발 솔리드웍스 속성편집기(\\2,000,000)",
    "- 설치 매뉴얼 제공",
    "- 차기 버전 Upgrade 1회",
    "- On/Off Line 기술 지원 (전화 및 원격지원, 방문 기술지원)",
    "- nodeDATA 교육 : On/Off Line 참여",
    "- Disable Request Service 제공 (라이선스 재 활성)",
    "- SOLIDWORKS CAM Standard (1,820,000원) : 유지보수 기간내 사용 가능",
    "  (SOLIDWORKS Std 이상 구매시)",
    "- SOLIDWORKS Visualize Standard (2,527,200원) : 유지보수 기간내 사용 가능",
    "   (SOLIDWORKS Pro 이상 구매시)",
];

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


const QuotationView = () => {
    const currentQuotation = useRecoilValue(atomCurrentQuotation);
    const allUsers = useRecoilValue(atomAllUsers);
    const [ quotationContents, setQuotationContents ] = useState([]);
    const [ quotationTables, setQuotationTables ] = useState([]);
    const [ viewSetting, setViewSetting ] = useState({});
    const [ salesRespInfo, setSalesRespInfo ] = useState({});
    const [ quotationCondition, setQuotationCondition ] = useState({});

    useEffect(() => {
        if(currentQuotation && currentQuotation !== defaultQuotation){
            const tempContents = JSON.parse(currentQuotation.quotation_contents);
            if(tempContents && Array.isArray(tempContents)){
                setQuotationContents(tempContents);
            };

            let tableHeaderInfos = [];
            let tempHeaderIndices = [];
            let tempTableWidthObject = {};
            let tempTotalTableWidth = 0;
            const tempTables = currentQuotation.quotation_table.split('|');
            const temp_count = Math.floor(tempTables.length / 3);
            for(let i=0; i<temp_count; i++)
            {
                const tempWidth = Number(tempTables[3*i+2]);
                if(!isNaN(tempWidth) && tempWidth !== 0){
                    tempTotalTableWidth += tempWidth;
                    tempHeaderIndices.push(tempTables[3*i]);
                    tempTableWidthObject[tempTables[3*i]] = [tempTables[3*i+1], tempWidth];
                };
            };
            tempHeaderIndices.forEach(index => {
                if(index === '10') return;

                const tempObject = tempTableWidthObject[index];
                let tableWidthPercent = 0;
                if(index === '5') {
                    const tempObject10 = tempTableWidthObject['10'];
                    if(tempObject10) {
                        tableWidthPercent = Math.round((
                            tempObject.at(1) + tempObject10.at(1)) / tempTotalTableWidth * 100);
                    };
                } else {
                    tableWidthPercent = Math.round(tempObject.at(1) / tempTotalTableWidth * 100);
                }
                tableHeaderInfos.push([index, tempObject.at(0), tableWidthPercent.toString()+'%']);
            });
            setQuotationTables(tableHeaderInfos);

            // set Setting ------------------------
            if(Number(currentQuotation.tax_amount) === 0){
                const tempSetting = {
                    vat_included : false,
                };
                setViewSetting(tempSetting);
            };

            // get info of sales representative -----------
            if(currentQuotation.sales_representative){
                const salesman = allUsers.filter(item => item.userName === currentQuotation.sales_representative);
                if(salesman.length > 0){
                    setSalesRespInfo({
                        userID: salesman[0].userId,
                        userName: salesman[0].userName,
                        mobileNumber: salesman[0].mobileNumber,
                    })
                };
            }

            // get info of quotation condition -----------
            // console.log('Check data :', currentQuotation);
            const foundExpiryArray = quotationExpiry.filter(item => item.value === currentQuotation.quotation_expiration_date);
            const tempExpiry = (foundExpiryArray.length > 0) ? foundExpiryArray[0].label : currentQuotation.quotation_expiration_date;
            const foundDeliveryArray = quotationDelivery.filter(item => item.value === currentQuotation.delivery_period);
            const tempDelivery = (foundDeliveryArray.length > 0) ? foundDeliveryArray[0].label : currentQuotation.delivery_period;
            const foundPaymentArray = quotationPayment.filter(item => item.value === currentQuotation.payment_type);
            const tempPayment = (foundPaymentArray.length > 0) ? foundPaymentArray[0].label : currentQuotation.payment_type;
            setQuotationCondition({expiry: tempExpiry, delivery: tempDelivery, payment: tempPayment});
        }
    }, [currentQuotation]);

    return (
        <PDFViewer style={{width: '100%', minHeight: '320px', height: '640px'}}>
            <Document>
                <Page wrap size="A4" style={Styles.body}>
                    {currentQuotation.sales_representative &&
                        <Text style={{fontSize: 10, marginBottom: 20, textAlign: 'start', color: 'grey', fontFamily: 'Noto Sans',}} fixed>
                            담당자: 노드데이타 {salesRespInfo.userName} {salesRespInfo.mobileNumber} {salesRespInfo.userID}
                        </Text>
                    }
                    {/*----- Header ---------------------------------------------*/}
                    <View style={{width: '100%', flexGrow: 0}} >
                        <Text style={{fontSize:10,textAlign:'right',marginBottom:20,fontFamily:'Noto Sans'}}>
                            견적번호: {currentQuotation.quotation_number}
                        </Text>
                        <Text style={{fontSize: 24,fontWeight: 'bold',marginBottom: 30,textAlign: 'center',textDecoration: 'underline',fontFamily: 'Noto Sans'}}>
                            {currentQuotation.quotation_type}
                        </Text>
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
                                <Image x="130" y="30" style={{width: 40, height: 40}} src={Stamp} debug={true} />
                                <Rect x="0" y="0" width="25" height="160" stroke="black" fill="#cccccc" />
                                <Path d="M25 0 H300 V160 H25 M100 0 V160 M25 20 H300 M25 40 H300 M25 60 H300 M25 90 H300 M25 120 H300 M25 140 H300 " stroke='black' fill='none'/>
                                <Text x="8" y="50" style={Styles.text}>공</Text>
                                <Text x="8" y="80" style={Styles.text}>급</Text>
                                <Text x="8" y="110" style={Styles.text}>자</Text>

                                <Text x="43" y="15" style={Styles.supplierText}>등록번호</Text><Text x="110" y="15" style={Styles.supplierText}>106-86-26016</Text>
                                <Text x="53" y="35" style={Styles.supplierText}>상호</Text><Text x="110" y="35" style={Styles.supplierText}>노드데이타</Text>
                                <Text x="43" y="55" style={Styles.supplierText}>대표자명</Text><Text x="110" y="55" style={Styles.supplierText}>김신일</Text>
                                <Text x="53" y="80" style={Styles.supplierText}>주소</Text><Text x="110" y="73" style={Styles.supplierText}>서울특별시 금천구 가산디지털 1로 128</Text><Text x="110" y="86" style={Styles.supplierText}>1811 (STX V-Tower)</Text>
                                <Text x="41" y="110" style={Styles.supplierText}>업태/종목</Text><Text x="110" y="103" style={Styles.supplierText}>도소매서비스/컴퓨터및주변기기, S/W개발,</Text><Text x="110" y="116" style={Styles.supplierText}>공급, 자문</Text>
                                <Text x="45" y="135" style={Styles.supplierText}>회사전화</Text><Text x="110" y="135" style={Styles.supplierText}>02-595-4450 / 051-517-4450</Text>
                                <Text x="45" y="155" style={Styles.supplierText}>회사팩스</Text><Text x="110" y="155" style={Styles.supplierText}>02-595-4454 / 051-518-4452</Text>
                            </Svg>
                        </View>
                        <Text style={Styles.text}>{currentQuotation.upper_memo}</Text>
                        <View style={{width:'100%',height:20,margin:0,padding:1,borderTop:1,borderLeft:1,borderRight:1,flexGrow:0}}>
                            <Text style={Styles.textBold}>
                                    견적합계: 일금{ConvertKoreanAmount(currentQuotation.total_quotation_amount)}원정
                                    (&#8361;{ConvertCurrency(currentQuotation.total_quotation_amount)})
                                    ({viewSetting.vat_included ? 'VAT포함' : 'VAT별도'})
                            </Text>
                        </View>
                    </View>
                    {/*----- Table ---------------------------------------------*/}
                    <View style={{width:'100%',height:20,margin:0,padding:0,border:1,backgroundColor:"#cccccc",flexDirection:'row',flexGrow:0}} fixed>
                        { quotationTables && quotationTables.map((item, index) => 
                            index !== (quotationTables.length - 1) ? (
                                <View key={item.at(0)} style={{width: item.at(2),margin:0,padding:0,borderRight:1}} >
                                    <Text style={Styles.text}>{item.at(1)}</Text>
                                </View>
                                ) : (
                                <View key={item.at(0)} style={{width: item.at(2),margin:0,padding:0,border:0}} >
                                    <Text style={Styles.text}>{item.at(1)}</Text>
                                </View>)
                        )}
                    </View>
                    { quotationContents.map((content, index) => 
                        <View key={index} style={{width:'100%',margin:0,padding:0,borderRight:1,borderLeft:1,flexDirection:'row',flexGrow: 1}}>
                            { quotationTables && quotationTables.map((item, index) => 
                                index !== (quotationTables.length - 1) ? (
                                    <View key={item.at(0)} wrap style={{width: item.at(2),margin:0,padding:0,borderRight:1}}>
                                        { content[item.at(0)] && <Text style={Styles.text}>{content[item.at(0)]}</Text>}
                                        { item.at(0) === '5' && content['998'] && ConvertComment(content['998'])}
                                    </View>
                                ) : (
                                    <View key={item.at(0)} wrap style={{width: item.at(2),margin:0,padding:0,border:0}}>
                                        { content[item.at(0)] && <Text style={Styles.text}>{ConvertCurrency(content[item.at(0)])}</Text>}
                                    </View>
                                )
                            )}
                        </View>
                    )}
                    {quotationTables.length > 0 &&
                        <View style={{width:'100%',margin:0,padding:0,border:1,flexDirection:'column',flexGrow:0}}>
                            <View style={{width:'100%',height:24,margin:0,padding:0,border:0,flexDirection:'row',flexGrow:0}}>
                                <View style={{margin:0,padding:0,borderRight:1,flexGrow:1}}>
                                    <Text style={Styles.text}>{}</Text>
                                </View>
                                
                                <View key={quotationTables.at(-2).at(0)} style={{width: quotationTables.at(-2).at(2),margin:0,padding:0,borderRight:1,borderBottom:1,flexGrow:0, backgroundColor: '#aaaaaa'}} >
                                    <Text style={Styles.text}>중간합계</Text>
                                </View>
                                <View key={quotationTables.at(-1).at(0)} style={{width: quotationTables.at(-1).at(2),margin:0,padding:0,borderBottom:1,flexGrow:0}} >
                                    <Text style={Styles.text}>{ConvertCurrency(currentQuotation.sub_total_amount)}</Text>
                                </View>
                            </View>
                            { viewSetting.vat_included &&
                                <View style={{width:'100%',height:24,margin:0,padding:0,border:0,flexDirection:'row',flexGrow:0}}>
                                    <View style={{margin:0,padding:0,borderRight:1,flexGrow:1}}>
                                        <Text style={Styles.text}>{}</Text>
                                    </View>
                                    <View key={quotationTables.at(-2).at(0)} style={{width: quotationTables.at(-2).at(2),margin:0,padding:0,borderRight:1,borderBottom:1,flexGrow:0,backgroundColor: '#aaaaaa'}} >
                                        <Text style={Styles.text}>부가세합계</Text>
                                    </View>
                                    <View key={quotationTables.at(-1).at(0)} style={{width: quotationTables.at(-1).at(2),margin:0,padding:0,borderBottom:1,flexGrow:0}} >
                                        <Text style={Styles.text}>{ConvertCurrency(currentQuotation.tax_amount)}</Text>
                                    </View>
                                </View>}
                            <View style={{width:'100%',height:24,margin:0,padding:0,border:0,flexDirection:'row',flexGrow:0}}>
                                <View style={{margin:0,padding:0,borderRight:1,flexGrow:1}}>
                                    <Text style={Styles.text}>{}</Text>
                                </View>
                                { quotationTables.length > 0 && <>
                                    <View key={quotationTables.at(-2).at(0)} style={{width: quotationTables.at(-2).at(2),margin:0,padding:0,borderRight:1,flexGrow:0, backgroundColor: '#aaaaaa'}} >
                                        <Text style={Styles.text}>견적합계</Text>
                                    </View>
                                    <View key={quotationTables.at(-1).at(0)} style={{width: quotationTables.at(-1).at(2),margin:0,padding:0,flexGrow:0}} >
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