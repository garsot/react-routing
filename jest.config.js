module.exports = {  
  transformIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist', '<rootDir>/example'],
  snapshotSerializers: ["enzyme-to-json/serializer"],
  setupFiles: ["./src/setupTests.js"],
  testURL: "http://example.com/"
}
