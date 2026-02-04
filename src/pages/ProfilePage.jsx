import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/MockAuthContext';
import { ArrowLeft, User, Mail } from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-white/60 hover:text-cyan-electric mb-8 transition-all"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-black uppercase">Voltar</span>
        </button>

        <div className="card-glass p-8 rounded-[2rem]">
          <h1 className="text-3xl font-black italic uppercase mb-8">Perfil</h1>
          
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                <User size={14} /> Nome
              </label>
              <div className="input-tactical bg-white/10 cursor-not-allowed">
                {profile?.name}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                <Mail size={14} /> Email
              </label>
              <div className="input-tactical bg-white/10 cursor-not-allowed">
                {profile?.email}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <p className="text-xs text-white/40 text-center">
                Perfil em modo simulado (mock)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
