import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Heart,
  FileText,
  User,
  ShieldCheck,
  Briefcase,
  Store,
  ChevronDown,
  Menu,
  X,
  PlusCircle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { User as UserType, City, UserRole } from '../types.ts';
import { StorageService } from '../services/storage.ts';
import { PWAInstallButton } from './PWAInstallButton.tsx';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  activeUser: UserType;
  setActiveUser: (user: UserType) => void;
  selectedCity: City;
  setSelectedCity: (city: City) => void;
  cities: City[];
  favoritesCount: number;
  openOrdersCount: number;
  onOpenNewRequest: () => void;
  onOpenAIHelper: () => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  activeUser,
  setActiveUser,
  selectedCity,
  setSelectedCity,
  cities,
  favoritesCount,
  openOrdersCount,
  onOpenNewRequest,
  onOpenAIHelper,
  onResetData
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  const handleRoleChange = (role: UserRole) => {
    let newUser: UserType;
    if (role === 'cliente') {
      newUser = StorageService.getAllClients()[0];
    } else if (role === 'profissional') {
      const pros = StorageService.getProfessionals();
      const firstPro = pros[0];
      newUser = {
        id: firstPro.usuarioId,
        nome: firstPro.nome,
        email: 'carlos.eletrica@sorocabaservicos.com.br',
        telefone: firstPro.telefone,
        role: 'profissional',
        cidadeId: firstPro.cidadeId,
        bairro: 'Campolim',
        avatarUrl: firstPro.fotoUrl,
        criadoEm: firstPro.criadoEm
      };
    } else if (role === 'empresa') {
      const bizs = StorageService.getBusinesses();
      const firstBiz = bizs[0];
      newUser = {
        id: firstBiz.usuarioId,
        nome: firstBiz.nome,
        email: 'contato@petmaniasorocaba.com.br',
        telefone: firstBiz.telefone,
        role: 'empresa',
        cidadeId: firstBiz.cidadeId,
        bairro: firstBiz.bairro,
        avatarUrl: firstBiz.logoUrl,
        criadoEm: firstBiz.criadoEm
      };
    } else {
      newUser = {
        id: 'usr-admin-1',
        nome: 'Administrador Sorocaba Serviços',
        email: 'admin@sorocabaservicos.com.br',
        telefone: '(15) 3000-0000',
        role: 'admin',
        cidadeId: 'cid-sorocaba',
        bairro: 'Centro',
        criadoEm: '2026-01-01T00:00:00Z'
      };
    }

    StorageService.setActiveUser(newUser);
    setActiveUser(newUser);
    setRoleDropdownOpen(false);

    if (role === 'admin') {
      setCurrentTab('admin');
    } else if (role === 'profissional') {
      setCurrentTab('painel_profissional');
    } else if (role === 'empresa') {
      setCurrentTab('painel_empresa');
    } else {
      setCurrentTab('home');
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'cliente':
        return 'Cliente';
      case 'profissional':
        return 'Profissional';
      case 'empresa':
        return 'Empresa / Loja';
      case 'admin':
        return 'Administrador';
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'cliente':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'profissional':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'empresa':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'admin':
        return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Testing Utility Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
            <span>Cidade:</span>
          </span>
          <div className="relative">
            <button
              id="btn-select-city"
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className="flex items-center gap-1 font-semibold text-white hover:text-teal-300 transition cursor-pointer"
            >
              <span>{selectedCity.nome} / {selectedCity.estado}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {cityDropdownOpen && (
              <div className="absolute left-0 mt-1 w-48 rounded-lg bg-slate-800 border border-slate-700 shadow-xl py-1 z-50 text-white">
                {cities.map(city => (
                  <button
                    key={city.id}
                    onClick={() => {
                      setSelectedCity(city);
                      StorageService.setSelectedCityId(city.id);
                      setCityDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-700 transition cursor-pointer ${
                      city.id === selectedCity.id ? 'bg-teal-900/60 text-teal-300 font-bold' : ''
                    }`}
                  >
                    <span>{city.nome} ({city.estado})</span>
                    {city.cidadePrincipal && (
                      <span className="text-[10px] bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded">Principal</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Role Quick Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 hidden sm:inline">Perfil ativo para teste:</span>
            <div className="relative">
              <button
                id="btn-role-switcher"
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold border ${getRoleBadgeColor(activeUser.role)} cursor-pointer`}
              >
                <span>{getRoleLabel(activeUser.role)}: <strong>{activeUser.nome.split(' ')[0]}</strong></span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-1 w-56 rounded-lg bg-white border border-slate-200 shadow-2xl py-1.5 z-50 text-slate-800">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Alternar Papel do Usuário
                  </div>
                  <button
                    onClick={() => handleRoleChange('cliente')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 transition cursor-pointer ${
                      activeUser.role === 'cliente' ? 'bg-teal-50 text-teal-800 font-bold' : ''
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-teal-600" />
                    <div>
                      <div>Cliente (Mariana Silva)</div>
                      <div className="text-[10px] text-slate-500">Busca, pedidos, WhatsApp, avaliações</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleRoleChange('profissional')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 transition cursor-pointer ${
                      activeUser.role === 'profissional' ? 'bg-blue-50 text-blue-800 font-bold' : ''
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                    <div>
                      <div>Profissional (Carlos Eletricista)</div>
                      <div className="text-[10px] text-slate-500">Disponível agora, orçamentos, 6m grátis</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleRoleChange('empresa')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 transition cursor-pointer ${
                      activeUser.role === 'empresa' ? 'bg-amber-50 text-amber-800 font-bold' : ''
                    }`}
                  >
                    <Store className="w-3.5 h-3.5 text-amber-600" />
                    <div>
                      <div>Empresa (Pet Mania)</div>
                      <div className="text-[10px] text-slate-500">Loja patrocinada, métricas, mapa</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleRoleChange('admin')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 transition cursor-pointer ${
                      activeUser.role === 'admin' ? 'bg-purple-50 text-purple-800 font-bold' : ''
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    <div>
                      <div>Administrador</div>
                      <div className="text-[10px] text-slate-500">Dashboard, aprovações, planos, cidades</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onResetData}
            title="Restaurar dados iniciais de teste"
            className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden md:inline">Resetar Dados</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <div
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-700 to-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-700/20 group-hover:scale-105 transition">
              <span className="font-extrabold text-xl tracking-tighter">S</span>
              <span className="font-bold text-amber-300 text-xs">★</span>
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-lg leading-tight tracking-tight flex items-center gap-1">
                <span>Sorocaba</span>
                <span className="text-teal-600 font-black">Serviços</span>
              </div>
              <div className="text-[11px] font-medium text-slate-500 leading-none">
                Marketplace & Comércio Local
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              id="nav-link-home"
              onClick={() => setCurrentTab('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                currentTab === 'home'
                  ? 'bg-teal-50 text-teal-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Início
            </button>

            <button
              id="nav-link-professionals"
              onClick={() => setCurrentTab('profissionais')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                currentTab === 'profissionais'
                  ? 'bg-teal-50 text-teal-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Profissionais
            </button>

            <button
              id="nav-link-businesses"
              onClick={() => setCurrentTab('empresas')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                currentTab === 'empresas'
                  ? 'bg-teal-50 text-teal-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Empresas & Lojas
            </button>

            <button
              id="nav-link-howitworks"
              onClick={() => setCurrentTab('como_funciona')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                currentTab === 'como_funciona'
                  ? 'bg-teal-50 text-teal-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Como Funciona
            </button>

            {/* Role specific links */}
            {activeUser.role === 'profissional' && (
              <button
                id="nav-link-pro-dashboard"
                onClick={() => setCurrentTab('painel_profissional')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  currentTab === 'painel_profissional'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-blue-700 bg-blue-50 hover:bg-blue-100'
                }`}
              >
                Painel do Profissional
              </button>
            )}

            {activeUser.role === 'empresa' && (
              <button
                id="nav-link-biz-dashboard"
                onClick={() => setCurrentTab('painel_empresa')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  currentTab === 'painel_empresa'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                }`}
              >
                Painel da Empresa
              </button>
            )}

            {activeUser.role === 'admin' && (
              <button
                id="nav-link-admin"
                onClick={() => setCurrentTab('admin')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  currentTab === 'admin'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-purple-700 bg-purple-50 hover:bg-purple-100'
                }`}
              >
                Painel Administrativo
              </button>
            )}
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-2.5">
            {/* AI Smart Search Helper */}
            <button
              id="btn-ai-helper"
              onClick={onOpenAIHelper}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal-200 bg-teal-50/70 text-teal-800 text-xs font-semibold hover:bg-teal-100 transition cursor-pointer"
              title="Classificação inteligente de pedidos com IA"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>IA: O que precisa?</span>
            </button>

            {/* Favorites Icon */}
            <button
              id="btn-nav-favorites"
              onClick={() => setCurrentTab('favoritos')}
              className="relative p-2 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              title="Meus Favoritos"
            >
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* My Requests Icon */}
            <button
              id="btn-nav-requests"
              onClick={() => setCurrentTab('pedidos')}
              className="relative p-2 rounded-lg text-slate-600 hover:text-teal-700 hover:bg-teal-50 transition cursor-pointer"
              title="Meus Pedidos de Serviço"
            >
              <FileText className="w-5 h-5" />
              {openOrdersCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {openOrdersCount}
                </span>
              )}
            </button>

            {/* Request Service CTA */}
            <button
              id="btn-nav-new-request"
              onClick={onOpenNewRequest}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 shadow-sm shadow-teal-600/20 transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Pedir Serviço</span>
            </button>

            {/* PWA Install Button */}
            <PWAInstallButton compact />

            {/* Mobile hamburger button */}
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => { setCurrentTab('home'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Início
          </button>
          <button
            onClick={() => { setCurrentTab('profissionais'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Profissionais Autônomos
          </button>
          <button
            onClick={() => { setCurrentTab('empresas'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Empresas & Lojas Locais
          </button>
          <button
            onClick={() => { setCurrentTab('como_funciona'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Como Funciona
          </button>
          <button
            onClick={() => { setCurrentTab('pedidos'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-teal-700 bg-teal-50 flex items-center justify-between"
          >
            <span>Meus Pedidos</span>
            <span className="bg-teal-600 text-white text-xs px-2 py-0.5 rounded-full">{openOrdersCount}</span>
          </button>
          <button
            onClick={() => { setCurrentTab('favoritos'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-700 bg-rose-50 flex items-center justify-between"
          >
            <span>Meus Favoritos</span>
            <span className="bg-rose-600 text-white text-xs px-2 py-0.5 rounded-full">{favoritesCount}</span>
          </button>

          {activeUser.role === 'profissional' && (
            <button
              onClick={() => { setCurrentTab('painel_profissional'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-blue-700 bg-blue-50"
            >
              Painel do Profissional
            </button>
          )}

          {activeUser.role === 'empresa' && (
            <button
              onClick={() => { setCurrentTab('painel_empresa'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-amber-700 bg-amber-50"
            >
              Painel da Empresa
            </button>
          )}

          {activeUser.role === 'admin' && (
            <button
              onClick={() => { setCurrentTab('admin'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-purple-700 bg-purple-50"
            >
              Painel Administrativo
            </button>
          )}

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => { onOpenNewRequest(); setMobileMenuOpen(false); }}
              className="w-full py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold text-center shadow-xs"
            >
              + Pedir Serviço Agora
            </button>

            <button
              onClick={() => { onOpenAIHelper(); setMobileMenuOpen(false); }}
              className="w-full py-2.5 rounded-xl border border-teal-200 bg-teal-50 text-teal-800 text-sm font-semibold text-center flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Classificar Pedido com IA</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
