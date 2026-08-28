import React, { useState, useEffect, useMemo, useRef } from 'https://esm.sh/react@18.2.0';
import ReactDOM from 'https://esm.sh/react-dom@18.2.0/client';
import htm from 'https://esm.sh/htm@3.1.1';
import { playAlert, playClick, playTick } from './soundEngine.js';

// Bind htm with React.createElement for zero-build JSX
const html = htm.bind(React.createElement);

// ==========================================
// CONSTANTS & MOCK DATA
// ==========================================

const CAMPUS_LOCATIONS = [
  'Main University Library (Floors 1-4)',
  'Science & Technology Hall',
  'Student Center & Union',
  'Athletic Center & Gym',
  'Campus Dining Commons',
  'Engineering Innovation Complex',
  'Business School Wing',
  'North Quad & Amphitheater',
  'Campus Health & Wellness Center',
  'University Transit Hub'
];

const DROP_OFF_LOCATIONS = [
  'Campus Security Main Desk (HQ Locker #12)',
  'University Library Front Desk (Bin A)',
  'Student Affairs Welcome Center (Locker #04)',
  'Athletic Complex Front Desk',
  'Engineering Dean\'s Office (Safe #2)'
];

const CATEGORIES = [
  { id: 'all', name: 'All Categories', icon: '📦' },
  { id: 'electronics', name: 'Electronics & Gadgets', icon: '💻' },
  { id: 'wallets', name: 'Wallets, IDs & Cards', icon: '🪪' },
  { id: 'keys', name: 'Keys & Lanyards', icon: '🔑' },
  { id: 'bottles', name: 'Water Bottles & Tumblers', icon: '🥤' },
  { id: 'bags', name: 'Backpacks & Bags', icon: '🎒' },
  { id: 'apparel', name: 'Clothing & Eyewear', icon: '👓' },
  { id: 'books', name: 'Books & Stationery', icon: '📚' },
  { id: 'others', name: 'Other Items', icon: '🏷️' }
];

const INITIAL_ITEMS = [
  {
    id: 'LF-1092',
    title: 'Midnight Blue Hydro Flask (32oz)',
    type: 'lost',
    category: 'bottles',
    location: 'Main University Library (Floors 1-4)',
    date: '2026-08-25',
    time: '14:30',
    description: 'Dark blue insulated bottle with university stickers and slight dent at base.',
    reportedBy: 'alex.rivers@university.edu',
    reporterName: 'Alex Rivers',
    contact: '555-0192',
    status: 'matched', // Matched with FD-2041!
    matchedWithId: 'FD-2041',
    matchScore: 96,
    storageLocation: 'Campus Security Main Desk (HQ Locker #12)',
    photoUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=400&q=80',
    distinguishingMarks: 'Stickers: Computer Science Club, NASA logo, small scratch on lid handle.'
  },
  {
    id: 'FD-2041',
    title: 'Blue Metal Water Bottle with Stickers',
    type: 'found',
    category: 'bottles',
    location: 'Main University Library (Floors 1-4)',
    date: '2026-08-25',
    time: '16:00',
    description: 'Found on 2nd-floor study cubicle near Silent Reading Zone.',
    reportedBy: 'library.staff@university.edu',
    reporterName: 'Sarah Jenkins (Staff)',
    contact: 'Ext. 4022',
    status: 'matched',
    matchedWithId: 'LF-1092',
    matchScore: 96,
    storageLocation: 'University Library Front Desk (Bin A)',
    photoUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=400&q=80',
    distinguishingMarks: 'Contains CS Club sticker and distinct scratch on cap.'
  },
  {
    id: 'FD-2038',
    title: 'Space Gray MacBook Air M2 (13-inch)',
    type: 'found',
    category: 'electronics',
    location: 'Science & Technology Hall',
    date: '2026-08-24',
    time: '18:15',
    description: 'Left behind in Lab 304 after Advanced Data Structures lecture.',
    reportedBy: 'marcus.v@university.edu',
    reporterName: 'Marcus Vance',
    contact: '555-0144',
    status: 'in_custody',
    storageLocation: 'Campus Security Main Desk (HQ Locker #12)',
    photoUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
    distinguishingMarks: 'Matte black hard-shell case with GitHub Octocat sticker.'
  },
  {
    id: 'LF-1088',
    title: 'Brown Leather Bi-fold Wallet with Student ID',
    type: 'lost',
    category: 'wallets',
    location: 'Campus Dining Commons',
    date: '2026-08-24',
    time: '12:45',
    description: 'Contains campus cafeteria meal card, driver license, and dormitory access keycard.',
    reportedBy: 'clara.oswald@university.edu',
    reporterName: 'Clara Oswald',
    contact: '555-0188',
    status: 'lost',
    storageLocation: 'Pending Recovery',
    photoUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=400&q=80',
    distinguishingMarks: 'Embossed initials "C.O." on inner right card pocket.'
  },
  {
    id: 'FD-2030',
    title: 'Set of 4 Brass Keys on Red University Lanyard',
    type: 'found',
    category: 'keys',
    location: 'Engineering Innovation Complex',
    date: '2026-08-23',
    time: '09:20',
    description: 'Found hanging on bicycle rack near West Entrance.',
    reportedBy: 'guard.daniels@university.edu',
    reporterName: 'Officer Daniels',
    contact: 'Security HQ',
    status: 'in_custody',
    storageLocation: 'Campus Security Main Desk (HQ Locker #12)',
    photoUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=400&q=80',
    distinguishingMarks: 'Red woven lanyard with metal bottle opener charm.'
  },
  {
    id: 'FD-2015',
    title: 'Sony WH-1000XM4 Noise-Cancelling Headphones',
    type: 'found',
    category: 'electronics',
    location: 'Athletic Center & Gym',
    date: '2026-08-22',
    time: '19:40',
    description: 'Left on bench near Locker Room B.',
    reportedBy: 'gym.desk@university.edu',
    reporterName: 'Coach Taylor',
    contact: 'Athletic Desk',
    status: 'claimed',
    claimant: 'jordan.lee@university.edu',
    claimToken: 'QR-9481-CLAIM',
    storageLocation: 'Athletic Complex Front Desk',
    photoUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
    distinguishingMarks: 'Custom gray leather carrying case with charging cable.'
  },
  {
    id: 'FD-1990',
    title: 'Calculus: Early Transcendentals Textbook (9th Ed)',
    type: 'found',
    category: 'books',
    location: 'North Quad & Amphitheater',
    date: '2026-08-20',
    time: '15:10',
    description: 'Found under the stone bench near the fountain.',
    reportedBy: 'student.sam@university.edu',
    reporterName: 'Samira Khan',
    contact: '555-0167',
    status: 'returned',
    storageLocation: 'University Library Front Desk (Bin A)',
    photoUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
    distinguishingMarks: 'Yellow highlighter on chapter 4, name "David M." on page 1.'
  }
];

// About Us / Development Team Members
const TEAM_MEMBERS = [
  {
    id: 'tadeo',
    name: 'Vladimir Tadeo',
    role: 'Project Leader & System Architect',
    isLeader: true,
    initials: 'VT',
    avatarGradient: 'linear-gradient(135deg, #2563eb, #7c3aed)',
    bio: 'Leads full product architecture, sprint milestones, matching algorithms, and security guidelines for the campus asset recovery platform.',
    skills: ['Project Leadership', 'System Architecture', 'Security Protocols', 'React & State Design']
  },
  {
    id: 'robles',
    name: 'John Mark Robles',
    role: 'Fullstack & State Engineer',
    isLeader: false,
    initials: 'JR',
    avatarGradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
    bio: 'Engineered high-performance filtering systems, instant 2-second search pipelines, and inventory persistence algorithms.',
    skills: ['Data Modeling', 'State Management', 'Search Optimization', 'Local Storage APIs']
  },
  {
    id: 'leonen',
    name: 'Justin Leonen',
    role: 'UI/UX & Frontend Specialist',
    isLeader: false,
    initials: 'JL',
    avatarGradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    bio: 'Designed the mobile-first collegiate interface, accessibility compliance (WCAG 2.2 AA), QR-code pickup verification, and responsive modals.',
    skills: ['UI/UX Design', 'Design Systems', 'Responsive Layouts', 'Interactive Micro-animations']
  }
];

// ==========================================
// QR CODE GENERATOR (NATIVE VECTOR SVG)
// ==========================================
function renderPickupQRCode(tokenString) {
  // Deterministic SVG QR-like matrix generator for pickup verification
  const size = 21;
  const hash = Array.from(tokenString).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const matrix = [];

  for (let r = 0; r < size; r++) {
    const row = [];
    for (let c = 0; c < size; c++) {
      // 3 Positioning Square Finder Patterns
      const isTopLeft = r < 7 && c < 7;
      const isTopRight = r < 7 && c >= size - 7;
      const isBottomLeft = r >= size - 7 && c < 7;

      if (isTopLeft || isTopRight || isBottomLeft) {
        const localR = isBottomLeft ? r - (size - 7) : r;
        const localC = isTopRight ? c - (size - 7) : c;
        if (localR === 0 || localR === 6 || localC === 0 || localC === 6) {
          row.push(1);
        } else if (localR >= 2 && localR <= 4 && localC >= 2 && localC <= 4) {
          row.push(1);
        } else {
          row.push(0);
        }
      } else {
        // Pseudo-random deterministic payload bits based on token hash
        const val = ((r * 7 + c * 13 + hash) % 3 === 0 || (r + c + hash) % 5 === 0) ? 1 : 0;
        row.push(val);
      }
    }
    matrix.push(row);
  }

  const cellSize = 8;
  const svgDimension = size * cellSize;

  return html`
    <svg className="qr-code-svg" viewBox="0 0 ${svgDimension} ${svgDimension}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#ffffff" />
      ${matrix.map((row, r) =>
        row.map((cell, c) =>
          cell === 1
            ? html`<rect
                key=${`${r}-${c}`}
                x=${c * cellSize}
                y=${r * cellSize}
                width=${cellSize}
                height=${cellSize}
                fill="#0f172a"
              />`
            : null
        )
      )}
    </svg>
  `;
}

// ==========================================
// MAIN CAMPUS APPLICATION COMPONENT
// ==========================================

function CampusLostAndFoundApp() {
  // Navigation: 'dashboard' | 'browse' | 'report-lost' | 'report-found' | 'admin' | 'about'
  const [currentView, setCurrentView] = useState('dashboard');
  
  // User Authentication State
  const [user, setUser] = useState({
    email: 'alex.rivers@university.edu',
    name: 'Alex Rivers',
    role: 'student', // 'student' | 'admin'
    isAuthenticated: true
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmailInput, setLoginEmailInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Items Database State (Synced with localStorage)
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('campus_lost_found_items');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_ITEMS;
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('campus_lost_found_items', JSON.stringify(items));
    } catch (e) {}
  }, [items]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'lost' | 'found' | 'matched' | 'claimed' | 'returned'
  const [locationFilter, setLocationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Interactive Modals State
  const [selectedItemForClaim, setSelectedItemForClaim] = useState(null);
  const [claimProofText, setClaimProofText] = useState('');
  const [claimSuccessToken, setClaimSuccessToken] = useState(null);
  const [activeMatchBanner, setActiveMatchBanner] = useState(true);
  const [showMatchModal, setShowMatchModal] = useState(false);

  // Form Submissions Loading State (simulating cloud storage & notification dispatch)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Helper for sound triggers & toasts
  const triggerToast = (msg, sound = 'bell') => {
    playAlert(sound, 0.6);
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Auto-Match detector: Check if logged in user has an active matched item
  const userMatchedPair = useMemo(() => {
    const userLost = items.find(
      (it) => it.type === 'lost' && it.reportedBy === user.email && it.status === 'matched'
    );
    if (!userLost || !userLost.matchedWithId) return null;
    const foundMatch = items.find((it) => it.id === userLost.matchedWithId);
    return { lost: userLost, found: foundMatch, score: userLost.matchScore || 95 };
  }, [items, user.email]);

  // Fast Filtered Items (SLA < 2ms client search)
  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return items.filter((item) => {
      // Search query
      const matchesQuery =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query);

      // Category
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

      // Status
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'lost' && item.type === 'lost') ||
        (statusFilter === 'found' && item.type === 'found') ||
        item.status === statusFilter;

      // Location
      const matchesLocation = locationFilter === 'all' || item.location === locationFilter;

      return matchesQuery && matchesCategory && matchesStatus && matchesLocation;
    }).sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
      return 0;
    });
  }, [items, searchQuery, selectedCategory, statusFilter, locationFilter, sortBy]);

  // Statistics Metrics
  const stats = useMemo(() => {
    const total = items.length;
    const totalLost = items.filter((i) => i.type === 'lost').length;
    const totalFound = items.filter((i) => i.type === 'found').length;
    const returnedCount = items.filter((i) => i.status === 'returned').length;
    const matchedCount = items.filter((i) => i.status === 'matched').length;
    const pendingClaims = items.filter((i) => i.status === 'claimed').length;
    const recoveryRate = total > 0 ? Math.round((returnedCount / (returnedCount + totalLost || 1)) * 100) : 85;

    return { total, totalLost, totalFound, returnedCount, matchedCount, pendingClaims, recoveryRate };
  }, [items]);

  // ==========================================
  // FORM HANDLERS
  // ==========================================

  // Report Lost Item
  const handleReportLostSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get('title');
    const category = formData.get('category');
    const location = formData.get('location');
    const date = formData.get('date');
    const time = formData.get('time');
    const description = formData.get('description');
    const marks = formData.get('marks');

    setIsSubmitting(true);
    playClick(0.2);

    // Simulate Cloud Storage & Real-time AI Matcher pipeline (800ms)
    setTimeout(() => {
      const newId = `LF-${Math.floor(1000 + Math.random() * 9000)}`;
      const newItem = {
        id: newId,
        title,
        type: 'lost',
        category,
        location,
        date: date || new Date().toISOString().split('T')[0],
        time: time || '12:00',
        description,
        distinguishingMarks: marks,
        reportedBy: user.email,
        reporterName: user.name,
        status: 'lost',
        photoUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80'
      };

      setItems([newItem, ...items]);
      setIsSubmitting(false);
      triggerToast(`Report Logged! Tracking Lost Item ID: ${newId}`, 'bell');
      setCurrentView('browse');
    }, 850);
  };

  // Report Found Item (with Photo Upload Simulation)
  const [foundPhotoPreview, setFoundPhotoPreview] = useState(null);

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFoundPhotoPreview(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReportFoundSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get('title');
    const category = formData.get('category');
    const location = formData.get('location');
    const dropOffLocation = formData.get('dropOffLocation');
    const date = formData.get('date');
    const time = formData.get('time');
    const description = formData.get('description');
    const marks = formData.get('marks');

    setIsSubmitting(true);
    playClick(0.2);

    setTimeout(() => {
      const newId = `FD-${Math.floor(2000 + Math.random() * 8000)}`;
      const newItem = {
        id: newId,
        title,
        type: 'found',
        category,
        location,
        storageLocation: dropOffLocation,
        date: date || new Date().toISOString().split('T')[0],
        time: time || '12:00',
        description,
        distinguishingMarks: marks,
        reportedBy: user.email,
        reporterName: user.name,
        status: 'in_custody',
        photoUrl: foundPhotoPreview || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80'
      };

      setItems([newItem, ...items]);
      setIsSubmitting(false);
      setFoundPhotoPreview(null);
      triggerToast(`Found Item Logged & Dispatched to Security Desk! ID: ${newId}`, 'zen');
      setCurrentView('browse');
    }, 900);
  };

  // Claim Item Submission
  const handleClaimSubmit = (e) => {
    e.preventDefault();
    if (!selectedItemForClaim) return;

    setIsSubmitting(true);
    playClick(0.2);

    setTimeout(() => {
      const token = `QR-${Math.floor(1000 + Math.random() * 9000)}-${selectedItemForClaim.id}`;
      
      setItems((prev) =>
        prev.map((it) =>
          it.id === selectedItemForClaim.id
            ? { ...it, status: 'claimed', claimant: user.email, claimToken: token, claimProof: claimProofText }
            : it
        )
      );

      setIsSubmitting(false);
      setClaimSuccessToken(token);
      triggerToast('Claim Verified! Present your QR Code at Campus Security.', 'zen');
    }, 700);
  };

  // Admin Actions: Approve / Return / Close
  const handleAdminUpdateStatus = (itemId, newStatus) => {
    playClick(0.2);
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, status: newStatus } : it))
    );
    triggerToast(`Item ${itemId} updated to status: ${newStatus.toUpperCase()}`, 'bell');
  };

  // Campus Email Verification Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const email = loginEmailInput.trim().toLowerCase();
    
    // Strict Campus Domain Verification Check
    const allowedDomains = ['university.edu', 'campus.edu', 'alumni.edu', 'college.edu'];
    const isCampusEmail = allowedDomains.some((d) => email.endsWith(`@${d}`));

    if (!isCampusEmail) {
      setLoginError(`Access Restricted: Please enter a verified campus email ending with @university.edu or @campus.edu.`);
      playAlert('marimba', 0.5);
      return;
    }

    const isAdmin = email.includes('admin') || email.includes('security') || email.includes('staff');
    const namePart = email.split('@')[0].replace('.', ' ');
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    setUser({
      email,
      name: formattedName,
      role: isAdmin ? 'admin' : 'student',
      isAuthenticated: true
    });

    setShowLoginModal(false);
    setLoginError('');
    triggerToast(`Welcome back, ${formattedName}!`, 'zen');
  };

  return html`
    <div className="campus-app">
      <!-- Toast Notification Bar -->
      ${toastMessage ? html`
        <div style=${{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 2000,
          background: '#0f172a',
          color: '#ffffff',
          padding: '0.85rem 1.25rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontWeight: '600',
          fontSize: '0.9rem',
          borderLeft: '4px solid #10b981',
          animation: 'slideInDown 0.3s ease-out'
        }}>
          <span>✨</span>
          <span>${toastMessage}</span>
        </div>
      ` : null}

      <!-- Top Header Navigation -->
      <header className="navbar">
        <div className="brand-container" onClick=${() => { playClick(0.15); setCurrentView('dashboard'); }}>
          <div className="brand-logo">🔍</div>
          <div className="brand-info">
            <h1>Campus Lost & Found</h1>
            <div className="brand-tagline">Centralized University Asset Recovery</div>
          </div>
        </div>

        <nav className="nav-links">
          <button
            className=${`nav-btn ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick=${() => { playClick(0.15); setCurrentView('dashboard'); }}
          >
            🏠 Hub
          </button>
          <button
            className=${`nav-btn ${currentView === 'browse' ? 'active' : ''}`}
            onClick=${() => { playClick(0.15); setCurrentView('browse'); }}
          >
            📋 Browse Inventory
          </button>
          <button
            className=${`nav-btn ${currentView === 'report-lost' ? 'active' : ''}`}
            onClick=${() => { playClick(0.15); setCurrentView('report-lost'); }}
          >
            🔴 Report Lost
          </button>
          <button
            className=${`nav-btn ${currentView === 'report-found' ? 'active' : ''}`}
            onClick=${() => { playClick(0.15); setCurrentView('report-found'); }}
          >
            🟢 Report Found
          </button>
          
          <!-- Role & Admin Switcher -->
          <button
            className=${`nav-btn ${currentView === 'admin' ? 'active' : ''}`}
            onClick=${() => { playClick(0.15); setCurrentView('admin'); }}
          >
            🛡️ Security Desk
          </button>

          <button
            className=${`nav-btn ${currentView === 'about' ? 'active' : ''}`}
            onClick=${() => { playClick(0.15); setCurrentView('about'); }}
          >
            👥 About Us
          </button>

          <!-- User Role Demo Toggle -->
          <div className="role-switcher-badge">
            <button
              className=${`role-pill ${user.role === 'student' ? 'active' : ''}`}
              onClick=${() => {
                playClick(0.15);
                setUser({ ...user, role: 'student' });
                triggerToast('Switched to Student / Faculty View');
              }}
              title="Student View"
            >
              🎓 Student
            </button>
            <button
              className=${`role-pill ${user.role === 'admin' ? 'admin-active' : ''}`}
              onClick=${() => {
                playClick(0.15);
                setUser({ ...user, role: 'admin' });
                setCurrentView('admin');
                triggerToast('Switched to Campus Security Admin View');
              }}
              title="Security Admin View"
            >
              🛡️ Security
            </button>
          </div>

          <!-- Auth Button -->
          ${user.isAuthenticated ? html`
            <button
              className="nav-btn nav-btn-highlight"
              onClick=${() => {
                playClick(0.15);
                setShowLoginModal(true);
              }}
              title=${user.email}
            >
              👤 ${user.name.split(' ')[0]}
            </button>
          ` : html`
            <button
              className="nav-btn nav-btn-highlight"
              onClick=${() => {
                playClick(0.15);
                setShowLoginModal(true);
              }}
            >
              🔐 Campus Sign-In
            </button>
          `}
        </nav>
      </header>

      <!-- Main Content Container -->
      <main className="app-container">

        <!-- =========================================================
             VIEW 1: MAIN USER DASHBOARD
             ========================================================= -->
        ${currentView === 'dashboard' ? html`
          <div>
            <!-- Smart Auto-Match Alert Banner -->
            ${activeMatchBanner && userMatchedPair ? html`
              <div className="match-alert-banner">
                <div className="match-alert-content">
                  <div className="match-icon-badge">✨</div>
                  <div className="match-text">
                    <h3>
                      Auto-Match Detected!
                      <span className="match-score-pill">${userMatchedPair.score}% Similarity</span>
                    </h3>
                    <p>
                      Your reported lost item <strong>"${userMatchedPair.lost.title}"</strong> has an automated match with a found item at <strong>${userMatchedPair.found.location}</strong>!
                    </p>
                  </div>
                </div>
                <div style=${{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    className="match-action-btn"
                    onClick=${() => {
                      playClick(0.2);
                      setShowMatchModal(true);
                    }}
                  >
                    🔍 Review & Verify Match
                  </button>
                  <button
                    style=${{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem', padding: '0.4rem' }}
                    onClick=${() => setActiveMatchBanner(false)}
                    title="Dismiss notification"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ` : null}

            <!-- Quick Action Hero Grid -->
            <div className="hero-action-grid">
              <div
                className="action-card card-lost"
                onClick=${() => { playClick(0.2); setCurrentView('report-lost'); }}
              >
                <div className="action-icon">🔴</div>
                <div className="action-card-text">
                  <h3>Report a Lost Item</h3>
                  <p>Lost your wallet, keys, laptop, or bottle? Broadcast it immediately to the campus network.</p>
                </div>
              </div>

              <div
                className="action-card card-found"
                onClick=${() => { playClick(0.2); setCurrentView('report-found'); }}
              >
                <div className="action-icon">🟢</div>
                <div className="action-card-text">
                  <h3>Report a Found Item</h3>
                  <p>Found something on campus? Upload a quick photo and specify the secure drop-off locker.</p>
                </div>
              </div>

              <div
                className="action-card card-browse"
                onClick=${() => { playClick(0.2); setCurrentView('browse'); }}
              >
                <div className="action-icon">📋</div>
                <div className="action-card-text">
                  <h3>Browse Campus Items</h3>
                  <p>Search through ${stats.total} verified campus lost and found listings with instant filtering.</p>
                </div>
              </div>
            </div>

            <!-- Campus Metrics Strip -->
            <div className="stats-strip">
              <div className="stat-box">
                <div>
                  <div className="stat-box-val">${stats.total}</div>
                  <div className="stat-box-label">Total Logged Items</div>
                </div>
                <div className="stat-box-icon">📦</div>
              </div>
              <div className="stat-box">
                <div>
                  <div className="stat-box-val" style=${{ color: '#10b981' }}>${stats.returnedCount}</div>
                  <div className="stat-box-label">Items Reunited</div>
                </div>
                <div className="stat-box-icon">🤝</div>
              </div>
              <div className="stat-box">
                <div>
                  <div className="stat-box-val" style=${{ color: '#8b5cf6' }}>${stats.matchedCount}</div>
                  <div className="stat-box-label">Smart Matches Found</div>
                </div>
                <div className="stat-box-icon">⚡</div>
              </div>
              <div className="stat-box">
                <div>
                  <div className="stat-box-val" style=${{ color: '#2563eb' }}>${stats.recoveryRate}%</div>
                  <div className="stat-box-label">Campus Return Rate</div>
                </div>
                <div className="stat-box-icon">📈</div>
              </div>
            </div>

            <!-- Recent Reports Section -->
            <div className="section-header">
              <div className="section-title">
                <span>🕒</span> Recent Campus Reports
              </div>
              <button
                className="btn-claim btn-claim-secondary"
                style=${{ width: 'auto', padding: '0.45rem 1rem' }}
                onClick=${() => { playClick(0.15); setCurrentView('browse'); }}
              >
                View Full Directory (${stats.total}) →
              </button>
            </div>

            <!-- Recent 3 Cards Grid -->
            <div className="items-grid">
              ${items.slice(0, 3).map((item) => html`
                <div key=${item.id} className="item-card">
                  <div className="item-card-image-wrap">
                    <img src=${item.photoUrl} alt=${item.title} className="item-card-img" />
                    <span className=${`item-status-badge badge-${item.type}`}>
                      ${item.type === 'lost' ? '🔴 Lost' : '🟢 Found'}
                    </span>
                    <span className="item-category-pill">
                      ${CATEGORIES.find((c) => c.id === item.category)?.name || item.category}
                    </span>
                  </div>

                  <div className="item-card-body">
                    <div className="item-card-title" title=${item.title}>${item.title}</div>
                    <div className="item-card-desc">${item.description}</div>

                    <div className="item-meta-row">
                      <div className="item-meta-item">
                        <span>📍</span> ${item.location.split('(')[0]}
                      </div>
                      <div className="item-meta-item">
                        <span>📅</span> ${item.date}
                      </div>
                    </div>

                    <div className="item-card-actions">
                      <button
                        className="btn-claim"
                        onClick=${() => {
                          playClick(0.2);
                          setSelectedItemForClaim(item);
                          setClaimSuccessToken(item.claimToken || null);
                        }}
                      >
                        ${item.status === 'claimed' ? 'View QR Claim' : 'Claim This Item'}
                      </button>
                    </div>
                  </div>
                </div>
              `)}
            </div>
          </div>
        ` : null}

        <!-- =========================================================
             VIEW 2: SEARCH & BROWSE INVENTORY (Fast 2-sec SLA)
             ========================================================= -->
        ${currentView === 'browse' ? html`
          <div>
            <div className="section-header">
              <div className="section-title">
                <span>📋</span> Campus Inventory & Listings
                <span style=${{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                  (${filteredItems.length} records found)
                </span>
              </div>
              <div style=${{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="nav-btn nav-btn-highlight"
                  onClick=${() => { playClick(0.15); setCurrentView('report-lost'); }}
                >
                  + Report Lost
                </button>
                <button
                  className="nav-btn"
                  style=${{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}
                  onClick=${() => { playClick(0.15); setCurrentView('report-found'); }}
                >
                  + Report Found
                </button>
              </div>
            </div>

            <!-- Smart Search & Facet Filters -->
            <div className="search-filter-container">
              <div className="search-input-row">
                <div className="search-input-wrapper">
                  <span className="search-input-icon">🔍</span>
                  <input
                    type="text"
                    className="search-text-input"
                    placeholder="Search by keyword, item name, location, ID (e.g. 'Hydro Flask', 'Library', 'LF-1092')..."
                    value=${searchQuery}
                    onChange=${(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <select
                  className="filter-select"
                  value=${sortBy}
                  onChange=${(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="oldest">Sort: Oldest First</option>
                </select>
              </div>

              <!-- Multi-Facet Filter Chips -->
              <div className="filter-pills-row">
                <!-- Status Tab Filter -->
                <div className="filter-tab-group">
                  ${[
                    { id: 'all', label: 'All Items' },
                    { id: 'lost', label: '🔴 Lost' },
                    { id: 'found', label: '🟢 Found' },
                    { id: 'matched', label: '⚡ Matched' },
                    { id: 'returned', label: '✓ Returned' }
                  ].map((tab) => html`
                    <button
                      key=${tab.id}
                      className=${`filter-tab ${statusFilter === tab.id ? 'active' : ''}`}
                      onClick=${() => { playClick(0.15); setStatusFilter(tab.id); }}
                    >
                      ${tab.label}
                    </button>
                  `)}
                </div>

                <!-- Category Select -->
                <select
                  className="filter-select"
                  value=${selectedCategory}
                  onChange=${(e) => setSelectedCategory(e.target.value)}
                >
                  ${CATEGORIES.map((cat) => html`
                    <option key=${cat.id} value=${cat.id}>${cat.icon} ${cat.name}</option>
                  `)}
                </select>

                <!-- Location Select -->
                <select
                  className="filter-select"
                  value=${locationFilter}
                  onChange=${(e) => setLocationFilter(e.target.value)}
                >
                  <option value="all">📍 All Campus Locations</option>
                  ${CAMPUS_LOCATIONS.map((loc) => html`
                    <option key=${loc} value=${loc}>${loc}</option>
                  `)}
                </select>

                ${(searchQuery || selectedCategory !== 'all' || statusFilter !== 'all' || locationFilter !== 'all') ? html`
                  <button
                    className="btn-xs btn-xs-outline"
                    onClick=${() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setStatusFilter('all');
                      setLocationFilter('all');
                    }}
                  >
                    Reset Filters
                  </button>
                ` : null}
              </div>
            </div>

            <!-- Items Gallery -->
            ${filteredItems.length === 0 ? html`
              <div style=${{
                background: 'var(--bg-card)',
                padding: '3rem',
                borderRadius: '18px',
                textAlign: 'center',
                border: '1px dashed var(--border-color)'
              }}>
                <div style=${{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔍</div>
                <h3 style=${{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No matching items found</h3>
                <p style=${{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  Try adjusting your search terms or filter categories.
                </p>
                <button
                  className="btn-claim"
                  style=${{ maxWidth: '200px', margin: '0 auto' }}
                  onClick=${() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setStatusFilter('all');
                    setLocationFilter('all');
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            ` : html`
              <div className="items-grid">
                ${filteredItems.map((item) => html`
                  <div key=${item.id} className="item-card">
                    <div className="item-card-image-wrap">
                      <img src=${item.photoUrl} alt=${item.title} className="item-card-img" />
                      <span className=${`item-status-badge badge-${item.type}`}>
                        ${item.type === 'lost' ? '🔴 Lost' : '🟢 Found'}
                      </span>
                      ${item.status === 'matched' ? html`
                        <span className="item-status-badge badge-matched" style=${{ top: '2.5rem' }}>
                          ⚡ Matched
                        </span>
                      ` : null}
                      ${item.status === 'returned' ? html`
                        <span className="item-status-badge badge-returned" style=${{ top: '2.5rem' }}>
                          ✓ Returned
                        </span>
                      ` : null}
                      <span className="item-category-pill">
                        ${CATEGORIES.find((c) => c.id === item.category)?.name || item.category}
                      </span>
                    </div>

                    <div className="item-card-body">
                      <div className="item-card-title" title=${item.title}>${item.title}</div>
                      <div className="item-card-desc">${item.description}</div>

                      <div className="item-meta-row">
                        <div className="item-meta-item">
                          <span>📍</span> ${item.location.split('(')[0]}
                        </div>
                        <div className="item-meta-item">
                          <span>📅</span> ${item.date}
                        </div>
                      </div>

                      <div className="item-card-actions">
                        <button
                          className="btn-claim"
                          onClick=${() => {
                            playClick(0.2);
                            setSelectedItemForClaim(item);
                            setClaimSuccessToken(item.claimToken || null);
                          }}
                        >
                          ${item.status === 'claimed'
                            ? '🔑 View Claim QR'
                            : item.status === 'returned'
                            ? '✓ Item Returned'
                            : 'This is Mine (Claim)'}
                        </button>
                      </div>
                    </div>
                  </div>
                `)}
              </div>
            `}
          </div>
        ` : null}

        <!-- =========================================================
             VIEW 3: "REPORT LOST ITEM" FORM
             ========================================================= -->
        ${currentView === 'report-lost' ? html`
          <div className="form-card">
            <div className="form-header">
              <span className="form-header-badge badge-lost-theme">🔴 Student & Faculty Report</span>
              <h2 className="form-title">Report a Lost Item</h2>
              <p className="form-subtitle">
                Provide details to help security and good samaritans identify and return your missing belongings.
              </p>
            </div>

            <form onSubmit=${handleReportLostSubmit}>
              <div className="form-grid">
                <div className="form-group form-group-full">
                  <label className="form-label">Item Name / Title *</label>
                  <input
                    type="text"
                    name="title"
                    required
                    placeholder="e.g. Midnight Blue Hydro Flask 32oz, Lenovo ThinkPad X1"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select name="category" required className="form-select">
                    ${CATEGORIES.filter((c) => c.id !== 'all').map((cat) => html`
                      <option key=${cat.id} value=${cat.id}>${cat.icon} ${cat.name}</option>
                    `)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Approximate Campus Location *</label>
                  <select name="location" required className="form-select">
                    ${CAMPUS_LOCATIONS.map((loc) => html`
                      <option key=${loc} value=${loc}>${loc}</option>
                    `)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Date Lost *</label>
                  <input
                    type="date"
                    name="date"
                    required
                    defaultValue=${new Date().toISOString().split('T')[0]}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Estimated Time</label>
                  <input
                    type="time"
                    name="time"
                    defaultValue="14:00"
                    className="form-input"
                  />
                </div>

                <div className="form-group form-group-full">
                  <label className="form-label">Detailed Description</label>
                  <textarea
                    name="description"
                    rows="3"
                    placeholder="Describe color, size, brand, where you last had it..."
                    className="form-textarea"
                  ></textarea>
                </div>

                <div className="form-group form-group-full">
                  <label className="form-label">Distinguishing Marks & Unique Verification Proof</label>
                  <input
                    type="text"
                    name="marks"
                    placeholder="e.g. Stickers, lockscreen photo description, scratches, serial numbers..."
                    className="form-input"
                  />
                </div>
              </div>

              <button type="submit" disabled=${isSubmitting} className="btn-submit-form">
                ${isSubmitting ? html`
                  <div className="spinner"></div>
                  <span>Transmitting & Running Auto-Matcher...</span>
                ` : html`
                  <span>📡 Broadcast Lost Report</span>
                `}
              </button>
            </form>
          </div>
        ` : null}

        <!-- =========================================================
             VIEW 4: "REPORT FOUND ITEM" FORM (With Photo Upload)
             ========================================================= -->
        ${currentView === 'report-found' ? html`
          <div className="form-card">
            <div className="form-header">
              <span className="form-header-badge badge-found-theme">🟢 Campus Good Samaritan</span>
              <h2 className="form-title">Report a Found Item</h2>
              <p className="form-subtitle">
                Log a found asset and drop it off at a designated Campus Security or Library locker.
              </p>
            </div>

            <form onSubmit=${handleReportFoundSubmit}>
              <!-- Interactive Photo Dropzone Component -->
              <div className="form-group form-group-full" style=${{ marginBottom: '1.25rem' }}>
                <label className="form-label">Item Photo Upload *</label>
                <div
                  className="photo-dropzone"
                  onClick=${() => document.getElementById('found-file-input').click()}
                >
                  <input
                    id="found-file-input"
                    type="file"
                    accept="image/*"
                    style=${{ display: 'none' }}
                    onChange=${handlePhotoSelect}
                  />
                  <div className="dropzone-icon">📷</div>
                  <div className="dropzone-text">Click or Drag & Drop photo here</div>
                  <div className="dropzone-subtext">Supports PNG, JPG, WEBP up to 10MB</div>

                  ${foundPhotoPreview ? html`
                    <div className="photo-preview-wrap" onClick=${(e) => e.stopPropagation()}>
                      <img src=${foundPhotoPreview} alt="Found item preview" className="photo-preview-img" />
                      <button
                        type="button"
                        className="btn-remove-photo"
                        onClick=${() => setFoundPhotoPreview(null)}
                        title="Remove Photo"
                      >
                        ✕
                      </button>
                    </div>
                  ` : null}
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group form-group-full">
                  <label className="form-label">Item Name / Title *</label>
                  <input
                    type="text"
                    name="title"
                    required
                    placeholder="e.g. Set of 4 Keys on Red Lanyard, Sony Headphones"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select name="category" required className="form-select">
                    ${CATEGORIES.filter((c) => c.id !== 'all').map((cat) => html`
                      <option key=${cat.id} value=${cat.id}>${cat.icon} ${cat.name}</option>
                    `)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Where Was It Found? *</label>
                  <select name="location" required className="form-select">
                    ${CAMPUS_LOCATIONS.map((loc) => html`
                      <option key=${loc} value=${loc}>${loc}</option>
                    `)}
                  </select>
                </div>

                <div className="form-group form-group-full">
                  <label className="form-label">Physical Drop-Off / Custody Location *</label>
                  <select name="dropOffLocation" required className="form-select">
                    ${DROP_OFF_LOCATIONS.map((drop) => html`
                      <option key=${drop} value=${drop}>${drop}</option>
                    `)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Date Found *</label>
                  <input
                    type="date"
                    name="date"
                    required
                    defaultValue=${new Date().toISOString().split('T')[0]}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Time Found</label>
                  <input
                    type="time"
                    name="time"
                    defaultValue="16:00"
                    className="form-input"
                  />
                </div>

                <div className="form-group form-group-full">
                  <label className="form-label">Found Context & Notes</label>
                  <textarea
                    name="description"
                    rows="3"
                    placeholder="Where exactly was it located? (e.g. Under Table #4, Left on bench...)"
                    className="form-textarea"
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                disabled=${isSubmitting}
                className="btn-submit-form"
                style=${{ background: '#10b981' }}
              >
                ${isSubmitting ? html`
                  <div className="spinner"></div>
                  <span>Compressing Photo & Dispatching to Security...</span>
                ` : html`
                  <span>✓ Submit Found Item & Notify Owners</span>
                `}
              </button>
            </form>
          </div>
        ` : null}

        <!-- =========================================================
             VIEW 5: SECURITY & ADMIN INVENTORY DASHBOARD
             ========================================================= -->
        ${currentView === 'admin' ? html`
          <div>
            <div className="section-header">
              <div className="section-title">
                <span>🛡️</span> Campus Security & Admin Custody Portal
                <span className="admin-badge-header">Authorized Personnel Only</span>
              </div>
              <button
                className="btn-xs btn-xs-outline"
                onClick=${() => {
                  playClick(0.15);
                  setUser({ ...user, role: 'student' });
                  setCurrentView('dashboard');
                }}
              >
                Exit Admin Mode
              </button>
            </div>

            <!-- Admin Key Performance Indicators -->
            <div className="stats-strip">
              <div className="stat-box">
                <div>
                  <div className="stat-box-val">${items.filter((i) => i.type === 'found' && i.status !== 'returned').length}</div>
                  <div className="stat-box-label">Items in Physical Lockers</div>
                </div>
                <div className="stat-box-icon">🔐</div>
              </div>
              <div className="stat-box">
                <div>
                  <div className="stat-box-val" style=${{ color: '#f59e0b' }}>${stats.pendingClaims}</div>
                  <div className="stat-box-label">Pending Claim Verifications</div>
                </div>
                <div className="stat-box-icon">⏳</div>
              </div>
              <div className="stat-box">
                <div>
                  <div className="stat-box-val" style=${{ color: '#10b981' }}>${stats.returnedCount}</div>
                  <div className="stat-box-label">Successfully Returned</div>
                </div>
                <div className="stat-box-icon">✅</div>
              </div>
              <div className="stat-box">
                <div>
                  <div className="stat-box-val" style=${{ color: '#2563eb' }}>72%</div>
                  <div className="stat-box-label">Locker Bay Capacity</div>
                </div>
                <div className="stat-box-icon">🏢</div>
              </div>
            </div>

            <!-- Physical Custody Ledger Table -->
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Item ID</th>
                    <th>Asset Title</th>
                    <th>Type</th>
                    <th>Custody Location / Locker</th>
                    <th>Reported Date</th>
                    <th>Status</th>
                    <th>Action Workflow</th>
                  </tr>
                </thead>
                <tbody>
                  ${items.map((item) => html`
                    <tr key=${item.id}>
                      <td><strong>${item.id}</strong></td>
                      <td>
                        <div style=${{ fontWeight: '600' }}>${item.title}</div>
                        <div style=${{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          ${item.reportedBy}
                        </div>
                      </td>
                      <td>
                        <span className=${`item-status-badge badge-${item.type}`} style=${{ position: 'static' }}>
                          ${item.type.toUpperCase()}
                        </span>
                      </td>
                      <td>${item.storageLocation || 'Campus Security Main Desk'}</td>
                      <td>${item.date}</td>
                      <td>
                        <span style=${{
                          fontWeight: '700',
                          fontSize: '0.8rem',
                          color: item.status === 'returned' ? '#10b981' : item.status === 'claimed' ? '#f59e0b' : '#2563eb'
                        }}>
                          ${item.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div className="action-btn-group">
                          ${item.status === 'claimed' ? html`
                            <button
                              className="btn-xs btn-xs-success"
                              onClick=${() => handleAdminUpdateStatus(item.id, 'returned')}
                              title="Mark verified & returned to student"
                            >
                              ✓ Verify Pickup
                            </button>
                          ` : null}

                          ${item.status !== 'returned' ? html`
                            <button
                              className="btn-xs btn-xs-outline"
                              onClick=${() => handleAdminUpdateStatus(item.id, 'returned')}
                            >
                              Mark Returned
                            </button>
                          ` : html`
                            <span style=${{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Archived & Closed</span>
                          `}
                        </div>
                      </td>
                    </tr>
                  `)}
                </tbody>
              </table>
            </div>
          </div>
        ` : null}

        <!-- =========================================================
             VIEW 6: ABOUT US / TEAM PAGE
             ========================================================= -->
        ${currentView === 'about' ? html`
          <div className="team-showcase">
            <div className="team-header">
              <span className="team-header-pill">🎓 Engineering & Product Team</span>
              <h1 className="team-title">Meet the Creators of PomoFocus / Campus Lost & Found</h1>
              <p className="team-subtitle">
                Dedicated developers building mission-critical campus tools for asset tracking, workflow automation, and student productivity.
              </p>
            </div>

            <div className="team-grid">
              ${TEAM_MEMBERS.map((member) => html`
                <div
                  key=${member.id}
                  className=${`team-card ${member.isLeader ? 'card-leader' : ''}`}
                >
                  ${member.isLeader ? html`
                    <div className="leader-ribbon">
                      👑 Team Leader
                    </div>
                  ` : null}

                  <div className="team-avatar-wrap">
                    <div
                      className="team-avatar"
                      style=${{ background: member.avatarGradient, color: '#ffffff' }}
                    >
                      ${member.initials}
                    </div>
                  </div>

                  <h3 className="team-name">${member.name}</h3>
                  <div className="team-role">${member.role}</div>
                  <p className="team-bio">${member.bio}</p>

                  <div className="team-tags">
                    ${member.skills.map((skill, idx) => html`
                      <span key=${idx} className="team-tag">${skill}</span>
                    `)}
                  </div>
                </div>
              `)}
            </div>

            <div style=${{ textAlign: 'center' }}>
              <button
                className="btn-claim"
                style=${{ maxWidth: '240px', margin: '0 auto' }}
                onClick=${() => { playClick(0.15); setCurrentView('dashboard'); }}
              >
                ← Back to Campus Hub
              </button>
            </div>
          </div>
        ` : null}

      </main>

      <!-- =========================================================
           MODAL 1: CLAIM VERIFICATION & DYNAMIC QR PICKUP
           ========================================================= -->
      ${selectedItemForClaim ? html`
        <div className="modal-overlay" onClick=${() => { setSelectedItemForClaim(null); setClaimSuccessToken(null); }}>
          <div className="modal-card" onClick=${(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick=${() => { setSelectedItemForClaim(null); setClaimSuccessToken(null); }}
            >
              ✕
            </button>

            ${claimSuccessToken ? html`
              <!-- QR Code Pickup Voucher -->
              <div style=${{ textAlign: 'center' }}>
                <div style=${{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>🎟️</div>
                <h2 style=${{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: '800' }}>
                  Pickup Verification Pass
                </h2>
                <p style=${{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Show this dynamic QR code at <strong>${selectedItemForClaim.storageLocation || 'Campus Security Main Desk'}</strong>.
                </p>

                <div className="qr-container">
                  ${renderPickupQRCode(claimSuccessToken)}
                  <div className="qr-token-text">${claimSuccessToken}</div>
                </div>

                <div style=${{
                  background: 'var(--bg-card-subtle)',
                  padding: '1rem',
                  borderRadius: '12px',
                  textAlign: 'left',
                  fontSize: '0.85rem',
                  lineHeight: '1.6',
                  color: 'var(--text-secondary)',
                  marginBottom: '1.5rem'
                }}>
                  <div>🏢 <strong>Drop-off Location:</strong> ${selectedItemForClaim.storageLocation || 'Campus Security Desk (HQ Locker #12)'}</div>
                  <div>🕒 <strong>Security Desk Hours:</strong> Mon-Fri: 8:00 AM - 8:00 PM, Sat: 9:00 AM - 4:00 PM</div>
                  <div>🪪 <strong>Requirement:</strong> Please bring your Student/Faculty ID card for physical handover.</div>
                </div>

                <button
                  className="btn-claim"
                  onClick=${() => { setSelectedItemForClaim(null); setClaimSuccessToken(null); }}
                >
                  Done & Close Pass
                </button>
              </div>
            ` : html`
              <!-- Claim Ownership Verification Questionnaire -->
              <div>
                <h2 style=${{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: '800', marginBottom: '0.25rem' }}>
                  Claim Item: ${selectedItemForClaim.title}
                </h2>
                <p style=${{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  To ensure security, please provide proof of ownership prior to generating your pickup pass.
                </p>

                <div style=${{
                  display: 'flex',
                  gap: '1rem',
                  background: 'var(--bg-card-subtle)',
                  padding: '0.85rem',
                  borderRadius: '12px',
                  marginBottom: '1.25rem'
                }}>
                  <img
                    src=${selectedItemForClaim.photoUrl}
                    alt=${selectedItemForClaim.title}
                    style=${{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <div>
                    <div style=${{ fontWeight: '700', fontSize: '0.95rem' }}>${selectedItemForClaim.title}</div>
                    <div style=${{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>📍 ${selectedItemForClaim.location}</div>
                    <div style=${{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>📅 Logged: ${selectedItemForClaim.date}</div>
                  </div>
                </div>

                <form onSubmit=${handleClaimSubmit}>
                  <div className="form-group" style=${{ marginBottom: '1.25rem' }}>
                    <label className="form-label">
                      Describe Specific Identifying Proof (Passcode, Serial #, Stickers, Scratches) *
                    </label>
                    <textarea
                      required
                      rows="3"
                      placeholder="e.g. My lockscreen is a picture of a golden retriever; it has a small scratch near the top right corner..."
                      className="form-textarea"
                      value=${claimProofText}
                      onChange=${(e) => setClaimProofText(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="form-group" style=${{ marginBottom: '1.25rem' }}>
                    <label className="form-label">Your Campus Email</label>
                    <input
                      type="text"
                      disabled
                      value=${user.email}
                      className="form-input"
                      style=${{ background: 'var(--bg-card-subtle)', opacity: 0.8 }}
                    />
                  </div>

                  <button type="submit" disabled=${isSubmitting} className="btn-submit-form">
                    ${isSubmitting ? html`
                      <div className="spinner"></div>
                      <span>Verifying Claim Proof...</span>
                    ` : html`
                      <span>🎟️ Generate Pickup QR Code Pass</span>
                    `}
                  </button>
                </form>
              </div>
            `}
          </div>
        </div>
      ` : null}

      <!-- =========================================================
           MODAL 2: AUTO-MATCH COMPARISON MODAL
           ========================================================= -->
      ${showMatchModal && userMatchedPair ? html`
        <div className="modal-overlay" onClick=${() => setShowMatchModal(false)}>
          <div className="modal-card" onClick=${(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick=${() => setShowMatchModal(false)}>✕</button>

            <div style=${{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <span className="match-score-pill" style=${{ fontSize: '0.9rem', padding: '0.3rem 0.8rem' }}>
                ⚡ ${userMatchedPair.score}% AI Match Confidence
              </span>
              <h2 style=${{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: '800', marginTop: '0.5rem' }}>
                Match Comparison Review
              </h2>
            </div>

            <!-- Side by Side Comparison Grid -->
            <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <!-- User Lost Report -->
              <div style=${{ border: '1px solid #ef4444', borderRadius: '12px', padding: '1rem', background: '#fef2f2' }}>
                <span style=${{ fontSize: '0.75rem', fontWeight: '700', color: '#b91c1c' }}>YOUR LOST REPORT</span>
                <h4 style=${{ margin: '0.35rem 0', color: '#0f172a' }}>${userMatchedPair.lost.title}</h4>
                <div style=${{ fontSize: '0.8rem', color: '#475569' }}>📍 ${userMatchedPair.lost.location}</div>
                <div style=${{ fontSize: '0.8rem', color: '#475569' }}>📅 Lost: ${userMatchedPair.lost.date}</div>
              </div>

              <!-- Campus Found Report -->
              <div style=${{ border: '1px solid #10b981', borderRadius: '12px', padding: '1rem', background: '#ecfdf5' }}>
                <span style=${{ fontSize: '0.75rem', fontWeight: '700', color: '#047857' }}>FOUND ASSET LOGGED</span>
                <h4 style=${{ margin: '0.35rem 0', color: '#0f172a' }}>${userMatchedPair.found.title}</h4>
                <div style=${{ fontSize: '0.8rem', color: '#475569' }}>📍 ${userMatchedPair.found.location}</div>
                <div style=${{ fontSize: '0.8rem', color: '#475569' }}>🏢 Drop-off: ${userMatchedPair.found.storageLocation}</div>
              </div>
            </div>

            <button
              className="btn-submit-form"
              onClick=${() => {
                setShowMatchModal(false);
                setSelectedItemForClaim(userMatchedPair.found);
              }}
            >
              <span>🎟️ Confirm Match & Generate Pickup Pass</span>
            </button>
          </div>
        </div>
      ` : null}

      <!-- =========================================================
           MODAL 3: VERIFIED CAMPUS EMAIL LOGIN GATEWAY
           ========================================================= -->
      ${showLoginModal ? html`
        <div className="modal-overlay" onClick=${() => setShowLoginModal(false)}>
          <div className="modal-card" style=${{ maxWidth: '440px' }} onClick=${(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick=${() => setShowLoginModal(false)}>✕</button>

            <div style=${{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div className="login-icon-badge">🎓</div>
              <h2 style=${{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: '800' }}>
                Campus SSO Authentication
              </h2>
              <p style=${{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Access is restricted to verified university student and faculty email accounts.
              </p>
            </div>

            ${loginError ? html`
              <div style=${{
                background: '#fef2f2',
                color: '#b91c1c',
                border: '1px solid #fecaca',
                padding: '0.75rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                marginBottom: '1rem',
                fontWeight: '600'
              }}>
                ${loginError}
              </div>
            ` : null}

            <form onSubmit=${handleLoginSubmit}>
              <div className="form-group" style=${{ marginBottom: '1.25rem' }}>
                <label className="form-label">Verified University Email *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. yourname@university.edu"
                  value=${loginEmailInput}
                  onChange=${(e) => setLoginEmailInput(e.target.value)}
                  className="form-input"
                />
                <span style=${{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Must end in <code>@university.edu</code> or <code>@campus.edu</code>
                </span>
              </div>

              <button type="submit" className="btn-submit-form">
                <span>🔐 Verify & Sign In</span>
              </button>

              <div style=${{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <div>Quick Demo Accounts:</div>
                <div style=${{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn-xs btn-xs-outline"
                    onClick=${() => setLoginEmailInput('student.alex@university.edu')}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    className="btn-xs btn-xs-outline"
                    onClick=${() => setLoginEmailInput('security.desk@university.edu')}
                  >
                    Security Staff
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ` : null}

      <!-- Footer -->
      <footer className="app-footer">
        <div>Campus Lost & Found Platform • University Asset Recovery System</div>
        <div style=${{ marginTop: '0.4rem', fontSize: '0.8rem' }}>
          Developed by <span className="footer-highlight">Vladimir Tadeo (Leader)</span>, John Mark Robles, and Justin Leonen
        </div>
      </footer>
    </div>
  `;
}

// Mount the React Application
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(React.createElement(CampusLostAndFoundApp));
}
