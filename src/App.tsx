import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  MapPin,
  Star,
  Clock,
  Filter,
  ArrowRight,
  ShieldCheck,
  Zap,
  Gift,
  PlusCircle,
  Sparkles,
  SlidersHorizontal,
  X,
  Phone,
  MessageCircle,
  Building2,
  Users,
  Navigation,
  Store
} from 'lucide-react';
import {
  City,
  ServiceCategory,
  User,
  Professional,
  Business,
  ServiceRequest,
  Review,
  AuditLog,
  SmartClassificationResult,
  UserLocation,
  DistanceFilterOptions
} from './types.ts';
import { StorageService } from './services/storage.ts';

// Components
import { Navbar } from './components/Navbar.tsx';
import { HeroSearch } from './components/HeroSearch.tsx';
import { CategoryGrid } from './components/CategoryGrid.tsx';
import { ProfessionalCard } from './components/ProfessionalCard.tsx';
import { BusinessCard } from './components/BusinessCard.tsx';
import { ProfessionalProfileModal } from './components/ProfessionalProfileModal.tsx';
import { BusinessProfileModal } from './components/BusinessProfileModal.tsx';
import { ServiceRequestModal } from './components/ServiceRequestModal.tsx';
import { SmartOrderClassifierModal } from './components/SmartOrderClassifierModal.tsx';
import { ReviewModal } from './components/ReviewModal.tsx';
import { ClientOrdersView } from './components/ClientOrdersView.tsx';
import { FavoritesView } from './components/FavoritesView.tsx';
import { ProfessionalDashboardView } from './components/ProfessionalDashboardView.tsx';
import { BusinessDashboardView } from './components/BusinessDashboardView.tsx';
import { AdminDashboardView } from './components/AdminDashboardView.tsx';
import { HowItWorksView } from './components/HowItWorksView.tsx';
import { Footer } from './components/Footer.tsx';
import { OfflineIndicator } from './components/OfflineIndicator.tsx';
import { GeolocationDistanceFilter } from './components/GeolocationDistanceFilter.tsx';
import { ProfessionalRegisterModal } from './components/ProfessionalRegisterModal.tsx';
import { ClientRegisterModal } from './components/ClientRegisterModal.tsx';
import { BusinessCarousel } from './components/BusinessCarousel.tsx';
import { BusinessRegisterModal } from './components/BusinessRegisterModal.tsx';
import {
  calculateDistanceKm,
  getProfessionalCoordinates
} from './utils/geolocation.ts';

export default function App() {
  // Navigation & role
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [activeUser, setActiveUser] = useState<User>(() => StorageService.getActiveUser());

  // Cities & Categories
  const [cities, setCities] = useState<City[]>(() => StorageService.getCities());
  const [selectedCityId, setSelectedCityId] = useState<string>(() => StorageService.getSelectedCityId());
  const [categories, setCategories] = useState<ServiceCategory[]>(() => StorageService.getCategories());

  // Entities
  const [professionals, setProfessionals] = useState<Professional[]>(() => StorageService.getProfessionals());
  const [businesses, setBusinesses] = useState<Business[]>(() => StorageService.getBusinesses());
  const [requests, setRequests] = useState<ServiceRequest[]>(() => StorageService.getServiceRequests());
  const [reviews, setReviews] = useState<Review[]>(() => StorageService.getReviews());
  const [favorites, setFavorites] = useState<string[]>(() => StorageService.getFavorites());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => StorageService.getAuditLogs());

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);
  const [filterAvailableNowOnly, setFilterAvailableNowOnly] = useState(false);
  const [minRatingFilter, setMinRatingFilter] = useState<number>(0);

  // Geolocation & Distance Filter
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [distanceFilter, setDistanceFilter] = useState<DistanceFilterOptions>({
    enabled: false,
    maxDistanceKm: null,
    sortByProximity: false
  });

  // Modals
  const [selectedProForModal, setSelectedProForModal] = useState<Professional | null>(null);
  const [selectedBizForModal, setSelectedBizForModal] = useState<Business | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [targetProForRequest, setTargetProForRequest] = useState<Professional | null>(null);
  const [requestModalDefaults, setRequestModalDefaults] = useState<{
    category?: string;
    service?: string;
    urgency?: 'baixa' | 'normal' | 'alta' | 'urgente';
  }>({});

  const [isAIHelperOpen, setIsAIHelperOpen] = useState(false);
  const [aiHelperQuery, setAiHelperQuery] = useState('');

  const [reviewModalData, setReviewModalData] = useState<{
    isOpen: boolean;
    targetId: string;
    targetName: string;
    serviceName: string;
    requestId?: string;
    targetType: 'profissional' | 'empresa';
  }>({
    isOpen: false,
    targetId: '',
    targetName: '',
    serviceName: '',
    targetType: 'profissional'
  });

  const [isRegisterProModalOpen, setIsRegisterProModalOpen] = useState(false);
  const [isRegisterClientModalOpen, setIsRegisterClientModalOpen] = useState(false);
  const [isBusinessRegisterModalOpen, setIsBusinessRegisterModalOpen] = useState(false);

  // Selected city object
  const selectedCity = useMemo(() => {
    return cities.find(c => c.id === selectedCityId) || cities[0];
  }, [cities, selectedCityId]);

  // Current active professional if the logged-in user is a pro
  const activeProfessional = useMemo(() => {
    return (
      professionals.find(p => p.usuarioId === activeUser.id || p.id === activeUser.id) ||
      professionals[0]
    );
  }, [professionals, activeUser]);

  // Refresh all state from localStorage
  const refreshAllState = () => {
    setCities(StorageService.getCities());
    setCategories(StorageService.getCategories());
    setProfessionals(StorageService.getProfessionals());
    setBusinesses(StorageService.getBusinesses());
    setRequests(StorageService.getServiceRequests());
    setReviews(StorageService.getReviews());
    setFavorites(StorageService.getFavorites());
    setAuditLogs(StorageService.getAuditLogs());
    setActiveUser(StorageService.getActiveUser());
  };

  const handleResetData = () => {
    if (window.confirm('Deseja restaurar os dados de demonstração da plataforma Kairos Serviços?')) {
      StorageService.resetDatabase();
      refreshAllState();
      alert('Dados de demonstração restaurados com sucesso!');
    }
  };

  const handleToggleFavorite = (id: string) => {
    StorageService.toggleFavorite(id);
    setFavorites(StorageService.getFavorites());
  };

  const handleCityChange = (city: City) => {
    setSelectedCityId(city.id);
    StorageService.setSelectedCityId(city.id);
    setSelectedNeighborhood(null);
  };

  // Calculate distance in km from user's current location to each professional
  const proDistancesMap = useMemo(() => {
    const map = new Map<string, number>();
    if (!userLocation) return map;

    for (const pro of professionals) {
      const coords = getProfessionalCoordinates(pro);
      const dist = calculateDistanceKm(
        userLocation.latitude,
        userLocation.longitude,
        coords.latitude,
        coords.longitude
      );
      map.set(pro.id, dist);
    }
    return map;
  }, [professionals, userLocation]);

  // Filtered Professionals
  const filteredProfessionals = useMemo(() => {
    return professionals.filter(pro => {
      // Must be active (or pending if looking directly)
      if (pro.status === 'BLOQUEADO') return false;

      // Distance radius filter: if enabled and max distance is specified, filter by proximity
      if (distanceFilter.enabled && distanceFilter.maxDistanceKm !== null && userLocation) {
        const dist = proDistancesMap.get(pro.id);
        if (dist === undefined || dist > distanceFilter.maxDistanceKm) {
          return false;
        }
      } else {
        // City filter applies when not constrained to a specific GPS radius
        if (pro.cidadeId !== selectedCityId) return false;
      }

      // Category
      if (selectedCategoryId && pro.categoriaId !== selectedCategoryId) return false;

      // Neighborhood
      if (selectedNeighborhood && !pro.bairrosAtendidos.includes(selectedNeighborhood)) return false;

      // Available now
      if (filterAvailableNowOnly && !pro.disponivelAgora) return false;

      // Rating
      if (minRatingFilter > 0 && pro.notaMedia < minRatingFilter) return false;

      // Text query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = pro.nome.toLowerCase().includes(q);
        const matchesTitle = pro.tituloProfissional.toLowerCase().includes(q);
        const matchesDesc = pro.descricao.toLowerCase().includes(q);
        const matchesServices = pro.servicos.some(s => s.toLowerCase().includes(q));
        const matchesNeighborhood = pro.bairrosAtendidos.some(b => b.toLowerCase().includes(q));
        if (!matchesName && !matchesTitle && !matchesDesc && !matchesServices && !matchesNeighborhood) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Proximity sorting when requested and user location is active
      if (distanceFilter.enabled && distanceFilter.sortByProximity && userLocation) {
        const distA = proDistancesMap.get(a.id) ?? 9999;
        const distB = proDistancesMap.get(b.id) ?? 9999;
        if (Math.abs(distA - distB) > 0.05) {
          return distA - distB;
        }
      }

      // Prioritize available now, then rating
      if (a.disponivelAgora && !b.disponivelAgora) return -1;
      if (!a.disponivelAgora && b.disponivelAgora) return 1;
      return b.notaMedia - a.notaMedia;
    });
  }, [
    professionals,
    selectedCityId,
    selectedCategoryId,
    selectedNeighborhood,
    filterAvailableNowOnly,
    minRatingFilter,
    searchQuery,
    proDistancesMap,
    distanceFilter,
    userLocation
  ]);

  // Filtered Businesses
  const filteredBusinesses = useMemo(() => {
    return businesses.filter(biz => {
      if (biz.status === 'BLOQUEADO') return false;

      // City
      if (biz.cidadeId !== selectedCityId) return false;

      // Category
      if (selectedCategoryId && biz.categoriaId !== selectedCategoryId) return false;

      // Neighborhood
      if (selectedNeighborhood && biz.bairro !== selectedNeighborhood) return false;

      // Rating
      if (minRatingFilter > 0 && biz.notaMedia < minRatingFilter) return false;

      // Text query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = biz.nome.toLowerCase().includes(q);
        const matchesDesc = biz.descricao.toLowerCase().includes(q);
        const matchesAddress = biz.endereco.toLowerCase().includes(q);
        const matchesItems = biz.servicosOuProdutos.some(p => p.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesAddress && !matchesItems) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Prioritize sponsored businesses
      if (a.patrocinada && !b.patrocinada) return -1;
      if (!a.patrocinada && b.patrocinada) return 1;
      return b.notaMedia - a.notaMedia;
    });
  }, [businesses, selectedCityId, selectedCategoryId, selectedNeighborhood, minRatingFilter, searchQuery]);

  // Professional count per category
  const proCountsPerCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const pro of professionals) {
      if (pro.cidadeId === selectedCityId && pro.status !== 'BLOQUEADO') {
        counts[pro.categoriaId] = (counts[pro.categoriaId] || 0) + 1;
      }
    }
    return counts;
  }, [professionals, selectedCityId]);

  const getCategoryName = (catId: string) => {
    return categories.find(c => c.id === catId)?.nome || 'Especialidade';
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategoryId(null);
    setSelectedNeighborhood(null);
    setFilterAvailableNowOnly(false);
    setMinRatingFilter(0);
    setDistanceFilter({
      enabled: false,
      maxDistanceKm: null,
      sortByProximity: false
    });
    setUserLocation(null);
  };

  const handleHeroSearch = (query: string, catId?: string) => {
    setSearchQuery(query);
    if (catId) setSelectedCategoryId(catId);
    setCurrentTab('profissionais');
  };

  const handleAIQuery = (queryText: string) => {
    setAiHelperQuery(queryText);
    setIsAIHelperOpen(true);
  };

  const handleProceedFromAI = (result: SmartClassificationResult, originalText: string) => {
    setTargetProForRequest(null);
    setRequestModalDefaults({
      category: result.categoriaId,
      service: result.servicoSugerido,
      urgency: result.urgencia
    });
    setIsRequestModalOpen(true);
  };

  const handleOpenReviewModal = (targetId: string, targetName: string, serviceName: string, requestId?: string) => {
    setReviewModalData({
      isOpen: true,
      targetId,
      targetName,
      serviceName,
      requestId,
      targetType: 'profissional'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-teal-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activeUser={activeUser}
        setActiveUser={setActiveUser}
        selectedCity={selectedCity}
        setSelectedCity={handleCityChange}
        cities={cities}
        favoritesCount={favorites.length}
        openOrdersCount={requests.filter(r => r.status === 'aberto' || r.status === 'profissional_interessado').length}
        onOpenNewRequest={() => {
          setTargetProForRequest(null);
          setRequestModalDefaults({});
          setIsRequestModalOpen(true);
        }}
        onOpenAIHelper={() => {
          setAiHelperQuery('');
          setIsAIHelperOpen(true);
        }}
        onResetData={handleResetData}
        onOpenRegisterPro={() => setIsRegisterProModalOpen(true)}
        onOpenRegisterClient={() => setIsRegisterClientModalOpen(true)}
        onOpenRegisterBusiness={() => setIsBusinessRegisterModalOpen(true)}
      />

      {/* Main Dynamic Content Area */}
      <main className="flex-1">
        {/* VIEW: HOME */}
        {currentTab === 'home' && (
          <div className="space-y-6">
            {/* Hero & Search Banner */}
            <HeroSearch
              selectedCity={selectedCity}
              categories={categories}
              onSearch={handleHeroSearch}
              onSelectCategory={(catId) => {
                setSelectedCategoryId(catId);
                setCurrentTab('profissionais');
              }}
              onQuickAIQuery={handleAIQuery}
              onOpenNewRequest={() => {
                setTargetProForRequest(null);
                setRequestModalDefaults({});
                setIsRequestModalOpen(true);
              }}
              onOpenNearMe={() => {
                setCurrentTab('profissionais');
                setDistanceFilter({
                  enabled: true,
                  maxDistanceKm: 10,
                  sortByProximity: true
                });
              }}
              onOpenRegisterPro={() => setIsRegisterProModalOpen(true)}
              onOpenRegisterClient={() => setIsRegisterClientModalOpen(true)}
            />

            {/* Popular Categories Grid */}
            <CategoryGrid
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={(catId) => {
                setSelectedCategoryId(catId);
                setCurrentTab('profissionais');
              }}
              professionalCounts={proCountsPerCategory}
            />

            {/* Featured Section on Homepage */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-1 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Destaques com Disponibilidade Imediata</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Profissionais em Destaque em {selectedCity.nome}
                  </h2>
                </div>

                <button
                  onClick={() => setCurrentTab('profissionais')}
                  className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                >
                  <span>Ver todos os {professionals.length} profissionais</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProfessionals.slice(0, 6).map((pro) => (
                  <ProfessionalCard
                    key={pro.id}
                    professional={pro}
                    categoryName={getCategoryName(pro.categoriaId)}
                    isFavorite={favorites.includes(pro.id)}
                    distanceKm={userLocation ? proDistancesMap.get(pro.id) : null}
                    onToggleFavorite={handleToggleFavorite}
                    onViewProfile={(p) => setSelectedProForModal(p)}
                    onRequestService={(p) => {
                      setTargetProForRequest(p);
                      setIsRequestModalOpen(true);
                    }}
                  />
                ))}
              </div>
            </section>

            {/* Local Businesses & Commercial Advertisements Carousel */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-slate-200/80">
              <BusinessCarousel
                businesses={businesses}
                onViewProfile={(b) => setSelectedBizForModal(b)}
                onOpenRegisterModal={() => setIsBusinessRegisterModalOpen(true)}
                getCategoryName={getCategoryName}
              />

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setCurrentTab('empresas')}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Ver todas as lojas e filtrar por bairro em Sorocaba</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>

            {/* How It Works Teaser Banner */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div className="space-y-2 max-w-xl">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-400/20 px-3 py-1 rounded-full">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Pacote de Oportunidades: R$ 9,99 = 10 Serviços</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-white">
                    Você é profissional autônomo ou tem uma loja em Sorocaba?
                  </h3>
                  <p className="text-sm text-teal-100 leading-relaxed">
                    Cadastre-se hoje e receba 10 oportunidades liberadas por apenas R$ 9,99 via PIX direto na tela. Sem mensalidades caras e sem comissão por orçamento.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                  <button
                    id="btn-home-promo-register-pro"
                    onClick={() => setIsRegisterProModalOpen(true)}
                    className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition text-center cursor-pointer shadow-md"
                  >
                    Cadastrar como Profissional
                  </button>

                  <button
                    onClick={() => setCurrentTab('como_funciona')}
                    className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition text-center cursor-pointer border border-white/20"
                  >
                    Saiba Como Funciona
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW: PROFESSIONALS SEARCH & CATALOG */}
        {currentTab === 'profissionais' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Profissionais Autônomos em {selectedCity.nome}
                </h1>
                <p className="text-sm text-slate-500">
                  Encontre eletricistas, encanadores, diaristas e especialistas verificados com WhatsApp direto.
                </p>
              </div>

              <button
                onClick={() => {
                  setTargetProForRequest(null);
                  setRequestModalDefaults({});
                  setIsRequestModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold shadow-xs transition cursor-pointer self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Pedir Serviço / Orçamento</span>
              </button>
            </div>

            {/* Geolocation Distance Filter Component */}
            <GeolocationDistanceFilter
              userLocation={userLocation}
              distanceFilter={distanceFilter}
              cityName={selectedCity.nome}
              totalMatchingPros={filteredProfessionals.length}
              onUpdateLocation={setUserLocation}
              onUpdateFilter={(patch) => setDistanceFilter((prev) => ({ ...prev, ...patch }))}
            />

            {/* Filter Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Search Text Input */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por nome, serviço ou especialidade..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Category Dropdown */}
                <div>
                  <select
                    value={selectedCategoryId || ''}
                    onChange={(e) => setSelectedCategoryId(e.target.value || null)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Todas as Categorias</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nome} ({proCountsPerCategory[c.id] || 0})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Neighborhood Dropdown */}
                <div>
                  <select
                    value={selectedNeighborhood || ''}
                    onChange={(e) => setSelectedNeighborhood(e.target.value || null)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Todos os Bairros de {selectedCity.nome}</option>
                    {(selectedCity.bairrosPrincipais || selectedCity.bairros || []).map((b: string, idx: number) => (
                      <option key={idx} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quick Filters */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFilterAvailableNowOnly(!filterAvailableNowOnly)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                      filterAvailableNowOnly
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${filterAvailableNowOnly ? 'bg-white' : 'bg-emerald-500'}`} />
                    <span>Disponível Agora</span>
                  </button>

                  {(searchQuery || selectedCategoryId || selectedNeighborhood || filterAvailableNowOnly || minRatingFilter > 0) && (
                    <button
                      onClick={clearAllFilters}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                      title="Limpar todos os filtros"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Results count & active distance indicators */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 px-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span>
                  Mostrando <strong>{filteredProfessionals.length}</strong> profissionais em {selectedCity.nome}
                </span>

                {distanceFilter.enabled && userLocation && (
                  <span className="inline-flex items-center gap-1 text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200 font-semibold">
                    <Navigation className="w-3 h-3 text-teal-600" />
                    <span>
                      {distanceFilter.maxDistanceKm ? `Até ${distanceFilter.maxDistanceKm} km` : 'Todas distâncias'}
                    </span>
                    {distanceFilter.sortByProximity && (
                      <span className="text-[10px] text-teal-700 font-normal">
                        (ordenados por proximidade)
                      </span>
                    )}
                  </span>
                )}

                {filterAvailableNowOnly && (
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    ● Disponibilidade imediata
                  </span>
                )}
              </div>

              {(userLocation || distanceFilter.enabled) && (
                <button
                  onClick={() => {
                    setUserLocation(null);
                    setDistanceFilter({
                      enabled: false,
                      maxDistanceKm: null,
                      sortByProximity: false
                    });
                  }}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium underline cursor-pointer"
                >
                  Desativar filtro de distância
                </button>
              )}
            </div>

            {/* Cards Grid */}
            {filteredProfessionals.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h3 className="font-bold text-slate-800">Nenhum profissional encontrado</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Tente ampliar o raio de distância em km ou alterar os filtros de busca.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-semibold hover:bg-teal-700 cursor-pointer"
                >
                  Limpar Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProfessionals.map((pro) => (
                  <ProfessionalCard
                    key={pro.id}
                    professional={pro}
                    categoryName={getCategoryName(pro.categoriaId)}
                    isFavorite={favorites.includes(pro.id)}
                    distanceKm={userLocation ? proDistancesMap.get(pro.id) : null}
                    onToggleFavorite={handleToggleFavorite}
                    onViewProfile={(p) => setSelectedProForModal(p)}
                    onRequestService={(p) => {
                      setTargetProForRequest(p);
                      setIsRequestModalOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW: BUSINESSES & STORES */}
        {currentTab === 'empresas' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
            {/* Top Carousel of Advertisements & Sponsored Stores */}
            <BusinessCarousel
              businesses={businesses}
              onViewProfile={(b) => setSelectedBizForModal(b)}
              onOpenRegisterModal={() => setIsBusinessRegisterModalOpen(true)}
              getCategoryName={getCategoryName}
            />

            {/* Header with Title & Registration CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Store className="w-6 h-6 text-amber-600" />
                  <span>Guia de Empresas & Comércios Locais em {selectedCity.nome}</span>
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Ache a loja mais perto da sua casa, confira o endereço no mapa e faça seu pedido direto pelo WhatsApp!
                </p>
              </div>

              <button
                onClick={() => setIsBusinessRegisterModalOpen(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white text-xs font-black shadow-md transition cursor-pointer self-start sm:self-auto shrink-0"
                title="Cadastre sua empresa e pague taxa via PIX"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Anuncie Sua Loja (Taxa PIX)</span>
              </button>
            </div>

            {/* Neighborhood Quick Filter Pills */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <MapPin className="w-4 h-4 text-teal-600" />
                  <span>Filtrar por Bairro em Sorocaba (Ache perto de você):</span>
                </div>

                {selectedNeighborhood && (
                  <button
                    onClick={() => setSelectedNeighborhood(null)}
                    className="text-xs text-amber-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Limpar bairro ({selectedNeighborhood})</span>
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Horizontal scrollable pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
                <button
                  onClick={() => setSelectedNeighborhood(null)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                    !selectedNeighborhood
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Todos os Bairros
                </button>

                {(selectedCity.bairrosPrincipais || selectedCity.bairros || []).map((bairroName: string, idx: number) => {
                  const isSelected = selectedNeighborhood === bairroName;
                  const count = businesses.filter(b => b.bairro === bairroName && b.status === 'ATIVO').length;

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedNeighborhood(isSelected ? null : bairroName)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                        isSelected
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-amber-50 hover:text-amber-900 text-slate-700'
                      }`}
                    >
                      <span>{bairroName}</span>
                      {count > 0 && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                          isSelected ? 'bg-amber-700 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter toolbar: Search, Category, Full Neighborhood dropdown */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar loja por nome, produto ou endereço..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <select
                    value={selectedCategoryId || ''}
                    onChange={(e) => setSelectedCategoryId(e.target.value || null)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">Todas as Categorias</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    value={selectedNeighborhood || ''}
                    onChange={(e) => setSelectedNeighborhood(e.target.value || null)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-amber-500 font-medium"
                  >
                    <option value="">Todos os Bairros de {selectedCity.nome}</option>
                    {(selectedCity.bairrosPrincipais || selectedCity.bairros || []).map((b: string, idx: number) => (
                      <option key={idx} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status banner */}
              <div className="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-100">
                <span>
                  Mostrando <strong>{filteredBusinesses.length} comércios</strong> {selectedNeighborhood ? `no bairro ${selectedNeighborhood}` : 'em Sorocaba'}.
                </span>
                {(searchQuery || selectedCategoryId || selectedNeighborhood) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-amber-700 font-bold hover:underline cursor-pointer"
                  >
                    Limpar todos os filtros
                  </button>
                )}
              </div>
            </div>

            {/* Results Grid */}
            {filteredBusinesses.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-xs">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h3 className="font-bold text-slate-800">Nenhum comércio encontrado</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Não encontramos lojas com os filtros selecionados {selectedNeighborhood && `no bairro ${selectedNeighborhood}`}.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                  <button
                    onClick={clearAllFilters}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Ver Todas as Lojas de Sorocaba
                  </button>
                  <button
                    onClick={() => setIsBusinessRegisterModalOpen(true)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Cadastrar Loja no Bairro
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBusinesses.map((biz) => (
                  <BusinessCard
                    key={biz.id}
                    business={biz}
                    categoryName={getCategoryName(biz.categoriaId)}
                    isFavorite={favorites.includes(biz.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onViewProfile={(b) => setSelectedBizForModal(b)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW: HOW IT WORKS */}
        {currentTab === 'como_funciona' && (
          <HowItWorksView
            onOpenNewRequest={() => {
              setTargetProForRequest(null);
              setRequestModalDefaults({});
              setIsRequestModalOpen(true);
            }}
            onGoToPros={() => setCurrentTab('profissionais')}
            onGoToBizs={() => setCurrentTab('empresas')}
            onOpenRegisterPro={() => setIsRegisterProModalOpen(true)}
            onOpenRegisterClient={() => setIsRegisterClientModalOpen(true)}
          />
        )}

        {/* VIEW: CLIENT ORDERS */}
        {currentTab === 'pedidos' && (
          <ClientOrdersView
            requests={requests.filter(r => r.clienteId === activeUser.id || activeUser.role === 'cliente')}
            onOpenNewRequest={() => {
              setTargetProForRequest(null);
              setRequestModalDefaults({});
              setIsRequestModalOpen(true);
            }}
            onOpenReview={handleOpenReviewModal}
            onRefresh={refreshAllState}
          />
        )}

        {/* VIEW: FAVORITES */}
        {currentTab === 'favoritos' && (
          <FavoritesView
            favoriteIds={favorites}
            professionals={professionals}
            businesses={businesses}
            categories={categories}
            onToggleFavorite={handleToggleFavorite}
            onViewProProfile={(p) => setSelectedProForModal(p)}
            onRequestProService={(p) => {
              setTargetProForRequest(p);
              setIsRequestModalOpen(true);
            }}
            onViewBizProfile={(b) => setSelectedBizForModal(b)}
          />
        )}

        {/* VIEW: PROFESSIONAL DASHBOARD */}
        {currentTab === 'painel_profissional' && (
          <ProfessionalDashboardView
            professional={activeProfessional || professionals[0] || ({} as any)}
            categories={categories}
            requests={requests}
            onRefresh={refreshAllState}
          />
        )}

        {/* VIEW: BUSINESS DASHBOARD */}
        {currentTab === 'painel_empresa' && (
          <BusinessDashboardView
            business={businesses[0] || ({} as any)}
            categories={categories}
            onRefresh={refreshAllState}
          />
        )}

        {/* VIEW: ADMIN DASHBOARD */}
        {currentTab === 'admin' && (
          <AdminDashboardView
            professionals={professionals}
            businesses={businesses}
            cities={cities}
            categories={categories}
            requests={requests}
            auditLogs={auditLogs}
            onRefresh={refreshAllState}
            onResetData={handleResetData}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        selectedCity={selectedCity}
        onSelectCategory={(catId) => {
          setSelectedCategoryId(catId);
          setCurrentTab('profissionais');
        }}
        onOpenNewRequest={() => {
          setTargetProForRequest(null);
          setRequestModalDefaults({});
          setIsRequestModalOpen(true);
        }}
        onOpenRegisterPro={() => setIsRegisterProModalOpen(true)}
        onOpenRegisterClient={() => setIsRegisterClientModalOpen(true)}
      />

      {/* Offline Banner Indicator */}
      <OfflineIndicator />

      {/* MODALS */}
      {/* Self-Registration Modal for Clients */}
      <ClientRegisterModal
        isOpen={isRegisterClientModalOpen}
        onClose={() => setIsRegisterClientModalOpen(false)}
        selectedCity={selectedCity}
        onSwitchToProfessional={() => {
          setIsRegisterClientModalOpen(false);
          setIsRegisterProModalOpen(true);
        }}
        onSuccess={(newUser, proceedToRequest) => {
          refreshAllState();
          setActiveUser(newUser);
          setIsRegisterClientModalOpen(false);
          if (proceedToRequest) {
            setTargetProForRequest(null);
            setRequestModalDefaults({});
            setIsRequestModalOpen(true);
          } else {
            setCurrentTab('profissionais');
          }
        }}
      />

      {/* Self-Registration Modal for Professionals */}
      <ProfessionalRegisterModal
        isOpen={isRegisterProModalOpen}
        onClose={() => setIsRegisterProModalOpen(false)}
        categories={categories}
        selectedCity={selectedCity}
        onSwitchToClient={() => {
          setIsRegisterProModalOpen(false);
          setIsRegisterClientModalOpen(true);
        }}
        onSuccess={(newPro, newUser) => {
          refreshAllState();
          setActiveUser(newUser);
          setCurrentTab('painel_profissional');
          setSelectedProForModal(newPro);
        }}
      />
      {/* Professional Profile Modal */}
      {selectedProForModal && (
        <ProfessionalProfileModal
          professional={selectedProForModal}
          category={categories.find(c => c.id === selectedProForModal.categoriaId)}
          reviews={reviews.filter(r => r.alvoTipo === 'profissional' && r.alvoId === selectedProForModal.id)}
          distanceKm={selectedProForModal && userLocation ? proDistancesMap.get(selectedProForModal.id) : null}
          onClose={() => setSelectedProForModal(null)}
          onRequestService={(pro) => {
            setTargetProForRequest(pro);
            setIsRequestModalOpen(true);
          }}
        />
      )}

      {/* Business Profile Modal */}
      {selectedBizForModal && (
        <BusinessProfileModal
          business={selectedBizForModal}
          category={categories.find(c => c.id === selectedBizForModal.categoriaId)}
          reviews={reviews.filter(r => r.alvoTipo === 'empresa' && r.alvoId === selectedBizForModal.id)}
          onClose={() => setSelectedBizForModal(null)}
        />
      )}

      {/* Business Register & Fee Payment Modal (Taxa PIX) */}
      <BusinessRegisterModal
        isOpen={isBusinessRegisterModalOpen}
        onClose={() => setIsBusinessRegisterModalOpen(false)}
        categories={categories}
        selectedCity={selectedCity}
        onSuccess={(newBiz) => {
          refreshAllState();
          setIsBusinessRegisterModalOpen(false);
          setSelectedBizForModal(newBiz);
        }}
      />

      {/* Service Request Creation Modal */}
      <ServiceRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => {
          setIsRequestModalOpen(false);
          setTargetProForRequest(null);
        }}
        categories={categories}
        selectedCity={selectedCity}
        activeUser={activeUser}
        targetProfessional={targetProForRequest}
        initialCategory={requestModalDefaults.category}
        initialService={requestModalDefaults.service}
        initialUrgency={requestModalDefaults.urgency}
        onSuccess={() => {
          refreshAllState();
          setCurrentTab('pedidos');
        }}
      />

      {/* AI Smart Order Classifier Modal */}
      <SmartOrderClassifierModal
        isOpen={isAIHelperOpen}
        onClose={() => setIsAIHelperOpen(false)}
        initialQuery={aiHelperQuery}
        onProceedToRequest={handleProceedFromAI}
      />

      {/* Customer Review Modal */}
      <ReviewModal
        isOpen={reviewModalData.isOpen}
        onClose={() => setReviewModalData({ ...reviewModalData, isOpen: false })}
        targetId={reviewModalData.targetId}
        targetName={reviewModalData.targetName}
        targetType={reviewModalData.targetType}
        serviceName={reviewModalData.serviceName}
        clientName={activeUser.nome}
        requestId={reviewModalData.requestId}
        onReviewSubmitted={() => {
          refreshAllState();
        }}
      />
    </div>
  );
}
