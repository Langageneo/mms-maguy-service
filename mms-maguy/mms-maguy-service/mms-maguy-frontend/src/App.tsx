import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import ClientDetail from './pages/ClientDetail'
import Commandes from './pages/Commandes'
import CommandeDetail from './pages/CommandeDetail'
import Agenda from './pages/Agenda'
import Kanban from './pages/Kanban'
import Factures from './pages/Factures'
import Export from './pages/Export'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/:id" element={<ClientDetail />} />
          <Route path="commandes" element={<Commandes />} />
          <Route path="commandes/:id" element={<CommandeDetail />} />
          <Route path="agenda" element={<Agenda />} />
          <Route path="kanban" element={<Kanban />} />
          <Route path="factures" element={<Factures />} />
          <Route path="export" element={<Export />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
