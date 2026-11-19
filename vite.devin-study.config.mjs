import path from 'node:path';
export default {root:process.cwd(),publicDir:false,build:{outDir:'dist-devin-study',emptyOutDir:false,rollupOptions:{input:path.resolve('experiments/devin-integration-study/index.html')}}};
