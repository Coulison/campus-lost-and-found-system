import React, { useState, useEffect, useMemo, useRef } from 'https://esm.sh/react@18.2.0';
import ReactDOM from 'https://esm.sh/react-dom@18.2.0/client';
import htm from 'https://esm.sh/htm@3.1.1';

// Bind htm with React.createElement for zero-build JSX
const html = htm.bind(React.createElement);

// ==========================================
// CONSTANTS & INITIAL DATA
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
    status: 'matched', // Matched with FD-2041
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
    avatarGradient: 'linear-gradient(135deg, #0284c7, #4f46e5)',
    bio: 'Leads full product architecture, sprint milestones, matching algorithms, and security guidelines for the campus asset recovery platform.',
    skills: ['Project Leadership', 'System Architecture', 'Security Protocols', 'React & State Design']
  },
  {
    id: 'robles',
    name: 'John Mark Robles',
    role: 'Fullstack & State Engineer',
    isLeader: false,
    initials: 'JR',
    avatarGradient: 'linear-gradient(135deg, #059669, #0891b2)',
    bio: 'Engineered high-performance filtering systems, instant sub-2-second search pipelines, and inventory persistence algorithms.',
    skills: ['Data Modeling', 'State Management', 'Search Optimization', 'Local Storage APIs']
  },
  {
    id: 'leonen',
    name: 'Justin Leonen',
    role: 'UI/UX & Frontend Specialist',
    isLeader: false,
    initials: 'JL',
    avatarGradient: 'linear-gradient(135deg, #d97706, #dc2626)',
    bio: 'Designed the mobile-first collegiate interface, accessibility compliance (WCAG 2.2 AA), QR-code pickup verification, and Nielsen heuristics layout.',
    skills: ['UI/UX Design', 'Design Systems', 'Responsive Layouts', 'Interactive Micro-animations']
  }
];

// ==========================================
// QR CODE GENERATOR (NATIVE VECTOR SVG)
// ==========================================
function renderPickupQRCode(tokenString) {
  const size = 21;
  const hash = Array.from(tokenString).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const matrix = [];

  for (let r = 0; r < size; r++) {
    const row = [];
    for (let c = 0; c < size; c++) {
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
                fill="#070d19"
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
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [confirmAdminAction, setConfirmAdminAction] = useState(null); // Heuristic #5: Error Prevention

  // Interactive Onboarding Guided Tour (Shows on startup)
  const [showOnboardingGuide, setShowOnboardingGuide] = useState(() => {
    try {
      return localStorage.getItem('xyz_onboarding_dismissed') !== 'true';
    } catch (e) {
      return true;
    }
  });
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleCloseOnboarding = () => {
    if (dontShowAgain) {
      try {
        localStorage.setItem('xyz_onboarding_dismissed', 'true');
      } catch (e) {}
    }
    setShowOnboardingGuide(false);
    setOnboardingStep(0);
  };

  // Form Submissions Loading State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Search Input Ref for Keyboard Shortcut Focus (Nielsen Heuristic #7)
  const searchInputRef = useRef(null);

  // Trigger Toast Notification (Silent / No Audio)
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Keyboard Shortcuts Listener (Nielsen Heuristic #3: User Freedom & #7: Flexibility)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Escape key closes any active modal
      if (e.key === 'Escape') {
        setSelectedItemForClaim(null);
        setClaimSuccessToken(null);
        setShowMatchModal(false);
        setShowLoginModal(false);
        setShowHelpModal(false);
        setConfirmAdminAction(null);
        setShowOnboardingGuide(false);
      }
      
      // '/' key focuses search bar if not already in an input/textarea
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        if (currentView !== 'browse') {
          setCurrentView('browse');
        }
        setTimeout(() => {
          if (searchInputRef.current) {
            searchInputRef.current.focus();
          }
        }, 50);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView]);

  // Auto-Match detector: Check if logged in user has an active matched item
  const userMatchedPair = useMemo(() => {
    const userLost = items.find(
      (it) => it.type === 'lost' && it.reportedBy === user.email && it.status === 'matched'
    );
    if (!userLost || !userLost.matchedWithId) return null;
    const foundMatch = items.find((it) => it.id === userLost.matchedWithId);
    return { lost: userLost, found: foundMatch, score: userLost.matchScore || 95 };
  }, [items, user.email]);

  // Fast Filtered Items (Nielsen Heuristic #1 & #6)
  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return items.filter((item) => {
      const matchesQuery =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query);

      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'lost' && item.type === 'lost') ||
        (statusFilter === 'found' && item.type === 'found') ||
        item.status === statusFilter;

      const matchesLocation = locationFilter === 'all' || item.location === locationFilter;

      return matchesQuery && matchesCategory && matchesStatus && matchesLocation;
    }).sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
      return 0;
    });
  }, [items, searchQuery, selectedCategory, statusFilter, locationFilter, sortBy]);

  // Category counts map for recognition over recall
  const categoryCounts = useMemo(() => {
    const counts = { all: items.length };
    CATEGORIES.forEach((cat) => {
      if (cat.id !== 'all') {
        counts[cat.id] = items.filter((it) => it.category === cat.id).length;
      }
    });
    return counts;
  }, [items]);

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
      triggerToast(`Report Logged! Tracking Lost Item ID: ${newId}`);
      setCurrentView('browse');
    }, 700);
  };

  // Report Found Item (with Photo Upload)
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
      triggerToast(`Found Item Logged & Dispatched to Security Desk! ID: ${newId}`);
      setCurrentView('browse');
    }, 750);
  };

  // Claim Item Submission
  const handleClaimSubmit = (e) => {
    e.preventDefault();
    if (!selectedItemForClaim) return;

    setIsSubmitting(true);

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
      triggerToast('Claim Verified! Present your QR Code at Campus Security.');
    }, 600);
  };

  // Admin Actions: Confirmation before marking Returned (Heuristic #5: Error Prevention)
  const confirmAndExecuteAdminStatus = () => {
    if (!confirmAdminAction) return;
    const { itemId, newStatus } = confirmAdminAction;
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, status: newStatus } : it))
    );
    setConfirmAdminAction(null);
    triggerToast(`Item ${itemId} updated to status: ${newStatus.toUpperCase()}`);
  };

  // Campus Email Verification Login (Heuristic #9: Clear error recognition)
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const email = loginEmailInput.trim().toLowerCase();
    
    const allowedDomains = ['university.edu', 'campus.edu', 'alumni.edu', 'college.edu'];
    const isCampusEmail = allowedDomains.some((d) => email.endsWith(`@${d}`));

    if (!isCampusEmail) {
      setLoginError(`Access Restricted: Email must end with a verified campus domain (@university.edu, @campus.edu, @college.edu).`);
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
    triggerToast(`Welcome back, ${formattedName}!`);
  };

  return html`
    <div className="campus-app">
      <!-- Toast Notification Bar (Heuristic #1: System Status) -->
      ${toastMessage ? html`
        <div style=${{
          position: 'fixed',
          top: '1.25rem',
          right: '1.25rem',
          zIndex: 2000,
          background: '#1e293b',
          color: '#f8fafc',
          padding: '0.85rem 1.25rem',
          borderRadius: '10px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontWeight: '600',
          fontSize: '0.9rem',
          borderLeft: '4px solid var(--primary)',
          border: '1px solid #334155',
          animation: 'slideInDown 0.3s ease-out'
        }}>
          <span style=${{ color: 'var(--primary)', fontSize: '1.1rem' }}>ℹ️</span>
          <span>${toastMessage}</span>
        </div>
      ` : null}

      <!-- Top Header Navigation -->
      <header className="navbar">
        <div className="brand-container" onClick=${() => setCurrentView('dashboard')}>
          <img src="./xyz_university_logo.jpg" alt="XYZ University Logo" className="brand-logo" style=${{ objectFit: 'cover', padding: 0 }} />
          <div className="brand-info">
            <h1>XYZ University</h1>
            <div className="brand-tagline">Campus Lost & Found • Asset Recovery Platform</div>
          </div>
        </div>

        <nav className="nav-links">
          <button
            className=${`nav-btn ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick=${() => setCurrentView('dashboard')}
          >
            🏠 Hub
          </button>
          <button
            className=${`nav-btn ${currentView === 'browse' ? 'active' : ''}`}
            onClick=${() => setCurrentView('browse')}
          >
            📋 Browse Inventory
          </button>
          <button
            className=${`nav-btn ${currentView === 'report-lost' ? 'active' : ''}`}
            onClick=${() => setCurrentView('report-lost')}
          >
            🔴 Report Lost
          </button>
          <button
            className=${`nav-btn ${currentView === 'report-found' ? 'active' : ''}`}
            onClick=${() => setCurrentView('report-found')}
          >
            🟢 Report Found
          </button>
          
          <!-- Role & Admin Switcher: Only show Security Desk when security admin view is enabled -->
          ${user.role === 'admin' ? html`
            <button
              className=${`nav-btn ${currentView === 'admin' ? 'active' : ''}`}
              style=${{ color: 'var(--brand-mint)', borderColor: 'rgba(45, 212, 191, 0.4)', background: 'var(--primary-light)' }}
              onClick=${() => setCurrentView('admin')}
            >
              🛡️ Security Desk
            </button>
          ` : null}

          <!-- Help & Guide Button (Heuristic #10) -->
          <button
            className="nav-btn"
            onClick=${() => setShowHelpModal(true)}
            title="Lost & Found Help & Procedures"
          >
            ❓ Guide & FAQ
          </button>

          <button
            className=${`nav-btn ${currentView === 'about' ? 'active' : ''}`}
            onClick=${() => setCurrentView('about')}
          >
            👥 Team
          </button>

          <!-- User Role Demo Toggle -->
          <div className="role-switcher-badge">
            <button
              className=${`role-pill ${user.role === 'student' ? 'active' : ''}`}
              onClick=${() => {
                setUser({ ...user, role: 'student' });
                if (currentView === 'admin') {
                  setCurrentView('dashboard');
                }
                triggerToast('Switched to Student / Faculty View');
              }}
              title="Student View"
            >
              🎓 Student
            </button>
            <button
              className=${`role-pill ${user.role === 'admin' ? 'admin-active' : ''}`}
              onClick=${() => {
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
              onClick=${() => setShowLoginModal(true)}
              title=${user.email}
            >
              👤 ${user.name.split(' ')[0]}
            </button>
          ` : html`
            <button
              className="nav-btn nav-btn-highlight"
              onClick=${() => setShowLoginModal(true)}
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
            <!-- Smart Auto-Match Alert Banner (Heuristic #1) -->
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
                    onClick=${() => setShowMatchModal(true)}
                  >
                    🔍 Review Match
                  </button>
                  <button
                    style=${{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem', padding: '0.4rem' }}
                    onClick=${() => setActiveMatchBanner(false)}
                    title="Dismiss alert (Heuristic #3: User Freedom)"
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
                onClick=${() => setCurrentView('report-lost')}
              >
                <div className="action-icon">🔴</div>
                <div className="action-card-text">
                  <h3>Report a Lost Item</h3>
                  <p>Lost your wallet, keys, laptop, or bottle? Broadcast it immediately to the campus safety desk.</p>
                </div>
              </div>

              <div
                className="action-card card-found"
                onClick=${() => setCurrentView('report-found')}
              >
                <div className="action-icon">🟢</div>
                <div className="action-card-text">
                  <h3>Report a Found Item</h3>
                  <p>Found something on campus? Upload a quick photo and specify the secure drop-off locker bin.</p>
                </div>
              </div>

              <div
                className="action-card card-browse"
                onClick=${() => setCurrentView('browse')}
              >
                <div className="action-icon">📋</div>
                <div className="action-card-text">
                  <h3>Browse Campus Inventory</h3>
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
                  <div className="stat-box-val" style=${{ color: 'var(--success)' }}>${stats.returnedCount}</div>
                  <div className="stat-box-label">Items Reunited</div>
                </div>
                <div className="stat-box-icon">🤝</div>
              </div>
              <div className="stat-box">
                <div>
                  <div className="stat-box-val" style=${{ color: 'var(--accent-purple)' }}>${stats.matchedCount}</div>
                  <div className="stat-box-label">Smart Matches Found</div>
                </div>
                <div className="stat-box-icon">⚡</div>
              </div>
              <div className="stat-box">
                <div>
                  <div className="stat-box-val" style=${{ color: 'var(--primary)' }}>${stats.recoveryRate}%</div>
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
                onClick=${() => setCurrentView('browse')}
              >
                View Full Directory (${stats.total}) →
              </button>
            </div>

            <!-- Recent 3 Cards Grid -->
            <div className="items-grid">
              ${items.slice(0, 3).map((item) => {
                const isReturned = item.status === 'returned';
                const isMatched = item.status === 'matched';
                const isClaimed = item.status === 'claimed';

                return html`
                  <div key=${item.id} className=${`item-card ${isReturned ? 'item-card-returned' : ''}`}>
                    <div className="item-card-image-wrap">
                      <img src=${item.photoUrl} alt=${item.title} className="item-card-img" />
                      
                      <!-- Crystal Clear Mutually-Exclusive Status Badge -->
                      ${isReturned ? html`
                        <span className="item-status-badge badge-returned">
                          ✓ Returned & Closed
                        </span>
                      ` : isMatched ? html`
                        <span className="item-status-badge badge-matched">
                          ⚡ Matched
                        </span>
                      ` : isClaimed ? html`
                        <span className="item-status-badge badge-claimed">
                          🔑 Claim Pending
                        </span>
                      ` : item.type === 'lost' ? html`
                        <span className="item-status-badge badge-lost">
                          🔴 Lost Report
                        </span>
                      ` : html`
                        <span className="item-status-badge badge-found">
                          🟢 Found Property
                        </span>
                      `}

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
                            setSelectedItemForClaim(item);
                            setClaimSuccessToken(item.claimToken || null);
                          }}
                        >
                          ${isClaimed
                            ? '🔑 View Claim QR'
                            : isReturned
                            ? '✓ Item Returned'
                            : 'This is Mine (Claim)'}
                        </button>
                      </div>
                    </div>
                  </div>
                `;
              })}
            </div>

            <!-- Help Guide Summary Card (Heuristic #10: Help & Docs) -->
            <div className="help-guide-card">
              <div className="section-title" style=${{ fontSize: '1.15rem' }}>
                <span>💡</span> How the Campus Recovery Process Works
              </div>
              <div className="help-guide-grid">
                <div className="help-box">
                  <h4>🔴 1. Report Missing Belongings</h4>
                  <p>Submit details with distinguishing marks. The automated engine cross-checks incoming found items 24/7.</p>
                </div>
                <div className="help-box">
                  <h4>🟢 2. Secure Drop-Off</h4>
                  <p>Found something? Deposit it in designated campus safety locker bins across the library and halls.</p>
                </div>
                <div className="help-box">
                  <h4>🎟️ 3. QR Claim Verification</h4>
                  <p>Provide proof of ownership to generate a cryptographic pickup pass for security desk handover.</p>
                </div>
              </div>
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
                  (Showing ${filteredItems.length} of ${items.length} records)
                </span>
              </div>
              <div style=${{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="nav-btn nav-btn-highlight"
                  onClick=${() => setCurrentView('report-lost')}
                >
                  + Report Lost
                </button>
                <button
                  className="nav-btn"
                  style=${{ background: 'var(--success-light)', color: 'var(--success)', border: '1px solid rgba(52, 211, 153, 0.3)' }}
                  onClick=${() => setCurrentView('report-found')}
                >
                  + Report Found
                </button>
              </div>
            </div>

            <!-- Smart Search & Facet Filters (Heuristic #6 & #7) -->
            <div className="search-filter-container">
              <div className="search-input-row">
                <div className="search-input-wrapper">
                  <span className="search-input-icon">🔍</span>
                  <input
                    ref=${searchInputRef}
                    type="text"
                    className="search-text-input"
                    placeholder="Search by keyword, item name, location, ID (e.g. 'Hydro Flask', 'Library', 'LF-1092')..."
                    value=${searchQuery}
                    onChange=${(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="search-shortcut-badge">
                    <kbd>/</kbd>
                  </div>
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

              <!-- Multi-Facet Filter Chips with Count Badges (Heuristic #6) -->
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
                      onClick=${() => setStatusFilter(tab.id)}
                    >
                      <span>${tab.label}</span>
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
                    <option key=${cat.id} value=${cat.id}>
                      ${cat.icon} ${cat.name} ${cat.id !== 'all' ? `(${categoryCounts[cat.id] || 0})` : ''}
                    </option>
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

                <!-- Reset Filters Button (Heuristic #3: User Freedom) -->
                ${(searchQuery || selectedCategory !== 'all' || statusFilter !== 'all' || locationFilter !== 'all') ? html`
                  <button
                    className="btn-xs btn-xs-outline"
                    style=${{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
                    onClick=${() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setStatusFilter('all');
                      setLocationFilter('all');
                    }}
                  >
                    ✕ Reset All Filters
                  </button>
                ` : null}
              </div>
            </div>

            <!-- Items Gallery -->
            ${filteredItems.length === 0 ? html`
              <!-- Friendly Empty State (Heuristic #9) -->
              <div style=${{
                background: 'var(--bg-card)',
                padding: '3.5rem 2rem',
                borderRadius: '16px',
                textAlign: 'center',
                border: '1px dashed var(--border-color)'
              }}>
                <div style=${{ fontSize: '3rem', marginBottom: '0.75rem' }}>🔍</div>
                <h3 style=${{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>No matching items found</h3>
                <p style=${{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
                  We couldn't find any items matching your current filters. Try changing your search query or reset the filters.
                </p>
                <button
                  className="btn-claim"
                  style=${{ maxWidth: '220px', margin: '0 auto' }}
                  onClick=${() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setStatusFilter('all');
                    setLocationFilter('all');
                  }}
                >
                  Reset All Filters
                </button>
              </div>
            ` : html`
              <div className="items-grid">
                ${filteredItems.map((item) => {
                  const isReturned = item.status === 'returned';
                  const isMatched = item.status === 'matched';
                  const isClaimed = item.status === 'claimed';

                  return html`
                    <div key=${item.id} className=${`item-card ${isReturned ? 'item-card-returned' : ''}`}>
                      <div className="item-card-image-wrap">
                        <img src=${item.photoUrl} alt=${item.title} className="item-card-img" />
                        
                        <!-- Crystal Clear Mutually-Exclusive Status Badge -->
                        ${isReturned ? html`
                          <span className="item-status-badge badge-returned">
                            ✓ Returned & Closed
                          </span>
                        ` : isMatched ? html`
                          <span className="item-status-badge badge-matched">
                            ⚡ Matched
                          </span>
                        ` : isClaimed ? html`
                          <span className="item-status-badge badge-claimed">
                            🔑 Claim Pending
                          </span>
                        ` : item.type === 'lost' ? html`
                          <span className="item-status-badge badge-lost">
                            🔴 Lost Report
                          </span>
                        ` : html`
                          <span className="item-status-badge badge-found">
                            🟢 Found Property
                          </span>
                        `}

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
                              setSelectedItemForClaim(item);
                              setClaimSuccessToken(item.claimToken || null);
                            }}
                          >
                            ${isClaimed
                              ? '🔑 View Claim QR'
                              : isReturned
                              ? '✓ Item Returned'
                              : 'This is Mine (Claim)'}
                          </button>
                        </div>
                      </div>
                    </div>
                  `;
                })}
              </div>
            `}
          </div>
        ` : null}

        <!-- =========================================================
             VIEW 3: "REPORT LOST ITEM" FORM
             ========================================================= -->
        ${currentView === 'report-lost' ? html`
          <div className="form-card">
            <!-- Step Indicator (Heuristic #1) -->
            <div className="form-step-indicator">
              <div className="step-node active">
                <div className="step-number">1</div>
                <span>Item Details</span>
              </div>
              <span style=${{ color: 'var(--border-color)' }}>—</span>
              <div className="step-node">
                <div className="step-number">2</div>
                <span>AI Match Broadcast</span>
              </div>
            </div>

            <div className="form-header">
              <span className="form-header-badge badge-lost-theme">🔴 Student & Faculty Report</span>
              <h2 className="form-title">Report a Lost Item</h2>
              <p className="form-subtitle">
                Provide details to help security and campus finders identify and return your missing belongings.
              </p>
            </div>

            <form onSubmit=${handleReportLostSubmit}>
              <div className="form-grid">
                <div className="form-group form-group-full">
                  <label className="form-label">
                    <span>Item Name / Title *</span>
                    <span className="form-label-hint">Be concise and descriptive</span>
                  </label>
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
                  <label className="form-label">
                    <span>Detailed Description</span>
                    <span className="form-label-hint">Color, model, material, case</span>
                  </label>
                  <textarea
                    name="description"
                    rows="3"
                    placeholder="Describe color, size, brand, where you last had it..."
                    className="form-textarea"
                  ></textarea>
                </div>

                <div className="form-group form-group-full">
                  <label className="form-label">
                    <span>Distinguishing Marks & Verification Proof</span>
                    <span className="form-label-hint">Helps verify ownership without doubt</span>
                  </label>
                  <input
                    type="text"
                    name="marks"
                    placeholder="e.g. Stickers, lockscreen photo description, scratches, serial numbers..."
                    className="form-input"
                  />
                </div>
              </div>

              <div style=${{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn-claim btn-claim-secondary"
                  style=${{ maxWidth: '140px' }}
                  onClick=${() => setCurrentView('dashboard')}
                >
                  Cancel
                </button>
                <button type="submit" disabled=${isSubmitting} className="btn-submit-form">
                  ${isSubmitting ? html`
                    <div className="spinner"></div>
                    <span>Transmitting & Running Auto-Matcher...</span>
                  ` : html`
                    <span>📡 Broadcast Lost Report</span>
                  `}
                </button>
              </div>
            </form>
          </div>
        ` : null}

        <!-- =========================================================
             VIEW 4: "REPORT FOUND ITEM" FORM (With Photo Upload)
             ========================================================= -->
        ${currentView === 'report-found' ? html`
          <div className="form-card">
            <!-- Step Indicator (Heuristic #1) -->
            <div className="form-step-indicator">
              <div className="step-node active">
                <div className="step-number">1</div>
                <span>Photo & Custody</span>
              </div>
              <span style=${{ color: 'var(--border-color)' }}>—</span>
              <div className="step-node">
                <div className="step-number">2</div>
                <span>Locker Logged</span>
              </div>
            </div>

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
                <label className="form-label">
                  <span>Item Photo Upload *</span>
                  <span className="form-label-hint">PNG, JPG, WEBP</span>
                </label>
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
                  <div className="dropzone-subtext">Instant image preview for visual confirmation</div>

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
                  <label className="form-label">
                    <span>Physical Drop-Off / Custody Location *</span>
                    <span className="form-label-hint">Where you physically deposited the item</span>
                  </label>
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

              <div style=${{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn-claim btn-claim-secondary"
                  style=${{ maxWidth: '140px' }}
                  onClick=${() => setCurrentView('dashboard')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled=${isSubmitting}
                  className="btn-submit-form"
                  style=${{ background: 'var(--success)' }}
                >
                  ${isSubmitting ? html`
                    <div className="spinner"></div>
                    <span>Logging & Dispatching to Security...</span>
                  ` : html`
                    <span>✓ Submit Found Item & Notify Owners</span>
                  `}
                </button>
              </div>
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
                  <div className="stat-box-val" style=${{ color: 'var(--warning)' }}>${stats.pendingClaims}</div>
                  <div className="stat-box-label">Pending Claim Verifications</div>
                </div>
                <div className="stat-box-icon">⏳</div>
              </div>
              <div className="stat-box">
                <div>
                  <div className="stat-box-val" style=${{ color: 'var(--success)' }}>${stats.returnedCount}</div>
                  <div className="stat-box-label">Successfully Returned</div>
                </div>
                <div className="stat-box-icon">✅</div>
              </div>
              <div className="stat-box">
                <div>
                  <div className="stat-box-val" style=${{ color: 'var(--primary)' }}>72%</div>
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
                          color: item.status === 'returned' ? 'var(--success)' : item.status === 'claimed' ? 'var(--warning)' : 'var(--primary)'
                        }}>
                          ${item.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div className="action-btn-group">
                          ${item.status === 'claimed' ? html`
                            <button
                              className="btn-xs btn-xs-success"
                              onClick=${() => setConfirmAdminAction({ itemId: item.id, newStatus: 'returned', title: item.title, action: 'verify_pickup' })}
                              title="Verify claim QR & mark returned"
                            >
                              ✓ Verify Pickup
                            </button>
                          ` : null}

                          ${item.status !== 'returned' ? html`
                            <button
                              className="btn-xs btn-xs-outline"
                              onClick=${() => setConfirmAdminAction({ itemId: item.id, newStatus: 'returned', title: item.title, action: 'mark_returned' })}
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
              <span className="team-header-pill">💎 Diamond (3x) La Piece</span>
              <h1 className="team-title">Diamond (3x) La Piece</h1>
              <p className="team-subtitle">
                Engineering team behind XYZ University's Campus Lost & Found Platform — built for rapid asset recovery, automated similarity matching, and secure physical custody tracking.
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
                onClick=${() => setCurrentView('dashboard')}
              >
                ← Back to Campus Hub
              </button>
            </div>
          </div>
        ` : null}

      </main>

      <!-- =========================================================
           MODAL 1: CLAIM VERIFICATION & DYNAMIC QR PICKUP (Heuristic #6)
           ========================================================= -->
      ${selectedItemForClaim ? html`
        <div className="modal-overlay" onClick=${() => { setSelectedItemForClaim(null); setClaimSuccessToken(null); }}>
          <div className="modal-card" onClick=${(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick=${() => { setSelectedItemForClaim(null); setClaimSuccessToken(null); }}
              title="Close modal (Esc)"
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
                  Show this dynamic QR pass at <strong>${selectedItemForClaim.storageLocation || 'Campus Security Main Desk'}</strong>.
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
                  marginBottom: '1.5rem',
                  border: '1px solid var(--border-color)'
                }}>
                  <div>🏢 <strong>Custody Locker:</strong> ${selectedItemForClaim.storageLocation || 'Campus Security Desk (HQ Locker #12)'}</div>
                  <div>🕒 <strong>Security Desk Hours:</strong> Mon-Fri: 8:00 AM - 8:00 PM, Sat: 9:00 AM - 4:00 PM</div>
                  <div>🪪 <strong>Requirement:</strong> Please present your Student/Faculty ID card for physical handover.</div>
                </div>

                <button
                  className="btn-claim"
                  onClick=${() => { setSelectedItemForClaim(null); setClaimSuccessToken(null); }}
                >
                  Done & Close Pass
                </button>
              </div>
            ` : html`
              <!-- Claim Ownership Verification Questionnaire (Recognition over Recall) -->
              <div>
                <h2 style=${{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: '800', marginBottom: '0.25rem' }}>
                  Claim Item: ${selectedItemForClaim.title}
                </h2>
                <p style=${{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  To prevent unauthorized pickups, describe identifying details prior to generating your pickup pass.
                </p>

                <div style=${{
                  display: 'flex',
                  gap: '1rem',
                  background: 'var(--bg-card-subtle)',
                  padding: '0.85rem',
                  borderRadius: '12px',
                  marginBottom: '1.25rem',
                  border: '1px solid var(--border-color)'
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
                      <span>Specific Identifying Proof (Passcode, Serial #, Stickers, Scratches) *</span>
                    </label>
                    <textarea
                      required
                      rows="3"
                      placeholder="e.g. My lockscreen wallpaper is a golden retriever; it has a small scratch near the top right corner..."
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

                  <div style=${{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      type="button"
                      className="btn-claim btn-claim-secondary"
                      style=${{ maxWidth: '120px' }}
                      onClick=${() => { setSelectedItemForClaim(null); setClaimSuccessToken(null); }}
                    >
                      Cancel
                    </button>
                    <button type="submit" disabled=${isSubmitting} className="btn-submit-form">
                      ${isSubmitting ? html`
                        <div className="spinner"></div>
                        <span>Verifying Claim Proof...</span>
                      ` : html`
                        <span>🎟️ Generate Pickup QR Pass</span>
                      `}
                    </button>
                  </div>
                </form>
              </div>
            `}
          </div>
        </div>
      ` : null}

      <!-- =========================================================
           MODAL 2: AUTO-MATCH COMPARISON REVIEW (Heuristic #1 & #6)
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
              <div style=${{ border: '1px solid rgba(248, 113, 113, 0.4)', borderRadius: '12px', padding: '1rem', background: 'var(--danger-light)' }}>
                <span style=${{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--danger)' }}>YOUR LOST REPORT</span>
                <h4 style=${{ margin: '0.35rem 0', color: 'var(--text-primary)' }}>${userMatchedPair.lost.title}</h4>
                <div style=${{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>📍 ${userMatchedPair.lost.location}</div>
                <div style=${{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>📅 Lost: ${userMatchedPair.lost.date}</div>
              </div>

              <!-- Campus Found Report -->
              <div style=${{ border: '1px solid rgba(52, 211, 153, 0.4)', borderRadius: '12px', padding: '1rem', background: 'var(--success-light)' }}>
                <span style=${{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--success)' }}>FOUND ASSET LOGGED</span>
                <h4 style=${{ margin: '0.35rem 0', color: 'var(--text-primary)' }}>${userMatchedPair.found.title}</h4>
                <div style=${{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>📍 ${userMatchedPair.found.location}</div>
                <div style=${{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>🏢 Drop-off: ${userMatchedPair.found.storageLocation}</div>
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
           MODAL 3: VERIFIED CAMPUS EMAIL LOGIN GATEWAY (Heuristic #9)
           ========================================================= -->
      ${showLoginModal ? html`
        <div className="modal-overlay" onClick=${() => setShowLoginModal(false)}>
          <div className="modal-card" style=${{ maxWidth: '440px' }} onClick=${(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick=${() => setShowLoginModal(false)}>✕</button>

            <div style=${{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div className="brand-logo" style=${{ margin: '0 auto 1rem', width: '56px', height: '56px', fontSize: '1.75rem' }}>🎓</div>
              <h2 style=${{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: '800' }}>
                Campus SSO Authentication
              </h2>
              <p style=${{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Access is restricted to verified university student and faculty email accounts.
              </p>
            </div>

            ${loginError ? html`
              <div style=${{
                background: 'var(--danger-light)',
                color: 'var(--danger)',
                border: '1px solid rgba(248, 113, 113, 0.4)',
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
                  Allowed domains: <code>@university.edu</code>, <code>@campus.edu</code>, <code>@college.edu</code>
                </span>
              </div>

              <button type="submit" className="btn-submit-form">
                <span>🔐 Verify & Sign In</span>
              </button>

              <div style=${{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <div style=${{ fontWeight: '600', marginBottom: '0.4rem' }}>Quick Evaluation Accounts:</div>
                <div style=${{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
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

      <!-- =========================================================
           MODAL 4: CONFIRMATION PROMPT (Heuristic #5: Error Prevention)
           ========================================================= -->
      ${confirmAdminAction ? html`
        <div className="modal-overlay" onClick=${() => setConfirmAdminAction(null)}>
          <div className="modal-card" style=${{ maxWidth: '420px' }} onClick=${(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick=${() => setConfirmAdminAction(null)}>✕</button>

            <div style=${{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style=${{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚠️</div>
              <h3 style=${{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: '800' }}>
                Confirm Custody Handover
              </h3>
              <p style=${{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                Are you sure you want to mark <strong>"${confirmAdminAction.title}"</strong> as <strong>RETURNED & CLOSED</strong>? This action archives the item record.
              </p>
            </div>

            <div style=${{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn-claim btn-claim-secondary"
                onClick=${() => setConfirmAdminAction(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-claim"
                style=${{ background: 'var(--success)' }}
                onClick=${confirmAndExecuteAdminStatus}
              >
                Confirm & Archive
              </button>
            </div>
          </div>
        </div>
      ` : null}

      <!-- =========================================================
           MODAL 5: HELP & GUIDELINES (Heuristic #10: Help & Documentation)
           ========================================================= -->
      ${showHelpModal ? html`
        <div className="modal-overlay" onClick=${() => setShowHelpModal(false)}>
          <div className="modal-card" onClick=${(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick=${() => setShowHelpModal(false)}>✕</button>

            <div style=${{ marginBottom: '1.25rem' }}>
              <div style=${{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style=${{ fontSize: '1.5rem' }}>📖</span>
                <h2 style=${{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: '800' }}>
                  Campus Lost & Found Help Guide
                </h2>
              </div>
              <p style=${{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Official campus procedures for asset reporting, custody storage, and physical pickup verification.
              </p>
            </div>

            <div style=${{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
              <div className="help-box">
                <h4>🔴 Reporting Lost Property</h4>
                <p>Submit your lost item with distinguishing marks (stickers, serial numbers, screen wallpapers). When someone logs a matching found item, you will see a similarity alert on your dashboard.</p>
              </div>

              <div className="help-box">
                <h4>🟢 Turning in Found Property</h4>
                <p>Upload a clear photo and take the item to a designated drop-off locker (Library Front Desk Bin A or Campus Security HQ Locker #12).</p>
              </div>

              <div className="help-box">
                <h4>🎟️ Claiming & Physical Verification</h4>
                <p>Click "Claim This Item", enter proof of ownership, and generate a dynamic QR Pickup Pass. Present this pass along with your campus ID card at the security desk.</p>
              </div>

              <div className="help-box">
                <h4>⌨️ Keyboard Shortcuts</h4>
                <p>Press <kbd>/</kbd> to quickly focus the inventory search bar. Press <kbd>Esc</kbd> to dismiss any open modal window.</p>
              </div>
            </div>

            <div style=${{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                className="btn-xs btn-xs-outline"
                style=${{ color: 'var(--brand-mint)', borderColor: 'var(--brand-mint)' }}
                onClick=${() => {
                  setShowHelpModal(false);
                  setOnboardingStep(0);
                  setShowOnboardingGuide(true);
                }}
              >
                🚀 Launch Interactive Guided Tour
              </button>
              <button className="btn-claim" style=${{ maxWidth: '160px' }} onClick=${() => setShowHelpModal(false)}>
                Got it, Close Guide
              </button>
            </div>
          </div>
        </div>
      ` : null}

      <!-- =========================================================
           MODAL 6: INTERACTIVE ONBOARDING GUIDED TOUR (Automatic on open)
           ========================================================= -->
      ${showOnboardingGuide ? html`
        <div className="modal-overlay" onClick=${handleCloseOnboarding}>
          <div className="onboarding-card" onClick=${(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick=${handleCloseOnboarding} title="Close guide (Esc)">✕</button>

            <!-- STEP 0: WELCOME & OVERVIEW -->
            ${onboardingStep === 0 ? html`
              <div>
                <div style=${{ textAlign: 'center', marginBottom: '1.25rem' }}>
                  <img src="./xyz_university_logo.jpg" alt="XYZ University" style=${{ width: '64px', height: '64px', borderRadius: '12px', margin: '0 auto 0.75rem', display: 'block', border: '2px solid var(--brand-mint)', boxShadow: '0 4px 14px rgba(45, 212, 191, 0.3)' }} />
                  <div className="onboarding-step-badge">✨ Welcome to XYZ University</div>
                  <h2 style=${{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                    Campus Asset Recovery Hub
                  </h2>
                  <p style=${{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                    A centralized, smart platform designed to reunite students and faculty with their missing belongings fast.
                  </p>
                </div>

                <div className="onboarding-feature-grid">
                  <div className="onboarding-feature-item">
                    <div className="onboarding-feature-icon">🔴</div>
                    <div className="onboarding-feature-text">
                      <h4>1. Report Lost</h4>
                      <p>Log missing items with distinguishing marks.</p>
                    </div>
                  </div>

                  <div className="onboarding-feature-item">
                    <div className="onboarding-feature-icon">🟢</div>
                    <div className="onboarding-feature-text">
                      <h4>2. Drop-Off Found</h4>
                      <p>Snap a photo & deposit in campus lockers.</p>
                    </div>
                  </div>

                  <div className="onboarding-feature-item">
                    <div className="onboarding-feature-icon">⚡</div>
                    <div className="onboarding-feature-text">
                      <h4>3. Auto-Matcher</h4>
                      <p>Real-time AI matching & alerts on your Hub.</p>
                    </div>
                  </div>

                  <div className="onboarding-feature-item">
                    <div className="onboarding-feature-icon">🎟️</div>
                    <div className="onboarding-feature-text">
                      <h4>4. QR Pickup Pass</h4>
                      <p>Verify ownership for secure desk pickup.</p>
                    </div>
                  </div>
                </div>
              </div>
            ` : null}

            <!-- STEP 1: REPORTING LOST BELONGINGS -->
            ${onboardingStep === 1 ? html`
              <div>
                <div className="onboarding-step-badge">Step 1 of 4 • Missing Property</div>
                <h2 style=${{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: '800' }}>
                  🔴 How to Report a Lost Item
                </h2>
                <p style=${{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Lost your ID card, laptop, water bottle, or keys somewhere on campus?
                </p>

                <div className="onboarding-highlight-box">
                  <div className="onboarding-highlight-icon">📝</div>
                  <div style=${{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                    <strong>Tip:</strong> Always include <strong>Distinguishing Marks</strong> (such as laptop stickers, phone wallpapers, or scratches). This allows campus security to verify you are the legitimate owner.
                  </div>
                </div>

                <div style=${{ background: 'var(--bg-card-subtle)', padding: '1rem', borderRadius: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <div>📍 <strong>Specify Campus Building:</strong> Choose Library, Science Hall, Gym, etc.</div>
                  <div style=${{ marginTop: '0.4rem' }}>🤖 <strong>Automated Matching:</strong> The system continuously scans all new found reports in the background.</div>
                </div>
              </div>
            ` : null}

            <!-- STEP 2: REPORTING FOUND PROPERTY & CUSTODY -->
            ${onboardingStep === 2 ? html`
              <div>
                <div className="onboarding-step-badge">Step 2 of 4 • Good Samaritan</div>
                <h2 style=${{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: '800' }}>
                  🟢 Found Something on Campus?
                </h2>
                <p style=${{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Help your fellow students by logging found items into the custody network.
                </p>

                <div className="onboarding-highlight-box">
                  <div className="onboarding-highlight-icon">📷</div>
                  <div style=${{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                    <strong>Instant Photo Upload:</strong> Drag & drop a photo from your phone or laptop. Visual confirmation helps owners recognize their items immediately.
                  </div>
                </div>

                <div style=${{ background: 'var(--bg-card-subtle)', padding: '1rem', borderRadius: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <div>🏢 <strong>Physical Drop-Off Locker:</strong> Deposit the item into designated bins at:</div>
                  <ul style=${{ marginLeft: '1.25rem', marginTop: '0.35rem', lineHeight: '1.6' }}>
                    <li><strong>Campus Security Desk:</strong> HQ Locker #12</li>
                    <li><strong>University Library Front Desk:</strong> Custody Bin A</li>
                  </ul>
                </div>
              </div>
            ` : null}

            <!-- STEP 3: SEARCH & KEYBOARD EFFICIENCY -->
            ${onboardingStep === 3 ? html`
              <div>
                <div className="onboarding-step-badge">Step 3 of 4 • Rapid Discovery</div>
                <h2 style=${{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: '800' }}>
                  🔍 Instant Inventory & Shortcuts
                </h2>
                <p style=${{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Query through verified university listings with multi-facet filters.
                </p>

                <div className="onboarding-highlight-box">
                  <div className="onboarding-highlight-icon">⚡</div>
                  <div style=${{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                    <strong>Sub-2-Second Search:</strong> Search by item title, campus hall, or tracking IDs (e.g. <code>LF-1092</code>, <code>FD-2041</code>).
                  </div>
                </div>

                <div style=${{ background: 'var(--bg-card-subtle)', padding: '1rem', borderRadius: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <div>⌨️ <strong>Power Keyboard Shortcuts:</strong></div>
                  <div style=${{ marginTop: '0.4rem' }}>• Press <kbd>/</kbd> anywhere to focus search immediately.</div>
                  <div style=${{ marginTop: '0.3rem' }}>• Press <kbd>Esc</kbd> to close any active modal or pass.</div>
                </div>
              </div>
            ` : null}

            <!-- STEP 4: CLAIMING & QR PICKUP VOUCHER -->
            ${onboardingStep === 4 ? html`
              <div>
                <div className="onboarding-step-badge">Step 4 of 4 • Handover Verification</div>
                <h2 style=${{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: '800' }}>
                  🎟️ Claiming & Physical Pickup
                </h2>
                <p style=${{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Reunite with your item securely at the Campus Security Desk.
                </p>

                <div className="onboarding-highlight-box">
                  <div className="onboarding-highlight-icon">🛡️</div>
                  <div style=${{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                    <strong>Dynamic QR Pickup Pass:</strong> Once your claim questionnaire is submitted, you receive a dynamic SVG QR code pass on your screen.
                  </div>
                </div>

                <div style=${{ background: 'var(--bg-card-subtle)', padding: '1rem', borderRadius: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <div>🪪 <strong>What to Bring for Pickup:</strong></div>
                  <div style=${{ marginTop: '0.3rem' }}>1. Your Digital QR Pass on your mobile device.</div>
                  <div>2. Your official XYZ Student or Faculty ID card.</div>
                </div>
              </div>
            ` : null}

            <!-- Step Dots Indicator -->
            <div className="onboarding-dots">
              ${[0, 1, 2, 3, 4].map((stepIdx) => html`
                <div
                  key=${stepIdx}
                  className=${`onboarding-dot ${onboardingStep === stepIdx ? 'active' : ''}`}
                  onClick=${() => setOnboardingStep(stepIdx)}
                  title=${`Go to step ${stepIdx + 1}`}
                ></div>
              `)}
            </div>

            <!-- Footer Controls -->
            <div className="onboarding-footer">
              <label style=${{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked=${dontShowAgain}
                  onChange=${(e) => setDontShowAgain(e.target.checked)}
                />
                <span>Don't show on startup</span>
              </label>

              <div style=${{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                ${onboardingStep > 0 ? html`
                  <button
                    type="button"
                    className="btn-claim btn-claim-secondary"
                    style=${{ padding: '0.5rem 0.9rem' }}
                    onClick=${() => setOnboardingStep(onboardingStep - 1)}
                  >
                    ← Back
                  </button>
                ` : html`
                  <button
                    type="button"
                    className="btn-xs btn-xs-outline"
                    onClick=${handleCloseOnboarding}
                  >
                    Skip Tour
                  </button>
                `}

                ${onboardingStep < 4 ? html`
                  <button
                    type="button"
                    className="btn-claim"
                    style=${{ padding: '0.5rem 1.25rem' }}
                    onClick=${() => setOnboardingStep(onboardingStep + 1)}
                  >
                    Next Step →
                  </button>
                ` : html`
                  <button
                    type="button"
                    className="btn-claim"
                    style=${{ padding: '0.5rem 1.25rem', background: 'var(--brand-mint)', color: 'var(--brand-teal-dark)' }}
                    onClick=${handleCloseOnboarding}
                  >
                    🚀 Enter Campus Hub
                  </button>
                `}
              </div>
            </div>
          </div>
        </div>
      ` : null}


      <!-- Footer -->
      <footer className="app-footer">
        <div>Campus Lost & Found Platform • University Asset Recovery System</div>
        <div style=${{ marginTop: '0.4rem', fontSize: '0.8rem' }}>
          Crafted with Nielsen's 10 Usability Heuristics & WCAG 2.2 AA Accessibility Standards
        </div>
        <div style=${{ marginTop: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Developed by Vladimir Tadeo (Leader), John Mark Robles, and Justin Leonen
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
