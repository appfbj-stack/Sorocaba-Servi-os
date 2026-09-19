import React, { useState } from 'react';
import {
  Navigation,
  MapPin,
  Sliders,
  X,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Compass,
  ArrowDownUp,
  Map,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { UserLocation, DistanceFilterOptions } from '../types.ts';
import {
  POPULAR_LANDMARKS,
  getNearestNeighborhood,
  formatDistance
} from '../utils/geolocation.ts';

interface GeolocationDistanceFilterProps {
  userLocation: UserLocation | null;
  distanceFilter: DistanceFilterOptions;
  cityName: string;
  totalMatchingPros: number;
  onUpdateLocation: (location: UserLocation | null) => void;
  onUpdateFilter: (filter: Partial<DistanceFilterOptions>) => void;
}

export const GeolocationDistanceFilter: React.FC<GeolocationDistanceFilterProps> = ({
  userLocation,
  distanceFilter,
  cityName,
  totalMatchingPros,
  onUpdateLocation,
  onUpdateFilter
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showLandmarkPicker, setShowLandmarkPicker] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // Quick radius preset options
  const radiusPresets = [
    { label: 'Qualquer distância', value: null },
    { label: 'Até 3 km', value: 3 },
    { label: 'Até 5 km', value: 5 },
    { label: 'Até 10 km', value: 10 },
    { label: 'Até 20 km', value: 20 },
    { label: 'Até 35 km', value: 35 }
  ];

  const requestBrowserLocation = () => {
    setErrorMsg(null);

    if (!('geolocation' in navigator)) {
      setErrorMsg('A API de geolocalização não é suportada por este navegador.');
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const nearestBairro = getNearestNeighborhood(latitude, longitude);

        const newLocation: UserLocation = {
          latitude,
          longitude,
          accuracy: Math.round(accuracy),
          bairro: nearestBairro,
          label: `Próximo a ${nearestBairro}`,
          timestamp: position.timestamp,
          isSimulated: false
        };

        onUpdateLocation(newLocation);
        onUpdateFilter({
          enabled: true,
          sortByProximity: true
        });
        setLoading(false);
        setErrorMsg(null);
      },
      (err) => {
        setLoading(false);
        if (err.code === 1) { // PERMISSION_DENIED
          setErrorMsg(
            'Permissão de GPS negada no navegador. Você pode habilitar o acesso nas permissões do site ou selecionar um ponto de referência de Sorocaba abaixo.'
          );
        } else if (err.code === 2) { // POSITION_UNAVAILABLE
          setErrorMsg(
            'Sua posição não pôde ser determinada pelo dispositivo. Tente selecionar um ponto de referência abaixo.'
          );
        } else if (err.code === 3) { // TIMEOUT
          setErrorMsg('Tempo limite excedido ao buscar localização. Tente novamente.');
        } else {
          setErrorMsg('Erro inesperado ao acessar o GPS.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 30000
      }
    );
  };

  const handleSelectLandmark = (landmark: typeof POPULAR_LANDMARKS[0]) => {
    const newLocation: UserLocation = {
      latitude: landmark.lat,
      longitude: landmark.lng,
      bairro: landmark.bairro,
      label: `${landmark.nome}`,
      isSimulated: true
    };

    onUpdateLocation(newLocation);
    onUpdateFilter({
      enabled: true,
      sortByProximity: true
    });
    setErrorMsg(null);
    setShowLandmarkPicker(false);
  };

  const handleClearLocation = () => {
    onUpdateLocation(null);
    onUpdateFilter({
      enabled: false,
      maxDistanceKm: null,
      sortByProximity: false
    });
    setErrorMsg(null);
  };

  return (
    <div
      id="geolocation-distance-filter-panel"
      className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all"
    >
      {/* Panel Header */}
      <div className="p-4 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 shrink-0">
            <Navigation className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-white">
                Filtro por Distância & Proximidade Real
              </h3>
              {userLocation && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Ativo
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {userLocation
                ? `Local de referência: ${userLocation.label || userLocation.bairro || 'Coordenadas obtidas'}`
                : `Utilize a geolocalização do navegador para ver profissionais mais próximos de você`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {!userLocation ? (
            <button
              id="btn-enable-geolocation"
              type="button"
              onClick={requestBrowserLocation}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Navigation className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Obtendo GPS...' : 'Usar Minha Localização'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={requestBrowserLocation}
                disabled={loading}
                title="Atualizar localização via GPS"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs transition cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                id="btn-disable-geolocation"
                type="button"
                onClick={handleClearLocation}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 text-xs font-semibold transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Desativar</span>
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title={isExpanded ? 'Recolher detalhes' : 'Expandir detalhes'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Controls Body */}
      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-4">
          {/* Error Banner with Reference Selection */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-amber-900 leading-snug">{errorMsg}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-amber-200/60">
                <span className="font-semibold text-[11px] text-amber-800">
                  Ou selecione um ponto em Sorocaba para calcular a distância:
                </span>
                {POPULAR_LANDMARKS.slice(0, 4).map((lm) => (
                  <button
                    key={lm.id}
                    type="button"
                    onClick={() => handleSelectLandmark(lm)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-medium text-[11px] transition cursor-pointer shadow-2xs"
                  >
                    📍 {lm.bairro}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active Geolocation Dashboard */}
          {userLocation ? (
            <div className="space-y-4">
              {/* Location Badge & Info Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-teal-50/70 border border-teal-100 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{userLocation.label || userLocation.bairro || 'Localização Atual'}</span>
                      {userLocation.isSimulated && (
                        <span className="text-[10px] font-medium bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
                          Referência
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Coordenadas: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
                      {userLocation.accuracy && ` (precisão de ~${userLocation.accuracy}m)`}
                    </p>
                  </div>
                </div>

                {/* Switch Landmark Button */}
                <button
                  type="button"
                  onClick={() => setShowLandmarkPicker(!showLandmarkPicker)}
                  className="text-xs font-semibold text-teal-800 hover:text-teal-900 hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Trocar ponto de referência</span>
                </button>
              </div>

              {/* Landmark Selection Drawer (if toggled) */}
              {showLandmarkPicker && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">
                      Escolha um bairro/ponto conhecido para simular sua localização:
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowLandmarkPicker(false)}
                      className="text-slate-400 hover:text-slate-700 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {POPULAR_LANDMARKS.map((lm) => (
                      <button
                        key={lm.id}
                        type="button"
                        onClick={() => handleSelectLandmark(lm)}
                        className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-teal-500 hover:bg-teal-50/50 text-left transition cursor-pointer"
                      >
                        <p className="font-bold text-slate-900">{lm.nome}</p>
                        <p className="text-[11px] text-slate-500 truncate">{lm.descricao}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Radius Presets and Slider */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-teal-600" />
                    <span>Raio máximo de distância:</span>
                  </span>
                  <span className="font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                    {distanceFilter.maxDistanceKm === null
                      ? 'Todas as distâncias (sem limite)'
                      : `Até ${distanceFilter.maxDistanceKm} km de você`}
                  </span>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {radiusPresets.map((preset, idx) => {
                    const isSelected = distanceFilter.maxDistanceKm === preset.value;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          onUpdateFilter({
                            maxDistanceKm: preset.value,
                            enabled: true
                          })
                        }
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                          isSelected
                            ? 'bg-teal-700 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>

                {/* Distance Slider */}
                <div className="pt-2 flex items-center gap-3">
                  <span className="text-[11px] text-slate-400 font-medium">1 km</span>
                  <input
                    type="range"
                    min="1"
                    max="45"
                    step="1"
                    value={distanceFilter.maxDistanceKm ?? 45}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      onUpdateFilter({
                        maxDistanceKm: val,
                        enabled: true
                      });
                    }}
                    className="flex-1 accent-teal-600 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-400 font-medium">45+ km</span>
                </div>
              </div>

              {/* Proximity Sorting Toggle & Match Counter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={distanceFilter.sortByProximity}
                    onChange={(e) =>
                      onUpdateFilter({
                        sortByProximity: e.target.checked
                      })
                    }
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
                  />
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                    <ArrowDownUp className="w-3.5 h-3.5 text-teal-600" />
                    <span>Ordenar pelo profissional mais próximo</span>
                  </span>
                </label>

                <div className="text-xs text-slate-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    <strong>{totalMatchingPros}</strong> profissionais encontrados dentro do raio
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Inactive State Prompt */
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-xs font-bold text-slate-800">
                  Quer ver quem atende mais perto da sua casa ou trabalho?
                </p>
                <p className="text-xs text-slate-500 leading-relaxed max-w-lg">
                  Ao ativar a localização, a plataforma calcula os quilômetros exatos de cada profissional até você, permitindo filtrar por raio (ex: até 5 km) e ordenar pelos mais próximos.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={requestBrowserLocation}
                  disabled={loading}
                  className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Navigation className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>{loading ? 'Detectando...' : 'Ativar GPS do Navegador'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowLandmarkPicker(!showLandmarkPicker)}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Map className="w-3.5 h-3.5 text-slate-500" />
                  <span>Escolher Bairro</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick Landmark Picker (when inactive and clicked) */}
          {!userLocation && showLandmarkPicker && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">
                  Ou selecione sua região em Sorocaba para calcular a distância aproximada:
                </span>
                <button
                  type="button"
                  onClick={() => setShowLandmarkPicker(false)}
                  className="text-slate-400 hover:text-slate-700 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {POPULAR_LANDMARKS.map((lm) => (
                  <button
                    key={lm.id}
                    type="button"
                    onClick={() => handleSelectLandmark(lm)}
                    className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-teal-500 hover:bg-teal-50/50 text-left transition cursor-pointer"
                  >
                    <p className="font-bold text-slate-900">{lm.nome}</p>
                    <p className="text-[11px] text-slate-500 truncate">{lm.descricao}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
