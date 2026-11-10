import React from 'react';
import { X, CloudSun, Sun, Moon, CloudFog, CloudRain, Zap, Sunset } from 'lucide-react';
import { WeatherType } from '../types/rpg';

interface AtmosphereSelectorProps {
  weather: WeatherType;
  onChangeWeather: (w: WeatherType) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const AtmosphereSelector: React.FC<AtmosphereSelectorProps> = ({
  weather,
  onChangeWeather,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const weatherOptions: { key: WeatherType; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      key: 'clear',
      label: 'Dia Claro',
      icon: <Sun className="w-5 h-5 text-amber-400" />,
      desc: 'Luz solar normal, visualização limpa de todo o território.'
    },
    {
      key: 'sunset',
      label: 'Crepúsculo Dourado',
      icon: <Sunset className="w-5 h-5 text-orange-400" />,
      desc: 'Sombras longas e tonalidade dourada ao cair da tarde.'
    },
    {
      key: 'night',
      label: 'Noite Enluarada',
      icon: <Moon className="w-5 h-5 text-indigo-400" />,
      desc: 'Céu noturno azul-marinho; visibilidade reduzida.'
    },
    {
      key: 'fog',
      label: 'Névoa Mística',
      icon: <CloudFog className="w-5 h-5 text-stone-300" />,
      desc: 'Camada de bruma densa que paira sobre colinas e vales.'
    },
    {
      key: 'rain',
      label: 'Chuva Torrencial',
      icon: <CloudRain className="w-5 h-5 text-cyan-400" />,
      desc: 'Gotas de chuva contínuas e terreno escorregadio.'
    },
    {
      key: 'storm',
      label: 'Tempestade Arcana',
      icon: <Zap className="w-5 h-5 text-purple-400" />,
      desc: 'Relâmpagos ocasionais e céu elétrico crepitante.'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="bg-stone-900 border border-stone-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-stone-950/80 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <CloudSun className="w-4 h-4" />
            </div>
            <h3 className="font-cinzel text-base font-bold text-stone-100">
              Clima & Atmosfera do Cenário
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-100 p-1 rounded hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-4 space-y-2 text-xs">
          {weatherOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => {
                onChangeWeather(opt.key);
                onClose();
              }}
              className={`w-full p-3 rounded-lg border text-left flex items-start gap-3 transition-all cursor-pointer ${
                weather === opt.key
                  ? 'bg-amber-950/40 border-amber-500/70 text-amber-200'
                  : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700'
              }`}
            >
              <div className="p-1.5 rounded-md bg-stone-900 border border-stone-800 shrink-0">
                {opt.icon}
              </div>
              <div>
                <div className="font-semibold text-stone-100 flex items-center gap-2">
                  <span>{opt.label}</span>
                  {weather === opt.key && (
                    <span className="text-[10px] text-amber-400 font-mono">✓ ATIVO</span>
                  )}
                </div>
                <p className="text-[11px] text-stone-400 mt-0.5 leading-relaxed">{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
