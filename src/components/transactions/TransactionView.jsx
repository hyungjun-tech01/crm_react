import React, { useCallback, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil';
import { PDFViewer } from '@react-pdf/renderer';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { atomCurrentTransaction, defaultTransaction } from "../../atoms/atoms";
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

// Create styles
const Styles = StyleSheet.create({
    body: {
        paddingTop: 25,
        paddingBottom: 35,
        paddingHorizontal: 20,
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
    textCenterUpper: {
        marginHorizontal: 2,
        marginTop: 0,
        marginBottom: -2,
        fontSize: 10,
        textAlign: 'center',
        textWrap: 'wrap',
        fontFamily: 'Noto Sans'
    },
    textCenterLower: {
        marginHorizontal: 2,
        marginTop: -2,
        marginBottom: 0,
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

const TransactionView = () => {
    const currentTransaction = useRecoilValue(atomCurrentTransaction);
    const [ transactionContents, setTransactionContents ] = useState([]);

    useEffect(() => {
        console.log('Load TransactionView');
        if(currentTransaction && currentTransaction !== defaultTransaction){
            const tempContents = JSON.parse(currentTransaction.transaction_contents);
            if(tempContents && Array.isArray(tempContents)){
                setTransactionContents(tempContents);
            };
        }
    }, [currentTransaction]);

    return (
        <PDFViewer style={{width: '100%', minHeight: '320px', height: '640px'}}>
            <Document>
                <Page size="A5" orientation="landscape" style={Styles.body}>
                    <View style={{margin:0,padding:5}}>
                        <View style={{width:'100%',margin:0,padding:0,border:0,flexDirection:'row'}}>
                            <View style={{width:'40%',justifyContent:'center'}}>
                                <Text style={{fontSize:24,fontFamily:'Noto Sans'}}>거  래  명  세  표</Text>
                            </View>
                            <View style={{width:'60%',margin:0,padding:0,border:2,borderColor:'#eee5555',flexDirection:'row'}}>
                                <View style={{width:20,borderRight:1,borderColor:'#eee5555',alignItems:'center',alignContent:'center',justifyContent:'center',flexGrow:0,flexDirection:'column'}}>
                                    <Text style={Styles.text}>공</Text>
                                    <Text style={Styles.text}>급</Text>
                                    <Text style={Styles.text}>받</Text>
                                    <Text style={Styles.text}>는</Text>
                                    <Text style={Styles.text}>자</Text>
                                </View>
                                <View style={{flexDirection:'column',border:0,flexGrow:1}}>
                                    <View style={{height:30,borderBottom:1,borderColor:'#eee5555',alignItems:'stretch',flexDirection:'row'}}>
                                        <View style={{width:50,height:'100%',borderRight:2,borderColor:'#eee5555',flexGrow:0}}>
                                            <View style={{alignItems:'center',alignContent:'center'}}>
                                                <Text style={Styles.textCenter}>등록번호</Text>
                                            </View>
                                        </View>
                                        <View style={{flexGrow:1}}>
                                            <View style={{alignItems:'center'}}>
                                                <Text style={Styles.text}>{currentTransaction.business_registration_code}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{height:30,borderBottom:1,borderColor:'#eee5555',alignItems:'stretch',alignContent:'center',flexDirection:'row'}}>
                                        <View style={{width:50,borderRight:2,borderColor:'#eee5555',flexGrow:0}}>
                                            <View style={{alignItems:'center'}}>
                                                <Text style={Styles.textCenterUpper}>상   호</Text>
                                                <Text style={Styles.textCenterLower}>(법인명)</Text>
                                            </View>
                                        </View>
                                        <View style={{borderRight:1,borderColor:'#eee5555',flexGrow:1}}>
                                            <View style={{alignItems:'center'}}>
                                                <Text style={Styles.textCenter}>{currentTransaction.company_name}</Text>
                                            </View>
                                        </View>
                                        <View style={{width:20,borderRight:1,borderColor:'#eee5555',flexGrow:0}}>
                                            <View style={{alignItems:'center'}}>
                                                <Text style={Styles.textCenterUpper}>성</Text>
                                                <Text style={Styles.textCenterLower}>명</Text>
                                            </View>
                                        </View>
                                        <View style={{width:75,flexGrow:0}}>
                                            <View style={{alignItems:'center'}}>
                                                <Text style={Styles.text}>{currentTransaction.ceo_name}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{height:30,borderBottom:1,borderColor:'#eee5555',alignItems:'center',alignContent:'center',flexDirection:'row'}}>
                                        <View style={{width:50,borderRight:2,borderColor:'#eee5555',flexGrow:0}}>
                                            <Text style={Styles.textCenterUpper}>사업장</Text>
                                            <Text style={Styles.textCenterLower}>주  소</Text>
                                        </View>
                                        <View style={{flexGrow:1}}>
                                            <Text style={Styles.text}>{currentTransaction.company_address}</Text>
                                        </View>
                                    </View>
                                    <View style={{height:30,border:0,flexDirection:'row',alignItems:'center',alignContent:'center'}}>
                                        <View style={{width:50,borderRight:2,borderColor:'#eee5555',flexGrow:0}}>
                                            <Text style={Styles.textCenter}>업  태</Text>
                                        </View>
                                        <View style={{borderRight:1,borderColor:'#eee5555',flexGrow:2}}>
                                            <Text style={Styles.text}>{currentTransaction.business_type}</Text>
                                        </View>
                                        <View style={{width:20,borderRight:1,borderColor:'#eee5555',flexGrow:0}}>
                                            <Text style={Styles.textCenterUpper}>종</Text>
                                            <Text style={Styles.textCenterLower}>목</Text>
                                        </View>
                                        <View style={{flexGrow:3}}>
                                            <Text style={Styles.text}>{currentTransaction.business_item}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    );
};

export default TransactionView;