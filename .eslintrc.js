module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true, // 如果你在项目中使用 Jest 进行测试，则启用此环境。
  },
  parser: "@typescript-eslint/parser", // 解析器用于解析 TypeScript 代码
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // 启用 JSX 支持
    },
    project: "./tsconfig.eslint.json",
    ecmaVersion: 12, // ECMAScript 版本
    sourceType: "module", // 模块类型
  },
  plugins: ["@typescript-eslint", "react", "prettier"],
  rules: {
    // 自定义规则
    "react/react-in-jsx-scope": "off", // 如果你使用了新的 JSX 转译器，可能不需要这个规则
    "react/jsx-uses-react": "off", // 如果你使用了新的 JSX 转译器，可能不需要这个规则
    "react/prop-types": "off", // 如果你使用 TypeScript 类型检查，可以关闭这个规则
  },
};
