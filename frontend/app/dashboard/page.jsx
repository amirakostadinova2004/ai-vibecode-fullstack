"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  // Filter and sort tools
  const filteredAndSortedTools = tools
    .filter(tool => {
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'popular':
          return b.rating * b.rating - a.rating * a.rating; // Simple popularity metric
        default:
          return 0;
      }
    });

  // Get recent tools (last 5 added)
  const recentTools = tools
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    url: '',
    image_url: '',
    tags: '',
    rating: 1,
    price_tier: 1,
    is_featured: false
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push('/login');
      return;
    }

    fetchUser();
    fetchTools();
    fetchCategories();
  }, [selectedCategory, searchTerm]);


  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8201/api/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  const fetchTools = async () => {
    const token = localStorage.getItem("token");
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);
      
      const res = await fetch(`http://localhost:8201/api/ai-tools?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setTools(data.data || []);
    } catch (err) {
      console.error("Error fetching tools:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8201/api/ai-tools/categories", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleAddTool = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    try {
      const res = await fetch("http://localhost:8201/api/ai-tools", {
        method: "POST",
      headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        })
      });
      
      if (res.ok) {
        setShowAddForm(false);
        setSuccessMessage('Tool submitted successfully! It will appear on the dashboard once approved by an admin.');
        setFormData({
          name: '', description: '', category: '', url: '', image_url: '',
          tags: '', rating: 1, price_tier: 1, is_featured: false
        });
        fetchTools();
        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    } catch (err) {
      console.error("Error adding tool:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push('/login');
  };

  if (!user) return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '18px',
      color: '#666'
    }}>
      Зареждане...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 font-sans flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 border-r border-slate-700 text-white p-6 flex flex-col">
        <div className="mb-8">
          {/* RateMyAI Logo with Text */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Main star fill */}
                <polygon
                  points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35"
                  fill="#7c3aed"
                  stroke="#5b21b6"
                  strokeWidth="2"
                  className="drop-shadow-lg"
                />
                {/* Faceted interior design */}
                <polygon
                  points="50,5 50,35 61,35"
                  fill="#8b5cf6"
                />
                <polygon
                  points="50,5 50,35 39,35"
                  fill="#7c3aed"
                />
                <polygon
                  points="50,35 68,57 79,91 50,70"
                  fill="#8b5cf6"
                />
                <polygon
                  points="50,35 32,57 21,91 50,70"
                  fill="#7c3aed"
                />
                <polygon
                  points="50,35 32,57 5,35"
                  fill="#6d28d9"
                />
                <polygon
                  points="50,35 68,57 95,35"
                  fill="#6d28d9"
                />
                
                {/* Connection lines */}
                <line x1="50" y1="5" x2="50" y2="70" stroke="#5b21b6" strokeWidth="2"/>
                <line x1="50" y1="5" x2="32" y2="57" stroke="#5b21b6" strokeWidth="2"/>
                <line x1="50" y1="5" x2="68" y2="57" stroke="#5b21b6" strokeWidth="2"/>
                <line x1="32" y1="57" x2="68" y2="57" stroke="#5b21b6" strokeWidth="2"/>
                <line x1="50" y1="70" x2="21" y2="91" stroke="#5b21b6" strokeWidth="2"/>
                <line x1="50" y1="70" x2="79" y2="91" stroke="#5b21b6" strokeWidth="2"/>
                
                {/* Connection points */}
                <circle cx="50" cy="5" r="4" fill="#ffffff" stroke="#5b21b6" strokeWidth="2"/>
                <circle cx="50" cy="70" r="4" fill="#ffffff" stroke="#5b21b6" strokeWidth="2"/>
                <circle cx="21" cy="91" r="4" fill="#ffffff" stroke="#5b21b6" strokeWidth="2"/>
                <circle cx="79" cy="91" r="4" fill="#ffffff" stroke="#5b21b6" strokeWidth="2"/>
                <circle cx="5" cy="35" r="4" fill="#ffffff" stroke="#5b21b6" strokeWidth="2"/>
                <circle cx="95" cy="35" r="4" fill="#ffffff" stroke="#5b21b6" strokeWidth="2"/>
                <circle cx="32" cy="57" r="4" fill="#ffffff" stroke="#5b21b6" strokeWidth="2"/>
                <circle cx="68" cy="57" r="4" fill="#ffffff" stroke="#5b21b6" strokeWidth="2"/>
                <circle cx="50" cy="35" r="4" fill="#ffffff" stroke="#5b21b6" strokeWidth="2"/>
              </svg>
            </div>
            <h2 className="text-2xl text-white font-bold">
              RateMyAI
            </h2>
          </div>
          <p className="text-sm text-slate-300 mb-1">
            Добре дошъл, {user.name}
          </p>
          <p className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded-full inline-block">
            {user.role}
          </p>
        </div>

        <nav className="flex-1">
          <div className="space-y-2">
            <button className="w-full p-3 bg-slate-700 text-purple-400 rounded-lg text-sm font-semibold hover:bg-slate-600 hover:text-purple-300 transition-all">
              Dashboard
            </button>
            <button 
              onClick={() => router.push('/my-tools')}
              className="w-full p-3 bg-transparent text-slate-300 border border-slate-600 rounded-lg text-sm hover:bg-slate-700 hover:text-slate-200 transition-colors"
            >
              My Tools
            </button>
          </div>
        </nav>

        <div className="border-t border-slate-600 pt-4">
          <button
            onClick={handleLogout}
            className="w-full p-3 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Success Message */}
        {successMessage && (
          <div className="mx-6 mt-6 p-4 bg-green-900/50 border border-green-700 rounded-lg text-green-200">
            {successMessage}
          </div>
        )}

        {/* Header */}
        <header className="bg-gradient-to-r from-purple-800 via-purple-900 to-indigo-900 text-white p-6 shadow-xl border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              AI Tools Dashboard
            </h1>
            
            {/* Quick Search */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Quick search tools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-80 px-4 py-2 pl-10 rounded-lg border-0 bg-white/10 text-white placeholder-white/70 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70">
                  🔍
                </div>
              </div>
              
              {/* View Toggle */}
              <div className="flex bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-purple-800' : 'text-white/70 hover:text-white'
                  }`}
                >
                  ⊞
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    viewMode === 'list' ? 'bg-white text-purple-800' : 'text-white/70 hover:text-white'
                  }`}
                >
                  ☰
                </button>
              </div>
            </div>
          </div>
        </header>


        <div className="p-6 flex-1 bg-slate-900">
        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-8 items-center">
          <div className="flex items-center gap-2">
            <label className="font-semibold text-slate-200">Категория:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Всички</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="font-semibold text-slate-200">Сортирай:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="newest">Най-нови</option>
              <option value="oldest">Най-стари</option>
              <option value="rating">По рейтинг</option>
              <option value="name">По име</option>
              <option value="popular">Най-популярни</option>
            </select>
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all shadow-md flex items-center gap-2"
          >
            <span>+</span>
            Добави AI инструмент
          </button>
        </div>

        {/* Add Tool Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-slate-800 border border-slate-700 p-8 rounded-xl w-11/12 max-w-2xl max-h-90vh overflow-y-auto shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                Добави нов AI инструмент
              </h3>
              <form onSubmit={handleAddTool} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-purple-400 border-b border-slate-600 pb-2">
                    Основна информация
                  </h4>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Име на инструмента:
                    </label>
                    <input
                      type="text"
                      placeholder="Въведи име на инструмента"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Описание:
                    </label>
                    <textarea
                      placeholder="Опиши инструмента..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      required
                      rows={4}
                      className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Категория:
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      required
                      className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Избери категория</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Links and Media */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-purple-400 border-b border-slate-600 pb-2">
                    Връзки и медия
                  </h4>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      URL на инструмента:
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com"
                      value={formData.url}
                      onChange={(e) => setFormData({...formData, url: e.target.value})}
                      required
                      className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      URL на изображение (незадължително):
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={formData.image_url}
                      onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                      className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Tags and Rating */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-purple-400 border-b border-slate-600 pb-2">
                    Тагове и рейтинг
                  </h4>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Тагове (разделени със запетая):
                    </label>
                    <input
                      type="text"
                      placeholder="AI, productivity, automation"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Рейтинг (1-5):
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="1"
                      value={formData.rating || ''}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        const clampedValue = Math.min(Math.max(value, 1), 5);
                        setFormData({...formData, rating: clampedValue});
                      }}
                      className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-purple-400 border-b border-slate-600 pb-2">
                    Ценова категория
                  </h4>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Тип на ценообразуване:
                    </label>
                    <select
                      value={formData.price_tier}
                      onChange={(e) => setFormData({...formData, price_tier: parseInt(e.target.value) || 1})}
                      className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value={1}>Безплатен</option>
                      <option value={2}>Freemium</option>
                      <option value={3}>Платен</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-end pt-6 border-t border-slate-600">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-semibold"
                  >
                    Отказ
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                  >
                    Добави инструмент
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}


        {/* Tools Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden animate-pulse">
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-slate-700 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-3 bg-slate-700 rounded w-full mb-2"></div>
                  <div className="h-3 bg-slate-700 rounded w-5/6 mb-4"></div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="h-4 bg-slate-700 rounded w-16"></div>
                    <div className="h-6 bg-slate-700 rounded w-20"></div>
                  </div>
                  <div className="h-10 bg-slate-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
            {filteredAndSortedTools.map(tool => (
              <div
                key={tool.id}
                className={`bg-slate-800 border border-slate-700 rounded-lg hover:shadow-xl transition-all duration-300 overflow-hidden group relative ${
                  tool.is_featured ? 'border-yellow-400' : 'border-slate-700'
                } ${
                  viewMode === 'list' ? 'flex items-center p-6' : ''
                }`                }
              >
                {/* Pricing Badge and Link */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="bg-purple-800 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {tool.price_tier === 1 ? 'Безплатен' :
                     tool.price_tier === 2 ? 'Freemium' : 'Платен'}
                  </span>
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-purple-600 text-white px-2 py-1 rounded text-xs hover:bg-purple-700 transition-colors"
                    title="Отвори в нов таб"
                  >
                    🔗
                  </a>
                </div>
                
                {viewMode === 'list' ? (
                  // List View
                  <div className="flex items-center w-full gap-6">
                    <div className="w-16 h-16 bg-grey-lighter rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                      🤖
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors mb-1">
                        {tool.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {tool.category}
                        </span>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className={`text-lg ${
                                star <= tool.rating ? 'text-yellow-400' : 'text-gray-400'
                              }`}>
                                ⭐
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="text-purple-400 px-3 py-1 text-sm hover:text-purple-300 transition-colors">
                              Rate
                            </button>
                            <button
                              onClick={() => router.push(`/tool/${tool.id}`)}
                              className="text-purple-400 px-3 py-1 text-sm hover:text-purple-300 transition-colors"
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm text-slate-400">
                        <p>Добавен от: {tool.user?.name}</p>
                        <p>{new Date(tool.created_at).toLocaleDateString('bg-BG')}</p>
                      </div>
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-purple-600 text-white py-2 px-6 rounded-md font-semibold hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2"
                      >
                        <span>🔗</span>
                        Отвори
                      </a>
                    </div>
                  </div>
                ) : (
                  // Grid View
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                    {tool.image_url ? (
                      <img
                        src={tool.image_url}
                        alt={tool.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                        🤖
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors mb-2">
                        {tool.name}
                      </h3>
                      <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {tool.category}
                      </span>
                    </div>
                  </div>
                
                  
                  {/* Tags */}
                  {tool.tags && tool.tags.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {tool.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="bg-slate-700 text-slate-300 px-2 py-1 rounded-md text-xs">
                            #{tag}
                          </span>
                        ))}
                        {tool.tags.length > 3 && (
                          <span className="text-slate-400 text-xs">
                            +{tool.tags.length - 3} повече
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                
                  {/* Rating */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={`text-lg ${
                            star <= tool.rating ? 'text-yellow-400' : 'text-gray-400'
                          }`}>
                            ⭐
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="text-purple-400 px-3 py-1 text-sm hover:text-purple-300 transition-colors">
                          Rate
                        </button>
                        <button
                          onClick={() => router.push(`/tool/${tool.id}`)}
                          className="text-purple-400 px-3 py-1 text-sm hover:text-purple-300 transition-colors"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  
                  <p className="text-xs text-slate-400 text-center">
                    Добавен от: {tool.user?.name}
                  </p>
                </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {filteredAndSortedTools.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-slate-200 mb-2">Няма намерени AI инструменти</h3>
            <p className="text-slate-400">Опитайте с различна категория или търсене</p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}