import React from 'react';
import { Circle } from '../types';
import { ALL_CIRCLES } from '../constants';
import OrnateCard from './OrnateCard';

interface CircleHubProps {
  onCircleSelect: (circle: Circle) => void;
}

const CircleHub: React.FC<CircleHubProps> = ({ onCircleSelect }) => {
  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold text-amber-400 font-amiri mb-4">
          دوائر الخليل العروضية
        </h1>
        <h2 className="text-2xl md:text-3xl text-gray-300 font-amiri mb-2">
          نظام الخليل بن أحمد الفراهيدي للعروض العربي
        </h2>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed font-amiri text-center">
          استكشف النظام الكامل لبحور الشعر العربي للخليل بن أحمد الفراهيدي،
          المنظم في خمس دوائر تقليدية تحتوي على جميع البحور الكلاسيكية الستة عشر
        </p>
      </div>

      {/* Ornate Cards Cluster - Grape Layout */}
      <div className="flex flex-col items-center gap-16 mb-12 px-4">
        {/* Top Row - 3 Ornate Cards */}
        <div className="flex justify-center gap-8">
          {ALL_CIRCLES.slice(0, 3).map((circle) => (
            <OrnateCard 
              key={circle.id} 
              circle={circle} 
              onCircleSelect={onCircleSelect}
            />
          ))}
        </div>

        {/* Bottom Row - 2 Ornate Cards */}
        <div className="flex justify-center gap-8">
          {ALL_CIRCLES.slice(3).map((circle) => (
            <OrnateCard 
              key={circle.id} 
              circle={circle} 
              onCircleSelect={onCircleSelect}
            />
          ))}
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="text-center bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-2xl font-bold text-amber-400 font-amiri">١٦</div>
            <div className="text-gray-400 text-sm font-amiri">بحراً كلاسيكياً</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-400 font-amiri">٥</div>
            <div className="text-gray-400 text-sm font-amiri">دوائر عروضية</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-400 font-amiri">+١٢٠٠</div>
            <div className="text-gray-400 text-sm font-amiri">سنة من التراث</div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm max-w-2xl mx-auto">
          This digital representation preserves Al-Khalil ibn Ahmad al-Farahidi's foundational 
          work in Arabic prosody, offering an interactive exploration of classical Arabic poetry meters.
        </p>
      </div>

      {/* Author Trademark Footer */}
      <div className="mt-6 text-center border-t border-gray-700/30 pt-6">
        <p className="text-gray-400 text-sm font-amiri">
          © تطوير وتصميم: <span className="text-amber-300 font-bold">د.محمد عمر الصديق</span>
        </p>
        <p className="text-gray-500 text-xs mt-1 font-inter">
          Interactive Arud Explorer - Digital Heritage Preservation
        </p>
      </div>
    </div>
  );
};

export default CircleHub;