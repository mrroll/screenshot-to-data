import { routeHandler } from '@/graphql/route-handler';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'only-no-store';
export { routeHandler as GET, routeHandler as POST };
