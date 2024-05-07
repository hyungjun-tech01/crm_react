import React  from 'react';
import { useTranslation } from 'react-i18next';

export function itemRender(current, type, originalElement) {
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