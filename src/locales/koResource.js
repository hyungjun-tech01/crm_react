const koResource = {
    translation: {
        header:{
            ko:'한글',
            en:'English'
        },
        login: {
            login: '로그인',
            userId:'사용자ID',
            password:'암호',
            forgotPassword: '암호 분실 시',
        },
        dashboard: {
            dashboard: '대시보드',
            completed_tasks: '완료 태스크',
            product_yearly_sales: '연 상품 매출',
            sales_overview: '매출 요약',
            sales_statistics: '매출 통계',
            total_lead: 'Total Lead',
            yearly_projects: '연 프로젝트',
        },
        company:{
            account_code:'계좌번호',
            account_owner:'예금주',
            address:'주소',
            bank_name:'은행명',
            business_item : '업종',
            business_registration_code:'사업자번호',
            business_type :'업태',
            ceo_name : '대표자명', 
            closure_date :'폐업일',
            company:'업체',
            company_details:'업체 상세정보',
            company_name:'회사명',
            company_scale:'기업 규모',
            counter:'카운터',
            deal_type:'구분',
            deal_type_mixed: '매출+매입',
            deal_type_sales: '매출',
            deal_type_purchase: '매입',
            deal_type_etc: '기타',
            eng_company_name:'영문회사명',
            engineer:'담당엔지니어',
            establishment_date   : '창업일',
            fax_number : '업체팩스번호',
            group:'기업 그룹',
            homepage :'홈페이지',
            information: '업체 정보',
            industry_type :'산업구분',
            ind_type_aerospace: '항공우주',
            ind_type_defence: '방위산업',
            ind_type_education: '교육',
            memo : '업체메모',
            new_company:'업체 등록',
            phone_number : '업체전화번호',
            salesman:'영업담당자',
            zip_code : '업체우편번호',
            company_multi_query:'업체 다중검색',
            ma_non_extended: '유지보수 계약 미연장',
        },
        lead: {
            actions:'액션',
            add_lead: '고객 등록',
            company_information:'회사 정보',
            consulting_history:'상담 이력',
            department: '부서',
            detail_information:'고객상세정보',
            email:'고객이메일',
            fax_number: '고객팩스번호',
            full_name:'고객명',
            homepage:'고객홈페이지',
            is_keyman:'키맨여부',
            lead:'고객',
            lead_group:'그룹',
            lead_information:'고객정보',
            lead_modified:'고객변경일',
            lead_name: '고객 이름',
            lead_sales:'고객영업담당',
            lead_status :'고객상태',
            mobile:'고객휴대전화',
            new_lead:'고객 등록',
            position:'직위',
            quotation_history:'견적 이력',
            zip_code:'고객우편번호',
            purchase_product:'구매 제품',
            not_contacted:'잠정 고객',
            attempted_contact:'시도 고객',
            contact:'접촉 고객',
            converted:'전환 고객',
        },
        consulting:{
            action_content: '상담 결과',
            add_consulting: '상담 등록',
            consulting: '상담',
            lead_time: '완료 기한',
            product_type: '물품 유형',
            request_content: '상담 내역',
            receipt_time: '상담일시',
            receiver: '상담 진행자',
            request_type: '요청 유형',
            type: '상담 유형',
            receipt_date:'접수 일자',
            status: '상담 상태',
        },
        quotation : {
            add_new_quotation: '견적 등록',
            confirm_date: '최종확인',
            consumer_price: '소비자가',
            cutoff_amount: '절삭금액',
            dc_rate: '할인율',
            delivery_location: '인도장소',
            delivery_period: '납품기간',
            detail_spec: '세부사양',
            discount_rate: '할인%',
            doc_no: '견적번호',
            edit_content: '항목 변경',
            expiry_date: '유효기간',
            header_setting: '머릿글 설정',
            list_price: '목록 가격',
            list_price_dc: '목록 가격 할인',
            lower_memo: '하단 메모',
            model_name: '모델명',
            note: '비고',
            order: '발주서',
            payment_type: '지불조건',
            product_lists: '품목',
            profit_amount: '이익금액',
            profit_rate: '이익율',
            quotation: '견적',
            quotation_amount: '견적금액',
            quotation_date: '견적일자',
            quotation_main_information: '견적 주요 정보',
            quotation_manager: '견적담당',
            quotation_owner: '견적담당자',
            quotation_price_information: '견적 가격 정보',
            quotation_type: '견적유형',
            quotation_unit_price: '견적단가',
            raw_price: '원가',
            sales_rep: '영업담당',
            send_type: '발부방식',
            sub_total_amount: '중간 총금액',
            tax_amount: '세금',
            total_quotation_amount: '총 견적금액',
            upper_memo: '상단 메모',
            warranty: '보증기간',
        },
        transaction:{
            add_transaction: '거래 등록',
            content_table: '항목표',
            information: '거래 정보',
            lead_org_info: '고객 / 회사 정보',
            modified: '변경일',
            month_day: '월일',
            payment_type: '지불유형',
            price_info: '가격 정보',
            product_name: '품목',
            publish_date: '발행일자',
            publish_type: '발행유형',
            statement_of_account: '거래명세표',
            supply_price: '공급가',
            tax_price: '세액',
            tax_invoice: '세금계산서',
            title: '거래 제목',
            total_price: '합계금액',
            transaction: '거래',
            transaction_code: '거래코드',
            transaction_content: '거래내용',
            type: '거래유형',
            unit_price: '단가',
        },
        purchase:{
            add_purchase:'구매 제품 등록',
            delivery_date:'납품일',
            hq_finish_date:'본사만료일',
            information: '구매 정보',
            licence_info: '라이센스 정보',
            ma_contract_date:'유지보수계약일',
            ma_finish_date:'유지보수종료일',
            modify_purchase:'구매 정보 변경',
            module: '모듈',
            product_info:'제품정보',
            product_name:'제품명',
            product_type:'제품유형',
            purchase:'구매',
            receipt_date:'입고일',
            register:'등록자',
            registration_code:'등록코드',
            registration_date:'등록일',
            serial:'기번',
            type:'구매유형',
        },
        contract:{
            add_contract: '계약 추가',
            contract_date:'계약일',
            contract_info: '계약 정보',
            contract_type:'계약종류',
            end_date:'종료일',
        },
        common:{
            actions: '',
            activity: '활동',
            add: '추가',
            additional_information:'추가 정보',
            address: '주소',
            all:'전체',
            cancel: '취소',
            category: '분류',
            created:'생성일',
            color: '색상',
            contact_details:'연락처 정보',
            currency: '통화',
            dashboard: '현황보기',
            details: '상세 사항',
            edit: '편집',
            fax_no: '팩스번호',
            information:'정보',
            issued_by: '작성자',
            location: '지역',
            maker: '제조사',
            material: '재질',
            memo:'메모',
            name: '이름',
            next: '다음',
            note: '비고',
            phone_no: '전화번호',
            previous: '이전',
            price: '가격',
            price_1: '금액',
            product: '품목',
            quantity: '수량',
            region:'지역',
            related: '관련 사항',
            revenue: '수익',
            sales: '매출',
            save: '저장',
            size: '크기',
            standard: '규격',
            status: '상태',
            table : '표',
            title: '제목',
            total: '총',
            type: 'Type',
            unit: '단위',
            view: '보기',
            visible: '보기',
            zip_code: '우편번호',
            search_here :'검색 키워드',
            item:'항목',
            condition:'조건',
            value:'값',
        },
        comment: {
            search_address_first: '먼저 주소 검색하시기 바랍니다.',
        }
    },
}
export default koResource;