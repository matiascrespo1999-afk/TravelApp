import React, { useState } from 'react';
import { 
  Wallet, 
  Plus, 
  ArrowRight, 
  Sparkles, 
  Trash2, 
  Download, 
  DollarSign, 
  CheckCircle2, 
  Receipt,
  Edit2,
  TrendingUp,
  Percent,
  Check,
  Scale
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTripStore } from '../context/TripStoreContext';
import { Expense } from '../types';

export const ExpensesView: React.FC = () => {
  const { 
    expenses, 
    mutateExpense,
    mutateSettlement,
    config,
    members,
    settlements 
  } = useTripStore();

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [isSettling, setIsSettling] = useState<boolean>(false);
  const [settleSuccessMsg, setSettleSuccessMsg] = useState<string | null>(null);

  // Safely fallback to members if not 2
  const userMatiasId = members?.[0]?.uid || 'USR_01';
  const userArielId = members?.[1]?.uid || 'USR_02';
  const userMatias = members?.[0]?.name || 'Matías';
  const userAriel = members?.[1]?.name || 'Ariel';

  // Form states
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [realUsd, setRealUsd] = useState('');
  const [curr, setCurr] = useState<'EUR' | 'GBP' | 'USD'>('EUR');
  const [payer, setPayer] = useState<string>(userMatiasId);
  const [split, setSplit] = useState<string>('50/50');
  const [category, setCategory] = useState('Comida');
  const [city, setCity] = useState('Roma');

  // 1. Calculate historical weighted average rates from actual entered expenses
  const getHistoricalRate = (currency: 'EUR' | 'GBP' | 'USD'): number => {
    if (currency === 'USD') return 1.0;
    const matching = expenses.filter(e => e.originalCurrency === currency && e.originalAmount > 0);
    if (matching.length === 0) return 0;
    const sumUSD = matching.reduce((acc, e) => acc + (e.realUsdAmount || e.calculatedUsdAmount || 0), 0);
    const sumLocal = matching.reduce((acc, e) => acc + e.originalAmount, 0);
    return sumLocal > 0 ? parseFloat((sumUSD / sumLocal).toFixed(4)) : 0;
  };

  // 2. Real-time rate + 2% bank debit fee buffer (Gold Standard fallback for Argentine credit cards)
  const getBankBufferRate = (currency: 'EUR' | 'GBP' | 'USD'): number => {
    if (currency === 'USD') return 1.0;
    const base = config.currencyRates?.[currency] || (currency === 'EUR' ? 1.09 : 1.29);
    return parseFloat((base * 1.02).toFixed(4));
  };

  // 3. Layered strategy suggestion for USD
  const getSuggestedUSD = (origAmount: number, currency: 'EUR' | 'GBP' | 'USD') => {
    if (currency === 'USD') return { usd: origAmount, rate: 1.0, reason: 'Paridad 1:1 USD' };
    const histRate = getHistoricalRate(currency);
    if (histRate > 0) {
      return {
        usd: parseFloat((origAmount * histRate).toFixed(2)),
        rate: histRate,
        reason: `Promedio ponderado del viaje (x${histRate})`
      };
    }
    const bufferRate = getBankBufferRate(currency);
    return {
      usd: parseFloat((origAmount * bufferRate).toFixed(2)),
      rate: bufferRate,
      reason: `Tasa base + 2% recargo banco (x${bufferRate})`
    };
  };

  // Trip actual expenses computation
  let matiasPaidTotalUSD = 0;
  let ariPaidTotalUSD = 0;
  let matiasChargedTotalUSD = 0;
  let ariChargedTotalUSD = 0;

  expenses.forEach(e => {
    const totalUSD = e.realUsdAmount || e.calculatedUsdAmount || 0;
    if (e.paidByUserId === userMatiasId || e.paidByUid === userMatiasId) matiasPaidTotalUSD += totalUSD;
    if (e.paidByUserId === userArielId || e.paidByUid === userArielId) ariPaidTotalUSD += totalUSD;
    
    e.splits?.forEach(s => {
      if (s.userId === userMatiasId) matiasChargedTotalUSD += (s.assignedUsdAmount || 0);
      if (s.userId === userArielId) ariChargedTotalUSD += (s.assignedUsdAmount || 0);
    });
  });

  const tripTotalUSD = matiasPaidTotalUSD + ariPaidTotalUSD;
  const netBalance = matiasPaidTotalUSD - matiasChargedTotalUSD; // positive: Ariel owes Matías, negative: Matías owes Ariel

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingExpenseId(null);
    setDesc('');
    setAmount('');
    setRealUsd('');
    setCurr('EUR');
    setPayer(userMatiasId);
    setSplit('50/50');
    setCategory('Comida');
    setCity('Roma');
    setShowAddModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (exp: Expense) => {
    setEditingExpenseId(exp.id);
    setDesc(exp.title);
    setAmount((exp.originalAmount || 0).toString());
    setRealUsd((exp.realUsdAmount || exp.calculatedUsdAmount || '').toString());
    setCurr((exp.originalCurrency as any) || 'EUR');
    setPayer((exp.paidByUserId || exp.paidByUid) as any || userMatiasId);
    
    const sMatias = exp.splits?.find(s => s.userId === userMatiasId)?.splitPercentage;
    if (sMatias === 100) setSplit('Solo USR_01');
    else if (sMatias === 0) setSplit('Solo USR_02');
    else setSplit('50/50');

    setCategory(exp.category || 'Varios');
    setShowAddModal(true);
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0 || !desc.trim()) return;

    // Resolve USD Amount:
    // 1. Real USD entered by user (Priority 1)
    // 2. Automated Layered calculation (Historical Avg or 2% Buffer)
    let finalUsd = parseFloat(realUsd);
    if (isNaN(finalUsd) || finalUsd <= 0) {
      finalUsd = getSuggestedUSD(numAmount, curr).usd;
    }

    let chargeMatias = 0;
    let chargeAri = 0;
    if (split === '50/50') {
      chargeMatias = parseFloat((finalUsd / 2).toFixed(2));
      chargeAri = parseFloat((finalUsd / 2).toFixed(2));
    } else if (split === 'Solo USR_01') {
      chargeMatias = finalUsd;
      chargeAri = 0;
    } else if (split === 'Solo USR_02') {
      chargeMatias = 0;
      chargeAri = finalUsd;
    }

    const expensePayload: Expense = {
      id: editingExpenseId || `exp_${Date.now()}`,
      tripId: 'TRIP_CURRENT',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      title: desc.trim(),
      expenseDate: new Date().toISOString().split('T')[0],
      date: new Date().toISOString().split('T')[0],
      category,
      originalAmount: numAmount,
      amount: numAmount,
      originalCurrency: curr,
      currency: curr,
      realUsdAmount: finalUsd,
      calculatedUsdAmount: finalUsd,
      fxRateToUSD: finalUsd / numAmount,
      paidByUserId: payer,
      paidByUid: payer,
      paymentMethod: 'Tarjeta Contactless',
      splitAmongUids: split === '50/50' ? [userMatiasId, userArielId] : split === 'Solo USR_01' ? [userMatiasId] : [userArielId],
      splits: [
        { 
          userId: userMatiasId, 
          assignedUsdAmount: chargeMatias, 
          splitPercentage: split === '50/50' ? 50 : (split === 'Solo USR_01' ? 100 : 0) 
        },
        { 
          userId: userArielId, 
          assignedUsdAmount: chargeAri, 
          splitPercentage: split === '50/50' ? 50 : (split === 'Solo USR_02' ? 100 : 0) 
        }
      ],
      notes: `Ciudad: ${city}`
    };

    if (editingExpenseId) {
      mutateExpense(editingExpenseId, expensePayload);
    } else {
      mutateExpense(expensePayload.id, expensePayload);
    }

    setShowAddModal(false);
  };

  const handleSettleDebt = async () => {
    setIsSettling(true);
    setSettleSuccessMsg(null);
    try {
      const payerId = netBalance > 0 ? userArielId : userMatiasId;
      const receiverId = netBalance > 0 ? userMatiasId : userArielId;
      const amountToSettle = Math.abs(netBalance);

      mutateSettlement(`set_${Date.now()}`, {
        id: `set_${Date.now()}`,
        tripId: 'TRIP_CURRENT',
        amount: amountToSettle,
        currency: 'USD',
        fxRateToUSD: 1,
        date: new Date().toISOString().split('T')[0],
        fromUid: payerId,
        toUid: receiverId,
        paymentMethod: 'TRANSFER',
        notes: 'Liquidación periódica de balance 50/50'
      });
      
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      setSettleSuccessMsg(`Compensación completada exitosamente. Se registraron los gastos como liquidados y se actualizó el balance.`);
      setTimeout(() => setSettleSuccessMsg(null), 6000);
    } catch (err) {
      console.error("Error settling debts:", err);
    } finally {
      setIsSettling(false);
    }
  };

  const handleResetSettlement = async () => {
    if (settlements) {
      settlements.forEach(s => mutateSettlement(s.id, {}, true));
      setSettleSuccessMsg("Se restauró el historial de compensaciones anteriores.");
      setTimeout(() => setSettleSuccessMsg(null), 4000);
    }
  };

  const handleExportCSV = () => {
    const headers = `ID,Fecha,Categoría,Título,Pagador,Moneda_Original,Monto_Original,Monto_USD_Real,Cargo_${userMatias},Cargo_${userAriel}\n`;
    const rows = expenses.map(e => {
      const cMatias = e.splits?.find(s => s.userId === userMatiasId)?.assignedUsdAmount || 0;
      const cAri = e.splits?.find(s => s.userId === userArielId)?.assignedUsdAmount || 0;
      const tUSD = e.realUsdAmount || e.calculatedUsdAmount || 0;
      const payerName = (e.paidByUserId === userMatiasId || e.paidByUid === userMatiasId) ? userMatias : userAriel;
      return `"${e.id}","${e.expenseDate}","${e.category}","${e.title}","${payerName}","${e.originalCurrency}",${e.originalAmount},${tUSD},${cMatias},${cAri}`;
    }).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gastos_viaje_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Real-time suggested USD for the modal input
  const currentNumAmount = parseFloat(amount) || 0;
  const suggestion = currentNumAmount > 0 ? getSuggestedUSD(currentNumAmount, curr) : null;

  return (
    <div className="space-y-6 pb-24">
      
      {/* 1. Header & Actions */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-[var(--border-card)] shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[var(--city-primary)] text-xs font-bold uppercase tracking-wider">
            <Wallet className="w-4 h-4" />
            <span>Gestor Financiero & Liquidación Multidivisa</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">
            Gastos Compartidos en Dólares ($USD)
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Liquidación precisa 50/50. Registra débitos reales bancarios en USD con promedio histórico o recargo del 2%.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-canvas)] text-[var(--text-primary)] border border-[var(--border-card)] text-xs font-semibold transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>

          <button
            id="btn-add-new-expense"
            onClick={handleOpenAdd}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[var(--city-primary)] hover:opacity-90 text-white text-xs font-bold shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Cargar Nuevo Gasto</span>
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Main Status / Settlement Balance */}
        <div className="md:col-span-2 glass-panel p-5 rounded-3xl border border-[var(--border-card)] shadow-xl flex flex-col justify-between gap-4 bg-gradient-to-br from-[var(--city-glow)]/40 via-[var(--bg-card)] to-[var(--bg-card)]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--city-primary)]">
                Posición Neta de Compensación (50 / 50)
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                Math.abs(netBalance) < 1.00 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
              }`}>
                <CheckCircle2 size={12} />
                <span>{Math.abs(netBalance) < 1.00 ? 'Cuentas Equilibradas' : 'Saldo Pendiente'}</span>
              </span>
            </div>

            <div className="mt-3">
              {Math.abs(netBalance) < 1.00 ? (
                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-black text-emerald-400">
                    Posición Neta Actual: Cuentas equilibradas ($0.00 USD de diferencia)
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Tanto {userMatias} como {userAriel} han aportado el 50.0% de los gastos vigentes del viaje.
                  </p>
                </div>
              ) : netBalance > 0 ? (
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-black text-[var(--text-primary)]">
                    Posición Neta Actual: <span className="text-emerald-400">{userMatias}</span> registra un saldo acreedor de <span className="text-emerald-400 font-mono">${netBalance.toFixed(2)} USD</span> frente a <span className="text-purple-400">{userAriel}</span>.
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {userMatias} ha adelantado consumos en comercios locales que le corresponden en un 50% a {userAriel}.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-black text-[var(--text-primary)]">
                    Posición Neta Actual: <span className="text-purple-400">{userAriel}</span> registra un saldo acreedor de <span className="text-purple-400 font-mono">${Math.abs(netBalance).toFixed(2)} USD</span> frente a <span className="text-emerald-400">{userMatias}</span>.
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {userAriel} ha adelantado consumos en comercios locales que le corresponden en un 50% a {userMatias}.
                  </p>
                </div>
              )}
            </div>

            {settleSuccessMsg && (
              <div className="mt-3 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 font-medium">
                {settleSuccessMsg}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[var(--border-card)] flex items-center justify-between flex-wrap gap-2 text-xs">
            <span className="text-[var(--text-secondary)]">
              Cotizaciones dinámicas: EUR · GBP · USD base contable
            </span>
            <div className="flex items-center gap-2">
              {settlements && settlements.length > 0 && (
                <button
                  onClick={handleResetSettlement}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold transition-all border border-[var(--border-card)]"
                >
                  Restaurar Histórico
                </button>
              )}
              <button
                onClick={handleSettleDebt}
                disabled={isSettling || Math.abs(netBalance) < 0.50}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none text-white font-bold transition-all shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isSettling ? 'Liquidando...' : 'Ejecutar Liquidación ($USD)'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 50/50 Individual Breakdown */}
        <div className="glass-panel p-5 rounded-3xl border border-[var(--border-card)] space-y-3 shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] block">
            Aportes Totales Viajeros
          </span>
          <div className="space-y-2.5 text-xs">
            {/* Matías */}
            <div className="p-2.5 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-card)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-sky-500" />
                <span className="font-bold text-[var(--text-primary)]">{userMatias} aportó:</span>
              </div>
              <span className="font-mono font-black text-sm text-[var(--text-primary)]">
                ${matiasPaidTotalUSD.toFixed(2)} USD
              </span>
            </div>

            {/* Ariel */}
            <div className="p-2.5 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-card)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="font-bold text-[var(--text-primary)]">{userAriel} aportó:</span>
              </div>
              <span className="font-mono font-black text-sm text-[var(--text-primary)]">
                ${ariPaidTotalUSD.toFixed(2)} USD
              </span>
            </div>

            {/* Total trip */}
            <div className="pt-2 border-t border-[var(--border-card)] flex justify-between items-center text-xs">
              <span className="text-[var(--text-secondary)] font-semibold">Total Viaje ({expenses.length} gastos):</span>
              <span className="font-mono font-black text-[var(--city-primary)] text-sm">
                ${tripTotalUSD.toFixed(2)} USD
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Expenses List */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-[var(--border-card)] space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[var(--city-primary)]" />
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Detalle de Transacciones ({expenses.length})
            </h3>
          </div>
          <span className="text-xs text-[var(--text-secondary)]">
            Toca "Editar" para modificar divisas o montos en USD
          </span>
        </div>

        <div className="space-y-3">
          {expenses.map((expense) => {
            const payerName = (expense.paidByUserId === userMatiasId || expense.paidByUid === userMatiasId) ? userMatias : userAriel;
            const chargeMatias = expense.splits?.find(s => s.userId === userMatiasId)?.assignedUsdAmount || 0;
            const chargeAri = expense.splits?.find(s => s.userId === userArielId)?.assignedUsdAmount || 0;
            const totalUSD = expense.realUsdAmount || expense.calculatedUsdAmount || 0;

            return (
              <div
                key={expense.id}
                className="p-4 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-card)] hover:border-[var(--city-primary)]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[var(--city-glow)] text-[var(--city-primary)] border border-[var(--city-primary)]/30">
                      {expense.category}
                    </span>
                    <span className="text-xs text-[var(--text-secondary)] font-mono">
                      {expense.expenseDate}
                    </span>
                    {expense.notes && (
                      <span className="text-[11px] text-[var(--text-secondary)] font-medium">
                        • {expense.notes}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">
                    {expense.title}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Pagó <strong className="text-[var(--text-primary)]">{payerName}</strong> · {userMatias}: ${chargeMatias.toFixed(2)} | {userAriel}: ${chargeAri.toFixed(2)} USD
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <span className="text-sm sm:text-base font-black font-mono text-[var(--text-primary)] block">
                      {(expense.originalAmount || 0).toFixed(2)} {expense.originalCurrency}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      ${totalUSD.toFixed(2)} USD
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(expense)}
                      className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--city-primary)] hover:bg-[var(--bg-card)] transition-colors"
                      title="Editar gasto"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => mutateExpense(expense.id, {}, true)}
                      className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-rose-400 hover:bg-[var(--bg-card)] transition-colors"
                      title="Eliminar gasto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Add / Edit Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-dock p-5 sm:p-6 rounded-3xl border border-[var(--border-card)] shadow-2xl max-w-md w-full space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-[var(--text-primary)]">
                {editingExpenseId ? 'Editar Gasto' : 'Cargar Nuevo Gasto'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-bold px-2.5 py-1 rounded-xl bg-white/10"
              >
                ✕ Cerrar
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-3 text-xs">
              <div>
                <label className="block text-[var(--text-secondary)] mb-1 font-semibold">Concepto / Comercio</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Trattoria da Enzo, Roma"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-card)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--city-primary)]"
                />
              </div>

              {/* Local amount and currency */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[var(--text-secondary)] mb-1 font-semibold">Monto Local</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="25.50"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-card)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--city-primary)] font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-secondary)] mb-1 font-semibold">Moneda Origen</label>
                  <select
                    value={curr}
                    onChange={(e) => setCurr(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-card)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--city-primary)]"
                  >
                    <option value="EUR">EUR (€) · Europa</option>
                    <option value="GBP">GBP (£) · Reino Unido</option>
                    <option value="USD">USD ($) · Dólar</option>
                  </select>
                </div>
              </div>

              {/* REAL USD CHARGED BY BANK */}
              <div className="p-3 rounded-2xl bg-[var(--city-glow)]/40 border border-[var(--city-primary)]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[var(--text-primary)] font-bold flex items-center gap-1">
                    <DollarSign size={13} className="text-[var(--city-primary)]" />
                    <span>Monto Real en Dólares ($USD)</span>
                  </label>
                  <span className="text-[10px] text-[var(--city-primary)] font-bold uppercase">Prioridad 1</span>
                </div>

                <input
                  type="number"
                  step="0.01"
                  placeholder={suggestion ? suggestion.usd.toString() : "Dejar en blanco para autocalcular"}
                  value={realUsd}
                  onChange={(e) => setRealUsd(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-card)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--city-primary)] font-mono font-black text-sm"
                />

                {suggestion && (
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-[var(--text-secondary)]">
                      💡 Sugerido: <strong className="text-emerald-400 font-mono">${suggestion.usd} USD</strong> ({suggestion.reason})
                    </span>
                    <button
                      type="button"
                      onClick={() => setRealUsd(suggestion.usd.toString())}
                      className="text-[10px] font-bold text-[var(--city-primary)] hover:underline"
                    >
                      Aplicar
                    </button>
                  </div>
                )}
              </div>

              {/* Payer and Split */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[var(--text-secondary)] mb-1 font-semibold">Quién Pagó</label>
                  <select
                    value={payer}
                    onChange={(e) => setPayer(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-card)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--city-primary)]"
                  >
                    <option value={userMatiasId}>{userMatias}</option>
                    <option value={userArielId}>{userAriel}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[var(--text-secondary)] mb-1 font-semibold">Reparto</label>
                  <select
                    value={split}
                    onChange={(e) => setSplit(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-card)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--city-primary)]"
                  >
                    <option value="50/50">50% / 50% (Equitativo)</option>
                    <option value="Solo USR_01">100% {userMatias}</option>
                    <option value="Solo USR_02">100% {userAriel}</option>
                  </select>
                </div>
              </div>

              {/* Category and City */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[var(--text-secondary)] mb-1 font-semibold">Categoría</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-card)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--city-primary)]"
                  >
                    <option value="Comida">Comida & Restaurante</option>
                    <option value="Supermercado">Supermercado</option>
                    <option value="Transporte">Transporte / Metro</option>
                    <option value="Entradas">Entradas / Museos</option>
                    <option value="Compras">Compras & Souvenirs</option>
                    <option value="Alojamiento">Alojamiento</option>
                    <option value="Varios">Varios</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[var(--text-secondary)] mb-1 font-semibold">Ciudad</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-card)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--city-primary)]"
                  >
                    <option value="Roma">Roma</option>
                    <option value="Londres">Londres</option>
                    <option value="Barcelona">Barcelona</option>
                    <option value="Madrid">Madrid</option>
                    <option value="Girona">Girona</option>
                    <option value="Oxford">Oxford</option>
                    <option value="Toledo">Toledo</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[var(--city-primary)] hover:opacity-90 text-white font-bold transition-all shadow-md mt-3"
              >
                {editingExpenseId ? 'Guardar Cambios' : 'Registrar Gasto'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
