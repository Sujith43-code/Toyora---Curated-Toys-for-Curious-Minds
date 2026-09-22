import serverless from 'serverless-http';
import app from '../../server/app';

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

export const handler = serverless(app);
