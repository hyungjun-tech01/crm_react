import React  from 'react';
import { useTranslation } from 'react-i18next';

export function ItemRender(current, type, originalElement) {
  const { t } = useTranslation();

  if (type === "prev") {
    return <a>{t('common.previous')}</a>;
  }
  if (type === "next") {
    return <a>{t('common.next')}</a>;
  }
  return originalElement;
}
  
export function onShowSizeChange(current, pageSize) {
  // console.log(current, pageSize);
}

export function ShowTotal(total, range) {
  const { i18n } = useTranslation();
  return i18n.language === 'ko' ? 
    `${total} 항목 중, ${range[0]}에서 ${range[1]}` :
    `Showing ${range[0]} to ${range[1]} of ${total} entries`;
}