import {getRequestConfig} from 'next-intl/server';
import {locales} from '@sharufa/shared';

export default getRequestConfig(async ({locale}) => {
  const activeLocale = locale || 'fr';
  return {
    locale: activeLocale,
    messages: (await import(`../messages/${activeLocale}.json`)).default
  };
});
