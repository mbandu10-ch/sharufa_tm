import createMiddleware from 'next-intl/middleware';
import {locales} from '@sharufa/shared';

export default createMiddleware({
  locales,
  defaultLocale: 'fr'
});

export const config = {
  matcher: ['/', '/(fr|en|tr)/:path*']
};
