import React, { useCallback, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil';
import { PDFViewer } from '@react-pdf/renderer';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { atomCurrentTransaction, defaultTransaction } from "../../atoms/atoms";
import NotoSansRegular from "../../fonts/NotoSansKR-Regular.ttf";
import NotoSansBold from "../../fonts/NotoSansKR-Bold.ttf";
import NotoSansLight from "../../fonts/NotoSansKR-Light.ttf";
import { ConverTextAmount } from '../../constants/functions';

// Create styles
const Styles = StyleSheet.create({
    body: {
        paddingHorizontal: 5,
        paddingVertical: 3,
    },
    text: {
        marginHorizontal: 2,
        marginVertical: 0,
        fontSize: 10,
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
    contentRow: {
        width: '100%',
        height:18,
        margin:0,
        padding:0,
        flexDirection:'row',
        alignContent:'center',
    },
    contentCell: {
        margin:0,
        padding:0,
        alignItems:'center',
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
                const num_10 = Math.ceil(tempContents.length / 10) * 10;
                let temp_array = new Array(num_10);
                let i = 0;
                for( ; i < tempContents.length; i++)
                {
                    temp_array[i] = tempContents[i];
                }
                for(; i < num_10; i++)
                {
                    temp_array[i] = null;
                }
                setTransactionContents(temp_array);
            };
        }
    }, [currentTransaction]);

    return (
        <PDFViewer style={{width: '100%', minHeight: '320px', height: '640px'}}>
            <Document>
                <Page size="A5" orientation="landscape" style={Styles.body}>
                    <View style={{margin:0,padding:5}}>
                        <View style={{width:'100%',margin:0,padding:0,border:0,flexDirection:'row',flexGrow:0}}>
                            <View style={{width:'40%',justifyContent:'center'}}>
                                <Text style={{fontSize:24,fontFamily:'Noto Sans'}}>거  래  명  세  표</Text>
                            </View>
                            <View style={{width:'60%',margin:0,padding:0,borderBottom:0,borderLeft:2,borderRight:2,borderTop:2,borderColor:'#eee5555',flexDirection:'row'}}>
                                <View style={{width:20,borderRight:1,borderColor:'#eee5555',alignItems:'center',alignContent:'center',justifyContent:'center',flexGrow:0,flexDirection:'column'}}>
                                    <Text style={Styles.text}>공</Text>
                                    <Text style={Styles.text}>급</Text>
                                    <Text style={Styles.text}>받</Text>
                                    <Text style={Styles.text}>는</Text>
                                    <Text style={Styles.text}>자</Text>
                                </View>
                                <View style={{flexDirection:'column',border:0,flexGrow:1}}>
                                    <View style={{height:22,borderBottom:1,borderColor:'#eee5555',alignItems:'stretch',alignContent:'center',flexDirection:'row'}}>
                                        <View style={{width:50,borderRight:2,borderColor:'#eee5555',alignItems:'center',flexGrow:0}}>
                                            <View style={{}}>
                                                <Text style={Styles.textCenter}>등록번호</Text>
                                            </View>
                                        </View>
                                        <View style={{flexGrow:1}}>
                                            <View style={{alignItems:'center'}}>
                                                <Text style={Styles.text}>{currentTransaction.business_registration_code}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{height:22,borderBottom:1,borderColor:'#eee5555',alignItems:'stretch',alignContent:'center',flexDirection:'row'}}>
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
                                    <View style={{height:22,borderBottom:1,borderColor:'#eee5555',alignItems:'center',alignContent:'center',flexDirection:'row'}}>
                                        <View style={{width:50,borderRight:2,borderColor:'#eee5555',flexGrow:0}}>
                                            <Text style={Styles.textCenterUpper}>사업장</Text>
                                            <Text style={Styles.textCenterLower}>주  소</Text>
                                        </View>
                                        <View style={{flexGrow:1}}>
                                            <Text style={Styles.text}>{currentTransaction.company_address}</Text>
                                        </View>
                                    </View>
                                    <View style={{height:22,border:0,flexDirection:'row',alignItems:'center',alignContent:'center'}}>
                                        <View style={{width:50, borderRight:2,borderColor:'#eee5555',flexGrow:0}}>
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
                        <View style={{width:'100%',margin:0,padding:0,border:2,borderColor:'#eee5555',flexDirection:'column',flexGrow:1}}>
                            <View style={{width:'100%',height:36,margin:0,padding:0, borderBottom:2,borderColor:'#eee5555',flexDirection:'row'}}>
                                <View style={{width:'40%',height:'100%',margin:0,justifyContent:'center',border:0}}></View>
                                <View style={{width:'60%',height:'100%',margin:0,justifyContent:'center',borderLeft:2,borderColor:'#eee5555'}}></View>
                            </View>
                            <View style={{width:'100%',height:200,margin:0,padding:0,borderBottom:2,borderColor:'#eee5555',flexDirection:'column'}}>
                                <View style={{width: '100%',height:20,margin:0,padding:0,borderBottom:1,borderColor:'#aaaaaa',flexDirection:'row',alignContent:'center'}}>
                                    <View style={{width:40,margin:0,padding:0,borderRight:1,borderColor:'#aaaaaa',flexGrow:0,alignItems:'center',justifyContent:'center'}}>
                                        <Text style={Styles.text}>월일</Text>
                                    </View>
                                    <View style={{margin:0,padding:0,borderRight:1,borderColor:'#aaaaaa',flexGrow:1,alignItems:'center',justifyContent:'center'}}>
                                        <Text style={Styles.text}>품    목</Text>
                                    </View>
                                    <View style={{width: 50,margin:0,padding:0,borderRight:1,borderColor:'#aaaaaa',flexGrow:0,alignItems:'center',justifyContent:'center'}}>
                                        <Text style={Styles.text}>규격</Text>
                                    </View>
                                    <View style={{width: 50,margin:0,padding:0,borderRight:1,borderColor:'#aaaaaa',flexGrow:0,alignItems:'center',justifyContent:'center'}}>
                                        <Text style={Styles.text}>수량</Text>
                                    </View>
                                    <View style={{width: 80,margin:0,padding:0,borderRight:1,borderColor:'#aaaaaa',flexGrow:0,alignItems:'center',justifyContent:'center'}}>
                                        <Text style={Styles.text}>단가</Text>
                                    </View>
                                    <View style={{width: 80,margin:0,padding:0,borderRight:1,borderColor:'#aaaaaa',flexGrow:0,alignItems:'center',justifyContent:'center'}}>
                                        <Text style={Styles.text}>공급가액</Text>
                                    </View>
                                    <View style={{width: 80,margin:0,padding:0,border:0,flexGrow:0,alignItems:'center',justifyContent:'center'}}>
                                        <Text style={Styles.text}>세액</Text>
                                    </View>
                                </View>
                                {  transactionContents && transactionContents.length >= 10 &&
                                    transactionContents.map((item, index) => {
                                        if(item) {
                                            if(index % 2 === 0) {
                                                return (
                                                    <View key={index} style={[Styles.contentRow, {borderBottom:1,borderColor:"#eeeeee"}]}>
                                                        <View style={[Styles.contentCell, {width:40,borderRight:1,borderColor:"#eeeeee",flexGrow:0,justifyContent:'center'}]}>
                                                            <Text style={Styles.text}>{item.month_day}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {borderRight:1,borderColor:"#eeeeee",flexGrow:1}]}>
                                                            <Text style={Styles.text}>{item.product_name}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:50,borderRight:1,borderColor:"#eeeeee",flexGrow:0}]}>
                                                            <Text style={Styles.text}>{item.standard}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:50,borderRight:1,borderColor:"#eeeeee",flexGrow:0,justifyContent:'flex-end'}]}>
                                                            <Text style={Styles.text}>{ConverTextAmount(item.quantity)}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:80,borderRight:1,borderColor:"#eeeeee",flexGrow:0,justifyContent:'flex-end'}]}>
                                                            <Text style={Styles.text}>{ConverTextAmount(item.supply_price)}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:80,borderRight:1,borderColor:"#eeeeee",flexGrow:0,justifyContent:'flex-end'}]}>
                                                            <Text style={Styles.text}>{ConverTextAmount(item.total_price)}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:80,border:0,flexGrow:0,justifyContent:'flex-end'}]}>
                                                            <Text style={Styles.text}>{ConverTextAmount(item.tax_price)}</Text>
                                                        </View>
                                                    </View>
                                            )};
                                            if(index % 10 === 9) {
                                                return (
                                                    <View key={index} style={[Styles.contentRow, {backgroundColor:"#eeeedd"}]}>
                                                        <View style={[Styles.contentCell, {width:40,borderRight:1,borderColor:"#eeeeee",flexGrow:0,justifyContent:'center'}]}>
                                                            <Text style={Styles.text}>{item.month_day}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {borderRight:1,borderColor:"#eeeeee",flexGrow:1}]}>
                                                            <Text style={Styles.text}>{item.product_name}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:50,borderRight:1,borderColor:"#eeeeee",flexGrow:0}]}>
                                                            <Text style={Styles.text}>{item.standard}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:50,borderRight:1,borderColor:"#eeeeee",flexGrow:0,justifyContent:'flex-end'}]}>
                                                            <Text style={Styles.text}>{ConverTextAmount(item.quantity)}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:80,borderRight:1,borderColor:"#eeeeee",flexGrow:0,justifyContent:'flex-end'}]}>
                                                            <Text style={Styles.text}>{ConverTextAmount(item.supply_price)}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:80,borderRight:1,borderColor:"#eeeeee",flexGrow:0,justifyContent:'flex-end'}]}>
                                                            <Text style={Styles.text}>{ConverTextAmount(item.total_price)}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:80,border:0,flexGrow:0,justifyContent:'flex-end'}]}>
                                                            <Text style={Styles.text}>{ConverTextAmount(item.tax_price)}</Text>
                                                        </View>
                                                    </View>
                                            )};
                                            return (
                                                <View key={index} style={[Styles.contentRow, {borderBottom:1,borderColor:"#eeeeee",backgroundColor:"#eeeedd"}]}>
                                                    <View style={[Styles.contentCell, {width:40,borderRight:1,borderColor:"#eeeeee",flexGrow:0}]}>
                                                        <Text style={Styles.text}>{item.month_day}</Text>
                                                    </View>
                                                    <View style={[Styles.contentCell, {borderRight:1,borderColor:"#eeeeee",flexGrow:1}]}>
                                                        <Text style={Styles.text}>{item.product_name}</Text>
                                                    </View>
                                                    <View style={[Styles.contentCell, {width:50,borderRight:1,borderColor:"#eeeeee",flexGrow:0}]}>
                                                        <Text style={Styles.text}>{item.standard}</Text>
                                                    </View>
                                                    <View style={[Styles.contentCell, {width:50,borderRight:1,borderColor:"#eeeeee",flexGrow:0}]}>
                                                        <Text style={Styles.text}>{item.quantity}</Text>
                                                    </View>
                                                    <View style={[Styles.contentCell, {width:80,borderRight:1,borderColor:"#eeeeee",flexGrow:0}]}>
                                                        <Text style={Styles.text}>{item.supply_price}</Text>
                                                    </View>
                                                    <View style={[Styles.contentCell, {width:80,borderRight:1,borderColor:"#eeeeee",flexGrow:0}]}>
                                                        <Text style={Styles.text}>{item.total_price}</Text>
                                                    </View>
                                                    <View style={[Styles.contentCell, {width:80,border:0,flexGrow:0}]}>
                                                        <Text style={Styles.text}>{item.tax_price}</Text>
                                                    </View>
                                                </View>
                                            );
                                        };
                                        if(index % 2 === 0) {
                                            return (
                                                <View key={index} style={[Styles.contentRow, {borderBottom:1,borderColor:"#eeeeee"}]}>
                                                    <View style={[Styles.contentCell, {width:40,borderRight:1,borderColor:"#eeeeee",flexGrow:0}]}></View>
                                                    <View style={[Styles.contentCell, {borderRight:1,borderColor:"#eeeeee",flexGrow:1}]}></View>
                                                    <View style={[Styles.contentCell, {width:50,borderRight:1,borderColor:"#eeeeee",flexGrow:0}]}></View>
                                                    <View style={[Styles.contentCell, {width:50,borderRight:1,borderColor:"#eeeeee",flexGrow:0}]}></View>
                                                    <View style={[Styles.contentCell, {width:80,borderRight:1,borderColor:"#eeeeee",flexGrow:0}]}></View>
                                                    <View style={[Styles.contentCell, {width:80,borderRight:1,borderColor:"#eeeeee",flexGrow:0}]}></View>
                                                    <View style={[Styles.contentCell, {width:80,border:0,flexGrow:0}]}></View>
                                                </View>
                                            );
                                        };
                                        if(index % 10 === 9) {
                                            return (
                                                <View key={index} style={[Styles.contentRow, {backgroundColor:"#eeeedd"}]}>
                                                    <View style={[Styles.contentCell, {width:40,borderRight:1,borderColor:"#eeeeee",flexGrow:0}]}></View>
                                                    <View style={[Styles.contentCell, {borderRight:1,borderColor:"#eeeeee",flexGrow:1}]}></View>
                                                    <View style={[Styles.contentCell, {width:50,borderRight:1,borderColor:"#eeeeee",flexGrow:0}]}></View>
                                                    <View style={[Styles.contentCell, {width:50,borderRight:1,borderColor:"#eeeeee",flexGrow:0}]}></View>
                                                    <View style={[Styles.contentCell, {width:80,borderRight:1,borderColor:"#eeeeee",flexGrow:0}]}></View>
                                                    <View style={[Styles.contentCell, {width:80,borderRight:1,borderColor:"#eeeeee",flexGrow:0}]}></View>
                                                    <View style={[Styles.contentCell, {width:80,border:0,flexGrow:0}]}></View>
                                                </View> 
                                            );
                                        };
                                        return (
                                            <View key={index} style={[Styles.contentRow, {borderBottom:1,borderColor:"#eeeeee",backgroundColor:"#eeeedd"}]}>
                                                <View style={[Styles.contentCell, {width:40,borderRight:1,borderColor:"#eeeeee",flexGrow:0}]}></View>
                                                <View style={[Styles.contentCell, {borderRight:1,borderColor:"#eeeeee",flexGrow:1}]}></View>
                                                <View style={[Styles.contentCell, {width:50,borderRight:1,borderColor:"#eeeeee",flexGrow:0}]}></View>
                                                <View style={[Styles.contentCell, {width:50,borderRight:1,borderColor:"#eeeeee",flexGrow:0}]}></View>
                                                <View style={[Styles.contentCell, {width:80,borderRight:1,borderColor:"#eeeeee",flexGrow:0}]}></View>
                                                <View style={[Styles.contentCell, {width:80,borderRight:1,borderColor:"#eeeeee",flexGrow:0}]}></View>
                                                <View style={[Styles.contentCell, {width:80,border:0,flexGrow:0}]}></View>
                                            </View> 
                                        );
                                })}
                            </View>
                            <View style={{width:'100%',height:36,margin:0,padding:0,borderBottom:2,borderColor:'#eee5555',flexDirection:'column'}}>
                                <View style={{width: '100%',height:18,margin:0,padding:0,borderBottom:1,borderColor:'#aaaaaa',flexDirection:'row',alignContent:'center'}}>
                                    <View style={{width:'25%',margin:0,padding:0,borderRight:1,borderColor:'#aaaaaa',alignItems:'center',justifyContent:'center'}}>
                                        <Text style={Styles.text}>전잔액</Text>
                                    </View>
                                    <View style={{width:'25%',margin:0,padding:0,borderRight:1,borderColor:'#aaaaaa',alignItems:'center',justifyContent:'center'}}>
                                        <Text style={Styles.text}>공급가액</Text>
                                    </View>
                                    <View style={{width:'25%',margin:0,padding:0,borderRight:1,borderColor:'#aaaaaa',alignItems:'center',justifyContent:'center'}}>
                                        <Text style={Styles.text}>세액</Text>
                                    </View>
                                    <View style={{width:'25%',margin:0,padding:0,alignItems:'center',justifyContent:'center'}}>
                                        <Text style={Styles.text}>합계금액</Text>
                                    </View>
                                </View>
                                <View style={{width: '100%',height:18,margin:0,padding:0,border:0,flexDirection:'row',alignContent:'center'}}>
                                    <View style={{width:'25%',margin:0,padding:0,borderRight:1,borderColor:'#eeeeee',alignItems:'center',justifyContent:'flex-end'}}>
                                        <Text style={Styles.text}>{}</Text>
                                    </View>
                                    <View style={{width:'25%',margin:0,padding:0,borderRight:1,borderColor:'#eeeeee',alignItems:'center',justifyContent:'flex-end'}}>
                                        <Text style={Styles.text}>{ConverTextAmount(currentTransaction.supply_price)}</Text>
                                    </View>
                                    <View style={{width:'25%',margin:0,padding:0,borderRight:1,borderColor:'#eeeeee',alignItems:'center',justifyContent:'flex-end'}}>
                                        <Text style={Styles.text}>{ConverTextAmount(currentTransaction.tax_price)}</Text>
                                    </View>
                                    <View style={{width:'25%',margin:0,padding:0,alignItems:'center',justifyContent:'flex-end'}}>
                                        <Text style={Styles.text}>{ConverTextAmount(currentTransaction.total_price)}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{width:'100%',height:36,margin:0,padding:0,border:0,flexDirection:'column'}}>
                                <View style={{width: '100%',height:18,margin:0,padding:0,borderBottom:1,borderColor:'#aaaaaa',flexDirection:'row',alignContent:'center'}}>
                                    <View style={{width:'25%',margin:0,padding:0,borderRight:1,borderColor:'#aaaaaa',alignItems:'center',justifyContent:'center'}}>
                                        <Text style={Styles.text}>입금</Text>
                                    </View>
                                    <View style={{width:'25%',margin:0,padding:0,borderRight:1,borderColor:'#aaaaaa',alignItems:'center',justifyContent:'center'}}>
                                        <Text style={Styles.text}>총잔액</Text>
                                    </View>
                                    <View style={{width:'25%',margin:0,padding:0,borderRight:1,borderColor:'#aaaaaa',alignItems:'center',justifyContent:'center'}}>
                                        <Text style={Styles.text}>인수자</Text>
                                    </View>
                                    <View style={{width:'25%',margin:0,padding:0,alignItems:'center',justifyContent:'center'}}>
                                        <Text style={Styles.text}>현재/전체/Page</Text>
                                    </View>
                                </View>
                                <View style={{width: '100%',height:18,margin:0,padding:0,border:0,flexDirection:'row',alignContent:'center'}}>
                                    <View style={{width:'25%',margin:0,padding:0,borderRight:1,borderColor:'#eeeeee',alignItems:'center',justifyContent:'flex-end'}}>
                                        <Text style={Styles.text}>{}</Text>
                                    </View>
                                    <View style={{width:'25%',margin:0,padding:0,borderRight:1,borderColor:'#eeeeee',alignItems:'center',justifyContent:'flex-end'}}>
                                        <Text style={Styles.text}>{}</Text>
                                    </View>
                                    <View style={{width:'25%',margin:0,padding:0,borderRight:1,borderColor:'#eeeeee',alignItems:'center',justifyContent:'flex-end'}}>
                                        <Text style={Styles.text}>{}</Text>
                                    </View>
                                    <View style={{width:'25%',margin:0,padding:0,alignItems:'center',justifyContent:'flex-end'}}>
                                        <Text style={Styles.text}>{}</Text>
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