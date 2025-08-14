import React, { useState } from 'react';

const InfoCard: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      <div 
        className="bg-gray-800/80 border border-gray-700 rounded-xl p-4 cursor-pointer hover:bg-gray-800/90 transition-all duration-300"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-amber-300 font-amiri">
            عن دوائر العروض
          </h3>
          <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-4 space-y-4 text-gray-300 leading-relaxed">
            <p className="font-amiri text-lg text-right">
              دائرة العروض هي نظام رياضي عبقري وضعه الخليل بن أحمد الفراهيدي (ت ١٧٥هـ) لتنظيم بحور الشعر العربي.
              تقوم هذه الدائرة على تسلسل أساسي من الوحدات المقطعية التي تتكرر في حلقة مغلقة.
            </p>
            
            <div className="bg-gray-900/50 rounded-lg p-4 max-w-4xl mx-auto">
              <h4 className="text-amber-200 font-bold mb-3 font-amiri text-center">الوحدات الأساسية:</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <ul className="space-y-2 font-amiri text-right">
                  <li><span className="text-amber-300">الوتد المجموع (//0):</span> مقطعان قصيران + مقطع طويل</li>
                  <li><span className="text-amber-300">السبب الخفيف (/0):</span> مقطع قصير + مقطع طويل</li>
                </ul>
                <ul className="space-y-2 font-amiri text-right">
                  <li><span className="text-amber-300">السبب الثقيل (//):</span> مقطعان قصيران</li>
                  <li><span className="text-amber-300">الوتد المفروق (/0/):</span> مقطع قصير + مقطع طويل + مقطع قصير</li>
                </ul>
              </div>
            </div>
            
            <p className="text-center text-amber-200 font-amiri text-sm">
              استخدم الأسهم للانتقال بين البحور ومشاهدة كيف تتحرك الأنماط في الدائرة
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoCard;