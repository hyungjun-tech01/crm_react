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

const TransactionBillPrint = (props) => {
    const { billData, contents} = props;
    const [ transactionContents, setTransactionContents ] = useState([]);
    const [ supplier, setSupplier ] = useState({});
    const [ receiver, setReceiver ] = useState({});

    useEffect(() => {
        console.log('TransactionBillPrint: ', billData);
        if(contents && Array.isArray(contents) && contents.length > 0){
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
        } else {
            setTransactionContents([]);
        };
        if(billData) {
            setSupplier({...billData.supplier});
            setReceiver({...billData.receiver});
        }
    }, [contents, billData]);

    if(!billData || Object.keys(billData).length === 0) return null;

    return (
        <PDFViewer style={{width: '100%', minHeight: '480px', height: '960px'}}>
            <Document>
                <Page size="A4" style={Styles.body}>
                    {/* 공급받는자 보관용 */}
                    <View style={{marginTop:10,padding:5}}>
                        <View style={{width:'100%',margin:0,padding:0,border:0,display:'flex',flexDirection:'row',justifyContent:'space-between',alignContent:'end',alignItems:'end'}}>
                            <View style={{width:'15%',height:25,margin:0,padding:0,fontFamily:'Noto Sans'}}>
                                <Text style={[Styles.SupplierText,{fontSize:10}]}>별지 제11호 서식</Text>
                            </View>
                            <View style={{width:'15%',height:25,margin:0,padding:0,fontFamily:'Noto Sans'}}>
                                <Text style={[Styles.SupplierText,{fontSize:10}]}>(청색)</Text>
                            </View>
                        </View>
                        <View style={{width:'100%',margin:0,padding:0,border:0,flexDirection:'row',flexGrow:0,borderRight:2,borderLeft:2,borderTop:2,borderColor:'#0000ff'}}>
                            <View style={{width: '35%'}}>
                                <Text style={[Styles.SupplierText,{fontSize:28}]}>세 금 계 산 서</Text>
                            </View>
                            <View style={{width: '20%'}}>
                                <Text style={[Styles.SupplierText,{fontSize:11}]}>(공급받는자 보관용)</Text>
                            </View>
                            <View style={{width: '45%',display:'flex',flexDirection:'row'}}>
                                <View style={{width: '30%',display:'flex',flexDirection:'column',borderRight:1,borderColor:'#0000ff'}}>
                                    <Text style={[Styles.SupplierText,{fontSize:11}]}>책 번 호</Text>
                                    <Text style={[Styles.SupplierText,{fontSize:11}]}>일련 번호</Text>
                                </View>
                                <View style={{width: '70%',display:'flex',flexDirection:'column'}}>
                                    <View style={{width: '100%',display:'flex',flexDirection:'row',borderBottom:1,borderColor:'#0000ff'}}>
                                        <View style={{width: '50%',borderRight:1,borderColor:'#0000ff'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:11,textAlign:'end'}]}>{`${billData.book_no ? billData.book_no : ''} 권`}</Text>
                                        </View>
                                        <View style={{width: '50%'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:11}]}>{`${billData.book_sub_no ? billData.book_sub_no : ''} 호`}</Text>
                                        </View>
                                    </View>
                                    <View style={{width: '100%',display:'flex',flexDirection:'column'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:11}]}>{billData.serial_no}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{width:'100%',margin:0,padding:0,border:0,flexDirection:'row',flexGrow:0}}>
                            {/* 공급자 */}
                            <View style={{width:'50%',margin:0,padding:0,borderBottom:0,borderLeft:1,borderRight:0,borderTop:1,borderColor:'#0000ff',flexDirection:'row'}}>
                                <View style={{width:20,borderRight:1,borderColor:'#0000ff',alignItems:'center',alignContent:'center',justifyContent:'center',flexGrow:0,flexDirection:'column'}}>
                                    <Text style={[Styles.SupplierText,{fontSize:10}]}>공 급 자</Text>
                                </View>
                                <View style={{flexDirection:'column',border:0,flexGrow:1}}>
                                    <View style={{height:27,borderBottom:1,borderColor:'#0000ff',alignItems:'center',alignContent:'center',flexDirection:'row'}}>
                                        <View style={{width:'20%',height:26,borderRight:1,borderColor:'#0000ff',alignItems:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginTop:6}]}>등록번호</Text>
                                        </View>
                                        <View style={{width:'80%'}}>
                                            <Text style={[Styles.SupplierRegNo]}>{supplier.business_registration_code}</Text>
                                        </View>
                                    </View>
                                    <View style={{height:27,borderBottom:1,borderColor:'#0000ff',alignItems:'stretch',alignContent:'center',flexDirection:'row'}}>
                                        <View style={{width:'20%',height:26,alignItems:'center',borderRight:1,borderColor:'#0000ff',flexGrow:0}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginBottom:-2}]}>상   호</Text>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginTop:-2}]}>(법인명)</Text>
                                        </View>
                                        <View style={{width:'36%',alignItems:'center',borderRight:1,borderColor:'#0000ff'}}>
                                            <Text style={[Styles.inputText,{fontSize:10,marginTop:6}]}>{supplier.company_name}</Text>
                                        </View>
                                        <View style={{width:'7%',alignItems:'center',borderRight:1,borderColor:'#0000ff',flexGrow:0}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginBottom:-2}]}>성</Text>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginTop:-2}]}>명</Text>
                                        </View>
                                        <View style={{width:'36%',alignItems:'center'}}>
                                            <Text style={[Styles.inputText,{fontSize:10,marginTop:5}]}>{supplier.ceo_name}</Text>
                                        </View>
                                    </View>
                                    <View style={{height:27,borderBottom:1,borderColor:'#0000ff',alignItems:'center',alignContent:'center',flexDirection:'row'}}>
                                        <View style={{width:'20%',height:26,alignItems:'center',borderRight:1,borderColor:'#0000ff',flexGrow:0}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginBottom:-2}]}>사업장</Text>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginTop:-2}]}>주  소</Text>
                                        </View>
                                        <View style={{width:'75%',alignItems:'center'}}>
                                            <Text style={[Styles.inputText,{fontSize:10,letterSpacing:-1}]}>{supplier.company_address}</Text>
                                        </View>
                                    </View>
                                    <View style={{height:26,border:0,flexDirection:'row',alignItems:'center',alignContent:'center'}}>
                                        <View style={{width:'20%',height:26,alignItems:'center',borderRight:1,borderColor:'#0000ff',flexGrow:0}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginTop:6}]}>업  태</Text>
                                        </View>
                                        <View style={{width:'27.5%'}}>
                                            <Text style={[Styles.inputText,{fontSize:10,letterSpacing:-1}]}>{supplier.business_type}</Text>
                                        </View>
                                        <View style={{width:'7%',height:26,alignItems:'center',borderLeft:1,borderRight:1,borderColor:'#0000ff',flexGrow:0}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginBottom:-2}]}>종</Text>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginTop:-2}]}>목</Text>
                                        </View>
                                        <View style={{width:'44.5%',}}>
                                            <Text style={[Styles.inputText,{fontSize:9,letterSpacing:-1}]}>{supplier.business_item}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            {/* 공급받는자 */}
                            <View style={{width:'50%',margin:0,padding:0,borderBottom:0,borderLeft:1,borderRight:1,borderTop:1,borderColor:'#0000ff',flexDirection:'row'}}>
                                <View style={{width:20,borderRight:1,borderColor:'#0000ff',alignItems:'center',alignContent:'center',justifyContent:'center',flexGrow:0,flexDirection:'column'}}>
                                    <Text style={[Styles.SupplierText,{fontSize:10}]}>공 급 받 는 자</Text>
                                </View>
                                <View style={{flexDirection:'column',border:0,flexGrow:1}}>
                                    <View style={{height:27,borderBottom:1,borderColor:'#0000ff',alignItems:'center',alignContent:'center',flexDirection:'row'}}>
                                        <View style={{width:'20%',height:26,borderRight:1,borderColor:'#0000ff',alignItems:'center',flexGrow:0}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginTop:6}]}>등록번호</Text>
                                        </View>
                                        <View style={{width:'80%',}}>
                                            <Text style={[Styles.SupplierRegNo]}>{receiver.business_registration_code}</Text>
                                        </View>
                                    </View>
                                    <View style={{height:27,borderBottom:1,borderColor:'#0000ff',alignItems:'stretch',alignContent:'center',flexDirection:'row'}}>
                                        <View style={{width:'20%',height:26,alignItems:'center',borderRight:1,borderColor:'#0000ff',flexGrow:0}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginBottom:-2}]}>상   호</Text>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginTop:-2}]}>(법인명)</Text>
                                        </View>
                                        <View style={{width:'36%',alignItems:'center',borderRight:1,borderColor:'#0000ff'}}>
                                            <Text style={[Styles.inputText,{fontSize:10,marginTop:6}]}>{receiver.company_name}</Text>
                                        </View>
                                        <View style={{width:'7%',alignItems:'center',borderRight:1,borderColor:'#0000ff',flexGrow:0}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginBottom:-2}]}>성</Text>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginTop:-2}]}>명</Text>
                                        </View>
                                        <View style={{width:'36%',alignItems:'center'}}>
                                            <Text style={[Styles.inputText,{fontSize:10,marginTop:5}]}>{receiver.ceo_name}</Text>
                                        </View>
                                    </View>
                                    <View style={{height:27,borderBottom:1,borderColor:'#0000ff',alignItems:'center',alignContent:'center',flexDirection:'row'}}>
                                        <View style={{width:'20%',height:26,alignItems:'center',borderRight:1,borderColor:'#0000ff',flexGrow:0}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginBottom:-2}]}>사업장</Text>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginTop:-2}]}>주  소</Text>
                                        </View>
                                        <View style={{width:'80%',alignItems:'center'}}>
                                            <Text style={[Styles.inputText,{fontSize:10,letterSpacing:-1}]}>{receiver.company_address}</Text>
                                        </View>
                                    </View>
                                    <View style={{height:26,border:0,flexDirection:'row',alignItems:'center',alignContent:'center'}}>
                                        <View style={{width:'20%',height:26,alignItems:'center',borderRight:1,borderColor:'#0000ff',flexGrow:0}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginTop:6}]}>업  태</Text>
                                        </View>
                                        <View style={{width:'27.5%',}}>
                                            <Text style={[Styles.inputText,{fontSize:10,letterSpacing:-1}]}>{receiver.business_type}</Text>
                                        </View>
                                        <View style={{width:'7%',height:26,alignItems:'center',borderLeft:1,borderRight:1,borderColor:'#0000ff',flexGrow:0}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginBottom:-2}]}>종</Text>
                                            <Text style={[Styles.SupplierText,{fontSize:10,marginTop:-2}]}>목</Text>
                                        </View>
                                        <View style={{width:'44.5%',}}>
                                            <Text style={[Styles.inputText,{fontSize:9,letterSpacing:-1}]}>{receiver.business_item}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        {/* 금액 표시 부분 */}
                        <View style={{width:'100%',margin:0,padding:0,border:1,borderColor:'#0000ff',flexDirection:'row',flexGrow:0}}>
                            <View style={{flex:'1 1 10%', display:'flex',border:1,borderColor:'#0000ff',flexDirection:'column'}}>
                                <View style={{textAlign:'center',borderBottom:1,borderColor:'#0000ff',}}>
                                    <Text style={[Styles.SupplierText,{fontSize:10}]}>작 성</Text>
                                </View>
                                <View style={{textAlign:'center',borderBottom:1,borderColor:'#0000ff',}}>
                                    <Text style={[Styles.SupplierText,{fontSize:10}]}>년 월 일</Text>
                                </View>
                                <View style={{textAlign:'center'}}>
                                    <Text style={[Styles.SupplierText,{fontSize:10}]}>{billData.publish_date}</Text>
                                </View>
                            </View>
                            <View style={{flex:'1 1 38%',border:1,borderColor:'#0000ff',display:'flex', flexDirection:'column'}}>
                                <View style={{width: '100%',textAlign:'center'}}>
                                    <Text style={[Styles.SupplierText,{fontSize:10}]}>공 급 가 액</Text>
                                </View>
                                <View style={{width: '100%',display:'flex',flexDirection:'row',textAlign:'center'}}>
                                    <View style={{flex:'3 3 21.4%', display:'flex', flexDirection:'column'}}>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>공란</Text>
                                        </View>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>{billData.vacant_count}</Text>
                                        </View>
                                    </View>
                                    <View style={{flex:'1 1 7.1%', display:'flex', flexDirection:'row'}}>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>백</Text>
                                        </View>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>{billData.supply_text.at(0)}</Text>
                                        </View>
                                    </View>
                                    <View style={{flex:'1 1 7.1%', display:'flex', flexDirection:'row'}}>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>십</Text>
                                        </View>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>{billData.supply_text.at(1)}</Text>
                                        </View>
                                    </View>
                                    <View style={{flex:'1 1 7.1%', display:'flex', flexDirection:'row'}}>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>억</Text>
                                        </View>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>{billData.supply_text.at(2)}</Text>
                                        </View>
                                    </View>
                                    <View style={{flex:'1 1 7.1%', display:'flex', flexDirection:'row'}}>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>천</Text>
                                        </View>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>{billData.supply_text.at(3)}</Text>
                                        </View>
                                    </View>
                                    <View style={{flex:'1 1 7.1%', display:'flex', flexDirection:'row'}}>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>백</Text>
                                        </View>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>{billData.supply_text.at(4)}</Text>
                                        </View>
                                    </View>
                                    <View style={{flex:'1 1 7.1%', display:'flex', flexDirection:'row'}}>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>십</Text>
                                        </View>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>{billData.supply_text.at(5)}</Text>
                                        </View>
                                    </View>
                                    <View style={{flex:'1 1 7.1%', display:'flex', flexDirection:'row'}}>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>만</Text>
                                        </View>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>{billData.supply_text.at(6)}</Text>
                                        </View>
                                    </View>
                                    <View style={{flex:'1 1 7.1%', display:'flex', flexDirection:'row'}}>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>천</Text>
                                        </View>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>{billData.supply_text.at(7)}</Text>
                                        </View>
                                    </View>
                                    <View style={{flex:'1 1 7.1%', display:'flex', flexDirection:'row'}}>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>백</Text>
                                        </View>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>{billData.supply_text.at(8)}</Text>
                                        </View>
                                    </View>
                                    <View style={{flex:'1 1 7.1%', display:'flex', flexDirection:'row'}}>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>십</Text>
                                        </View>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>{billData.supply_text.at(9)}</Text>
                                        </View>
                                    </View>
                                    <View style={{flex:'1 1 7.1%', display:'flex', flexDirection:'row'}}>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>원</Text>
                                        </View>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>{billData.supply_text.at(10)}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={{flex:'1 1 27%',border:1,borderColor:'#0000ff',display:'flex',flexDirection:'column'}}>
                                <View style={{width: '100%',textAlign:'center'}}>
                                    <Text style={[Styles.SupplierText,{fontSize:10}]}>세   액</Text>
                                </View>
                                <View style={{width: '100%',display:'flex',flexDirection:'row',textAlign:'center'}}>
                                    <View style={{flex:'1 1 10%', display:'flex', flexDirection:'row'}}>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>십</Text>
                                        </View>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>{billData.tax_text.at(1)}</Text>
                                        </View>
                                    </View>
                                    <View style={{flex:'1 1 10%', display:'flex', flexDirection:'row'}}>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>억</Text>
                                        </View>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>{billData.tax_text.at(2)}</Text>
                                        </View>
                                    </View>
                                    <View style={{flex:'1 1 10%', display:'flex', flexDirection:'row'}}>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>천</Text>
                                        </View>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>{billData.tax_text.at(3)}</Text>
                                        </View>
                                    </View>
                                    <View style={{flex:'1 1 10%', display:'flex', flexDirection:'row'}}>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>백</Text>
                                        </View>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>{billData.tax_text.at(4)}</Text>
                                        </View>
                                    </View>
                                    <View style={{flex:'1 1 10%', display:'flex', flexDirection:'row'}}>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>십</Text>
                                        </View>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>{billData.tax_text.at(5)}</Text>
                                        </View>
                                    </View>
                                    <View style={{flex:'1 1 10%', display:'flex', flexDirection:'row'}}>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>만</Text>
                                        </View>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>{billData.tax_text.at(6)}</Text>
                                        </View>
                                    </View>
                                    <View style={{flex:'1 1 10%', display:'flex', flexDirection:'row'}}>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>천</Text>
                                        </View>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>{billData.tax_text.at(7)}</Text>
                                        </View>
                                    </View>
                                    <View style={{flex:'1 1 10%', display:'flex', flexDirection:'row'}}>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>백</Text>
                                        </View>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>{billData.tax_text.at(8)}</Text>
                                        </View>
                                    </View>
                                    <View style={{flex:'1 1 10%', display:'flex', flexDirection:'row'}}>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>십</Text>
                                        </View>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>{billData.tax_text.at(9)}</Text>
                                        </View>
                                    </View>
                                    <View style={{flex:'1 1 10%', display:'flex', flexDirection:'row'}}>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>원</Text>
                                        </View>
                                        <View style={{textAlign:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>{billData.tax_text.at(10)}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={{flex:'1 1 25%', display:'flex', flexDirection:'column'}}>
                                <View style={{textAlign:'center'}}>
                                    <Text style={[Styles.SupplierText,{fontSize:10}]}>비 고</Text>
                                </View>
                                <View style={{textAlign:'center'}}>
                                    <Text style={[Styles.SupplierText,{fontSize:10}]}>{billData.memo}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{width:'100%',margin:0,padding:0,border:1,borderColor:'#0000ff',flexDirection:'column',flexGrow:1}}>
                            <View style={{width:'100%',height:200,margin:0,padding:0,borderBottom:1,borderColor:'#0000ff',flexDirection:'column'}}>
                                <View style={{width: '100%',height:20,margin:0,padding:0,borderBottom:1,borderColor:'#0000ff',flexDirection:'row',alignContent:'center'}}>
                                    <View style={{width:'7%',margin:0,padding:0,borderRight:1,borderColor:'#0000ff',flexGrow:0,alignItems:'center',justifyContent:'center'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>월.일</Text>
                                    </View>
                                    <View style={{width:'32%',margin:0,padding:0,borderRight:1,borderColor:'#0000ff',flexGrow:1,alignItems:'center',justifyContent:'center'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>품    목</Text>
                                    </View>
                                    <View style={{width:'10%',margin:0,padding:0,borderRight:1,borderColor:'#0000ff',flexGrow:0,alignItems:'center',justifyContent:'center'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>규격</Text>
                                    </View>
                                    <View style={{width:'10%',margin:0,padding:0,borderRight:1,borderColor:'#0000ff',flexGrow:0,alignItems:'center',justifyContent:'center'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>수량</Text>
                                    </View>
                                    <View style={{width:'14%',margin:0,padding:0,borderRight:1,borderColor:'#0000ff',flexGrow:0,alignItems:'center',justifyContent:'center'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>단가</Text>
                                    </View>
                                    <View style={{width:'15%',margin:0,padding:0,borderRight:1,borderColor:'#0000ff',flexGrow:0,alignItems:'center',justifyContent:'center'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>공급가액</Text>
                                    </View>
                                    <View style={{width:'12%',margin:0,padding:0,border:0,flexGrow:0,alignItems:'center',justifyContent:'center'}}>
                                        <Text style={[Styles.SupplierText,{fontSize:10}]}>세액</Text>
                                    </View>
                                </View>
                                {  transactionContents && transactionContents.length >= 10 &&
                                    transactionContents.map((item, index) => {
                                        if(item) {
                                            if(index % 2 === 0) {
                                                return (
                                                    <View key={index} style={[Styles.contentRow, {borderBottom:1,borderColor:"#0000ff"}]}>
                                                        <View style={[Styles.contentCell, {width:'7%',borderRight:1,borderColor:"#0000ff",flexGrow:0,justifyContent:'center'}]}>
                                                            <Text style={[Styles.inputTextCenter,{fontSize:10}]}>{item.month_day}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:'32%',borderRight:1,borderColor:"#0000ff",flexGrow:1}]}>
                                                            <Text style={[Styles.inputText,{fontSize:10}]}>{item.product_name}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:'10%',borderRight:1,borderColor:"#0000ff",flexGrow:0}]}>
                                                            <Text style={[Styles.inputTextCenter,{fontSize:10}]}>{item.standard}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:'10%',borderRight:1,borderColor:"#0000ff",flexGrow:0,justifyContent:'flex-end'}]}>
                                                            <Text style={[Styles.inputTextCenter,{fontSize:10}]}>{item.quantity}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:'14%',borderRight:1,borderColor:"#0000ff",flexGrow:0,justifyContent:'flex-end'}]}>
                                                            <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(item.supply_price)}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:'15%',borderRight:1,borderColor:"#0000ff",flexGrow:0,justifyContent:'flex-end'}]}>
                                                            <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(item.total_price)}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:'12%',border:0,flexGrow:0,justifyContent:'flex-end'}]}>
                                                            <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(item.tax_price)}</Text>
                                                        </View>
                                                    </View>
                                            )};
                                            if(index % 10 === 9) {
                                                return (
                                                    <View key={index} style={[Styles.contentRow, {backgroundColor:"#0000ff"}]}>
                                                        <View style={[Styles.contentCell, {width:'7%',borderRight:1,borderColor:"#0000ff",flexGrow:0,justifyContent:'center'}]}>
                                                            <Text style={[Styles.inputTextCenter,{fontSize:10}]}>{item.month_day}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:'32%',borderRight:1,borderColor:"#0000ff",flexGrow:1}]}>
                                                            <Text style={[Styles.inputText,{fontSize:10}]}>{item.product_name}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:'10%',borderRight:1,borderColor:"#0000ff",flexGrow:0}]}>
                                                            <Text style={[Styles.inputTextCenter,{fontSize:10}]}>{item.standard}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:'10%',borderRight:1,borderColor:"#0000ff",flexGrow:0,justifyContent:'flex-end'}]}>
                                                            <Text style={[Styles.inputAmount,{fontSize:10}]}>{item.quantity}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:'14%',borderRight:1,borderColor:"#0000ff",flexGrow:0,justifyContent:'flex-end'}]}>
                                                            <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(item.supply_price)}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:'15%',borderRight:1,borderColor:"#0000ff",flexGrow:0,justifyContent:'flex-end'}]}>
                                                            <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(item.total_price)}</Text>
                                                        </View>
                                                        <View style={[Styles.contentCell, {width:'12%',border:0,flexGrow:0,justifyContent:'flex-end'}]}>
                                                            <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(item.tax_price)}</Text>
                                                        </View>
                                                    </View>
                                            )};
                                            return (
                                                <View key={index} style={[Styles.contentRow, {borderBottom:1,borderColor:"#0000ff",backgroundColor:"#ededff"}]}>
                                                    <View style={[Styles.contentCell, {width:'7%',borderRight:1,borderColor:"#0000ff",flexGrow:0}]}>
                                                        <Text style={[Styles.inputTextCenter,{fontSize:10}]}>{item.month_day}</Text>
                                                    </View>
                                                    <View style={[Styles.contentCell, {width:'32%',borderRight:1,borderColor:"#0000ff",flexGrow:1}]}>
                                                        <Text style={[Styles.inputText,{fontSize:10}]}>{item.product_name}</Text>
                                                    </View>
                                                    <View style={[Styles.contentCell, {width:'10%',borderRight:1,borderColor:"#0000ff",flexGrow:0}]}>
                                                        <Text style={[Styles.inputTextCenter,{fontSize:10}]}>{item.standard}</Text>
                                                    </View>
                                                    <View style={[Styles.contentCell, {width:'10%',borderRight:1,borderColor:"#0000ff",flexGrow:0}]}>
                                                        <Text style={[Styles.inputAmount,{fontSize:10}]}>{item.quantity}</Text>
                                                    </View>
                                                    <View style={[Styles.contentCell, {width:'14%',borderRight:1,borderColor:"#0000ff",flexGrow:0}]}>
                                                        <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(item.supply_price)}</Text>
                                                    </View>
                                                    <View style={[Styles.contentCell, {width:'15%',borderRight:1,borderColor:"#0000ff",flexGrow:0}]}>
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
                                                <View key={index} style={[Styles.contentRow, {borderBottom:1,borderColor:"#0000ff"}]}>
                                                    <View style={[Styles.contentCell, {width:'7%',borderRight:1,borderColor:"#0000ff",flexGrow:0}]}></View>
                                                    <View style={[Styles.contentCell, {width:'32%',borderRight:1,borderColor:"#0000ff",flexGrow:1}]}></View>
                                                    <View style={[Styles.contentCell, {width:'10%',borderRight:1,borderColor:"#0000ff",flexGrow:0}]}></View>
                                                    <View style={[Styles.contentCell, {width:'10%',borderRight:1,borderColor:"#0000ff",flexGrow:0}]}></View>
                                                    <View style={[Styles.contentCell, {width:'14%',borderRight:1,borderColor:"#0000ff",flexGrow:0}]}></View>
                                                    <View style={[Styles.contentCell, {width:'15%',borderRight:1,borderColor:"#0000ff",flexGrow:0}]}></View>
                                                    <View style={[Styles.contentCell, {width:'12%',border:0,flexGrow:0}]}></View>
                                                </View>
                                            );
                                        };
                                        if(index % 10 === 9) {
                                            return (
                                                <View key={index} style={[Styles.contentRow, {backgroundColor:"#ededff"}]}>
                                                    <View style={[Styles.contentCell, {width:'7%',borderRight:1,borderColor:"#0000ff",flexGrow:0}]}></View>
                                                    <View style={[Styles.contentCell, {width:'32%',borderRight:1,borderColor:"#0000ff",flexGrow:1}]}></View>
                                                    <View style={[Styles.contentCell, {width:'10%',borderRight:1,borderColor:"#0000ff",flexGrow:0}]}></View>
                                                    <View style={[Styles.contentCell, {width:'10%',borderRight:1,borderColor:"#0000ff",flexGrow:0}]}></View>
                                                    <View style={[Styles.contentCell, {width:'14%',borderRight:1,borderColor:"#0000ff",flexGrow:0}]}></View>
                                                    <View style={[Styles.contentCell, {width:'15%',borderRight:1,borderColor:"#0000ff",flexGrow:0}]}></View>
                                                    <View style={[Styles.contentCell, {width:'12%',border:0,flexGrow:0}]}></View>
                                                </View> 
                                            );
                                        };
                                        return (
                                            <View key={index} style={[Styles.contentRow, {borderBottom:1,borderColor:"#0000ff",backgroundColor:"#ededff"}]}>
                                                <View style={[Styles.contentCell, {width:'7%',borderRight:1,borderColor:"#0000ff",flexGrow:0}]}></View>
                                                <View style={[Styles.contentCell, {width:'32%',borderRight:1,borderColor:"#0000ff",flexGrow:1}]}></View>
                                                <View style={[Styles.contentCell, {width:'10%',borderRight:1,borderColor:"#0000ff",flexGrow:0}]}></View>
                                                <View style={[Styles.contentCell, {width:'10%',borderRight:1,borderColor:"#0000ff",flexGrow:0}]}></View>
                                                <View style={[Styles.contentCell, {width:'14%',borderRight:1,borderColor:"#0000ff",flexGrow:0}]}></View>
                                                <View style={[Styles.contentCell, {width:'15%',borderRight:1,borderColor:"#0000ff",flexGrow:0}]}></View>
                                                <View style={[Styles.contentCell, {width:'12%',border:0,flexGrow:0}]}></View>
                                            </View> 
                                        );
                                })}
                            </View>
                            {billData && 
                                <View style={{width:'100%',height:36,margin:0,padding:0,flexDirection:'column'}}>
                                    <View style={{width: '100%',height:18,margin:0,padding:0,borderBottom:1,borderColor:'#0000ff',flexDirection:'row',alignContent:'center'}}>
                                        <View style={{width:'10%',margin:0,padding:0,borderRight:1,borderColor:'#0000ff',alignItems:'center',justifyContent:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>합 계 금 액</Text>
                                        </View>
                                        <View style={{width:'23.3%',margin:0,padding:0,borderRight:1,borderColor:'#0000ff',alignItems:'center',justifyContent:'end'}}>
                                            <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(billData.total_amount)}</Text>
                                        </View>
                                        <View style={{width:'10%',margin:0,padding:0,borderRight:1,borderColor:'#0000ff',alignItems:'center',justifyContent:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>현    금</Text>
                                        </View>
                                        <View style={{width:'23.3%',margin:0,padding:0,borderRight:1,borderColor:'#0000ff',alignItems:'center',justifyContent:'end'}}>
                                            <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(billData.cash)}</Text>
                                        </View>
                                        <View style={{width:'10%',margin:0,padding:0,borderRight:1,borderColor:'#0000ff',alignItems:'center',justifyContent:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>수    표</Text>
                                        </View>
                                        <View style={{width:'23.4%',margin:0,padding:0,alignItems:'center',justifyContent:'end'}}>
                                            <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(billData.check)}</Text>
                                        </View>
                                        <View style={{width:'10%',margin:0,padding:0,borderRight:1,borderColor:'#0000ff',alignItems:'center',justifyContent:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>어    음</Text>
                                        </View>
                                        <View style={{width:'23.4%',margin:0,padding:0,alignItems:'center',justifyContent:'end'}}>
                                            <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(billData.note)}</Text>
                                        </View>
                                        <View style={{width:'10%',margin:0,padding:0,borderRight:1,borderColor:'#0000ff',alignItems:'center',justifyContent:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>외상미수금</Text>
                                        </View>
                                        <View style={{width:'23.4%',margin:0,padding:0,alignItems:'center',justifyContent:'end'}}>
                                            <Text style={[Styles.inputAmount,{fontSize:10}]}>{ConvertCurrency(billData.credit)}</Text>
                                        </View>
                                        <View style={{width:'10%',margin:0,padding:0,borderRight:1,borderColor:'#0000ff',alignItems:'center',justifyContent:'center'}}>
                                            <Text style={[Styles.SupplierText,{fontSize:10}]}>이 금액일 청구 함.</Text>
                                        </View>
                                    </View>
                                </View>
                            }
                        </View>
                    </View>
                    {/* 중간 경계선 */}
                    <View style={{width:'100%', height:2, borderTop:1, marginVertical:5}}></View>
                    {/* 공급자 보관용*/}
                </Page>
            </Document>
        </PDFViewer>
    );
};

export default TransactionBillPrint;