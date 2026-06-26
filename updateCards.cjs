const fs = require('fs');
let data = fs.readFileSync('x:/Company projects/Defense_auto_hub/Frontend/src/Components/Home.jsx', 'utf8');

const cardGradient = 'bg-gradient-to-br from-[#fefefe] to-[#fafbf8]';
const solidBorder = 'border-2 border-solid border-[#708ca4]';

const replacements = [
  {
    old: 'bg-white/70 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50',
    new: `${cardGradient} backdrop-blur-md p-4 rounded-2xl shadow-xl ${solidBorder}`
  },
  {
    old: 'bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-[0_20px_40px_-15px_rgba(25,69,109,0.1)] border border-white',
    new: `${cardGradient} backdrop-blur-xl p-6 rounded-3xl shadow-[0_20px_40px_-15px_rgba(25,69,109,0.1)] ${solidBorder}`
  },
  {
    old: 'bg-white/40 backdrop-blur-sm border border-white/50 rounded-3xl p-6',
    new: `${cardGradient} backdrop-blur-sm ${solidBorder} rounded-3xl p-6`
  },
  {
    old: 'bg-[#fafbf8]/50 rounded-3xl overflow-hidden border border-[#708ca4]/30',
    new: `${cardGradient} rounded-3xl overflow-hidden ${solidBorder}`
  },
  {
    old: 'bg-white rounded-3xl p-8 hover:shadow-xl transition-shadow border border-[#708ca4]/20',
    new: `${cardGradient} rounded-3xl p-8 hover:shadow-xl transition-shadow ${solidBorder}`
  },
  {
    old: 'bg-white/60 backdrop-blur-sm border border-white/50 p-8 rounded-3xl hover:bg-white',
    new: `${cardGradient} backdrop-blur-sm ${solidBorder} p-8 rounded-3xl hover:from-[#fefefe] hover:to-[#fefefe]`
  },
  {
    old: 'bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white shadow-xl',
    new: `${cardGradient} backdrop-blur-md p-8 rounded-3xl ${solidBorder} shadow-xl`
  },
  {
    old: 'bg-white rounded-2xl p-6 cursor-pointer hover:shadow-md transition-shadow flex justify-between items-center group',
    new: `${cardGradient} rounded-2xl p-6 cursor-pointer hover:shadow-md transition-shadow flex justify-between items-center group ${solidBorder}`
  }
];

replacements.forEach(r => {
  data = data.split(r.old).join(r.new);
});

fs.writeFileSync('x:/Company projects/Defense_auto_hub/Frontend/src/Components/Home.jsx', data, 'utf8');
console.log('Cards updated successfully!');
