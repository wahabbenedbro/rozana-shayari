import React, { useState, useEffect } from 'react';
import { PoemService, Poem, Analytics } from './PoemService';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('poems');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form state for adding/editing poems
  const [formData, setFormData] = useState({
    urdu: '',
    hindi: '',
    english: '',
    author: {
      urdu: '',
      hindi: '',
      english: ''
    },
    category: 'general',
    metadata: {
      theme: '',
      difficulty: 'medium',
      audioAvailable: false
    }
  });

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, activeTab]);

  useEffect(() => {
    if (isOpen && activeTab === 'poems') {
      loadPoems();
    }
  }, [currentPage, selectedCategory, searchQuery]);

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Load categories
      const categoriesResult = await PoemService.getCategories();
      if (categoriesResult.success && categoriesResult.data) {
        setCategories(['all', ...categoriesResult.data.categories]);
      }

      // Load analytics if on analytics tab
      if (activeTab === 'analytics') {
        const analyticsResult = await PoemService.getAnalytics();
        if (analyticsResult.success && analyticsResult.data) {
          setAnalytics(analyticsResult.data.analytics);
        }
      }

      // Load poems if on poems tab
      if (activeTab === 'poems') {
        await loadPoems();
      }
    } catch (error) {
      console.error('Error loading data:', error);
      showAlert('error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadPoems = async () => {
    try {
      const result = await PoemService.getAllPoems({
        page: currentPage,
        limit: 10,
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        search: searchQuery || undefined
      });
      
      if (result.success && result.data) {
        setPoems(result.data.poems);
        setTotalPages(result.data.pagination.totalPages);
      } else {
        console.error('Failed to load poems:', result.error);
        showAlert('error', result.error || 'Failed to load poems');
      }
    } catch (error) {
      console.error('Error loading poems:', error);
      showAlert('error', 'Error loading poems');
    }
  };

  const handleAddPoem = async () => {
    setLoading(true);
    try {
      const result = await PoemService.addPoem(formData);
      if (result.success) {
        await loadPoems();
        setShowAddForm(false);
        resetForm();
        showAlert('success', 'Poem added successfully!');
      } else {
        showAlert('error', result.error || 'Failed to add poem');
      }
    } catch (error) {
      console.error('Error adding poem:', error);
      showAlert('error', 'Error adding poem');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePoem = async () => {
    if (!selectedPoem) return;
    
    setLoading(true);
    try {
      const result = await PoemService.updatePoem(selectedPoem.id, formData);
      if (result.success) {
        await loadPoems();
        setIsEditing(false);
        setSelectedPoem(null);
        resetForm();
        showAlert('success', 'Poem updated successfully!');
      } else {
        showAlert('error', result.error || 'Failed to update poem');
      }
    } catch (error) {
      console.error('Error updating poem:', error);
      showAlert('error', 'Error updating poem');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePoem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this poem?')) return;
    
    setLoading(true);
    try {
      const result = await PoemService.deletePoem(id, false); // Soft delete
      if (result.success) {
        await loadPoems();
        showAlert('success', 'Poem deleted successfully!');
      } else {
        showAlert('error', result.error || 'Failed to delete poem');
      }
    } catch (error) {
      console.error('Error deleting poem:', error);
      showAlert('error', 'Error deleting poem');
    } finally {
      setLoading(false);
    }
  };

  const handleSchedulePoem = async (poemId: string, date: string) => {
    setLoading(true);
    try {
      const result = await PoemService.schedulePoem(poemId, date, false);
      if (result.success) {
        showAlert('success', `Poem scheduled for ${date}!`);
      } else {
        showAlert('error', result.error || 'Failed to schedule poem');
      }
    } catch (error) {
      console.error('Error scheduling poem:', error);
      showAlert('error', 'Error scheduling poem');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      urdu: '',
      hindi: '',
      english: '',
      author: {
        urdu: '',
        hindi: '',
        english: ''
      },
      category: 'general',
      metadata: {
        theme: '',
        difficulty: 'medium',
        audioAvailable: false
      }
    });
  };

  const startEditing = (poem: Poem) => {
    setSelectedPoem(poem);
    setFormData({
      urdu: poem.urdu,
      hindi: poem.hindi,
      english: poem.english,
      author: poem.author,
      category: poem.category,
      metadata: poem.metadata || {
        theme: '',
        difficulty: 'medium',
        audioAvailable: false
      }
    });
    setIsEditing(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when filtering
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Poetry Management Dashboard</h2>
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>

        {alert && (
          <div className="p-4">
            <Alert className={alert.type === 'error' ? 'border-red-500 text-red-700' : 'border-green-500 text-green-700'}>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start p-6 pb-0">
            <TabsTrigger value="poems">Poems Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          {/* Poems Management Tab */}
          <TabsContent value="poems" className="p-6 overflow-y-auto max-h-[70vh]">
            <div className="space-y-4">
              {/* Search and Filter Controls */}
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-2 flex-1 min-w-0">
                  <Input
                    placeholder="Search poems, authors, themes..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="max-w-md"
                  />
                  <Select value={selectedCategory} onValueChange={handleCategoryFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="bg-emerald-deep hover:bg-emerald-deep/90 text-white"
                >
                  Add New Poem
                </Button>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-deep"></div>
                  <p className="mt-2 text-gray-600">Loading poems...</p>
                </div>
              )}

              {/* Empty State */}
              {!loading && poems.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    {searchQuery ? 'No poems found matching your search.' : 'No poems found. Add your first poem to get started!'}
                  </p>
                </div>
              )}

              {/* Poems Grid */}
              <div className="grid gap-4">
                {poems.map((poem) => (
                  <Card key={poem.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="secondary">{poem.category}</Badge>
                          {poem.metadata?.theme && (
                            <Badge variant="outline">{poem.metadata.theme}</Badge>
                          )}
                          <Badge variant="outline">{poem.metadata?.difficulty || 'medium'}</Badge>
                          <span className="text-xs text-gray-500">
                            Added: {new Date(poem.dateAdded).toLocaleDateString()}
                          </span>
                          {poem.metadata?.views !== undefined && (
                            <span className="text-xs text-blue-600">
                              Views: {poem.metadata.views}
                            </span>
                          )}
                          {poem.metadata?.shares !== undefined && (
                            <span className="text-xs text-green-600">
                              Shares: {poem.metadata.shares}
                            </span>
                          )}
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Urdu</p>
                            <p className="text-sm text-right" dir="rtl">{poem.urdu.slice(0, 100)}...</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Hindi</p>
                            <p className="text-sm">{poem.hindi.slice(0, 100)}...</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">English</p>
                            <p className="text-sm">{poem.english.slice(0, 100)}...</p>
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-600">
                          Author: {poem.author.english} / {poem.author.hindi} / {poem.author.urdu}
                        </p>
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditing(poem)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const date = prompt('Enter date (YYYY-MM-DD) to schedule this poem:');
                            if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
                              handleSchedulePoem(poem.id, date);
                            } else if (date) {
                              showAlert('error', 'Invalid date format. Use YYYY-MM-DD');
                            }
                          }}
                        >
                          Schedule
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeletePoem(poem.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="p-6 overflow-y-auto max-h-[70vh]">
            {analytics ? (
              <div className="grid gap-6">
                {/* Overview Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-emerald-deep">{analytics.overview.totalPoems}</div>
                    <div className="text-sm text-gray-600">Total Poems</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{analytics.overview.activePoems}</div>
                    <div className="text-sm text-gray-600">Active</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{analytics.overview.totalViews}</div>
                    <div className="text-sm text-gray-600">Total Views</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{analytics.overview.totalShares}</div>
                    <div className="text-sm text-gray-600">Total Shares</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-gold-accent">{analytics.overview.avgViewsPerPoem}</div>
                    <div className="text-sm text-gray-600">Avg Views</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{analytics.overview.inactivePoems}</div>
                    <div className="text-sm text-gray-600">Inactive</div>
                  </Card>
                </div>

                {/* Popular Poems */}
                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Most Popular Poems</h3>
                  <div className="space-y-3">
                    {analytics.popularPoems.map((poem, index) => (
                      <div key={poem.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-emerald-deep">#{index + 1}</span>
                            <div>
                              <p className="font-medium">{poem.title}</p>
                              <p className="text-sm text-gray-600">by {poem.author}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-4 text-sm">
                          <span className="text-blue-600">{poem.views} views</span>
                          <span className="text-green-600">{poem.shares} shares</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Categories Distribution */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Categories</h3>
                    <div className="space-y-2">
                      {Object.entries(analytics.categories).map(([category, count]) => (
                        <div key={category} className="flex justify-between items-center">
                          <span className="capitalize">{category}</span>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Top Authors</h3>
                    <div className="space-y-2">
                      {Object.entries(analytics.authors)
                        .sort(([,a], [,b]) => (b as number) - (a as number))
                        .slice(0, 10)
                        .map(([author, count]) => (
                        <div key={author} className="flex justify-between items-center">
                          <span>{author}</span>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-deep"></div>
                <p className="mt-2 text-gray-600">Loading analytics...</p>
              </div>
            )}
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="p-6 overflow-y-auto max-h-[70vh]">
            <div className="text-center py-8">
              <p className="text-gray-600">Schedule management coming soon...</p>
              <p className="text-sm text-gray-500 mt-2">
                Use the "Schedule" button on individual poems for now.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Add/Edit Form Modal */}
        {(showAddForm || isEditing) && (
          <Dialog open={showAddForm || isEditing} onOpenChange={(open) => {
            if (!open) {
              setShowAddForm(false);
              setIsEditing(false);
              setSelectedPoem(null);
              resetForm();
            }
          }}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? 'Edit Poem' : 'Add New Poem'}
                </DialogTitle>
                <DialogDescription>
                  {isEditing 
                    ? 'Update the poem content and metadata below.' 
                    : 'Add a new poem to the collection with content in all three languages.'
                  }
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Urdu Text</label>
                    <Textarea
                      value={formData.urdu}
                      onChange={(e) => setFormData({...formData, urdu: e.target.value})}
                      placeholder="اردو شاعری..."
                      className="min-h-32 text-right"
                      dir="rtl"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Hindi Text</label>
                    <Textarea
                      value={formData.hindi}
                      onChange={(e) => setFormData({...formData, hindi: e.target.value})}
                      placeholder="हिंदी कविता..."
                      className="min-h-32"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">English Text</label>
                    <Textarea
                      value={formData.english}
                      onChange={(e) => setFormData({...formData, english: e.target.value})}
                      placeholder="English poetry..."
                      className="min-h-32"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Author (Urdu)</label>
                    <Input
                      value={formData.author.urdu}
                      onChange={(e) => setFormData({
                        ...formData,
                        author: {...formData.author, urdu: e.target.value}
                      })}
                      placeholder="شاعر کا نام"
                      className="text-right"
                      dir="rtl"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Author (Hindi)</label>
                    <Input
                      value={formData.author.hindi}
                      onChange={(e) => setFormData({
                        ...formData,
                        author: {...formData.author, hindi: e.target.value}
                      })}
                      placeholder="कवि का नाम"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Author (English)</label>
                    <Input
                      value={formData.author.english}
                      onChange={(e) => setFormData({
                        ...formData,
                        author: {...formData.author, english: e.target.value}
                      })}
                      placeholder="Poet's name"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({...formData, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="inspiration">Inspiration</SelectItem>
                        <SelectItem value="romance">Romance</SelectItem>
                        <SelectItem value="wisdom">Wisdom</SelectItem>
                        <SelectItem value="spiritual">Spiritual</SelectItem>
                        <SelectItem value="nature">Nature</SelectItem>
                        <SelectItem value="patriotic">Patriotic</SelectItem>
                        <SelectItem value="philosophy">Philosophy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Theme</label>
                    <Input
                      value={formData.metadata.theme}
                      onChange={(e) => setFormData({
                        ...formData,
                        metadata: {...formData.metadata, theme: e.target.value}
                      })}
                      placeholder="hope, love, wisdom..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Difficulty</label>
                    <Select
                      value={formData.metadata.difficulty}
                      onValueChange={(value) => setFormData({
                        ...formData,
                        metadata: {...formData.metadata, difficulty: value}
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setIsEditing(false);
                      setSelectedPoem(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={isEditing ? handleUpdatePoem : handleAddPoem}
                    disabled={loading}
                    className="bg-emerald-deep hover:bg-emerald-deep/90 text-white"
                  >
                    {loading ? 'Saving...' : (isEditing ? 'Update Poem' : 'Add Poem')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}