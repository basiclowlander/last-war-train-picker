// Admin roster. Each entry: { name, hash } where hash = md5("their-secret-code").
// To generate a hash: open the browser console and run:
//   import md5 from './src/utils/md5.js'; md5("your-code")
// Or use any online MD5 tool.
//
// Codes must be unique across all admins — two identical codes would match the first entry.
export const ADMINS = [
  { name: 'BasicLowlander', hash: 'ae0b848155d485cd36488e144bde5450' },
  // { name: 'Bob', hash: '<md5 of Bob's code>' },
];
