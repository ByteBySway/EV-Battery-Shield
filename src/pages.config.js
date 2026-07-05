/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import Alerts from './pages/Alerts';
import BeforeAfter from './pages/BeforeAfter';
import CaseStudies from './pages/CaseStudies';
import Chat from './pages/Chat';
import Dashboard from './pages/Dashboard';
import DataExport from './pages/DataExport';
import Export from './pages/Export';
import Graphs from './pages/Graphs';
import GreenEnergy from './pages/GreenEnergy';
import Helpline from './pages/Helpline';
import Fleet from './pages/Fleet';
import Home from './pages/Home';
import SafetyInfo from './pages/SafetyInfo';
import Settings from './pages/Settings';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Alerts": Alerts,
    "BeforeAfter": BeforeAfter,
    "CaseStudies": CaseStudies,
    "Chat": Chat,
    "Dashboard": Dashboard,
    "DataExport": DataExport,
    "Export": Export,
    "Graphs": Graphs,
    "GreenEnergy": GreenEnergy,
    "Helpline": Helpline,
    "Home": Home,
    "SafetyInfo": SafetyInfo,
    "Settings": Settings,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};