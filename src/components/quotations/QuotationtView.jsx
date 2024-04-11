import React, { useCallback, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil';
import { PDFViewer } from '@react-pdf/renderer';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { atomCurrentQuotation, defaultQuotation } from "../../atoms/atoms";
import NotoSansRegular from "../../fonts/NotoSansKR-Regular.ttf";
import NotoSansBold from "../../fonts/NotoSansKR-Bold.ttf";
import NotoSansLight from "../../fonts/NotoSansKR-Light.ttf";

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
        console.log('\t[ ConvertKoreanAmount ] Wrong input');
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
    // console.log('\t[ ConvertKoreanAmount ] output : ', ret);
    return ret;
};

const ConverTextAmount = (amount) => {
    let input = null;
    if(typeof amount === 'number'){
        input = amount;
    } else if(typeof amount === 'string')
    {
        input = amount.toString();
    };
    
    let ret = "";
    for(let i = input.length - 1, m = 0; i >= 0; i--, m++)
    {
        let temp_ret = input.at(i);
        if(m !==0 && m % 3 === 0){
            temp_ret += ",";
        };
        ret = temp_ret + ret;
    };
    // console.log('\t[ ConverTextAmount ] output : ', ret);
    return ret;
};

const ConvCurrencyMark = (currency) => {
    if(typeof currency !== 'string')
    {
        console.log('\t[ ConvCurrencyMark ] Wrong Type : ', typeof currency);
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
}

const sw_pro_items = [
    "Professional",
    "- SOLIDWORKS Design Software (Part, Assembly, Drawing)",
    "- Sheetmetal Design Module (판금)",
    "- Surface Design Module (곡면 모델링)",
    "- Simulation XPress (단품 구조해석)",
    "- Flow XPress (유동의 흐름 Viewing)",
    "- DFM XPress (가공 시 에러 발생 부분 분석)",
    "- DriveWorks XPress (유사한 제품 시리즈 생성)",
    "- SOLIDWORKS eDrawings",
    "- SOLIDWORKS Utilities (데이타 비교)",
    "- FeatureWorks (작업 이력 생성)",
    "- 3D 파단도",
    "- SOLIDWORKS eDrawings Professional",
    "- SOLIDWORKS Toolbox (라이브러리)",
    "- PhotoView360 (실사 이미지 제작)",
    "- Task Scheduler (작업 스케줄러)",
    "- Design Checker (도면 비교 분석)",
    "- SOLIDWORKS PDM Standard (설계 데이터 관리 프로그램)",
    "- TolAnalyst (공차해석)",
    "- SOLIDWORKS ScadTo3D (3D 스캔data를 3D 파일로 변환)",
    "- SOLIDWORKS Visualize Standard (Rendering_이미지)",
    "- CircuitWorks (ECAD 데이타 호환)",
    "- Costing (제품 원가 계산)",
];

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
const pdfStyles = StyleSheet.create({
    body: {
        paddingTop: 25,
        paddingBottom: 35,
        paddingHorizontal: 20,
    },
    type: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        textDecoration: 'underline',
        fontFamily: 'Noto Sans'
    },
    text: {
        marginHorizontal: 2,
        marginVertical: 0,
        fontSize: 10,
        textAlign: 'justify',
        textWrap: 'wrap',
        fontFamily: 'Noto Sans'
    },
    textBold: {
        marginHorizontal: 2,
        marginVertical: 0,
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'justify',
        textWrap: 'wrap',
        fontFamily: 'Noto Sans'
    },
    textCenter: {
        marginHorizontal: 2,
        marginVertical: 0,
        fontSize: 10,
        textAlign: 'center',
        textWrap: 'wrap',
        fontFamily: 'Noto Sans'
    },
    textComment: {
        marginHorizontal: 2,
        marginVertical: 0,
        fontSize: 9,
        fontWeight: 'light',
        textAlign: 'justify',
        textWrap: 'wrap',
        fontFamily: 'Noto Sans'
    },
    image: {
        marginVertical: 15,
        marginHorizontal: 100,
    },
    header: {
        fontSize: 12,
        marginBottom: 20,
        textAlign: 'left',
        color: 'grey',
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 12,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey',
    },
    supplierCell:{
        minHeight: 20,
        margin: 0,
        padding: 0,
        flexDirection: 'row',
    },
    supplierSubject: {
        width: 75,
        margin: 0,
        paddingHorizontal: 5,
        paddingVertical: 0,
        borderRight: 1,
        flexGrow: 0,
    },
    supplierContent: {
        margin:0,
        paddingHorizontal: 5,
        paddingVertical: 0,
        border: 0,
        flexGrow: 1,
    },
    supplierText: {
        marginHorizontal: 2,
        marginVertical: 0,
        fontSize: 10,
        textAlign: 'start',
        textWrap: 'wrap',
        fontFamily: 'Noto Sans'
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
    const [ quotationContents, setQuotationContents ] = useState([]);

    useEffect(() => {
        console.log('Load QuotationView');
        if(currentQuotation && currentQuotation !== defaultQuotation){
            console.log('- Total amount : ', currentQuotation.total_quotation_amount);
            console.log('- Currency : ', currentQuotation.currency);
            const tempContents = JSON.parse(currentQuotation.quotation_contents);
            if(tempContents && Array.isArray(tempContents)){
                setQuotationContents(tempContents);
            };
        }
    }, [currentQuotation]);

    return (
        <PDFViewer style={{width: '100%', minHeight: '320px', height: '640px'}}>
            <Document>
                <Page wrap size="A4" style={pdfStyles.body}>
                    {currentQuotation.sales_representative &&
                        <Text style={pdfStyles.header} fixed>{currentQuotation.sales_representative}</Text>
                    }
                    <Text style={{fontSize:10,textAlign:'right',marginBottom:20,fontFamily:'Noto Sans'}}>
                        견적번호: {currentQuotation.quotation_number}
                    </Text>
                    <Text style={{fontSize: 24,fontWeight: 'bold',marginBottom: 30,textAlign: 'center',textDecoration: 'underline',fontFamily: 'Noto Sans'}}>
                        {currentQuotation.quotation_type}
                    </Text>
                    <Text style={{fontSize: 16,textAlign: 'left',textDecoration: 'underline',marginLeft: 20,marginBottom: 10,fontFamily: 'Noto Sans'}}>
                        {currentQuotation.company_name} 귀중
                    </Text>
                    <View style={{marginBottom: 20, padding: 0, flexDirection: 'row'}}>
                        <View style={{margin: 0, padding: 5, width:'50%', flewGrow: 1}}>
                            <Text style={pdfStyles.text}>받으실 분:  {currentQuotation.department} {currentQuotation.lead_name} {currentQuotation.position}</Text>
                            <Text style={pdfStyles.text}>견적 일자:  {new Date(currentQuotation.quotation_date).toLocaleDateString('ko-KR', {year:'numeric', month:'short', day:'numeric'})}</Text>
                            <Text style={pdfStyles.text}>지불 조건:  {currentQuotation.payment_type}</Text>
                            <Text style={pdfStyles.text}>납품 기간:  {currentQuotation.delivery_period}</Text>
                            <Text style={pdfStyles.text}>유효 기간:  {currentQuotation.quotation_expiration_date}</Text>
                        </View>
                        <View style={{margin: 0, padding: 0, width:'50%', border: 1,flexGrow:1,alignContent:'center',alignItems:'stretch',flexDirection: 'row'}}>
                            <View style={{width:20,margin:0,backgroundColor:'#cccccc',borderRight:1,flexGrow:0,flexDirection:'column',justifyContent:'space-around'}}>
                                <Text style={pdfStyles.text}>공</Text>
                                <Text style={pdfStyles.text}>급</Text>
                                <Text style={pdfStyles.text}>자</Text>
                            </View>
                            <View style={{margin: 0, border: 0,flexGrow:1, flexDirection: 'column'}}>
                                <View style={[pdfStyles.supplierCell,{flexGrow:0,borderBottom:1}]}>
                                    <View style={pdfStyles.supplierSubject}>
                                        <Text style={pdfStyles.supplierText}>등록번호</Text>
                                    </View>
                                    <View style={pdfStyles.supplierContent}>
                                        <Text style={pdfStyles.supplierText}>106-86-26016</Text>
                                    </View>
                                </View>
                                <View style={[pdfStyles.supplierCell,{flexGrow:0,borderBottom:1}]}>
                                    <View style={pdfStyles.supplierSubject}>
                                        <Text style={pdfStyles.supplierText}>상호</Text>
                                    </View>
                                    <View style={pdfStyles.supplierContent}>
                                        <Text style={pdfStyles.supplierText}>노드데이타</Text>
                                    </View>
                                </View>
                                <View style={[pdfStyles.supplierCell,{flexGrow:0,borderBottom:1}]}>
                                    <View style={pdfStyles.supplierSubject}>
                                        <Text style={pdfStyles.supplierText}>대표자명</Text>
                                    </View>
                                    <View style={pdfStyles.supplierContent}>
                                        <Text style={pdfStyles.supplierText}>김신일</Text>
                                    </View>
                                </View>
                                <View style={[pdfStyles.supplierCell,{flexGrow:1,borderBottom:1}]}>
                                    <View style={pdfStyles.supplierSubject}>
                                        <Text style={pdfStyles.supplierText}>주소</Text>
                                    </View>
                                    <View style={pdfStyles.supplierContent}>
                                        <Text style={pdfStyles.supplierText}>서울특별시 금천구 가산디지털 1로 128 1811 (STX V-Tower)</Text>
                                    </View>
                                </View>
                                <View style={[pdfStyles.supplierCell,{flexGrow:1,borderBottom:1}]}>
                                    <View style={pdfStyles.supplierSubject}>
                                        <Text style={pdfStyles.supplierText}>업태/종목</Text>
                                    </View>
                                    <View style={pdfStyles.supplierContent}>
                                        <Text style={pdfStyles.supplierText}>도소매서비스/컴퓨터및주변기기,S/W개발,공급,자문</Text>
                                    </View>
                                </View>
                                <View style={[pdfStyles.supplierCell,{flexGrow:0,borderBottom:1}]}>
                                    <View style={pdfStyles.supplierSubject}>
                                        <Text style={pdfStyles.supplierText}>회사전화</Text>
                                    </View>
                                    <View style={pdfStyles.supplierContent}>
                                        <Text style={pdfStyles.supplierText}>02-595-4450 / 051-517-4450</Text>
                                    </View>
                                </View>
                                <View style={[pdfStyles.supplierCell,{flexGrow:0,border:0}]}>
                                    <View style={pdfStyles.supplierSubject}>
                                        <Text style={pdfStyles.supplierText}>회사팩스</Text>
                                    </View>
                                    <View style={pdfStyles.supplierContent}>
                                        <Text style={pdfStyles.supplierText}>02-595-4454 / 051-518-4452</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{margin: 0, padding: 0}}>
                        <Text style={pdfStyles.text}>{currentQuotation.upper_memo}</Text>
                        <View style={{width: '100%',height: '100%',margin: 0,padding: 0,border: 1, flexDirection: 'column'}}>
                            <View style={{width:'100%',height:20,margin:0,padding:1, border: 0,flexGrow:0}}>
                                <Text style={pdfStyles.textBold}>
                                     견적합계: 일금{ConvertKoreanAmount(currentQuotation.total_quotation_amount)}원정
                                     ({ConvCurrencyMark(currentQuotation.currency)}{ConverTextAmount(currentQuotation.total_quotation_amount)})(VAT별도)
                                </Text>
                            </View>
                            <View style={{width:'100%',height:20,margin:0,padding:0,borderBottom:1,borderTop:1,backgroundColor:"#cccccc",flexDirection:'row',flexGrow:0}} fixed>
                                <View style={{width: 30, height:'100%',margin:0,padding:0,borderRight:1,flexGrow:0}} fixed>
                                    <Text style={pdfStyles.textCenter} fixed>No</Text>
                                </View>
                                <View style={{height:'100%',margin:0,padding:0,borderRight:1,flexGrow:1}} fixed>
                                    <Text style={pdfStyles.textCenter} fixed>품목</Text>
                                </View>
                                <View style={{width: 40, height:'100%',margin:0,padding:0,borderRight:1,flexGrow:0}} fixed>
                                    <Text style={pdfStyles.textCenter} fixed>수량</Text>
                                </View>
                                <View style={{width: 60, height:'100%',margin:0,padding:0,borderRight:1,flexGrow:0}} fixed>
                                    <Text style={pdfStyles.textCenter} fixed>소비자가</Text>
                                </View>
                                <View style={{width: 60, height:'100%',margin:0,padding:0,borderRight:1,flexGrow:0}} fixed>
                                    <Text style={pdfStyles.textCenter} fixed>견적단가</Text>
                                </View>
                                <View style={{width: 60, height:'100%',margin:0,padding:0,flexGrow:0}} fixed>
                                    <Text style={pdfStyles.textCenter} fixed>견적금액</Text>
                                </View>
                            </View>
                            <View wrap={false} style={{width:'100%',margin:0,padding:0,border:0,alignItems:'stretch',alignContent:'space-between',flexDirection:'column',flexGrow:1}}>
                                { quotationContents.map((content, index) => 
                                    <View key={index} style={{width:'100%',margin:0,padding:0,border:0,flexDirection:'row',flexGrow: 1}}>
                                        <View style={{width: 30, margin:0,padding:0,borderRight:1,flexGrow:0}}>
                                            <Text style={pdfStyles.textCenter}>{index + 1}</Text>
                                        </View>
                                        <View style={{margin:0,padding:0,borderRight:1,flexGrow:1}}>
                                            <Text style={pdfStyles.text}>{content["5"]}</Text>
                                            { content["5"] && content["5"].includes("Professional") &&
                                                sw_pro_items.map((item, index) => <Text key={index} style={pdfStyles.textComment}>{item}</Text>)}
                                        </View>
                                        <View style={{width: 40,margin:0,padding:0,borderRight:1,flexGrow:0}}>
                                            <Text style={pdfStyles.text}>{}</Text>
                                        </View>
                                        <View style={{width: 60,margin:0,padding:0,borderRight:1,flexGrow:0}}>
                                            <Text style={pdfStyles.textCenter}>{}</Text>
                                        </View>
                                        <View style={{width: 60,margin:0,padding:0,borderRight:1,flexGrow:0}}>
                                            <Text style={pdfStyles.textBold}>{content["18"]}</Text>
                                        </View>
                                        <View style={{width: 60,margin:0,padding:0,flexGrow:0}}>
                                            <Text style={pdfStyles.textBold}>{content["18"]}</Text>
                                        </View>
                                    </View>
                                )}
                                {true && <View style={{width:'100%',margin:0,padding:0,borderBottom:1,flexDirection:'row',alignItems:'stretch',alignContent:'start'}}>
                                        <View style={{width: 30, height:'100%',margin:0,padding:0,borderRight:1,flexGrow:0}}>
                                            <Text style={pdfStyles.textCenter}></Text>
                                        </View>
                                        <View style={{height:'100%',margin:0,padding:0,borderRight:1,flexGrow:1}}>
                                            <Text style={{marginHorizontal:2,marginVertical:0,fontSize:10,fontWeight:'bold',textAlign:'justify',textWrap:'wrap',fontFamily:'Noto Sans'}}>
                                                +++ 상기 공통 사항 +++
                                            </Text>
                                            {common_items.map(item => <Text style={pdfStyles.textComment}>{item}</Text>)}
                                        </View>
                                        <View style={{width: 40, height:'100%',margin:0,padding:0,borderRight:1,flexGrow:0}}>
                                            <Text style={pdfStyles.text}>{}</Text>
                                        </View>
                                        <View style={{width: 60, height:'100%',margin:0,padding:0,borderRight:1,flexGrow:0}}>
                                            <Text style={pdfStyles.textCenter}>{}</Text>
                                        </View>
                                        <View style={{width: 60, height:'100%',margin:0,padding:0,borderRight:1,flexGrow:0}}>
                                            <Text style={pdfStyles.ttextCenterext}>{}</Text>
                                        </View>
                                        <View style={{width: 60, height:'100%',margin:0,padding:0,flexGrow:1,flexGrow:0}}>
                                            <Text style={pdfStyles.textCenter}>{}</Text>
                                        </View>
                                    </View>
                                }
                            </View>
                            <View style={{width:'100%',height:40,margin:0,padding:0,border:0,flexDirection:'row',flexGrow:0}}>
                                <View style={{height:'100%',margin:0,padding:0,borderRight:1,flexGrow:1}}>
                                <Text style={pdfStyles.textCenter}>{}</Text>
                                </View>
                                <View style={{width: 120, height:'100%',margin:0,padding:0,borderRight:1,flexGrow:0, backgroundColor: '#aaaaaa'}}>
                                    <Text style={pdfStyles.textCenter}>견적합계</Text>
                                </View>
                                <View style={{width: 60, height:'100%',margin:0,padding:0,flexGrow:1,flexGrow:0}}>
                                    <Text style={pdfStyles.textCenter}>{ConverTextAmount(currentQuotation.total_quotation_amount)}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    );
};

export default QuotationView;