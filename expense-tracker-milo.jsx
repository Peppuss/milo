import React, { useState, useEffect } from 'react';
import { Trash2, Plus, TrendingDown, Calendar } from 'lucide-react';

const MiloBudgetTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('🍔');
  const [description, setDescription] = useState('');
  const [view, setView] = useState('home'); // home, add, stats

  const categoryEmojis = {
    '🍔': { name: 'Cibo', color: 'from-orange-400 to-red-500' },
    '🚗': { name: 'Trasporti', color: 'from-blue-400 to-cyan-500' },
    '🎬': { name: 'Intrattenimento', color: 'from-purple-400 to-pink-500' },
    '🏥': { name: 'Salute', color: 'from-green-400 to-emerald-500' },
    '🛍️': { name: 'Shopping', color: 'from-pink-400 to-rose-500' },
    '📚': { name: 'Educazione', color: 'from-indigo-400 to-blue-500' },
    '⚡': { name: 'Utenze', color: 'from-yellow-400 to-orange-500' },
    '📱': { name: 'Abbonamenti', color: 'from-cyan-400 to-blue-500' },
    '🏠': { name: 'Casa', color: 'from-amber-400 to-yellow-500' },
    '💇': { name: 'Bellezza', color: 'from-fuchsia-400 to-pink-500' },
    '⚽': { name: 'Sport', color: 'from-lime-400 to-green-500' },
    '🎁': { name: 'Regali', color: 'from-rose-400 to-red-500' }
  };

  // Carica da localStorage
  useEffect(() => {
    const saved = localStorage.getItem('milo_expenses');
    if (saved) {
      try {
        setExpenses(JSON.parse(saved));
      } catch (e) {
        console.error('Errore caricamento dati');
      }
    }
  }, []);

  // Salva su localStorage
  useEffect(() => {
    localStorage.setItem('milo_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Inserisci un importo valido');
      return;
    }

    const newExpense = {
      id: Date.now(),
      amount: parseFloat(amount),
      category,
      categoryName: categoryEmojis[category].name,
      description: description || categoryEmojis[category].name,
      date: new Date().toLocaleDateString('it-IT', { 
        month: 'short', 
        day: 'numeric'
      }),
      fullDate: new Date()
    };

    setExpenses([newExpense, ...expenses]);
    setAmount('');
    setDescription('');
    setCategory('🍔');
    setView('home');
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const todaySpent = expenses
    .filter(e => new Date(e.fullDate).toDateString() === new Date().toDateString())
    .reduce((sum, e) => sum + e.amount, 0);

  const expensesByCategory = Object.keys(categoryEmojis).reduce((acc, cat) => {
    const total = expenses
      .filter(e => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0);
    if (total > 0) {
      acc[cat] = total;
    }
    return acc;
  }, {});

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addExpense();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pb-32">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap');
        
        * {
          font-family: 'Outfit', sans-serif;
        }

        .glow-text {
          background: linear-gradient(135deg, #60a5fa, #a78bfa);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .card-gradient {
          position: relative;
          overflow: hidden;
        }

        .card-gradient::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0.1;
          border-radius: inherit;
        }

        .category-card {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
          border: 2px solid transparent;
        }

        .category-card:active {
          transform: scale(0.95);
        }

        .category-card.selected {
          border-color: white;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        }

        .expense-item {
          animation: slideIn 0.4s ease-out forwards;
          opacity: 0;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .expense-item:nth-child(1) { animation-delay: 0.05s; }
        .expense-item:nth-child(2) { animation-delay: 0.1s; }
        .expense-item:nth-child(3) { animation-delay: 0.15s; }

        .stat-box {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }
      `}
      </style>

      {/* HOME VIEW */}
      {view === 'home' && (
        <>
          {/* Header */}
          <div className="pt-8 px-6 pb-6">
            <h1 className="text-5xl font-black mb-2">milo</h1>
            <p className="text-slate-400 text-sm">il tuo budget tracker</p>
          </div>

          {/* Total Spent Card */}
          <div className="px-6 mb-6">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700 stat-box">
              <p className="text-slate-400 text-sm mb-2">Totale speso</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black glow-text">€{totalSpent.toFixed(2)}</span>
              </div>
              <p className="text-slate-500 text-sm mt-4">Oggi: €{todaySpent.toFixed(2)}</p>
            </div>
          </div>

          {/* Quick Add Button */}
          <div className="px-6 mb-8">
            <button
              onClick={() => setView('add')}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-3 transition-all transform hover:scale-105 active:scale-95"
            >
              <Plus size={24} />
              Aggiungi spesa
            </button>
          </div>

          {/* Stats by Category */}
          {Object.keys(expensesByCategory).length > 0 && (
            <div className="px-6 mb-8">
              <h2 className="text-lg font-bold mb-4">Categorie</h2>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(expensesByCategory)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 6)
                  .map(([cat, total]) => (
                    <div
                      key={cat}
                      className={`bg-gradient-to-br ${categoryEmojis[cat].color} rounded-2xl p-4 stat-box border border-white border-opacity-20`}
                    >
                      <div className="text-3xl mb-2">{cat}</div>
                      <p className="text-white text-opacity-80 text-xs mb-1">
                        {categoryEmojis[cat].name}
                      </p>
                      <p className="text-xl font-bold">€{total.toFixed(2)}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Recent Expenses */}
          <div className="px-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Ultimi movimenti</h2>
              {expenses.length > 0 && (
                <button
                  onClick={() => setView('stats')}
                  className="text-blue-400 hover:text-blue-300 text-sm font-semibold"
                >
                  Vedi tutto →
                </button>
              )}
            </div>

            {expenses.length === 0 ? (
              <div className="text-center py-12">
                <TrendingDown size={48} className="mx-auto mb-4 text-slate-700" />
                <p className="text-slate-400">Nessuna spesa ancora</p>
                <p className="text-slate-600 text-sm mt-2">Inizia ad aggiungere le tue spese</p>
              </div>
            ) : (
              <div className="space-y-2">
                {expenses.slice(0, 5).map((expense, idx) => (
                  <div
                    key={expense.id}
                    className="expense-item flex items-center justify-between p-4 bg-slate-800 bg-opacity-50 rounded-2xl border border-slate-700 hover:border-slate-600 transition-colors"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`bg-gradient-to-br ${categoryEmojis[expense.category].color} rounded-xl p-3 text-2xl`}>
                        {expense.category}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-white">{expense.description}</p>
                        <p className="text-xs text-slate-400">{expense.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">€{expense.amount.toFixed(2)}</span>
                      <button
                        onClick={() => deleteExpense(expense.id)}
                        className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ADD VIEW */}
      {view === 'add' && (
        <>
          <div className="pt-8 px-6 pb-6">
            <button
              onClick={() => setView('home')}
              className="text-slate-400 hover:text-white mb-4 font-semibold"
            >
              ← Indietro
            </button>
            <h1 className="text-4xl font-black">Nuova spesa</h1>
          </div>

          <div className="px-6 space-y-6">
            {/* Amount Input */}
            <div>
              <input
                type="number"
                inputMode="decimal"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full bg-transparent text-6xl font-black text-white placeholder-slate-700 focus:outline-none"
                autoFocus
              />
              <div className="text-2xl text-slate-500 mt-2">€</div>
            </div>

            {/* Category Selection */}
            <div>
              <p className="text-slate-400 text-sm mb-4 font-semibold">Categoria</p>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(categoryEmojis).map(([emoji, { name, color }]) => (
                  <button
                    key={emoji}
                    onClick={() => setCategory(emoji)}
                    className={`category-card bg-gradient-to-br ${color} rounded-2xl p-4 text-center transition-all ${
                      category === emoji ? 'selected' : 'opacity-60 hover:opacity-80'
                    }`}
                  >
                    <div className="text-4xl mb-2">{emoji}</div>
                    <p className="text-xs font-semibold text-white text-opacity-90">{name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Description Input */}
            <div>
              <p className="text-slate-400 text-sm mb-2 font-semibold">Note (opzionale)</p>
              <input
                type="text"
                placeholder="Es: caffè con amici"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full bg-slate-800 text-white placeholder-slate-600 rounded-xl px-4 py-3 border border-slate-700 focus:border-slate-600 focus:outline-none transition-colors"
              />
            </div>

            {/* Add Button */}
            <button
              onClick={addExpense}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-2xl py-4 font-bold text-lg transition-all transform hover:scale-105 active:scale-95 mt-8"
            >
              Aggiungi spesa
            </button>
          </div>
        </>
      )}

      {/* STATS VIEW */}
      {view === 'stats' && (
        <>
          <div className="pt-8 px-6 pb-6">
            <button
              onClick={() => setView('home')}
              className="text-slate-400 hover:text-white mb-4 font-semibold"
            >
              ← Indietro
            </button>
            <h1 className="text-4xl font-black">Tutte le spese</h1>
          </div>

          <div className="px-6 space-y-4">
            {expenses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400">Nessuna spesa</p>
              </div>
            ) : (
              <>
                {expenses.map((expense, idx) => (
                  <div
                    key={expense.id}
                    className="expense-item flex items-center justify-between p-4 bg-slate-800 bg-opacity-50 rounded-2xl border border-slate-700 hover:border-slate-600 transition-colors"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`bg-gradient-to-br ${categoryEmojis[expense.category].color} rounded-xl p-3 text-2xl`}>
                        {expense.category}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-white">{expense.description}</p>
                        <p className="text-xs text-slate-400">{expense.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">€{expense.amount.toFixed(2)}</span>
                      <button
                        onClick={() => deleteExpense(expense.id)}
                        className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => {
                    if (window.confirm('Eliminare tutte le spese?')) {
                      setExpenses([]);
                      setView('home');
                    }
                  }}
                  className="w-full text-red-400 hover:text-red-300 font-semibold py-3 px-4 rounded-xl transition-colors mt-6 border border-red-400 border-opacity-30 hover:border-opacity-50"
                >
                  Elimina tutto
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MiloBudgetTracker;