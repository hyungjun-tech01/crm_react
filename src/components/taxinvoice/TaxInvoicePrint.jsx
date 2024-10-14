import React, { useEffect, useState } from 'react'
import { PDFViewer } from '@react-pdf/renderer';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import NotoSansRegular from "../../fonts/NotoSansKR-Regular.ttf";
import NotoSansBold from "../../fonts/NotoSansKR-Bold.ttf";
import NotoSansLight from "../../fonts/NotoSansKR-Light.ttf";
import { formatDate, ConvertCurrency } from '../../constants/functions';

// Create styles
const Styles = StyleSheet.create({
    body: {
        paddingLeft: 40,
        paddingRight: 10,
        paddingVertical: 10,
    },
    SupplierText: {
        marginHorizontal: 2,
        fontFamily: 'Noto Sans',
        textAlign: 'center',
        color: '#0000ff',
    },
    inputText: {
        maxLines: 2,
        textAlign: 'justify',
        fontFamily: 'Noto Sans',
    },
    inputTextCenter: {
        textAlign: 'center',
        fontFamily: 'Noto Sans',
    },
    inputAmount: {
        marginHorizontal: 2,
        textAlign: 'end',
        fontFamily: 'Noto Sans',
    },
    ReceiverText: {
        marginHorizontal: 2,
        fontFamily: 'Noto Sans',
        textAlign: 'center',
        color: '#ff0505',
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
        height:19.2,
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

const TaxInvoicePrint = (props) => {
    const { invoiceData, contents, supplierData, receiverData} = props;
    const [ transactionContents, setTransactionContents ] = useState([]);
    const [ supplier, setSupplier ] = useState({});
    const [ receiver, setReceiver ] = useState({});

    useEffect(() => {
        if(contents && Array.isArray(contents) && contents.length > 0){
            const num_5 = Math.ceil(contents.length / 5) * 5;
            let temp_array = new Array(num_5);
            let i = 0;
            for( ; i < contents.length; i++)
            {
                temp_array[i] = contents[i];
            };
            // '이하여백' 추가
            temp_array[i] = {
                month_day: '',
                product_name: '--- 이하 여백 ---',
                standard: '',
                unit: '',
                quantity: '',
                unit_price: '',
                supply_price: '',
                tax_price: '',
                total_price: '',
                memo: '',
            };
            i++;
            for(; i < num_5; i++)
            {
                temp_array[i] = null;
            };
            setTransactionContents(temp_array);
        } else {
            setTransactionContents([]);
        };
        if(invoiceData) {
            setSupplier({...supplierData});
            setReceiver({...receiverData});
        }
    }, [contents, invoiceData]);

    if(!invoiceData || Object.keys(invoiceData).length === 0) return null;

    return (
        <PDFViewer style={{width: '100%', minHeight: '480px', height: '960px'}}>
            <Document>
                <Page size="A4" style={Styles.body}>
                    {/* 공급받는자 보관용 */}
                    <View style={{marginTop:10,padding:5}}>
                        <View style={{width:'100%',marginBottom:-2,padding:0,border:0,display:'flex',flexDirection:'row',justifyContent:'space-between',alignContent:'end',alignItems:'end'}}>
                            <View style={{width:'15%',height:16,margin:0,padding:0,fontFamily:'Noto Sans'}}>
                                <Text style={[Styles.SupplierText,{fontSize:10}]}>별지 제11호 서식</Text>
                            </View>
                            <View style={{width:'15%',height:16,margin:0,padding:0,fontFamily:'Noto Sans'}}>
                                <Text style={[Styles.SupplierText,{fontSize:10}]}>(청색)</Text>
                            </View>
                        </View>
                        <View style={{width:'100%',margin:0,padding:0,border:0,flexDirection:'column',flexGrow:0}}>
                            <View style={{width:'100%',margin:0,padding:0,border:1.2,borderBottom:0.6,borderColor:'#0000ff',flexDirection:'row',flexGrow:0}}>
                                <View style={{width: '35%'}}>
                                    <Text style={[Styles.SupplierText,{fontSize:26}]}>세 금 계 산 서</Text>
                                </View>
                                <View style={{width: '20%',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                    <View style={{}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>(공급받는자 보관용)</Text>
                                    </View>
                                </View>
                                <View style={{width: '45%',display:'flex',flexDirection:'row'}}>
                                    <View style={{width: '30%',display:'flex',flexDirection:'column',borderRight:0.6,borderColor:'#0000ff',justifyContent:'space-around'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10,textAlign:'right'}]}>책 번 호</Text>
                                        <Text style={[Styles.SupplierText,{fontSize:10,textAlign:'right'}]}>일련 번호</Text>
                                    </View>
                                    <View style={{width: '70%',display:'flex',flexDirection:'column'}}>
                                        <View style={{width: '100%',display:'flex',flexDirection:'row',borderBottom:0.6,borderColor:'#0000ff'}}>
                                            <View style={{width:'50%',height:20,borderRight:0.6,borderColor:'#0000ff',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10,textAlign:'right'}]}>{`${invoiceData.index1} 권`}</Text>
                                            </View>
                                            <View style={{width:'50%',height:20,display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10,textAlign:'right'}]}>{`${invoiceData.index2} 호`}</Text>
                                            </View>
                                        </View>
                                        <View style={{width: '100%',display:'flex',flexDirection:'column'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>{invoiceData.sequence_number}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={{width:'100%',margin:0,padding:0,border:0,flexDirection:'row',flexGrow:0}}>
                                {/* 공급자 */}
                                <View style={{width:'50%',margin:0,padding:0,border:0,flexDirection:'row'}}>
                                    <View style={{width:20,borderLeft:1.2,borderRight:0.6,borderColor:'#0000ff',alignItems:'center',alignContent:'center',justifyContent:'center',flexGrow:0,flexDirection:'column'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>공 급 자</Text>
                                    </View>
                                    <View style={{flexDirection:'column',border:0,flexGrow:1}}>
                                        <View style={{border:0.6,borderColor:'#0000ff'}}>
                                            <View style={{height:27,borderBottom:0.6,borderColor:'#0000ff',alignItems:'center',alignContent:'center',flexDirection:'row'}}>
                                                <View style={{width:'20%',height:28,borderRight:0.6,borderColor:'#0000ff',alignItems:'center'}}>
                                                    <Text style={[Styles.SupplierText,{fontSize:10,marginTop:6}]}>등록번호</Text>
                                                </View>
                                                <View style={{width:'80%'}}>
                                                    <Text style={[Styles.SupplierRegNo]}>{supplier.business_registration_code}</Text>
                                                </View>
                                            </View>
                                            <View style={{height:27,borderBottom:0.6,borderColor:'#0000ff',alignItems:'stretch',alignContent:'center',flexDirection:'row'}}>
                                                <View style={{width:'20%',height:26,alignItems:'center',borderRight:0.6,borderColor:'#0000ff',flexGrow:0}}>
                                                    <Text style={[Styles.SupplierText,{fontSize:10,marginBottom:-2}]}>상   호</Text>
                                                    <Text style={[Styles.SupplierText,{fontSize:10,marginTop:-2}]}>(법인명)</Text>
                                                </View>
                                                <View style={{width:'36%',alignItems:'center',borderRight:0.6,borderColor:'#0000ff'}}>
                                                    <Text style={[Styles.inputText,{fontSize:10,marginTop:6}]}>{supplier.company_name}</Text>
                                                </View>
                                                <View style={{width:'7%',alignItems:'center',borderRight:0.6,borderColor:'#0000ff',flexGrow:0}}>
                                                    <Text style={[Styles.SupplierText,{fontSize:10,marginBottom:-2}]}>성</Text>
                                                    <Text style={[Styles.SupplierText,{fontSize:10,marginTop:-2}]}>명</Text>
                                                </View>
                                                <View style={{width:'36%',alignItems:'center'}}>
                                                    <Text style={[Styles.inputText,{fontSize:10,marginTop:5}]}>{supplier.ceo_name}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{height:27,borderBottom:0.6,borderColor:'#0000ff',alignItems:'center',alignContent:'center',flexDirection:'row'}}>
                                            <View style={{width:'20%',height:26,alignItems:'center',borderRight:0.6,borderColor:'#0000ff',flexGrow:0}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10,marginBottom:-2}]}>사업장</Text>
                                                <Text style={[Styles.SupplierText,{fontSize:10,marginTop:-2}]}>주  소</Text>
                                            </View>
                                            <View style={{width:'80%',paddingLeft:2}}>
                                                <Text style={[Styles.inputText,{fontSize:10,letterSpacing:-1,textAlign:'left'}]}>{supplier.company_address}</Text>
                                            </View>
                                        </View>
                                        <View style={{height:26,border:0,flexDirection:'row',alignItems:'center',alignContent:'center'}}>
                                            <View style={{width:'20%',height:26,alignItems:'center',borderRight:0.6,borderColor:'#0000ff',flexGrow:0}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10,marginTop:6}]}>업  태</Text>
                                            </View>
                                            <View style={{width:'27.5%',paddingLeft:2}}>
                                                <Text style={[Styles.inputText,{fontSize:10,letterSpacing:-1}]}>{supplier.business_type}</Text>
                                            </View>
                                            <View style={{width:'7%',height:26,alignItems:'center',borderLeft:0.6,borderRight:0.6,borderColor:'#0000ff',flexGrow:0}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10,marginBottom:-2}]}>종</Text>
                                                <Text style={[Styles.SupplierText,{fontSize:10,marginTop:-2}]}>목</Text>
                                            </View>
                                            <View style={{width:'44.5%',paddingLeft:2}}>
                                                <Text style={[Styles.inputText,{fontSize:9,letterSpacing:-1}]}>{supplier.business_item}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                {/* 공급받는자 */}
                                <View style={{width:'50%',margin:0,padding:0,border:0,flexDirection:'row'}}>
                                    <View style={{width:20,borderLeft:0.6,borderRight:0.6,borderColor:'#0000ff',alignItems:'center',alignContent:'center',justifyContent:'center',flexGrow:0,flexDirection:'column'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>공 급 받 는 자</Text>
                                    </View>
                                    <View style={{flexDirection:'column',borderRight:0.6,borderColor:'#0000ff',flexGrow:1}}>
                                        <View style={{height:27,border:0.6,borderColor:'#0000ff',alignItems:'center',alignContent:'center',flexDirection:'row'}}>
                                            <View style={{width:'20%',height:28,borderRight:0.6,borderColor:'#0000ff',alignItems:'center',flexGrow:0}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10,marginTop:6}]}>등록번호</Text>
                                            </View>
                                            <View style={{width:'80%'}}>
                                                <Text style={[Styles.SupplierRegNo]}>{receiver.business_registration_code}</Text>
                                            </View>
                                        </View>
                                        <View style={{height:27,borderTop:0.6,borderRight:0.6,borderBottom:0.6,borderColor:'#0000ff',alignItems:'stretch',alignContent:'center',flexDirection:'row'}}>
                                            <View style={{width:'20%',height:26,alignItems:'center',borderRight:0.6,borderColor:'#0000ff',flexGrow:0}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10,marginBottom:-2}]}>상   호</Text>
                                                <Text style={[Styles.SupplierText,{fontSize:10,marginTop:-2}]}>(법인명)</Text>
                                            </View>
                                            <View style={{width:'36%',alignItems:'center',borderRight:0.6,borderColor:'#0000ff'}}>
                                                <Text style={[Styles.inputText,{fontSize:10,marginTop:6}]}>{receiver.company_name}</Text>
                                            </View>
                                            <View style={{width:'7%',alignItems:'center',borderRight:0.6,borderColor:'#0000ff',flexGrow:0}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10,marginBottom:-2}]}>성</Text>
                                                <Text style={[Styles.SupplierText,{fontSize:10,marginTop:-2}]}>명</Text>
                                            </View>
                                            <View style={{width:'36%',alignItems:'center',height:26}}>
                                                <Text style={[Styles.inputText,{fontSize:10,marginTop:5}]}>{receiver.ceo_name}</Text>
                                            </View>
                                        </View>
                                        <View style={{height:27,borderBottom:0.6,borderRight:0.6,borderColor:'#0000ff',alignItems:'center',alignContent:'center',flexDirection:'row'}}>
                                            <View style={{width:'20%',height:26,alignItems:'center',borderRight:0.6,borderColor:'#0000ff',flexGrow:0}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10,marginBottom:-2}]}>사업장</Text>
                                                <Text style={[Styles.SupplierText,{fontSize:10,marginTop:-2}]}>주  소</Text>
                                            </View>
                                            <View style={{width:'80%',paddingLeft:2}}>
                                                <Text style={[Styles.inputText,{fontSize:10,letterSpacing:-1,textAlign:'left'}]}>{receiver.company_address}</Text>
                                            </View>
                                        </View>
                                        <View style={{height:28,borderRight:0.6,flexDirection:'row',alignItems:'center',alignContent:'center'}}>
                                            <View style={{width:'20%',height:26,alignItems:'center',borderRight:0.6,borderColor:'#0000ff',flexGrow:0}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10,marginTop:6}]}>업  태</Text>
                                            </View>
                                            <View style={{width:'27.5%',paddingLeft:2}}>
                                                <Text style={[Styles.inputText,{fontSize:10,letterSpacing:-1}]}>{receiver.business_type}</Text>
                                            </View>
                                            <View style={{width:'7%',height:26,alignItems:'center',borderLeft:0.6,borderRight:0.6,borderColor:'#0000ff',flexGrow:0}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10,marginBottom:-2}]}>종</Text>
                                                <Text style={[Styles.SupplierText,{fontSize:10,marginTop:-2}]}>목</Text>
                                            </View>
                                            <View style={{width:'44.5%',paddingLeft:2}}>
                                                <Text style={[Styles.inputText,{fontSize:9,letterSpacing:-1}]}>{receiver.business_item}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            {/* 금액 표시 부분 */}
                            <View style={{width:'100%',margin:0,padding:0,border:0.6,borderColor:'#0000ff',flexDirection:'row',flexGrow:0}}>
                                <View style={{flex:'1 1 15%', display:'flex',border:0.6,borderColor:'#0000ff',flexDirection:'column'}}>
                                    <View style={{textAlign:'center',borderBottom:0.6,borderColor:'#0000ff',}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>작 성</Text>
                                    </View>
                                    <View style={{textAlign:'center',borderBottom:0.6,borderColor:'#0000ff',}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>년 월 일</Text>
                                    </View>
                                    <View style={{height:28,display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                        <View>
                                            <Text style={[Styles.inputText,{fontSize:11,textAlign:'center'}]}>{formatDate(invoiceData.create_date, 1)}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{flex:'1 1 41%',border:0.6,borderColor:'#0000ff',display:'flex', flexDirection:'column'}}>
                                    <View style={{width: '100%',textAlign:'center',borderBottom:0.6,borderColor:'#0000ff'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>공 급 가 액</Text>
                                    </View>
                                    <View style={{width: '100%',display:'flex',flexDirection:'row',textAlign:'center'}}>
                                        <View style={{flex:'3 3 21.2%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:1.2,borderColor:'#0000ff'}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10}]}>공란</Text>
                                            </View>
                                            <View style={{height:28,borderRight:1.2,borderColor:'#0000ff',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                    <Text style={[Styles.inputText,{fontSize:11,textAlign:'center'}]}>{invoiceData.vacant_count}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 7.1%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:0.6,borderColor:'#0000ff'}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10}]}>백</Text>
                                            </View>
                                            <View style={{height:28,borderRight:0.6,borderColor:'#0000ff',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                    <Text style={[Styles.SupplierText,{fontSize:11}]}>{invoiceData.supply_text.at(0)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 7.1%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:1.2,borderColor:'#0000ff'}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10}]}>십</Text>
                                            </View>
                                            <View style={{height:28,borderRight:1.2,borderColor:'#0000ff',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                <Text style={[Styles.SupplierText,{fontSize:11}]}>{invoiceData.supply_text.at(1)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 7.1%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:0.6,borderColor:'#0000ff'}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10}]}>억</Text>
                                            </View>
                                            <View style={{height:28,borderRight:0.6,borderColor:'#0000ff',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                    <Text style={[Styles.SupplierText,{fontSize:11}]}>{invoiceData.supply_text.at(2)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 7.1%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:0.6,borderColor:'#0000ff'}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10}]}>천</Text>
                                            </View>
                                            <View style={{height:28,borderRight:0.6,borderColor:'#0000ff',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                    <Text style={[Styles.SupplierText,{fontSize:11}]}>{invoiceData.supply_text.at(3)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 7.1%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:1.2,borderColor:'#0000ff'}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10}]}>백</Text>
                                            </View>
                                            <View style={{height:28,borderRight:1.2,borderColor:'#0000ff',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                <Text style={[Styles.SupplierText,{fontSize:11}]}>{invoiceData.supply_text.at(4)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 7.1%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:0.6,borderColor:'#0000ff'}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10}]}>십</Text>
                                            </View>
                                            <View style={{height:28,borderRight:0.6,borderColor:'#0000ff',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                    <Text style={[Styles.SupplierText,{fontSize:11}]}>{invoiceData.supply_text.at(5)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 7.1%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:0.6,borderColor:'#0000ff'}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10}]}>만</Text>
                                            </View>
                                            <View style={{height:28,borderRight:0.6,borderColor:'#0000ff',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                    <Text style={[Styles.SupplierText,{fontSize:11}]}>{invoiceData.supply_text.at(6)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 7.1%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:1.2,borderColor:'#0000ff'}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10}]}>천</Text>
                                            </View>
                                            <View style={{height:28,borderRight:1.2,borderColor:'#0000ff',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                <Text style={[Styles.SupplierText,{fontSize:11}]}>{invoiceData.supply_text.at(7)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 7.1%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:0.6,borderColor:'#0000ff'}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10}]}>백</Text>
                                            </View>
                                            <View style={{height:28,borderRight:0.6,borderColor:'#0000ff',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                    <Text style={[Styles.SupplierText,{fontSize:10}]}>{invoiceData.supply_text.at(8)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 7.1%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:0.6,borderColor:'#0000ff'}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10}]}>십</Text>
                                            </View>
                                            <View style={{height:28,borderRight:0.6,borderColor:'#0000ff',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                    <Text style={[Styles.SupplierText,{fontSize:11}]}>{invoiceData.supply_text.at(9)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 7.1%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderColor:'#0000ff'}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10}]}>원</Text>
                                            </View>
                                            <View style={{height:28,display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                    <Text style={[Styles.SupplierText,{fontSize:11}]}>{invoiceData.supply_text.at(10)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={{flex:'1 1 29%',border:0.6,borderColor:'#0000ff',display:'flex',flexDirection:'column'}}>
                                    <View style={{width: '100%',textAlign:'center',borderBottom:0.6,borderColor:'#0000ff'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>세   액</Text>
                                    </View>
                                    <View style={{width: '100%',display:'flex',flexDirection:'row',textAlign:'center'}}>
                                        <View style={{flex:'1 1 10%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:1.2,borderColor:'#0000ff'}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10}]}>십</Text>
                                            </View>
                                            <View style={{height:28,borderRight:1.2,borderColor:'#0000ff',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                <Text style={[Styles.SupplierText,{fontSize:11}]}>{invoiceData.tax_text.at(0)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 10%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:0.6,borderColor:'#0000ff'}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10}]}>억</Text>
                                            </View>
                                            <View style={{height:28,borderRight:0.6,borderColor:'#0000ff',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                <Text style={[Styles.SupplierText,{fontSize:11}]}>{invoiceData.tax_text.at(1)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 10%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:0.6,borderColor:'#0000ff'}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10}]}>천</Text>
                                            </View>
                                            <View style={{height:28,borderRight:0.6,borderColor:'#0000ff',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                <Text style={[Styles.SupplierText,{fontSize:11}]}>{invoiceData.tax_text.at(2)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 10%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:1.2,borderColor:'#0000ff'}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10}]}>백</Text>
                                            </View>
                                            <View style={{height:28,borderRight:1.2,borderColor:'#0000ff',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                <Text style={[Styles.SupplierText,{fontSize:11}]}>{invoiceData.tax_text.at(3)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 10%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:0.6,borderColor:'#0000ff'}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10}]}>십</Text>
                                            </View>
                                            <View style={{height:28,borderRight:0.6,borderColor:'#0000ff',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                <Text style={[Styles.SupplierText,{fontSize:11}]}>{invoiceData.tax_text.at(4)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 10%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:0.6,borderColor:'#0000ff'}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10}]}>만</Text>
                                            </View>
                                            <View style={{height:28,borderRight:0.6,borderColor:'#0000ff',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                <Text style={[Styles.SupplierText,{fontSize:11}]}>{invoiceData.tax_text.at(5)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 10%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:1.2,borderColor:'#0000ff'}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10}]}>천</Text>
                                            </View>
                                            <View style={{height:28,borderRight:1.2,borderColor:'#0000ff',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                <Text style={[Styles.SupplierText,{fontSize:11}]}>{invoiceData.tax_text.at(6)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 10%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:0.6,borderColor:'#0000ff'}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10}]}>백</Text>
                                            </View>
                                            <View style={{height:28,borderRight:0.6,borderColor:'#0000ff',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                <Text style={[Styles.SupplierText,{fontSize:11}]}>{invoiceData.tax_text.at(7)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 10%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:0.6,borderColor:'#0000ff'}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10}]}>십</Text>
                                            </View>
                                            <View style={{height:28,borderRight:0.6,borderColor:'#0000ff',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                <Text style={[Styles.SupplierText,{fontSize:11}]}>{invoiceData.tax_text.at(8)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 10%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderColor:'#0000ff'}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10}]}>원</Text>
                                            </View>
                                            <View style={{height:28,display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                <Text style={[Styles.SupplierText,{fontSize:11}]}>{invoiceData.tax_text.at(9)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={{flex:'1 1 15%',borderRight:0.6,borderLeft:0.6,borderColor:'#0000ff',display:'flex',flexDirection:'column'}}>
                                    <View style={{textAlign:'center',borderBottom:0.6,borderColor:'#0000ff'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>비 고</Text>
                                    </View>
                                    <View style={{textAlign:'center'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>{invoiceData.memo}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{width:'100%',margin:0,padding:0,borderRight:1.2,borderLeft:1.2,borderColor:'#0000ff',flexDirection:'column',flexGrow:1}}>
                                <View style={{width:'100%',height:100,margin:0,padding:0,borderBottom:0.6,borderColor:'#0000ff',flexDirection:'column'}}>
                                    <View style={{width: '100%',height:20,margin:0,padding:0,borderBottom:0.6,borderColor:'#0000ff',flexDirection:'row',alignContent:'center'}}>
                                        <View style={{width:'7%',margin:0,padding:0,borderRight:0.6,borderColor:'#0000ff',flexGrow:0,alignItems:'center',justifyContent:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>월.일</Text>
                                        </View>
                                        <View style={{width:'32%',margin:0,padding:0,borderRight:0.6,borderColor:'#0000ff',flexGrow:1,alignItems:'center',justifyContent:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>품    목</Text>
                                        </View>
                                        <View style={{width:'10%',margin:0,padding:0,borderRight:0.6,borderColor:'#0000ff',flexGrow:0,alignItems:'center',justifyContent:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>규격</Text>
                                        </View>
                                        <View style={{width:'10%',margin:0,padding:0,borderRight:0.6,borderColor:'#0000ff',flexGrow:0,alignItems:'center',justifyContent:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>수량</Text>
                                        </View>
                                        <View style={{width:'14%',margin:0,padding:0,borderRight:0.6,borderColor:'#0000ff',flexGrow:0,alignItems:'center',justifyContent:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>단가</Text>
                                        </View>
                                        <View style={{width:'15%',margin:0,padding:0,borderRight:0.6,borderColor:'#0000ff',flexGrow:0,alignItems:'center',justifyContent:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>공급가액</Text>
                                        </View>
                                        <View style={{width:'12%',margin:0,padding:0,border:0,flexGrow:0,alignItems:'center',justifyContent:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>세액</Text>
                                        </View>
                                    </View>
                                    {  transactionContents && transactionContents.length >= 5 &&
                                        transactionContents.map((item, index) => {
                                            if(item) {
                                                if(index % 2 === 0) {
                                                    return (
                                                        <View key={index} style={[Styles.contentRow, {borderBottom:0.6,borderColor:"#0000ff"}]}>
                                                            <View style={[Styles.contentCell, {width:'7%',borderRight:0.6,borderColor:"#0000ff",flexGrow:0,justifyContent:'center'}]}>
                                                                <Text style={[Styles.inputTextCenter,{fontSize:10}]}>{item.month_day}</Text>
                                                            </View>
                                                            <View style={{width:'32%',paddingLeft:2,borderRight:0.6,borderColor:"#0000ff",flexGrow:1}}>
                                                                <Text style={[Styles.inputText,{fontSize:10}]}>{item.product_name}</Text>
                                                            </View>
                                                            <View style={[Styles.contentCell, {width:'10%',borderRight:0.6,borderColor:"#0000ff",flexGrow:0}]}>
                                                                <Text style={[Styles.inputTextCenter,{fontSize:10}]}>{item.standard}</Text>
                                                            </View>
                                                            <View style={[Styles.contentCell, {width:'10%',borderRight:0.6,borderColor:"#0000ff",flexGrow:0,justifyContent:'flex-end'}]}>
                                                                <Text style={[Styles.inputTextCenter,{fontSize:10}]}>{item.quantity}</Text>
                                                            </View>
                                                            <View style={[Styles.contentCell, {width:'14%',borderRight:0.6,borderColor:"#0000ff",flexGrow:0,justifyContent:'flex-end'}]}>
                                                                <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(item.supply_price)}</Text>
                                                            </View>
                                                            <View style={[Styles.contentCell, {width:'15%',borderRight:0.6,borderColor:"#0000ff",flexGrow:0,justifyContent:'flex-end'}]}>
                                                                <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(item.total_price)}</Text>
                                                            </View>
                                                            <View style={[Styles.contentCell, {width:'12%',border:0,flexGrow:0,justifyContent:'flex-end'}]}>
                                                                <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(item.tax_price)}</Text>
                                                            </View>
                                                        </View>
                                                )};
                                                if(index % 5 === 4) {
                                                    return (
                                                        <View key={index} style={[Styles.contentRow, {backgroundColor:"#0000ff"}]}>
                                                            <View style={[Styles.contentCell, {width:'7%',borderRight:0.6,borderColor:"#0000ff",flexGrow:0,justifyContent:'center'}]}>
                                                                <Text style={[Styles.inputTextCenter,{fontSize:10}]}>{item.month_day}</Text>
                                                            </View>
                                                            <View style={{width:'32%',paddingLeft:2,borderRight:0.6,borderColor:"#0000ff",flexGrow:1}}>
                                                                <Text style={[Styles.inputText,{fontSize:10}]}>{item.product_name}</Text>
                                                            </View>
                                                            <View style={[Styles.contentCell, {width:'10%',borderRight:0.6,borderColor:"#0000ff",flexGrow:0}]}>
                                                                <Text style={[Styles.inputTextCenter,{fontSize:10}]}>{item.standard}</Text>
                                                            </View>
                                                            <View style={[Styles.contentCell, {width:'10%',borderRight:0.6,borderColor:"#0000ff",flexGrow:0,justifyContent:'flex-end'}]}>
                                                                <Text style={[Styles.inputAmount,{fontSize:10}]}>{item.quantity}</Text>
                                                            </View>
                                                            <View style={[Styles.contentCell, {width:'14%',borderRight:0.6,borderColor:"#0000ff",flexGrow:0,justifyContent:'flex-end'}]}>
                                                                <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(item.supply_price)}</Text>
                                                            </View>
                                                            <View style={[Styles.contentCell, {width:'15%',borderRight:0.6,borderColor:"#0000ff",flexGrow:0,justifyContent:'flex-end'}]}>
                                                                <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(item.total_price)}</Text>
                                                            </View>
                                                            <View style={[Styles.contentCell, {width:'12%',border:0,flexGrow:0,justifyContent:'flex-end'}]}>
                                                                <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(item.tax_price)}</Text>
                                                            </View>
                                                        </View>
                                                )};
                                                return (
                                                    <View key={index} style={[Styles.contentRow, {borderBottom:0.6,borderColor:"#0000ff",backgroundColor:"#ededff"}]}>
                                                        <View style={[Styles.contentCell, {width:'7%',borderRight:0.6,borderColor:"#0000ff",flexGrow:0}]}>
                                                            <Text style={[Styles.inputTextCenter,{fontSize:10}]}>{item.month_day}</Text>
                                                        </View>
                                                        <View style={{width:'32%',paddingLeft:2,borderRight:0.6,borderColor:"#0000ff",flexGrow:1}}>
                                                            <Text style={[Styles.inputText,{fontSize:10}]}>{item.product_name}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:'10%',borderRight:0.6,borderColor:"#0000ff",flexGrow:0}]}>
                                                            <Text style={[Styles.inputTextCenter,{fontSize:10}]}>{item.standard}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:'10%',borderRight:0.6,borderColor:"#0000ff",flexGrow:0}]}>
                                                            <Text style={[Styles.inputAmount,{fontSize:10}]}>{item.quantity}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:'14%',borderRight:0.6,borderColor:"#0000ff",flexGrow:0}]}>
                                                            <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(item.supply_price)}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:'15%',borderRight:0.6,borderColor:"#0000ff",flexGrow:0}]}>
                                                            <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(item.total_price)}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:'12%',border:0,flexGrow:0}]}>
                                                            <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(item.tax_price)}</Text>
                                                        </View>
                                                    </View>
                                                );
                                            };
                                            if(index % 2 === 0) {
                                                return (
                                                    <View key={index} style={[Styles.contentRow, {borderBottom:0.6,borderColor:"#0000ff"}]}>
                                                        <View style={[Styles.contentCell, {width:'7%',borderRight:0.6,borderColor:"#0000ff",flexGrow:0}]}></View>
                                                        <View style={[Styles.contentCell, {width:'32%',borderRight:0.6,borderColor:"#0000ff",flexGrow:1}]}></View>
                                                        <View style={[Styles.contentCell, {width:'10%',borderRight:0.6,borderColor:"#0000ff",flexGrow:0}]}></View>
                                                        <View style={[Styles.contentCell, {width:'10%',borderRight:0.6,borderColor:"#0000ff",flexGrow:0}]}></View>
                                                        <View style={[Styles.contentCell, {width:'14%',borderRight:0.6,borderColor:"#0000ff",flexGrow:0}]}></View>
                                                        <View style={[Styles.contentCell, {width:'15%',borderRight:0.6,borderColor:"#0000ff",flexGrow:0}]}></View>
                                                        <View style={[Styles.contentCell, {width:'12%',border:0,flexGrow:0}]}></View>
                                                    </View>
                                                );
                                            };
                                            if(index % 5 === 4) {
                                                return (
                                                    <View key={index} style={[Styles.contentRow, {backgroundColor:"#ededff"}]}>
                                                        <View style={[Styles.contentCell, {width:'7%',borderRight:0.6,borderColor:"#0000ff",flexGrow:0}]}></View>
                                                        <View style={[Styles.contentCell, {width:'32%',borderRight:0.6,borderColor:"#0000ff",flexGrow:1}]}></View>
                                                        <View style={[Styles.contentCell, {width:'10%',borderRight:0.6,borderColor:"#0000ff",flexGrow:0}]}></View>
                                                        <View style={[Styles.contentCell, {width:'10%',borderRight:0.6,borderColor:"#0000ff",flexGrow:0}]}></View>
                                                        <View style={[Styles.contentCell, {width:'14%',borderRight:0.6,borderColor:"#0000ff",flexGrow:0}]}></View>
                                                        <View style={[Styles.contentCell, {width:'15%',borderRight:0.6,borderColor:"#0000ff",flexGrow:0}]}></View>
                                                        <View style={[Styles.contentCell, {width:'12%',border:0,flexGrow:0}]}></View>
                                                    </View> 
                                                );
                                            };
                                            return (
                                                <View key={index} style={[Styles.contentRow, {borderBottom:0.6,borderColor:"#0000ff",backgroundColor:"#ededff"}]}>
                                                    <View style={[Styles.contentCell, {width:'7%',borderRight:0.6,borderColor:"#0000ff",flexGrow:0}]}></View>
                                                    <View style={[Styles.contentCell, {width:'32%',borderRight:0.6,borderColor:"#0000ff",flexGrow:1}]}></View>
                                                    <View style={[Styles.contentCell, {width:'10%',borderRight:0.6,borderColor:"#0000ff",flexGrow:0}]}></View>
                                                    <View style={[Styles.contentCell, {width:'10%',borderRight:0.6,borderColor:"#0000ff",flexGrow:0}]}></View>
                                                    <View style={[Styles.contentCell, {width:'14%',borderRight:0.6,borderColor:"#0000ff",flexGrow:0}]}></View>
                                                    <View style={[Styles.contentCell, {width:'15%',borderRight:0.6,borderColor:"#0000ff",flexGrow:0}]}></View>
                                                    <View style={[Styles.contentCell, {width:'12%',border:0,flexGrow:0}]}></View>
                                                </View> 
                                            );
                                    })}
                                </View>
                                {invoiceData && 
                                    <View style={{width: '100%',margin:0,padding:0,borderTop:0.6,borderBottom:1.2,borderColor:'#0000ff',flexDirection:'row',alignContent:'center'}}>
                                        <View style={{flex:'1 1 16%',margin:0,padding:0,display:'flex',flexDirection:'column',alignContent:'center'}}>
                                            <View style={{width: '100%',height:18,margin:0,padding:0,borderRight:0.6,borderBottom:0.6,borderColor:'#0000ff',alignItems:'center',justifyContent:'center'}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10}]}>합 계 금 액</Text>
                                            </View>
                                            <View style={{width:'100%',height:18,margin:0,padding:0,borderRight:0.6,borderColor:'#0000ff',alignItems:'center',justifyContent:'end'}}>
                                                <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(invoiceData.total_price)}</Text>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 16%',margin:0,padding:0,display:'flex',flexDirection:'column',alignContent:'center'}}>
                                            <View style={{width:'100%',height:18,margin:0,padding:0,borderRight:0.6,borderBottom:0.6,borderColor:'#0000ff',alignItems:'center',justifyContent:'center'}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10}]}>현    금</Text>
                                            </View>
                                            <View style={{width:'100%',height:18,margin:0,padding:0,borderRight:0.6,borderColor:'#0000ff',alignItems:'center',justifyContent:'end'}}>
                                                <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(invoiceData.cash_amount)}</Text>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 16%',margin:0,padding:0,display:'flex',flexDirection:'column',alignContent:'center'}}>
                                            <View style={{width:'100%',height:18,margin:0,padding:0,borderRight:0.6,borderBottom:0.6,borderColor:'#0000ff',alignItems:'center',justifyContent:'center'}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10}]}>수    표</Text>
                                            </View>
                                            <View style={{width:'100%',height:18,margin:0,padding:0,borderRight:0.6,borderColor:'#0000ff',alignItems:'center',justifyContent:'end'}}>
                                                <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(invoiceData.check_amount)}</Text>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 16%',margin:0,padding:0,display:'flex',flexDirection:'column',alignContent:'center'}}>
                                            <View style={{width:'100%',height:18,margin:0,padding:0,borderRight:0.6,borderBottom:0.6,borderColor:'#0000ff',alignItems:'center',justifyContent:'center'}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10}]}>어    음</Text>
                                            </View>
                                            <View style={{width:'100%',height:18,margin:0,padding:0,borderRight:0.6,borderColor:'#0000ff',alignItems:'center',justifyContent:'end'}}>
                                                <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(invoiceData.note_amount)}</Text>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 16%',margin:0,padding:0,display:'flex',flexDirection:'column',alignContent:'center'}}>
                                            <View style={{width:'100%',height:18,margin:0,padding:0,borderRight:0.6,borderBottom:0.6,borderColor:'#0000ff',alignItems:'center',justifyContent:'center'}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10}]}>외상미수금</Text>
                                            </View>
                                            <View style={{width:'100%',height:18,margin:0,padding:0,borderRight:0.6,borderColor:'#0000ff',alignItems:'center',justifyContent:'end'}}>
                                                <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(invoiceData.receivable_amount)}</Text>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 20%',margin:0,padding:0,display:'flex',flexDirection:'row',justifyContent:'center'}}>
                                            <View style={{width:'50%',height:36,margin:0,padding:0,alignItems:'center',justifyContent:'center'}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10}]}>이 금액일</Text>
                                            </View>
                                            <View style={{width:'30%',height:36,margin:0,padding:0,display:'flex',flexDirection:'column'}}>
                                                <View style={{width:'100%',margin:0,padding:0}}>
                                                    <Text style={[Styles.SupplierText,{fontSize:10},invoiceData.request_type!=='청구' && {border:1,borderRadius:6}]}>영수</Text>
                                                </View>
                                                <View style={{width:'100%',margin:0,padding:0}}>
                                                    <Text style={[Styles.SupplierText,{fontSize:10},invoiceData.request_type==='청구' && {border:1,borderRadius:6}]}>청구</Text>
                                                </View>
                                            </View>
                                            <View style={{width:'20%',height:36,margin:0,padding:0,alignItems:'center',justifyContent:'center'}}>
                                                <Text style={[Styles.SupplierText,{fontSize:10}]}>함.</Text>
                                            </View>
                                        </View>
                                    </View>
                                }
                            </View>
                        </View>
                    </View>
                    {/* 중간 경계선 */}
                    <View style={{width:'100%', height:2, borderTop:1, marginVertical:5}}></View>
                    {/* 공급자 보관용*/}
                    <View style={{marginTop:10,padding:5}}>
                        <View style={{width:'100%',marginBottom:-2,padding:0,border:0,display:'flex',flexDirection:'row',justifyContent:'space-between',alignContent:'end',alignItems:'end'}}>
                            <View style={{width:'15%',height:16,margin:0,padding:0,fontFamily:'Noto Sans'}}>
                                <Text style={[Styles.ReceiverText,{fontSize:10}]}>별지 제11호 서식</Text>
                            </View>
                            <View style={{width:'15%',height:16,margin:0,padding:0,fontFamily:'Noto Sans'}}>
                                <Text style={[Styles.ReceiverText,{fontSize:10}]}>(적색)</Text>
                            </View>
                        </View>
                        <View style={{width:'100%',margin:0,padding:0,border:0,flexDirection:'column',flexGrow:0}}>
                            <View style={{width:'100%',margin:0,padding:0,border:1.2,borderBottom:0.6,borderColor:'#ff0505',flexDirection:'row',flexGrow:0}}>
                                <View style={{width: '35%'}}>
                                    <Text style={[Styles.ReceiverText,{fontSize:26}]}>세 금 계 산 서</Text>
                                </View>
                                <View style={{width: '20%',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                    <View style={{}}>
                                        <Text style={[Styles.ReceiverText,{fontSize:10}]}>(공급자 보관용)</Text>
                                    </View>
                                </View>
                                <View style={{width: '45%',display:'flex',flexDirection:'row'}}>
                                    <View style={{width: '30%',display:'flex',flexDirection:'column',borderRight:0.6,borderColor:'#ff0505',justifyContent:'space-around'}}>
                                        <Text style={[Styles.ReceiverText,{fontSize:10,textAlign:'right'}]}>책 번 호</Text>
                                        <Text style={[Styles.ReceiverText,{fontSize:10,textAlign:'right'}]}>일련 번호</Text>
                                    </View>
                                    <View style={{width: '70%',display:'flex',flexDirection:'column'}}>
                                        <View style={{width: '100%',display:'flex',flexDirection:'row',borderBottom:0.6,borderColor:'#ff0505'}}>
                                            <View style={{width:'50%',height:20,borderRight:0.6,borderColor:'#ff0505',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10,textAlign:'right'}]}>{`${invoiceData.index1} 권`}</Text>
                                            </View>
                                            <View style={{width:'50%',height:20,display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10,textAlign:'right'}]}>{`${invoiceData.index2} 호`}</Text>
                                            </View>
                                        </View>
                                        <View style={{width: '100%',display:'flex',flexDirection:'column'}}>
                                            <Text style={[Styles.ReceiverText,{fontSize:10}]}>{invoiceData.sequence_number}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={{width:'100%',margin:0,padding:0,border:0,flexDirection:'row',flexGrow:0}}>
                                {/* 공급자 */}
                                <View style={{width:'50%',margin:0,padding:0,border:0,flexDirection:'row'}}>
                                    <View style={{width:20,borderLeft:1.2,borderRight:0.6,borderColor:'#ff0505',alignItems:'center',alignContent:'center',justifyContent:'center',flexGrow:0,flexDirection:'column'}}>
                                        <Text style={[Styles.ReceiverText,{fontSize:10}]}>공 급 자</Text>
                                    </View>
                                    <View style={{flexDirection:'column',border:0,flexGrow:1}}>
                                        <View style={{border:0.6,borderColor:'#ff0505'}}>
                                            <View style={{height:27,borderBottom:0.6,borderColor:'#ff0505',alignItems:'center',alignContent:'center',flexDirection:'row'}}>
                                                <View style={{width:'20%',height:28,borderRight:0.6,borderColor:'#ff0505',alignItems:'center'}}>
                                                    <Text style={[Styles.ReceiverText,{fontSize:10,marginTop:6}]}>등록번호</Text>
                                                </View>
                                                <View style={{width:'80%'}}>
                                                    <Text style={[Styles.SupplierRegNo]}>{supplier.business_registration_code}</Text>
                                                </View>
                                            </View>
                                            <View style={{height:27,borderBottom:0.6,borderColor:'#ff0505',alignItems:'stretch',alignContent:'center',flexDirection:'row'}}>
                                                <View style={{width:'20%',height:26,alignItems:'center',borderRight:0.6,borderColor:'#ff0505',flexGrow:0}}>
                                                    <Text style={[Styles.ReceiverText,{fontSize:10,marginBottom:-2}]}>상   호</Text>
                                                    <Text style={[Styles.ReceiverText,{fontSize:10,marginTop:-2}]}>(법인명)</Text>
                                                </View>
                                                <View style={{width:'36%',alignItems:'center',borderRight:0.6,borderColor:'#ff0505'}}>
                                                    <Text style={[Styles.inputText,{fontSize:10,marginTop:6}]}>{supplier.company_name}</Text>
                                                </View>
                                                <View style={{width:'7%',alignItems:'center',borderRight:0.6,borderColor:'#ff0505',flexGrow:0}}>
                                                    <Text style={[Styles.ReceiverText,{fontSize:10,marginBottom:-2}]}>성</Text>
                                                    <Text style={[Styles.ReceiverText,{fontSize:10,marginTop:-2}]}>명</Text>
                                                </View>
                                                <View style={{width:'36%',alignItems:'center'}}>
                                                    <Text style={[Styles.inputText,{fontSize:10,marginTop:5}]}>{supplier.ceo_name}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{height:27,borderBottom:0.6,borderColor:'#ff0505',alignItems:'center',alignContent:'center',flexDirection:'row'}}>
                                            <View style={{width:'20%',height:26,alignItems:'center',borderRight:0.6,borderColor:'#ff0505',flexGrow:0}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10,marginBottom:-2}]}>사업장</Text>
                                                <Text style={[Styles.ReceiverText,{fontSize:10,marginTop:-2}]}>주  소</Text>
                                            </View>
                                            <View style={{width:'80%',paddingLeft:2}}>
                                                <Text style={[Styles.inputText,{fontSize:10,letterSpacing:-1,textAlign:'left'}]}>{supplier.company_address}</Text>
                                            </View>
                                        </View>
                                        <View style={{height:26,border:0,flexDirection:'row',alignItems:'center',alignContent:'center'}}>
                                            <View style={{width:'20%',height:26,alignItems:'center',borderRight:0.6,borderColor:'#ff0505',flexGrow:0}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10,marginTop:6}]}>업  태</Text>
                                            </View>
                                            <View style={{width:'27.5%',paddingLeft:2}}>
                                                <Text style={[Styles.inputText,{fontSize:10,letterSpacing:-1}]}>{supplier.business_type}</Text>
                                            </View>
                                            <View style={{width:'7%',height:26,alignItems:'center',borderLeft:0.6,borderRight:0.6,borderColor:'#ff0505',flexGrow:0}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10,marginBottom:-2}]}>종</Text>
                                                <Text style={[Styles.ReceiverText,{fontSize:10,marginTop:-2}]}>목</Text>
                                            </View>
                                            <View style={{width:'44.5%',paddingLeft:2}}>
                                                <Text style={[Styles.inputText,{fontSize:9,letterSpacing:-1}]}>{supplier.business_item}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                {/* 공급받는자 */}
                                <View style={{width:'50%',margin:0,padding:0,border:0,flexDirection:'row'}}>
                                    <View style={{width:20,borderLeft:0.6,borderRight:0.6,borderColor:'#ff0505',alignItems:'center',alignContent:'center',justifyContent:'center',flexGrow:0,flexDirection:'column'}}>
                                        <Text style={[Styles.ReceiverText,{fontSize:10}]}>공 급 받 는 자</Text>
                                    </View>
                                    <View style={{flexDirection:'column',borderRight:0.6,borderColor:'#ff0505',flexGrow:1}}>
                                        <View style={{height:27,border:0.6,borderColor:'#ff0505',alignItems:'center',alignContent:'center',flexDirection:'row'}}>
                                            <View style={{width:'20%',height:28,borderRight:0.6,borderColor:'#ff0505',alignItems:'center',flexGrow:0}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10,marginTop:6}]}>등록번호</Text>
                                            </View>
                                            <View style={{width:'80%'}}>
                                                <Text style={[Styles.SupplierRegNo]}>{receiver.business_registration_code}</Text>
                                            </View>
                                        </View>
                                        <View style={{height:27,borderTop:0.6,borderRight:0.6,borderBottom:0.6,borderColor:'#ff0505',alignItems:'stretch',alignContent:'center',flexDirection:'row'}}>
                                            <View style={{width:'20%',height:26,alignItems:'center',borderRight:0.6,borderColor:'#ff0505',flexGrow:0}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10,marginBottom:-2}]}>상   호</Text>
                                                <Text style={[Styles.ReceiverText,{fontSize:10,marginTop:-2}]}>(법인명)</Text>
                                            </View>
                                            <View style={{width:'36%',alignItems:'center',borderRight:0.6,borderColor:'#ff0505'}}>
                                                <Text style={[Styles.inputText,{fontSize:10,marginTop:6}]}>{receiver.company_name}</Text>
                                            </View>
                                            <View style={{width:'7%',alignItems:'center',borderRight:0.6,borderColor:'#ff0505',flexGrow:0}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10,marginBottom:-2}]}>성</Text>
                                                <Text style={[Styles.ReceiverText,{fontSize:10,marginTop:-2}]}>명</Text>
                                            </View>
                                            <View style={{width:'36%',alignItems:'center',height:26}}>
                                                <Text style={[Styles.inputText,{fontSize:10,marginTop:5}]}>{receiver.ceo_name}</Text>
                                            </View>
                                        </View>
                                        <View style={{height:27,borderBottom:0.6,borderRight:0.6,borderColor:'#ff0505',alignItems:'center',alignContent:'center',flexDirection:'row'}}>
                                            <View style={{width:'20%',height:26,alignItems:'center',borderRight:0.6,borderColor:'#ff0505',flexGrow:0}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10,marginBottom:-2}]}>사업장</Text>
                                                <Text style={[Styles.ReceiverText,{fontSize:10,marginTop:-2}]}>주  소</Text>
                                            </View>
                                            <View style={{width:'80%',paddingLeft:2}}>
                                                <Text style={[Styles.inputText,{fontSize:10,letterSpacing:-1,textAlign:'left'}]}>{receiver.company_address}</Text>
                                            </View>
                                        </View>
                                        <View style={{height:28,borderRight:0.6,flexDirection:'row',alignItems:'center',alignContent:'center'}}>
                                            <View style={{width:'20%',height:26,alignItems:'center',borderRight:0.6,borderColor:'#ff0505',flexGrow:0}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10,marginTop:6}]}>업  태</Text>
                                            </View>
                                            <View style={{width:'27.5%',paddingLeft:2}}>
                                                <Text style={[Styles.inputText,{fontSize:10,letterSpacing:-1}]}>{receiver.business_type}</Text>
                                            </View>
                                            <View style={{width:'7%',height:26,alignItems:'center',borderLeft:0.6,borderRight:0.6,borderColor:'#ff0505',flexGrow:0}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10,marginBottom:-2}]}>종</Text>
                                                <Text style={[Styles.ReceiverText,{fontSize:10,marginTop:-2}]}>목</Text>
                                            </View>
                                            <View style={{width:'44.5%',paddingLeft:2}}>
                                                <Text style={[Styles.inputText,{fontSize:9,letterSpacing:-1}]}>{receiver.business_item}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            {/* 금액 표시 부분 */}
                            <View style={{width:'100%',margin:0,padding:0,border:0.6,borderColor:'#ff0505',flexDirection:'row',flexGrow:0}}>
                                <View style={{flex:'1 1 15%', display:'flex',border:0.6,borderColor:'#ff0505',flexDirection:'column'}}>
                                    <View style={{textAlign:'center',borderBottom:0.6,borderColor:'#ff0505',}}>
                                        <Text style={[Styles.ReceiverText,{fontSize:10}]}>작 성</Text>
                                    </View>
                                    <View style={{textAlign:'center',borderBottom:0.6,borderColor:'#ff0505',}}>
                                        <Text style={[Styles.ReceiverText,{fontSize:10}]}>년 월 일</Text>
                                    </View>
                                    <View style={{height:28,display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                        <View>
                                            <Text style={[Styles.inputText,{fontSize:11,textAlign:'center'}]}>{formatDate(invoiceData.create_date, 1)}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{flex:'1 1 41%',border:0.6,borderColor:'#ff0505',display:'flex', flexDirection:'column'}}>
                                    <View style={{width: '100%',textAlign:'center',borderBottom:0.6,borderColor:'#ff0505'}}>
                                        <Text style={[Styles.ReceiverText,{fontSize:10}]}>공 급 가 액</Text>
                                    </View>
                                    <View style={{width: '100%',display:'flex',flexDirection:'row',textAlign:'center'}}>
                                        <View style={{flex:'3 3 21.2%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:1.2,borderColor:'#ff0505'}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10}]}>공란</Text>
                                            </View>
                                            <View style={{height:28,borderRight:1.2,borderColor:'#ff0505',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                    <Text style={[Styles.inputText,{fontSize:11,textAlign:'center'}]}>{invoiceData.vacant_count}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 7.1%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:0.6,borderColor:'#ff0505'}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10}]}>백</Text>
                                            </View>
                                            <View style={{height:28,borderRight:0.6,borderColor:'#ff0505',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                    <Text style={[Styles.ReceiverText,{fontSize:11}]}>{invoiceData.supply_text.at(0)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 7.1%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:1.2,borderColor:'#ff0505'}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10}]}>십</Text>
                                            </View>
                                            <View style={{height:28,borderRight:1.2,borderColor:'#ff0505',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                <Text style={[Styles.ReceiverText,{fontSize:11}]}>{invoiceData.supply_text.at(1)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 7.1%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:0.6,borderColor:'#ff0505'}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10}]}>억</Text>
                                            </View>
                                            <View style={{height:28,borderRight:0.6,borderColor:'#ff0505',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                    <Text style={[Styles.ReceiverText,{fontSize:11}]}>{invoiceData.supply_text.at(2)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 7.1%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:0.6,borderColor:'#ff0505'}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10}]}>천</Text>
                                            </View>
                                            <View style={{height:28,borderRight:0.6,borderColor:'#ff0505',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                    <Text style={[Styles.ReceiverText,{fontSize:11}]}>{invoiceData.supply_text.at(3)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 7.1%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:1.2,borderColor:'#ff0505'}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10}]}>백</Text>
                                            </View>
                                            <View style={{height:28,borderRight:1.2,borderColor:'#ff0505',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                <Text style={[Styles.ReceiverText,{fontSize:11}]}>{invoiceData.supply_text.at(4)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 7.1%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:0.6,borderColor:'#ff0505'}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10}]}>십</Text>
                                            </View>
                                            <View style={{height:28,borderRight:0.6,borderColor:'#ff0505',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                    <Text style={[Styles.ReceiverText,{fontSize:11}]}>{invoiceData.supply_text.at(5)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 7.1%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:0.6,borderColor:'#ff0505'}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10}]}>만</Text>
                                            </View>
                                            <View style={{height:28,borderRight:0.6,borderColor:'#ff0505',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                    <Text style={[Styles.ReceiverText,{fontSize:11}]}>{invoiceData.supply_text.at(6)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 7.1%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:1.2,borderColor:'#ff0505'}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10}]}>천</Text>
                                            </View>
                                            <View style={{height:28,borderRight:1.2,borderColor:'#ff0505',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                <Text style={[Styles.ReceiverText,{fontSize:11}]}>{invoiceData.supply_text.at(7)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 7.1%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:0.6,borderColor:'#ff0505'}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10}]}>백</Text>
                                            </View>
                                            <View style={{height:28,borderRight:0.6,borderColor:'#ff0505',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                    <Text style={[Styles.ReceiverText,{fontSize:10}]}>{invoiceData.supply_text.at(8)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 7.1%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:0.6,borderColor:'#ff0505'}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10}]}>십</Text>
                                            </View>
                                            <View style={{height:28,borderRight:0.6,borderColor:'#ff0505',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                    <Text style={[Styles.ReceiverText,{fontSize:11}]}>{invoiceData.supply_text.at(9)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 7.1%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderColor:'#ff0505'}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10}]}>원</Text>
                                            </View>
                                            <View style={{height:28,display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                    <Text style={[Styles.ReceiverText,{fontSize:11}]}>{invoiceData.supply_text.at(10)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={{flex:'1 1 29%',border:0.6,borderColor:'#ff0505',display:'flex',flexDirection:'column'}}>
                                    <View style={{width: '100%',textAlign:'center',borderBottom:0.6,borderColor:'#ff0505'}}>
                                        <Text style={[Styles.ReceiverText,{fontSize:10}]}>세   액</Text>
                                    </View>
                                    <View style={{width: '100%',display:'flex',flexDirection:'row',textAlign:'center'}}>
                                        <View style={{flex:'1 1 10%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:1.2,borderColor:'#ff0505'}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10}]}>십</Text>
                                            </View>
                                            <View style={{height:28,borderRight:1.2,borderColor:'#ff0505',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                <Text style={[Styles.ReceiverText,{fontSize:11}]}>{invoiceData.tax_text.at(0)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 10%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:0.6,borderColor:'#ff0505'}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10}]}>억</Text>
                                            </View>
                                            <View style={{height:28,borderRight:0.6,borderColor:'#ff0505',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                <Text style={[Styles.ReceiverText,{fontSize:11}]}>{invoiceData.tax_text.at(1)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 10%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:0.6,borderColor:'#ff0505'}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10}]}>천</Text>
                                            </View>
                                            <View style={{height:28,borderRight:0.6,borderColor:'#ff0505',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                <Text style={[Styles.ReceiverText,{fontSize:11}]}>{invoiceData.tax_text.at(2)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 10%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:1.2,borderColor:'#ff0505'}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10}]}>백</Text>
                                            </View>
                                            <View style={{height:28,borderRight:1.2,borderColor:'#ff0505',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                <Text style={[Styles.ReceiverText,{fontSize:11}]}>{invoiceData.tax_text.at(3)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 10%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:0.6,borderColor:'#ff0505'}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10}]}>십</Text>
                                            </View>
                                            <View style={{height:28,borderRight:0.6,borderColor:'#ff0505',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                <Text style={[Styles.ReceiverText,{fontSize:11}]}>{invoiceData.tax_text.at(4)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 10%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:0.6,borderColor:'#ff0505'}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10}]}>만</Text>
                                            </View>
                                            <View style={{height:28,borderRight:0.6,borderColor:'#ff0505',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                <Text style={[Styles.ReceiverText,{fontSize:11}]}>{invoiceData.tax_text.at(5)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 10%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:1.2,borderColor:'#ff0505'}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10}]}>천</Text>
                                            </View>
                                            <View style={{height:28,borderRight:1.2,borderColor:'#ff0505',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                <Text style={[Styles.ReceiverText,{fontSize:11}]}>{invoiceData.tax_text.at(6)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 10%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:0.6,borderColor:'#ff0505'}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10}]}>백</Text>
                                            </View>
                                            <View style={{height:28,borderRight:0.6,borderColor:'#ff0505',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                <Text style={[Styles.ReceiverText,{fontSize:11}]}>{invoiceData.tax_text.at(7)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 10%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderRight:0.6,borderColor:'#ff0505'}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10}]}>십</Text>
                                            </View>
                                            <View style={{height:28,borderRight:0.6,borderColor:'#ff0505',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                <Text style={[Styles.ReceiverText,{fontSize:11}]}>{invoiceData.tax_text.at(8)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 10%', display:'flex', flexDirection:'column'}}>
                                            <View style={{textAlign:'center',borderBottom:0.6,borderColor:'#ff0505'}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10}]}>원</Text>
                                            </View>
                                            <View style={{height:28,display:'flex',flexDirection:'column',justifyContent:'center'}}>
                                                <View>
                                                <Text style={[Styles.ReceiverText,{fontSize:11}]}>{invoiceData.tax_text.at(9)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={{flex:'1 1 15%',borderRight:0.6,borderLeft:0.6,borderColor:'#ff0505',display:'flex',flexDirection:'column'}}>
                                    <View style={{textAlign:'center',borderBottom:0.6,borderColor:'#ff0505'}}>
                                        <Text style={[Styles.ReceiverText,{fontSize:10}]}>비 고</Text>
                                    </View>
                                    <View style={{textAlign:'center'}}>
                                        <Text style={[Styles.ReceiverText,{fontSize:10}]}>{invoiceData.memo}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{width:'100%',margin:0,padding:0,borderRight:1.2,borderLeft:1.2,borderColor:'#ff0505',flexDirection:'column',flexGrow:1}}>
                                <View style={{width:'100%',height:100,margin:0,padding:0,borderBottom:0.6,borderColor:'#ff0505',flexDirection:'column'}}>
                                    <View style={{width: '100%',height:20,margin:0,padding:0,borderBottom:0.6,borderColor:'#ff0505',flexDirection:'row',alignContent:'center'}}>
                                        <View style={{width:'7%',margin:0,padding:0,borderRight:0.6,borderColor:'#ff0505',flexGrow:0,alignItems:'center',justifyContent:'center'}}>
                                            <Text style={[Styles.ReceiverText,{fontSize:10}]}>월.일</Text>
                                        </View>
                                        <View style={{width:'32%',margin:0,padding:0,borderRight:0.6,borderColor:'#ff0505',flexGrow:1,alignItems:'center',justifyContent:'center'}}>
                                            <Text style={[Styles.ReceiverText,{fontSize:10}]}>품    목</Text>
                                        </View>
                                        <View style={{width:'10%',margin:0,padding:0,borderRight:0.6,borderColor:'#ff0505',flexGrow:0,alignItems:'center',justifyContent:'center'}}>
                                            <Text style={[Styles.ReceiverText,{fontSize:10}]}>규격</Text>
                                        </View>
                                        <View style={{width:'10%',margin:0,padding:0,borderRight:0.6,borderColor:'#ff0505',flexGrow:0,alignItems:'center',justifyContent:'center'}}>
                                            <Text style={[Styles.ReceiverText,{fontSize:10}]}>수량</Text>
                                        </View>
                                        <View style={{width:'14%',margin:0,padding:0,borderRight:0.6,borderColor:'#ff0505',flexGrow:0,alignItems:'center',justifyContent:'center'}}>
                                            <Text style={[Styles.ReceiverText,{fontSize:10}]}>단가</Text>
                                        </View>
                                        <View style={{width:'15%',margin:0,padding:0,borderRight:0.6,borderColor:'#ff0505',flexGrow:0,alignItems:'center',justifyContent:'center'}}>
                                            <Text style={[Styles.ReceiverText,{fontSize:10}]}>공급가액</Text>
                                        </View>
                                        <View style={{width:'12%',margin:0,padding:0,border:0,flexGrow:0,alignItems:'center',justifyContent:'center'}}>
                                            <Text style={[Styles.ReceiverText,{fontSize:10}]}>세액</Text>
                                        </View>
                                    </View>
                                    {  transactionContents && transactionContents.length >= 5 &&
                                        transactionContents.map((item, index) => {
                                            if(item) {
                                                if(index % 2 === 0) {
                                                    return (
                                                        <View key={index} style={[Styles.contentRow, {borderBottom:0.6,borderColor:"#ff0505"}]}>
                                                            <View style={[Styles.contentCell, {width:'7%',borderRight:0.6,borderColor:"#ff0505",flexGrow:0,justifyContent:'center'}]}>
                                                                <Text style={[Styles.inputTextCenter,{fontSize:10}]}>{item.month_day}</Text>
                                                            </View>
                                                            <View style={{width:'32%',paddingLeft:2,borderRight:0.6,borderColor:"#ff0505",flexGrow:1}}>
                                                                <Text style={[Styles.inputText,{fontSize:10}]}>{item.product_name}</Text>
                                                            </View>
                                                            <View style={[Styles.contentCell, {width:'10%',borderRight:0.6,borderColor:"#ff0505",flexGrow:0}]}>
                                                                <Text style={[Styles.inputTextCenter,{fontSize:10}]}>{item.standard}</Text>
                                                            </View>
                                                            <View style={[Styles.contentCell, {width:'10%',borderRight:0.6,borderColor:"#ff0505",flexGrow:0,justifyContent:'flex-end'}]}>
                                                                <Text style={[Styles.inputTextCenter,{fontSize:10}]}>{item.quantity}</Text>
                                                            </View>
                                                            <View style={[Styles.contentCell, {width:'14%',borderRight:0.6,borderColor:"#ff0505",flexGrow:0,justifyContent:'flex-end'}]}>
                                                                <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(item.supply_price)}</Text>
                                                            </View>
                                                            <View style={[Styles.contentCell, {width:'15%',borderRight:0.6,borderColor:"#ff0505",flexGrow:0,justifyContent:'flex-end'}]}>
                                                                <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(item.total_price)}</Text>
                                                            </View>
                                                            <View style={[Styles.contentCell, {width:'12%',border:0,flexGrow:0,justifyContent:'flex-end'}]}>
                                                                <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(item.tax_price)}</Text>
                                                            </View>
                                                        </View>
                                                )};
                                                if(index % 5 === 4) {
                                                    return (
                                                        <View key={index} style={[Styles.contentRow, {backgroundColor:"#ff0505"}]}>
                                                            <View style={[Styles.contentCell, {width:'7%',borderRight:0.6,borderColor:"#ff0505",flexGrow:0,justifyContent:'center'}]}>
                                                                <Text style={[Styles.inputTextCenter,{fontSize:10}]}>{item.month_day}</Text>
                                                            </View>
                                                            <View style={{width:'32%',paddingLeft:2,borderRight:0.6,borderColor:"#ff0505",flexGrow:1}}>
                                                                <Text style={[Styles.inputText,{fontSize:10}]}>{item.product_name}</Text>
                                                            </View>
                                                            <View style={[Styles.contentCell, {width:'10%',borderRight:0.6,borderColor:"#ff0505",flexGrow:0}]}>
                                                                <Text style={[Styles.inputTextCenter,{fontSize:10}]}>{item.standard}</Text>
                                                            </View>
                                                            <View style={[Styles.contentCell, {width:'10%',borderRight:0.6,borderColor:"#ff0505",flexGrow:0,justifyContent:'flex-end'}]}>
                                                                <Text style={[Styles.inputAmount,{fontSize:10}]}>{item.quantity}</Text>
                                                            </View>
                                                            <View style={[Styles.contentCell, {width:'14%',borderRight:0.6,borderColor:"#ff0505",flexGrow:0,justifyContent:'flex-end'}]}>
                                                                <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(item.supply_price)}</Text>
                                                            </View>
                                                            <View style={[Styles.contentCell, {width:'15%',borderRight:0.6,borderColor:"#ff0505",flexGrow:0,justifyContent:'flex-end'}]}>
                                                                <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(item.total_price)}</Text>
                                                            </View>
                                                            <View style={[Styles.contentCell, {width:'12%',border:0,flexGrow:0,justifyContent:'flex-end'}]}>
                                                                <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(item.tax_price)}</Text>
                                                            </View>
                                                        </View>
                                                )};
                                                return (
                                                    <View key={index} style={[Styles.contentRow, {borderBottom:0.6,borderColor:"#ff0505",backgroundColor:"#ededff"}]}>
                                                        <View style={[Styles.contentCell, {width:'7%',borderRight:0.6,borderColor:"#ff0505",flexGrow:0}]}>
                                                            <Text style={[Styles.inputTextCenter,{fontSize:10}]}>{item.month_day}</Text>
                                                        </View>
                                                        <View style={{width:'32%',paddingLeft:2,borderRight:0.6,borderColor:"#ff0505",flexGrow:1}}>
                                                            <Text style={[Styles.inputText,{fontSize:10}]}>{item.product_name}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:'10%',borderRight:0.6,borderColor:"#ff0505",flexGrow:0}]}>
                                                            <Text style={[Styles.inputTextCenter,{fontSize:10}]}>{item.standard}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:'10%',borderRight:0.6,borderColor:"#ff0505",flexGrow:0}]}>
                                                            <Text style={[Styles.inputAmount,{fontSize:10}]}>{item.quantity}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:'14%',borderRight:0.6,borderColor:"#ff0505",flexGrow:0}]}>
                                                            <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(item.supply_price)}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:'15%',borderRight:0.6,borderColor:"#ff0505",flexGrow:0}]}>
                                                            <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(item.total_price)}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:'12%',border:0,flexGrow:0}]}>
                                                            <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(item.tax_price)}</Text>
                                                        </View>
                                                    </View>
                                                );
                                            };
                                            if(index % 2 === 0) {
                                                return (
                                                    <View key={index} style={[Styles.contentRow, {borderBottom:0.6,borderColor:"#ff0505"}]}>
                                                        <View style={[Styles.contentCell, {width:'7%',borderRight:0.6,borderColor:"#ff0505",flexGrow:0}]}></View>
                                                        <View style={[Styles.contentCell, {width:'32%',borderRight:0.6,borderColor:"#ff0505",flexGrow:1}]}></View>
                                                        <View style={[Styles.contentCell, {width:'10%',borderRight:0.6,borderColor:"#ff0505",flexGrow:0}]}></View>
                                                        <View style={[Styles.contentCell, {width:'10%',borderRight:0.6,borderColor:"#ff0505",flexGrow:0}]}></View>
                                                        <View style={[Styles.contentCell, {width:'14%',borderRight:0.6,borderColor:"#ff0505",flexGrow:0}]}></View>
                                                        <View style={[Styles.contentCell, {width:'15%',borderRight:0.6,borderColor:"#ff0505",flexGrow:0}]}></View>
                                                        <View style={[Styles.contentCell, {width:'12%',border:0,flexGrow:0}]}></View>
                                                    </View>
                                                );
                                            };
                                            if(index % 5 === 4) {
                                                return (
                                                    <View key={index} style={[Styles.contentRow, {backgroundColor:"#ededff"}]}>
                                                        <View style={[Styles.contentCell, {width:'7%',borderRight:0.6,borderColor:"#ff0505",flexGrow:0}]}></View>
                                                        <View style={[Styles.contentCell, {width:'32%',borderRight:0.6,borderColor:"#ff0505",flexGrow:1}]}></View>
                                                        <View style={[Styles.contentCell, {width:'10%',borderRight:0.6,borderColor:"#ff0505",flexGrow:0}]}></View>
                                                        <View style={[Styles.contentCell, {width:'10%',borderRight:0.6,borderColor:"#ff0505",flexGrow:0}]}></View>
                                                        <View style={[Styles.contentCell, {width:'14%',borderRight:0.6,borderColor:"#ff0505",flexGrow:0}]}></View>
                                                        <View style={[Styles.contentCell, {width:'15%',borderRight:0.6,borderColor:"#ff0505",flexGrow:0}]}></View>
                                                        <View style={[Styles.contentCell, {width:'12%',border:0,flexGrow:0}]}></View>
                                                    </View> 
                                                );
                                            };
                                            return (
                                                <View key={index} style={[Styles.contentRow, {borderBottom:0.6,borderColor:"#ff0505",backgroundColor:"#ededff"}]}>
                                                    <View style={[Styles.contentCell, {width:'7%',borderRight:0.6,borderColor:"#ff0505",flexGrow:0}]}></View>
                                                    <View style={[Styles.contentCell, {width:'32%',borderRight:0.6,borderColor:"#ff0505",flexGrow:1}]}></View>
                                                    <View style={[Styles.contentCell, {width:'10%',borderRight:0.6,borderColor:"#ff0505",flexGrow:0}]}></View>
                                                    <View style={[Styles.contentCell, {width:'10%',borderRight:0.6,borderColor:"#ff0505",flexGrow:0}]}></View>
                                                    <View style={[Styles.contentCell, {width:'14%',borderRight:0.6,borderColor:"#ff0505",flexGrow:0}]}></View>
                                                    <View style={[Styles.contentCell, {width:'15%',borderRight:0.6,borderColor:"#ff0505",flexGrow:0}]}></View>
                                                    <View style={[Styles.contentCell, {width:'12%',border:0,flexGrow:0}]}></View>
                                                </View> 
                                            );
                                    })}
                                </View>
                                {invoiceData && 
                                    <View style={{width: '100%',margin:0,padding:0,borderTop:0.6,borderBottom:1.2,borderColor:'#ff0505',flexDirection:'row',alignContent:'center'}}>
                                        <View style={{flex:'1 1 16%',margin:0,padding:0,display:'flex',flexDirection:'column',alignContent:'center'}}>
                                            <View style={{width: '100%',height:18,margin:0,padding:0,borderRight:0.6,borderBottom:0.6,borderColor:'#ff0505',alignItems:'center',justifyContent:'center'}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10}]}>합 계 금 액</Text>
                                            </View>
                                            <View style={{width:'100%',height:18,margin:0,padding:0,borderRight:0.6,borderColor:'#ff0505',alignItems:'center',justifyContent:'end'}}>
                                                <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(invoiceData.total_price)}</Text>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 16%',margin:0,padding:0,display:'flex',flexDirection:'column',alignContent:'center'}}>
                                            <View style={{width:'100%',height:18,margin:0,padding:0,borderRight:0.6,borderBottom:0.6,borderColor:'#ff0505',alignItems:'center',justifyContent:'center'}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10}]}>현    금</Text>
                                            </View>
                                            <View style={{width:'100%',height:18,margin:0,padding:0,borderRight:0.6,borderColor:'#ff0505',alignItems:'center',justifyContent:'end'}}>
                                                <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(invoiceData.cash_amount)}</Text>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 16%',margin:0,padding:0,display:'flex',flexDirection:'column',alignContent:'center'}}>
                                            <View style={{width:'100%',height:18,margin:0,padding:0,borderRight:0.6,borderBottom:0.6,borderColor:'#ff0505',alignItems:'center',justifyContent:'center'}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10}]}>수    표</Text>
                                            </View>
                                            <View style={{width:'100%',height:18,margin:0,padding:0,borderRight:0.6,borderColor:'#ff0505',alignItems:'center',justifyContent:'end'}}>
                                                <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(invoiceData.check_amount)}</Text>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 16%',margin:0,padding:0,display:'flex',flexDirection:'column',alignContent:'center'}}>
                                            <View style={{width:'100%',height:18,margin:0,padding:0,borderRight:0.6,borderBottom:0.6,borderColor:'#ff0505',alignItems:'center',justifyContent:'center'}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10}]}>어    음</Text>
                                            </View>
                                            <View style={{width:'100%',height:18,margin:0,padding:0,borderRight:0.6,borderColor:'#ff0505',alignItems:'center',justifyContent:'end'}}>
                                                <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(invoiceData.note_amount)}</Text>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 16%',margin:0,padding:0,display:'flex',flexDirection:'column',alignContent:'center'}}>
                                            <View style={{width:'100%',height:18,margin:0,padding:0,borderRight:0.6,borderColor:'#ff0505',borderBottom:0.6,alignItems:'center',justifyContent:'center'}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10}]}>외상미수금</Text>
                                            </View>
                                            <View style={{width:'100%',height:18,margin:0,padding:0,borderRight:0.6,borderColor:'#ff0505',alignItems:'center',justifyContent:'end'}}>
                                                <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(invoiceData.receivable_amount)}</Text>
                                            </View>
                                        </View>
                                        <View style={{flex:'1 1 20%',margin:0,padding:0,display:'flex',flexDirection:'row',justifyContent:'center'}}>
                                            <View style={{width:'50%',height:36,margin:0,padding:0,alignItems:'center',justifyContent:'center'}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10}]}>이 금액일</Text>
                                            </View>
                                            <View style={{width:'30%',height:36,margin:0,padding:0,display:'flex',flexDirection:'column'}}>
                                                <View style={{width:'100%',margin:0,padding:0}}>
                                                    <Text style={[Styles.ReceiverText,{fontSize:10},invoiceData.request_type!=='청구' && {border:1,borderRadius:6}]}>영수</Text>
                                                </View>
                                                <View style={{width:'100%',margin:0,padding:0}}>
                                                    <Text style={[Styles.ReceiverText,{fontSize:10},invoiceData.request_type==='청구' && {border:1,borderRadius:6}]}>청구</Text>
                                                </View>
                                            </View>
                                            <View style={{width:'20%',height:36,margin:0,padding:0,alignItems:'center',justifyContent:'center'}}>
                                                <Text style={[Styles.ReceiverText,{fontSize:10}]}>함.</Text>
                                            </View>
                                        </View>
                                    </View>
                                }
                            </View>
                        </View>
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    );
};

export default TaxInvoicePrint;