'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://my-new-user:password@ds115219.mlab.com:15219/calories_db';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-calories-app';
exports.PORT = process.env.PORT || 8080;