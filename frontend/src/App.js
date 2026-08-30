import { RangeProvider } from './context/RangeContext';
import { TransactionsProvider } from './context/TransactionsContext';
import Dashboard from './components/dashboard/Dashboard';

function BackdropFX() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* soft single-hue depth, no rainbow */}
      <div className="absolute inset-0 bg-canvas" />
      <div className="absolute inset-x-0 top-0 h-[40rem] bg-[radial-gradient(70%_60%_at_50%_0%,rgba(52,211,153,0.07)_0%,transparent_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-72 bg-[radial-gradient(60%_100%_at_50%_100%,rgba(255,255,255,0.03)_0%,transparent_100%)]" />
    </div>
  );
}

export default function App() {
  return (
    <RangeProvider>
      <TransactionsProvider>
        <BackdropFX />
        <div className="relative z-10">
          <Dashboard />
        </div>
      </TransactionsProvider>
    </RangeProvider>
  );
}