const delete_text = [' ','㈜','(주)','(유)','(의)','(학)'];

export const compareCompanyName = (name1, name2) => {
    // At first, remove text not used to sort from input name.
    let text1 = name1;
    delete_text.forEach(text => {
        text1 = text1 === null ? '' : text1.replaceAll(text, '');
    });

    let text2 = name2;
    delete_text.forEach(text => {
        text2 = text2 === null ? '' : text2.replaceAll(text, '');
    });

    if (text1 > text2) {
        return 1;
    }
    if (text1 < text2) {
    return -1;
    }
    // a must be equal to b
    return 0;
};

export const compareText = (text1, text2) => {
    if (text1 > text2) {
        return 1;
    }
    if (text1 < text2) {
    return -1;
    }
    // a must be equal to b
    return 0;
};

export const formatDate = (date_value) => {
    if(date_value === null) return "";
    
    let  converted = null;
    if(typeof date_value === 'string') {
        converted = new Date(date_value);
    } else {
        converted = date_value;
    }
    const month = converted.getMonth() + 1;
    const date = converted.getDate();
    return converted.getFullYear()
          + "." + (month < 10 ? "0" + month.toString() : month.toString())
          + "." + (date < 10 ? "0" + date.toString() : date.toString());
};

export const formatTime = (date_value) => {
    const hours = date_value.getHours();
    const min = date_value.getMinutes();
    const sec = date_value.getSeconds();
    return (hours < 10 ? "0" + hours.toString() : hours.toString())
          + ":" + (min < 10 ? "0" + min.toString() : min.toString())
          + ":" + (sec < 10 ? "0" + sec.toString() : sec.toString());
};

export const ConverTextAmount = (amount) => {
    if(!amount) return "";

    let input = null;
    if(typeof amount === 'number'){
        input = amount.toString();
    } else if(typeof amount === 'string')
    {
        input = amount;
    };
    
    let ret = "";
    for(let i = input.length - 1, m = 0; i >= 0; i--, m++)
    {
        let temp_ret = input.at(i);
        if(m !==0 && m % 3 === 0 && !isNaN(Number(temp_ret))){
            temp_ret += ",";
        };
        ret = temp_ret + ret;
    };
    // console.log('\t[ ConverTextAmount ] output : ', ret);
    return ret;
};