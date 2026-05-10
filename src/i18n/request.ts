import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['fr', 'en', 'tr'];

export default getRequestConfig(async ({locale}) => {

  
  // Default to 'fr' if locale is undefined (can happen during build or if middleware/proxy is not passing it)
  const activeLocale = locale || 'fr';
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(activeLocale as any)) {
    notFound();
  }


  return {
    locale: activeLocale,
    messages: (await import(`../../messages/${activeLocale}.json`)).default
  };
});
