'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/calories-app';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-calories-app';
exports.PORT = process.env.PORT || 8080;