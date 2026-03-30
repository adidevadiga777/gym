const fs = require('fs');
let content = fs.readFileSync('src/features/posts/pages/DashboardPage.jsx', 'utf8');

const replacements = [
  [/bg-gray-50/g, 'bg-neutral-950'],
  [/bg-white/g, 'bg-neutral-900'],
  [/text-gray-900/g, 'text-white'],
  [/text-gray-800/g, 'text-neutral-200'],
  [/text-gray-700/g, 'text-neutral-300'],
  [/text-gray-600/g, 'text-neutral-400'],
  [/text-gray-500/g, 'text-neutral-400'],
  [/text-gray-400/g, 'text-neutral-500'],
  [/border-gray-100/g, 'border-neutral-800'],
  [/border-gray-200/g, 'border-neutral-700'],
  [/border-gray-300/g, 'border-neutral-700'],
  [/hover:bg-gray-50/g, 'hover:bg-neutral-800'],
  [/bg-gray-100/g, 'bg-neutral-800'],
  [/bg-blue-100/g, 'bg-blue-500/20'],
  [/text-blue-600/g, 'text-blue-400'],
  [/text-blue-700/g, 'text-blue-300'],
  [/bg-blue-50/g, 'bg-blue-500/10'],
  [/hover:bg-blue-100/g, 'hover:bg-blue-500/20'],
  [/bg-green-100/g, 'bg-green-500/20'],
  [/text-green-600/g, 'text-green-400'],
  [/text-green-800/g, 'text-green-300'],
  [/bg-red-100/g, 'bg-red-500/20'],
  [/text-red-600/g, 'text-red-400'],
  [/text-red-800/g, 'text-red-300'],
  [/bg-red-50/g, 'bg-red-500/10'],
  [/text-red-700/g, 'text-red-300'],
  [/hover:bg-red-100/g, 'hover:bg-red-500/20'],
  [/bg-gray-900\/60/g, 'bg-neutral-950/80'],
  [/bg-gray-50\/50/g, 'bg-neutral-900'],
  [/shadow-sm/g, 'shadow-md shadow-black/20'],
  [/#f0f0f0/g, '#262626'],
  [/#6b7280/g, '#a3a3a3'],
  [/stroke="#3b82f6"/g, 'stroke="#60a5fa"'],
  [/fill: '#3b82f6'/g, "fill: '#60a5fa'"]
];

replacements.forEach(([regex, replacement]) => {
  content = content.replace(regex, replacement);
});

fs.writeFileSync('src/features/posts/pages/DashboardPage.jsx', content);
console.log('Done!');
