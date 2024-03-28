const delete_text = ['㈜','(주)'];

const compareText = (text1, text2) => {
    // Check if character is korean
    const min_length = text1.length < text2.length ? text1.length : text2.length;
    for(let i = 0; i < min_length; i++){
        const char1_code = text1.at(i).charCodeAt();
        const char2_code = text2.at(i).charCodeAt();
        const is_char1__kor = (char1_code >= 44032) && (char1_code <= 55215);
        const is_char2__kor = (char2_code >= 44032) && (char2_code <= 55215);

        if(is_char1__kor){
            if(!is_char2__kor) return true;     // char 1 only is korean
        } else{
            if(is_char2__kor) return false;     // char 2 only is korean
        }

        // We should compare them with code value
        if(char1_code > char2_code) return true;
        if(char1_code < char2_code) return false;
    };

    // At this point, they are same as far minimum length of names
    if(text1.length > min_length ) return true;
    return false;
}

export const compareCompanyName = (name1, name2) => {
    // At first, remove text not used to sort from input name.
    let text1 = name1;
    delete_text.forEach(text => {
        text1 = text1.replaceAll(text, '');
    });

    let text2 = name2;
    delete_text.forEach(text => {
        text2 = text2.replaceAll(text, '');
    });

    return compareText(text1, text2);
};