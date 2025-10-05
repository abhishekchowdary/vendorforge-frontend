import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Home from './pages/Home.jsx';
import RootLayout from './layouts/RootLayout.jsx';
import Payments from './pages/Payments.jsx';
import Configurations from './pages/Configurations.jsx';
import TestCases from './pages/TestCases.jsx';
import SDKSession from './pages/SDKSession.jsx';

const variants = {
  initial: { opacity: 0, y: 8 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -8 }
};

export default function App() {
  const location = useLocation();
  return (
    <RootLayout>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          variants={variants}
          initial="initial"
          animate="in"
          exit="out"
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="container-px py-6"
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/configurations" element={<Configurations />} />
            <Route path="/test-cases" element={<TestCases />} />
            <Route path="/sdk/session/:id" element={<SDKSession />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </RootLayout>
  );
}
