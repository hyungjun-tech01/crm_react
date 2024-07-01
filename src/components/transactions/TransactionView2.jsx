import React, { useEffect, useState } from 'react'
import { PDFViewer } from '@react-pdf/renderer';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import NotoSansRegular from "../../fonts/NotoSansKR-Regular.ttf";
import NotoSansBold from "../../fonts/NotoSansKR-Bold.ttf";
import NotoSansLight from "../../fonts/NotoSansKR-Light.ttf";
import { ConvertCurrency } from '../../constants/functions';

// Create styles
const Styles = StyleSheet.create({
    body: {
        paddingLeft: 40,
        paddingRight: 10,
        paddingVertical: 10,
    },
    text: {
        marginHorizontal: 2,
        marginVertical: 0,
        fontSize: 10,
        textAlign: 'justify',
        textOverflow: 'ellipsis',
        fontFamily: 'Noto Sans'
    },
    SupplierText: {
        marginHorizontal: 2,
        fontFamily: 'Noto Sans',
        textAlign: 'center',
        color: '#0000ff',
    },
    SupplierInput: {
        marginHorizontal: 2,
        textAlign: 'start',
        fontFamily: 'Noto Sans',
    },
    SupplierRegNo: {
        marginHorizontal: 2,
        marginTop: 3,
        fontFamily: 'Noto Sans',
        textAlign: 'center',
        fontSize: 13,
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

const TransactionView2 = (props) => {
    const { transaction, contents} = props;
    const [ transactionContents, setTransactionContents ] = useState([]);

    const supplier_info = {
        business_registration_code: '106-86-26016',
        company_name: '노드데이타',
        ceo_name: '김신일',
        company_address: '서울특별시 금천구 가산디지털 1로 128 1811 (STX V-Tower)',
        business_type: '도소매서비스',
        business_item: '컴퓨터및주변기기, S/W개발, 공급, 자문',
    };

    useEffect(() => {
        if(contents && Array.isArray(contents)){
            const num_10 = Math.ceil(contents.length / 10) * 10;
            let temp_array = new Array(num_10);
            let i = 0;
            for( ; i < contents.length; i++)
            {
                temp_array[i] = contents[i];
            };
            for(; i < num_10; i++)
            {
                temp_array[i] = null;
            };
            setTransactionContents(temp_array);
            console.log('TransactionView2 : ', temp_array);
        };
    }, [contents]);

    return (
        <PDFViewer style={{width: '100%', minHeight: '480px', height: '960px'}}>
            <Document>
                <Page size="A4" style={Styles.body}>
                    <View style={{margin:0,padding:5}}>
                        <View style={{width:'100%',marginBottom:2,padding:0,border:0,display:'flex',flexDirection:'row',justifyContent:'space-between',alignContent:'end',alignItems:'end'}}>
                            <View style={{height:32,margin:0,padding:0,border:'1px solid #0000ff',flexDirection:'row'}}>
                                <View style={{width:25,height:30,margin:0,padding:0, borderRight:'1px solid #0000ff'}}>
                                    <Text style={[Styles.SupplierText,{fontSize:10}]}>발 행</Text>
                                </View>
                                <View style={{width:100,height:30}}><Text>&nbsp;</Text></View>
                            </View>
                            <View style={{justifyContent:'center'}}>
                                <Text style={[Styles.SupplierText,{fontSize:24}]}>거  래  명  세  표</Text>
                            </View>
                            <View style={{width:120, height:'10mm',fontFamily:'Noto Sans'}}>
                                <Text style={[Styles.SupplierText,{fontSize:11,marginTop:14}]}>(공급받는자 보관용)</Text>
                            </View>
                        </View>
                        {/* 공급자 */}
                        <View style={{width:'100%',margin:0,padding:0,border:0,flexDirection:'row',flexGrow:0}}>
                            <View style={{width:'50%',margin:0,padding:0,borderBottom:0,borderLeft:1,borderRight:0,borderTop:1,borderColor:'#0000ff',flexDirection:'row'}}>
                                <View style={{width:20,borderRight:1,borderColor:'#0000ff',alignItems:'center',alignContent:'center',justifyContent:'center',flexGrow:0,flexDirection:'column'}}>
                                    <Text style={[Styles.SupplierText,{fontSize:10}]}>공 급 자</Text>
                                </View>
                                <View style={{flexDirection:'column',border:0,flexGrow:1}}>
                                    <View style={{height:27,borderBottom:1,borderColor:'#0000ff',alignItems:'center',alignContent:'center',flexDirection:'row'}}>
                                        <View style={{width:50,height:26,borderRight:1,borderColor:'#0000ff',alignItems:'center',flexGrow:0}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginTop:6}]}>등록번호</Text>
                                        </View>
                                        <View style={{width:180, flexGrow:1}}>
                                            <Text style={[Styles.SupplierRegNo]}>{supplier_info.business_registration_code}</Text>
                                        </View>
                                    </View>
                                    <View style={{height:27,borderBottom:1,borderColor:'#0000ff',alignItems:'stretch',alignContent:'center',flexDirection:'row'}}>
                                        <View style={{width:50,height:26,alignItems:'center',borderRight:1,borderColor:'#0000ff',flexGrow:0}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginBottom:-2}]}>상   호</Text>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginTop:-2}]}>(법인명)</Text>
                                        </View>
                                        <View style={{width:80,alignItems:'center',borderRight:1,borderColor:'#0000ff',flexGrow:1}}>
                                            <Text style={[Styles.SupplierInput,{fontSize:10,marginTop:6}]}>{supplier_info.company_name}</Text>
                                        </View>
                                        <View style={{width:20,alignItems:'center',borderRight:1,borderColor:'#0000ff',flexGrow:0}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginBottom:-2}]}>성</Text>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginTop:-2}]}>명</Text>
                                        </View>
                                        <View style={{width:80,alignItems:'center',flexGrow:0}}>
                                            <Text style={[Styles.SupplierInput,{fontSize:10,marginTop:5}]}>{supplier_info.ceo_name}</Text>
                                        </View>
                                    </View>
                                    <View style={{height:27,borderBottom:1,borderColor:'#0000ff',alignItems:'center',alignContent:'center',flexDirection:'row'}}>
                                        <View style={{width:50,height:26,alignItems:'center',borderRight:1,borderColor:'#0000ff',flexGrow:0}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginBottom:-2}]}>사업장</Text>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginTop:-2}]}>주  소</Text>
                                        </View>
                                        <View style={{width:180, alignItems:'center',flexGrow:1}}>
                                            <Text style={[Styles.SupplierInput,{fontSize:10,letterSpacing:-1}]}>{supplier_info.company_address}</Text>
                                        </View>
                                    </View>
                                    <View style={{height:26,border:0,flexDirection:'row',alignItems:'center',alignContent:'center'}}>
                                        <View style={{width:50,height:26,alignItems:'center',borderRight:1,borderColor:'#0000ff',flexGrow:0}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginTop:6}]}>업  태</Text>
                                        </View>
                                        <View style={{width:70}}>
                                            <Text style={[Styles.SupplierInput,{fontSize:10,marginTop:5}]}>{supplier_info.business_type}</Text>
                                        </View>
                                        <View style={{width:20,height:26,alignItems:'center',borderLeft:1,borderRight:1,borderColor:'#0000ff',flexGrow:0}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginBottom:-2}]}>종</Text>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginTop:-2}]}>목</Text>
                                        </View>
                                        <View style={{width:90}}>
                                            <Text style={[Styles.SupplierInput,{fontSize:9,letterSpacing:-1}]}>{supplier_info.business_item}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={{width:'50%',margin:0,padding:0,borderBottom:0,borderLeft:1,borderRight:1,borderTop:1,borderColor:'#0000ff',flexDirection:'row'}}>
                            <View style={{width:20,borderRight:1,borderColor:'#0000ff',alignItems:'center',alignContent:'center',justifyContent:'center',flexGrow:0,flexDirection:'column'}}>
                                    <Text style={[Styles.SupplierText,{fontSize:10}]}>공 급 받 는 자</Text>
                                </View>
                                <View style={{flexDirection:'column',border:0,flexGrow:1}}>
                                    <View style={{height:27,borderBottom:1,borderColor:'#0000ff',alignItems:'center',alignContent:'center',flexDirection:'row'}}>
                                        <View style={{width:50,height:26,borderRight:1,borderColor:'#0000ff',alignItems:'center',flexGrow:0}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginTop:6}]}>등록번호</Text>
                                        </View>
                                        <View style={{flexGrow:1}}>
                                            <Text style={[Styles.SupplierText,{fontSize:14,marginTop:6}]}>{transaction.business_registration_code}</Text>
                                        </View>
                                    </View>
                                    <View style={{height:27,borderBottom:1,borderColor:'#0000ff',alignItems:'stretch',alignContent:'center',flexDirection:'row'}}>
                                        <View style={{width:50,height:26,alignItems:'center',borderRight:1,borderColor:'#0000ff',flexGrow:0}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginBottom:-2}]}>상   호</Text>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginTop:-2}]}>(법인명)</Text>
                                        </View>
                                        <View style={{alignItems:'center',borderRight:1,borderColor:'#0000ff',flexGrow:1}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginTop:6}]}>{transaction.company_name}</Text>
                                        </View>
                                        <View style={{width:20,alignItems:'center',borderRight:1,borderColor:'#0000ff',flexGrow:0}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginBottom:-2}]}>성</Text>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginTop:-2}]}>명</Text>
                                        </View>
                                        <View style={{width:75,alignItems:'center',flexGrow:0}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginTop:6}]}>{transaction.ceo_name}</Text>
                                        </View>
                                    </View>
                                    <View style={{height:27,borderBottom:1,borderColor:'#0000ff',alignItems:'center',alignContent:'center',flexDirection:'row'}}>
                                        <View style={{width:50,height:26,alignItems:'center',borderRight:1,borderColor:'#0000ff',flexGrow:0}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginBottom:-2}]}>사업장</Text>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginTop:-2}]}>주  소</Text>
                                        </View>
                                        <View style={{alignItems:'center',flexGrow:1}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginTop:6}]}>{transaction.company_address}</Text>
                                        </View>
                                    </View>
                                    <View style={{height:26,border:0,flexDirection:'row',alignItems:'center',alignContent:'center'}}>
                                        <View style={{width:50,height:26,alignItems:'center',borderRight:1,borderColor:'#0000ff',flexGrow:0}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginTop:6}]}>업  태</Text>
                                        </View>
                                        <View style={{flexGrow:2}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginTop:6}]}>{transaction.business_type}</Text>
                                        </View>
                                        <View style={{width:20,height:26,alignItems:'center',borderLeft:1,borderRight:1,borderColor:'#0000ff',flexGrow:0}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginBottom:-2}]}>종</Text>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginTop:-2}]}>목</Text>
                                        </View>
                                        <View style={{flexGrow:3}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginTop:6}]}>{transaction.business_item}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        {/* 공급받는자 */}
                        <View style={{width:'100%',margin:0,padding:0,border:1,borderColor:'#000ff',flexDirection:'column',flexGrow:1}}>
                            <View style={{width:'100%',height:200,margin:0,padding:0,borderBottom:2,borderColor:'#000ff',flexDirection:'column'}}>
                                <View style={{width: '100%',height:20,margin:0,padding:0,borderBottom:1,borderColor:'#aaaaaa',flexDirection:'row',alignContent:'center'}}>
                                    <View style={{width:40,margin:0,padding:0,borderRight:1,borderColor:'#aaaaaa',flexGrow:0,alignItems:'center',justifyContent:'center'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>월일</Text>
                                    </View>
                                    <View style={{margin:0,padding:0,borderRight:1,borderColor:'#aaaaaa',flexGrow:1,alignItems:'center',justifyContent:'center'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>품    목</Text>
                                    </View>
                                    <View style={{width: 50,margin:0,padding:0,borderRight:1,borderColor:'#aaaaaa',flexGrow:0,alignItems:'center',justifyContent:'center'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>규격</Text>
                                    </View>
                                    <View style={{width: 50,margin:0,padding:0,borderRight:1,borderColor:'#aaaaaa',flexGrow:0,alignItems:'center',justifyContent:'center'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>수량</Text>
                                    </View>
                                    <View style={{width: 80,margin:0,padding:0,borderRight:1,borderColor:'#aaaaaa',flexGrow:0,alignItems:'center',justifyContent:'center'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>단가</Text>
                                    </View>
                                    <View style={{width: 80,margin:0,padding:0,borderRight:1,borderColor:'#aaaaaa',flexGrow:0,alignItems:'center',justifyContent:'center'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>공급가액</Text>
                                    </View>
                                    <View style={{width: 80,margin:0,padding:0,border:0,flexGrow:0,alignItems:'center',justifyContent:'center'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>세액</Text>
                                    </View>
                                </View>
                                {  transactionContents && transactionContents.length >= 10 &&
                                    transactionContents.map((item, index) => {
                                        if(item) {
                                            if(index % 2 === 0) {
                                                return (
                                                    <View key={index} style={[Styles.contentRow, {borderBottom:1,borderColor:"#eeeeee"}]}>
                                                        <View style={[Styles.contentCell, {width:40,borderRight:1,borderColor:"#eeeeee",flexGrow:0,justifyContent:'center'}]}>
                                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>{item.month_day}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {borderRight:1,borderColor:"#eeeeee",flexGrow:1}]}>
                                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>{item.product_name}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:50,borderRight:1,borderColor:"#eeeeee",flexGrow:0}]}>
                                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>{item.standard}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:50,borderRight:1,borderColor:"#eeeeee",flexGrow:0,justifyContent:'flex-end'}]}>
                                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>{item.quantity}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:80,borderRight:1,borderColor:"#eeeeee",flexGrow:0,justifyContent:'flex-end'}]}>
                                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>{ConvertCurrency(item.supply_price)}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:80,borderRight:1,borderColor:"#eeeeee",flexGrow:0,justifyContent:'flex-end'}]}>
                                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>{ConvertCurrency(item.total_price)}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:80,border:0,flexGrow:0,justifyContent:'flex-end'}]}>
                                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>{ConvertCurrency(item.tax_price)}</Text>
                                                        </View>
                                                    </View>
                                            )};
                                            if(index % 10 === 9) {
                                                return (
                                                    <View key={index} style={[Styles.contentRow, {backgroundColor:"#eeeedd"}]}>
                                                        <View style={[Styles.contentCell, {width:40,borderRight:1,borderColor:"#eeeeee",flexGrow:0,justifyContent:'center'}]}>
                                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>{item.month_day}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {borderRight:1,borderColor:"#eeeeee",flexGrow:1}]}>
                                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>{item.product_name}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:50,borderRight:1,borderColor:"#eeeeee",flexGrow:0}]}>
                                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>{item.standard}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:50,borderRight:1,borderColor:"#eeeeee",flexGrow:0,justifyContent:'flex-end'}]}>
                                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>{item.quantity}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:80,borderRight:1,borderColor:"#eeeeee",flexGrow:0,justifyContent:'flex-end'}]}>
                                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>{ConvertCurrency(item.supply_price)}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:80,borderRight:1,borderColor:"#eeeeee",flexGrow:0,justifyContent:'flex-end'}]}>
                                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>{ConvertCurrency(item.total_price)}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:80,border:0,flexGrow:0,justifyContent:'flex-end'}]}>
                                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>{ConvertCurrency(item.tax_price)}</Text>
                                                        </View>
                                                    </View>
                                            )};
                                            return (
                                                <View key={index} style={[Styles.contentRow, {borderBottom:1,borderColor:"#eeeeee",backgroundColor:"#eeeedd"}]}>
                                                    <View style={[Styles.contentCell, {width:40,borderRight:1,borderColor:"#eeeeee",flexGrow:0}]}>
                                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>{item.month_day}</Text>
                                                    </View>
                                                    <View style={[Styles.contentCell, {borderRight:1,borderColor:"#eeeeee",flexGrow:1}]}>
                                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>{item.product_name}</Text>
                                                    </View>
                                                    <View style={[Styles.contentCell, {width:50,borderRight:1,borderColor:"#eeeeee",flexGrow:0}]}>
                                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>{item.standard}</Text>
                                                    </View>
                                                    <View style={[Styles.contentCell, {width:50,borderRight:1,borderColor:"#eeeeee",flexGrow:0}]}>
                                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>{item.quantity}</Text>
                                                    </View>
                                                    <View style={[Styles.contentCell, {width:80,borderRight:1,borderColor:"#eeeeee",flexGrow:0}]}>
                                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>{ConvertCurrency(item.supply_price)}</Text>
                                                    </View>
                                                    <View style={[Styles.contentCell, {width:80,borderRight:1,borderColor:"#eeeeee",flexGrow:0}]}>
                                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>{ConvertCurrency(item.total_price)}</Text>
                                                    </View>
                                                    <View style={[Styles.contentCell, {width:80,border:0,flexGrow:0}]}>
                                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>{ConvertCurrency(item.tax_price)}</Text>
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
                            <View style={{width:'100%',height:36,margin:0,padding:0,borderBottom:2,borderColor:'#000ff',flexDirection:'column'}}>
                                <View style={{width: '100%',height:18,margin:0,padding:0,borderBottom:1,borderColor:'#aaaaaa',flexDirection:'row',alignContent:'center'}}>
                                    <View style={{width:'25%',margin:0,padding:0,borderRight:1,borderColor:'#aaaaaa',alignItems:'center',justifyContent:'center'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>전잔액</Text>
                                    </View>
                                    <View style={{width:'25%',margin:0,padding:0,borderRight:1,borderColor:'#aaaaaa',alignItems:'center',justifyContent:'center'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>공급가액</Text>
                                    </View>
                                    <View style={{width:'25%',margin:0,padding:0,borderRight:1,borderColor:'#aaaaaa',alignItems:'center',justifyContent:'center'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>세액</Text>
                                    </View>
                                    <View style={{width:'25%',margin:0,padding:0,alignItems:'center',justifyContent:'center'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>합계금액</Text>
                                    </View>
                                </View>
                                <View style={{width: '100%',height:18,margin:0,padding:0,border:0,flexDirection:'row',alignContent:'center'}}>
                                    <View style={{width:'25%',margin:0,padding:0,borderRight:1,borderColor:'#eeeeee',alignItems:'center',justifyContent:'flex-end'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>{ConvertCurrency(transaction.valance_prev)}</Text>
                                    </View>
                                    <View style={{width:'25%',margin:0,padding:0,borderRight:1,borderColor:'#eeeeee',alignItems:'center',justifyContent:'flex-end'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>{ConvertCurrency(transaction.supply_price)}</Text>
                                    </View>
                                    <View style={{width:'25%',margin:0,padding:0,borderRight:1,borderColor:'#eeeeee',alignItems:'center',justifyContent:'flex-end'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>{ConvertCurrency(transaction.tax_price)}</Text>
                                    </View>
                                    <View style={{width:'25%',margin:0,padding:0,alignItems:'center',justifyContent:'flex-end'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>{ConvertCurrency(transaction.total_price)}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{width:'100%',height:36,margin:0,padding:0,border:0,flexDirection:'column'}}>
                                <View style={{width: '100%',height:18,margin:0,padding:0,borderBottom:1,borderColor:'#aaaaaa',flexDirection:'row',alignContent:'center'}}>
                                    <View style={{width:'25%',margin:0,padding:0,borderRight:1,borderColor:'#aaaaaa',alignItems:'center',justifyContent:'center'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>입금</Text>
                                    </View>
                                    <View style={{width:'25%',margin:0,padding:0,borderRight:1,borderColor:'#aaaaaa',alignItems:'center',justifyContent:'center'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>총잔액</Text>
                                    </View>
                                    <View style={{width:'25%',margin:0,padding:0,borderRight:1,borderColor:'#aaaaaa',alignItems:'center',justifyContent:'center'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>인수자</Text>
                                    </View>
                                    <View style={{width:'25%',margin:0,padding:0,alignItems:'center',justifyContent:'center'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>현재/전체/Page</Text>
                                    </View>
                                </View>
                                <View style={{width: '100%',height:18,margin:0,padding:0,border:0,flexDirection:'row',alignContent:'center'}}>
                                    <View style={{width:'25%',margin:0,padding:0,borderRight:1,borderColor:'#eeeeee',alignItems:'center',justifyContent:'flex-end'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>{ConvertCurrency(transaction.receipt)}</Text>
                                    </View>
                                    <View style={{width:'25%',margin:0,padding:0,borderRight:1,borderColor:'#eeeeee',alignItems:'center',justifyContent:'flex-end'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>{ConvertCurrency(transaction.valance_final)}</Text>
                                    </View>
                                    <View style={{width:'25%',margin:0,padding:0,borderRight:1,borderColor:'#eeeeee',alignItems:'center',justifyContent:'flex-end'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>{transaction.receiver}</Text>
                                    </View>
                                    <View style={{width:'25%',margin:0,padding:0,alignItems:'center',justifyContent:'flex-end'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>{`${transaction.page_cur}/${transaction.page_total}/${transaction.page}`}</Text>
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

export default TransactionView2;