import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer';

// Import your mock .ts files one by one
// If you use vite.mock.config.ts, just import the file directly

const modules = import.meta.globEager('./**/*.js');

const mockModules = [];
Object.keys(modules).forEach((key) => {
  if (key.includes('/_')) {
    return;
  }
  mockModules.push(...modules[key]);
});


export function setupProdMockServer() {
  createProdMockServer(mockModules);
}