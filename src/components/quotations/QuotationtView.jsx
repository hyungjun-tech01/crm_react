import React, { useEffect } from 'react'
import { useRecoilValue } from 'recoil';
import { PDFViewer } from '@react-pdf/renderer';
import { Canvas, Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { atomCurrentQuotation } from "../../atoms/atoms";

import NotoSansFont from "../../fonts/NotoSansKR-Regular.ttf"

// Create styles
const pdfStyles = StyleSheet.create({
    body: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35,
    },
    type: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'Noto Sans'
    },
    doc_no: {
        fontSize: 12,
        textAlign: 'right',
        marginBottom: 20,
        fontFamily: 'Noto Sans'
    },
    company_name: {
        fontSize: 16,
        textAlign: 'left',
        marginLeft: 40,
        fontFamily: 'Noto Sans'
    },
    text: {
        margin: 2,
        fontSize: 12,
        textAlign: 'justify',
        textOverflow: 'wrap',
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
    upperSection: {
        margin: 10,
        padding: 10,
        flexDirection: 'row',
    },
    downSection: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    },
});

Font.register({
    family: 'Noto Sans',
    format: 'trueType',
    src: NotoSansFont,
});


const QuotationView = () => {
    const currentQuotation = useRecoilValue(atomCurrentQuotation);

    useEffect(() => {
        console.log('Load QuotationView');
    }, [currentQuotation]);

    return (
        <PDFViewer style={{width: '100%', minHeight: '320px', height: '640px'}}>
            <Document>
                <Page size="A4" style={pdfStyles.body}>
                    {currentQuotation.sales_representative &&
                        <Text style={pdfStyles.header} fixed>{currentQuotation.sales_representative}</Text>
                    }
                    <Text style={pdfStyles.doc_no}>견적번호: {currentQuotation.quotation_number}</Text>
                    <Text style={pdfStyles.type}>{currentQuotation.quotation_type}</Text>
                    <Text style={pdfStyles.company_name}>{currentQuotation.company_name} 귀중</Text>
                    <View style={pdfStyles.upperSection}>
                        <View style={{padding: '5px', width: '50%', flewGrow: 1}}>
                            <Text style={pdfStyles.text}>받으실 분: {currentQuotation.department} {currentQuotation.lead_name} {currentQuotation.position}</Text>
                            <Text style={pdfStyles.text}>견적 일자: {new Date(currentQuotation.quotation_date).toLocaleDateString('ko-KR', {year:'numeric', month:'short', day:'numeric'})}</Text>
                            <Text style={pdfStyles.text}>지불 조건: {currentQuotation.payment_type}</Text>
                            <Text style={pdfStyles.text}>납품 기간: {currentQuotation.delivery_period}</Text>
                            <Text style={pdfStyles.text}>유효 기간: {currentQuotation.quotation_expiration_date}</Text>
                        </View>
                        <View style={{margin: 0, padding: 0, border: 1, width: 180, flexDirection: 'row', flexGrow: 1}}>
                            <View style={{width: 25, height: '100%', border: 1}}>
                                <Text style={pdfStyles.text}>공 급 자</Text>
                            </View>
                            <View style={{width: 100, height: '100%', border: 1}}>
                                <Text style={pdfStyles.text}>등록번호</Text>
                                <Text style={pdfStyles.text}>상호</Text>
                                <Text style={pdfStyles.text}>대표자명</Text>
                                <Text style={pdfStyles.text}>주소</Text>
                                <Text style={pdfStyles.text}>업태/종목</Text>
                                <Text style={pdfStyles.text}>회사전화</Text>
                                <Text style={pdfStyles.text}>회사팩스</Text>
                            </View>
                            <View style={{height: '100%', border: 1}}>
                                <Text style={pdfStyles.text}>106-86-26016</Text>
                                <Text style={pdfStyles.text}>노드데이타</Text>
                                <Text style={pdfStyles.text}>김신일</Text>
                                <Text style={pdfStyles.text}>서울특별시 금천구 가산디지털 1로 128 1811 (STX V-Tower)</Text>
                                <Text style={pdfStyles.text}>도소매서비스/컴퓨터및주변기기,S/W개발,공급,자문</Text>
                                <Text style={pdfStyles.text}>02-595-4450 / 051-517-4450</Text>
                                <Text style={pdfStyles.text}>02-595-4454 / 051-518-4452</Text>
                            </View>
                        </View>
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    );
};

export default QuotationView;