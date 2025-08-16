import { createClient } from 'jsr:@supabase/supabase-js@2';
import { Hono } from 'npm:hono@4';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.use('*', logger(console.log));

// Helper function to generate unique ID
const generateId = () => `poem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Helper function to get current date in YYYY-MM-DD format
const getCurrentDate = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

// Helper function to validate email
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Initialize data structure on first run
app.post('/make-server-5cd263ef/init', async (c) => {
  try {
    // Check if poems collection exists
    const existingPoems = await kv.get('poems:collection');
    
    if (!existingPoems) {
      // Create initial poems collection with sample data
      const initialPoems = [
        {
          id: generateId(),
          urdu: `دل میں چھپے ہوئے خوابوں کو\nآنکھوں میں سجانا آتا ہے\nہر غم کو خوشی میں بدلنا\nاردو شاعری کا جادو ہے`,
          hindi: `दिल में छुपे हुए सपनों को\nआंखों में सजाना आता है\nहर गम को खुशी में बदलना\nहिंदी कविता का जादू है`,
          english: `Hidden dreams within the heart,\nAdorn the eyes with gentle art.\nTurning sorrow into joy,\nIs poetry's timeless ploy.`,
          author: {
            urdu: 'علامہ اقبال',
            hindi: 'अल्लामा इक़बाल',
            english: 'Allama Iqbal'
          },
          category: 'inspiration',
          dateAdded: new Date().toISOString(),
          scheduledDate: null,
          isActive: true,
          metadata: {
            theme: 'hope',
            difficulty: 'medium',
            audioAvailable: false,
            views: 0,
            shares: 0
          }
        },
        {
          id: generateId(),
          urdu: `رات کی خاموشی میں\nستاروں سے باتیں کرتے ہیں\nدل کے راز چاند کو\nآہستہ آہستہ سناتے ہیں`,
          hindi: `रात की खामोशी में\nसितारों से बातें करते हैं\nदिल के राज चांद को\nआहिस्ता आहिस्ता सुनाते हैं`,
          english: `In the silence of the night,\nWe converse with stars so bright.\nTo the moon we softly tell,\nSecrets that within hearts dwell.`,
          author: {
            urdu: 'میر تقی میر',
            hindi: 'मीर तकी मीर',
            english: 'Mir Taqi Mir'
          },
          category: 'romance',
          dateAdded: new Date().toISOString(),
          scheduledDate: null,
          isActive: true,
          metadata: {
            theme: 'night',
            difficulty: 'easy',
            audioAvailable: false,
            views: 0,
            shares: 0
          }
        },
        {
          id: generateId(),
          urdu: `محبت کا درس سکھانے والے\nہر دل میں امید جگانے والے\nلفظوں کے جادوگر شاعر\nخوابوں کو حقیقت بنانے والے`,
          hindi: `मोहब्बत का दर्स सिखाने वाले\nहर दिल में उम्मीद जगाने वाले\nशब्दों के जादूगर शायर\nख्वाबों को हकीकत बनाने वाले`,
          english: `Teachers of love's sacred art,\nWho kindle hope in every heart.\nPoets, the wizards of the word,\nMake dreams reality, truth heard.`,
          author: {
            urdu: 'احمد فراز',
            hindi: 'अहमद फराज',
            english: 'Ahmed Faraz'
          },
          category: 'wisdom',
          dateAdded: new Date().toISOString(),
          scheduledDate: null,
          isActive: true,
          metadata: {
            theme: 'poetry',
            difficulty: 'medium',
            audioAvailable: false,
            views: 0,
            shares: 0
          }
        },
        {
          id: generateId(),
          urdu: `ہوا کے جھونکے سے پوچھا\nکیا تم نے دیکھا ہے محبت\nجواب ملا مسکراتے ہوئے\nہاں، پھولوں کی خوشبو میں`,
          hindi: `हवा के झोंके से पूछा\nक्या तुमने देखा है मोहब्बत\nजवाब मिला मुस्कराते हुए\nहां, फूलों की खुशबू में`,
          english: `Asked the breeze so light,\nHave you seen love's sight?\nWith a smile came the reply,\nYes, in flowers' fragrance high.`,
          author: {
            urdu: 'جوش ملیح آبادی',
            hindi: 'जोश मलीहाबादी',
            english: 'Josh Malihabadi'
          },
          category: 'nature',
          dateAdded: new Date().toISOString(),
          scheduledDate: null,
          isActive: true,
          metadata: {
            theme: 'nature',
            difficulty: 'easy',
            audioAvailable: false,
            views: 0,
            shares: 0
          }
        },
        {
          id: generateId(),
          urdu: `خدا کی محبت میں ڈوبا ہوا\nیہ دل ہے کہ ہر وقت مست رہتا ہے\nدنیا کی ہر چیز میں اُس کا جلوہ\nنظر آتا ہے، بس یہی رشتہ ہے`,
          hindi: `खुदा की मोहब्बत में डूबा हुआ\nयह दिल है कि हर वक्त मस्त रहता है\nदुनिया की हर चीज में उसका जलवा\nनजर आता है, बस यही रिश्ता है`,
          english: `Immersed in divine love's grace,\nThis heart stays in blissful space.\nIn everything, His light I see,\nThis bond eternal, strong and free.`,
          author: {
            urdu: 'حالی',
            hindi: 'हाली',
            english: 'Hali'
          },
          category: 'spiritual',
          dateAdded: new Date().toISOString(),
          scheduledDate: null,
          isActive: true,
          metadata: {
            theme: 'divine',
            difficulty: 'medium',
            audioAvailable: false,
            views: 0,
            shares: 0
          }
        }
      ];

      await kv.set('poems:collection', initialPoems);
      
      // Set up daily poem schedule for today
      const today = getCurrentDate();
      const todayKey = `daily_poem:${today}`;
      await kv.set(todayKey, initialPoems[0]);
      
      // Initialize analytics
      await kv.set('analytics:total_views', 0);
      await kv.set('analytics:total_shares', 0);
      await kv.set('email_subscribers', []);
      
      console.log('Initialized poems collection with sample data');
    }

    return c.json({ 
      success: true, 
      message: 'Backend initialized successfully',
      initialized: !existingPoems 
    });
  } catch (error) {
    console.error('Error initializing backend:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Email subscription endpoint
app.post('/make-server-5cd263ef/email/subscribe', async (c) => {
  try {
    const body = await c.req.json();
    const { email, language = 'english' } = body;

    if (!email) {
      return c.json({ 
        success: false, 
        error: 'Email is required' 
      }, 400);
    }

    if (!validateEmail(email)) {
      return c.json({ 
        success: false, 
        error: 'Invalid email format' 
      }, 400);
    }

    // Get existing subscribers
    const subscribers = await kv.get('email_subscribers') || [];
    
    // Check if already subscribed
    const existingSubscriber = subscribers.find(sub => sub.email === email);
    if (existingSubscriber) {
      return c.json({ 
        success: false, 
        error: 'Email already subscribed' 
      }, 409);
    }

    // Add new subscriber
    const newSubscriber = {
      email,
      language,
      subscribedAt: new Date().toISOString(),
      isActive: true
    };

    subscribers.push(newSubscriber);
    await kv.set('email_subscribers', subscribers);

    // Log subscription
    console.log(`New email subscription: ${email} (${language})`);

    // In a real application, you would integrate with an email service here
    // Example integrations:
    // - Mailchimp API
    // - ConvertKit API
    // - SendGrid API
    // - Resend API

    return c.json({ 
      success: true, 
      message: 'Successfully subscribed to daily poetry emails',
      subscriber: newSubscriber
    });
  } catch (error) {
    console.error('Error subscribing email:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Unsubscribe from email
app.post('/make-server-5cd263ef/email/unsubscribe', async (c) => {
  try {
    const body = await c.req.json();
    const { email } = body;

    if (!email) {
      return c.json({ 
        success: false, 
        error: 'Email is required' 
      }, 400);
    }

    const subscribers = await kv.get('email_subscribers') || [];
    const updatedSubscribers = subscribers.map(sub => 
      sub.email === email ? { ...sub, isActive: false, unsubscribedAt: new Date().toISOString() } : sub
    );

    await kv.set('email_subscribers', updatedSubscribers);

    console.log(`Email unsubscribed: ${email}`);

    return c.json({ 
      success: true, 
      message: 'Successfully unsubscribed from daily poetry emails'
    });
  } catch (error) {
    console.error('Error unsubscribing email:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Get email subscribers (admin only)
app.get('/make-server-5cd263ef/email/subscribers', async (c) => {
  try {
    const subscribers = await kv.get('email_subscribers') || [];
    const activeSubscribers = subscribers.filter(sub => sub.isActive);

    return c.json({ 
      success: true, 
      subscribers: activeSubscribers,
      total: activeSubscribers.length,
      totalEverSubscribed: subscribers.length
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Get today's poem with view tracking
app.get('/make-server-5cd263ef/poem/today', async (c) => {
  try {
    const today = getCurrentDate();
    const todayKey = `daily_poem:${today}`;
    
    let todaysPoem = await kv.get(todayKey);
    
    if (!todaysPoem) {
      // If no poem scheduled for today, get a random poem
      const poems = await kv.get('poems:collection') || [];
      const activePoems = poems.filter(p => p.isActive);
      
      if (activePoems.length > 0) {
        const randomIndex = Math.floor(Math.random() * activePoems.length);
        todaysPoem = activePoems[randomIndex];
        // Cache it for today
        await kv.set(todayKey, todaysPoem);
      }
    }

    if (!todaysPoem) {
      return c.json({ success: false, error: 'No poems available' }, 404);
    }

    // Track view
    const poems = await kv.get('poems:collection') || [];
    const poemIndex = poems.findIndex(p => p.id === todaysPoem.id);
    if (poemIndex !== -1) {
      poems[poemIndex].metadata = {
        ...poems[poemIndex].metadata,
        views: (poems[poemIndex].metadata?.views || 0) + 1
      };
      await kv.set('poems:collection', poems);
    }

    // Update global analytics
    const totalViews = await kv.get('analytics:total_views') || 0;
    await kv.set('analytics:total_views', totalViews + 1);

    return c.json({ 
      success: true, 
      poem: todaysPoem,
      date: today
    });
  } catch (error) {
    console.error('Error fetching today\'s poem:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Get all poems with pagination and filtering
app.get('/make-server-5cd263ef/poems', async (c) => {
  try {
    const { page = '1', limit = '50', category, active = 'true', search } = c.req.query();
    
    let poems = await kv.get('poems:collection') || [];
    
    // Apply filters
    if (active === 'true') {
      poems = poems.filter(p => p.isActive);
    }
    
    if (category && category !== 'all') {
      poems = poems.filter(p => p.category?.toLowerCase() === category.toLowerCase());
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      poems = poems.filter(p => 
        p.urdu.toLowerCase().includes(searchLower) ||
        p.hindi.toLowerCase().includes(searchLower) ||
        p.english.toLowerCase().includes(searchLower) ||
        p.author.english.toLowerCase().includes(searchLower) ||
        p.author.hindi.toLowerCase().includes(searchLower) ||
        p.author.urdu.toLowerCase().includes(searchLower) ||
        p.metadata?.theme?.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort by date added (newest first)
    poems.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
    
    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedPoems = poems.slice(startIndex, endIndex);
    
    return c.json({ 
      success: true, 
      poems: paginatedPoems,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: poems.length,
        totalPages: Math.ceil(poems.length / limitNum),
        hasNext: endIndex < poems.length,
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Error fetching poems:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Add a new poem with validation
app.post('/make-server-5cd263ef/poems', async (c) => {
  try {
    const body = await c.req.json();
    
    const { urdu, hindi, english, author, category, metadata } = body;
    
    // Validation
    if (!urdu || !hindi || !english || !author) {
      return c.json({ 
        success: false, 
        error: 'Missing required fields: urdu, hindi, english, author' 
      }, 400);
    }

    if (!author.urdu || !author.hindi || !author.english) {
      return c.json({ 
        success: false, 
        error: 'Author names required in all three languages' 
      }, 400);
    }

    const poems = await kv.get('poems:collection') || [];
    
    const newPoem = {
      id: generateId(),
      urdu: urdu.trim(),
      hindi: hindi.trim(),
      english: english.trim(),
      author: {
        urdu: author.urdu.trim(),
        hindi: author.hindi.trim(),
        english: author.english.trim()
      },
      category: category || 'general',
      dateAdded: new Date().toISOString(),
      scheduledDate: null,
      isActive: true,
      metadata: {
        theme: metadata?.theme || '',
        difficulty: metadata?.difficulty || 'medium',
        audioAvailable: metadata?.audioAvailable || false,
        views: 0,
        shares: 0,
        ...metadata
      }
    };

    poems.push(newPoem);
    await kv.set('poems:collection', poems);

    console.log(`Added new poem: ${newPoem.id} by ${author.english}`);

    return c.json({ 
      success: true, 
      poem: newPoem,
      message: 'Poem added successfully' 
    });
  } catch (error) {
    console.error('Error adding poem:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Update a poem
app.put('/make-server-5cd263ef/poems/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const poems = await kv.get('poems:collection') || [];
    const poemIndex = poems.findIndex(p => p.id === id);
    
    if (poemIndex === -1) {
      return c.json({ success: false, error: 'Poem not found' }, 404);
    }

    // Update poem while preserving important fields
    poems[poemIndex] = {
      ...poems[poemIndex],
      ...body,
      id, // Ensure ID doesn't change
      dateModified: new Date().toISOString(),
      metadata: {
        ...poems[poemIndex].metadata,
        ...body.metadata
      }
    };

    await kv.set('poems:collection', poems);

    console.log(`Updated poem: ${id}`);

    return c.json({ 
      success: true, 
      poem: poems[poemIndex],
      message: 'Poem updated successfully' 
    });
  } catch (error) {
    console.error('Error updating poem:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Delete a poem (soft delete by setting isActive to false)
app.delete('/make-server-5cd263ef/poems/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const { permanent = 'false' } = c.req.query();
    
    const poems = await kv.get('poems:collection') || [];
    
    if (permanent === 'true') {
      // Permanent deletion
      const filteredPoems = poems.filter(p => p.id !== id);
      
      if (filteredPoems.length === poems.length) {
        return c.json({ success: false, error: 'Poem not found' }, 404);
      }
      
      await kv.set('poems:collection', filteredPoems);
      console.log(`Permanently deleted poem: ${id}`);
    } else {
      // Soft delete
      const poemIndex = poems.findIndex(p => p.id === id);
      
      if (poemIndex === -1) {
        return c.json({ success: false, error: 'Poem not found' }, 404);
      }
      
      poems[poemIndex].isActive = false;
      poems[poemIndex].dateDeleted = new Date().toISOString();
      
      await kv.set('poems:collection', poems);
      console.log(`Soft deleted poem: ${id}`);
    }

    return c.json({ 
      success: true, 
      message: permanent === 'true' ? 'Poem permanently deleted' : 'Poem deactivated successfully' 
    });
  } catch (error) {
    console.error('Error deleting poem:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Schedule a poem for a specific date
app.post('/make-server-5cd263ef/schedule', async (c) => {
  try {
    const body = await c.req.json();
    const { poemId, date, overwrite = false } = body;
    
    if (!poemId || !date) {
      return c.json({ 
        success: false, 
        error: 'Missing required fields: poemId, date' 
      }, 400);
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return c.json({ 
        success: false, 
        error: 'Invalid date format. Use YYYY-MM-DD' 
      }, 400);
    }

    const poems = await kv.get('poems:collection') || [];
    const poem = poems.find(p => p.id === poemId);
    
    if (!poem) {
      return c.json({ success: false, error: 'Poem not found' }, 404);
    }

    const dateKey = `daily_poem:${date}`;
    
    // Check if date already has a scheduled poem
    if (!overwrite) {
      const existingPoem = await kv.get(dateKey);
      if (existingPoem) {
        return c.json({ 
          success: false, 
          error: `A poem is already scheduled for ${date}. Use overwrite=true to replace it.` 
        }, 409);
      }
    }

    // Schedule the poem for the specific date
    await kv.set(dateKey, poem);
    
    // Update the poem's scheduled date in the collection
    const poemIndex = poems.findIndex(p => p.id === poemId);
    if (poemIndex !== -1) {
      poems[poemIndex].scheduledDate = date;
      await kv.set('poems:collection', poems);
    }

    console.log(`Scheduled poem ${poemId} for ${date}`);

    return c.json({ 
      success: true, 
      message: `Poem scheduled for ${date}`,
      poem: poem,
      date: date
    });
  } catch (error) {
    console.error('Error scheduling poem:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Get scheduled poems
app.get('/make-server-5cd263ef/schedule', async (c) => {
  try {
    const { startDate, endDate, limit = '30' } = c.req.query();
    
    const scheduledPoems = [];
    const currentDate = new Date();
    const limitNum = parseInt(limit);
    
    // If date range is specified, use it; otherwise show next 30 days
    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date(Date.now() + (limitNum * 24 * 60 * 60 * 1000));
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = getCurrentDateFromDate(d);
      const dateKey = `daily_poem:${dateStr}`;
      const poem = await kv.get(dateKey);
      
      if (poem) {
        scheduledPoems.push({
          date: dateStr,
          poem: poem
        });
      }
    }
    
    return c.json({ 
      success: true, 
      scheduledPoems: scheduledPoems,
      count: scheduledPoems.length
    });
  } catch (error) {
    console.error('Error fetching scheduled poems:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Helper function to format date from Date object
const getCurrentDateFromDate = (date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// Get poem by category
app.get('/make-server-5cd263ef/poems/category/:category', async (c) => {
  try {
    const category = c.req.param('category');
    const { limit = '20', random = 'false' } = c.req.query();
    
    const poems = await kv.get('poems:collection') || [];
    
    let filteredPoems = poems.filter(p => 
      p.category?.toLowerCase() === category.toLowerCase() && p.isActive
    );

    if (random === 'true') {
      // Shuffle array randomly
      for (let i = filteredPoems.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filteredPoems[i], filteredPoems[j]] = [filteredPoems[j], filteredPoems[i]];
      }
    }

    // Apply limit
    const limitNum = parseInt(limit);
    filteredPoems = filteredPoems.slice(0, limitNum);

    return c.json({ 
      success: true, 
      poems: filteredPoems,
      category: category,
      count: filteredPoems.length 
    });
  } catch (error) {
    console.error('Error fetching poems by category:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Get random poem with view tracking
app.get('/make-server-5cd263ef/poem/random', async (c) => {
  try {
    const { category, exclude } = c.req.query();
    
    const poems = await kv.get('poems:collection') || [];
    let activePoems = poems.filter(p => p.isActive);
    
    // Filter by category if specified
    if (category && category !== 'all') {
      activePoems = activePoems.filter(p => p.category?.toLowerCase() === category.toLowerCase());
    }
    
    // Exclude specific poem if specified
    if (exclude) {
      activePoems = activePoems.filter(p => p.id !== exclude);
    }
    
    if (activePoems.length === 0) {
      return c.json({ success: false, error: 'No active poems available' }, 404);
    }

    const randomIndex = Math.floor(Math.random() * activePoems.length);
    const randomPoem = activePoems[randomIndex];

    // Track view
    const poemIndex = poems.findIndex(p => p.id === randomPoem.id);
    if (poemIndex !== -1) {
      poems[poemIndex].metadata = {
        ...poems[poemIndex].metadata,
        views: (poems[poemIndex].metadata?.views || 0) + 1
      };
      await kv.set('poems:collection', poems);
    }

    return c.json({ 
      success: true, 
      poem: randomPoem
    });
  } catch (error) {
    console.error('Error fetching random poem:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Track poem share
app.post('/make-server-5cd263ef/poems/:id/share', async (c) => {
  try {
    const id = c.req.param('id');
    const { platform = 'unknown' } = await c.req.json().catch(() => ({}));
    
    const poems = await kv.get('poems:collection') || [];
    const poemIndex = poems.findIndex(p => p.id === id);
    
    if (poemIndex === -1) {
      return c.json({ success: false, error: 'Poem not found' }, 404);
    }

    // Update poem share count
    poems[poemIndex].metadata = {
      ...poems[poemIndex].metadata,
      shares: (poems[poemIndex].metadata?.shares || 0) + 1
    };
    await kv.set('poems:collection', poems);

    // Update global analytics
    const totalShares = await kv.get('analytics:total_shares') || 0;
    await kv.set('analytics:total_shares', totalShares + 1);

    // Track platform-specific shares
    const platformKey = `analytics:shares:${platform}`;
    const platformShares = await kv.get(platformKey) || 0;
    await kv.set(platformKey, platformShares + 1);

    console.log(`Poem ${id} shared on ${platform}`);

    return c.json({ 
      success: true, 
      message: 'Share tracked successfully',
      shares: poems[poemIndex].metadata.shares
    });
  } catch (error) {
    console.error('Error tracking share:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Get analytics and statistics
app.get('/make-server-5cd263ef/analytics', async (c) => {
  try {
    const poems = await kv.get('poems:collection') || [];
    const totalViews = await kv.get('analytics:total_views') || 0;
    const totalShares = await kv.get('analytics:total_shares') || 0;
    const emailSubscribers = await kv.get('email_subscribers') || [];
    const activeSubscribers = emailSubscribers.filter(sub => sub.isActive);
    
    // Calculate category distribution
    const categoryStats = {};
    const authorStats = {};
    let totalPoems = poems.length;
    let activePoems = 0;
    
    poems.forEach(poem => {
      if (poem.isActive) activePoems++;
      
      // Category stats
      const cat = poem.category || 'general';
      categoryStats[cat] = (categoryStats[cat] || 0) + 1;
      
      // Author stats
      const author = poem.author.english;
      authorStats[author] = (authorStats[author] || 0) + 1;
    });

    // Find most popular poems
    const popularPoems = poems
      .filter(p => p.isActive)
      .sort((a, b) => {
        const aViews = a.metadata?.views || 0;
        const bViews = b.metadata?.views || 0;
        return bViews - aViews;
      })
      .slice(0, 5)
      .map(p => ({
        id: p.id,
        title: p.english.substring(0, 50) + '...',
        author: p.author.english,
        views: p.metadata?.views || 0,
        shares: p.metadata?.shares || 0
      }));

    return c.json({
      success: true,
      analytics: {
        overview: {
          totalPoems,
          activePoems,
          inactivePoems: totalPoems - activePoems,
          totalViews,
          totalShares,
          avgViewsPerPoem: activePoems > 0 ? Math.round(totalViews / activePoems) : 0,
          emailSubscribers: activeSubscribers.length,
          totalSubscribersEver: emailSubscribers.length
        },
        categories: categoryStats,
        authors: authorStats,
        popularPoems,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Search poems
app.get('/make-server-5cd263ef/search', async (c) => {
  try {
    const { q, category, author, language = 'all', limit = '20' } = c.req.query();
    
    if (!q || q.length < 2) {
      return c.json({ 
        success: false, 
        error: 'Search query must be at least 2 characters long' 
      }, 400);
    }

    const poems = await kv.get('poems:collection') || [];
    const searchLower = q.toLowerCase();
    
    let results = poems.filter(poem => {
      if (!poem.isActive) return false;
      
      let matches = false;
      
      // Search in content based on language preference
      if (language === 'all' || language === 'urdu') {
        matches = matches || poem.urdu.toLowerCase().includes(searchLower);
      }
      if (language === 'all' || language === 'hindi') {
        matches = matches || poem.hindi.toLowerCase().includes(searchLower);
      }
      if (language === 'all' || language === 'english') {
        matches = matches || poem.english.toLowerCase().includes(searchLower);
      }
      
      // Search in authors
      matches = matches || 
        poem.author.english.toLowerCase().includes(searchLower) ||
        poem.author.hindi.toLowerCase().includes(searchLower) ||
        poem.author.urdu.toLowerCase().includes(searchLower);
      
      // Search in metadata
      matches = matches || poem.metadata?.theme?.toLowerCase().includes(searchLower);
      
      return matches;
    });

    // Apply additional filters
    if (category && category !== 'all') {
      results = results.filter(p => p.category?.toLowerCase() === category.toLowerCase());
    }
    
    if (author) {
      const authorLower = author.toLowerCase();
      results = results.filter(p => 
        p.author.english.toLowerCase().includes(authorLower) ||
        p.author.hindi.toLowerCase().includes(authorLower) ||
        p.author.urdu.toLowerCase().includes(authorLower)
      );
    }

    // Sort by relevance (simple scoring based on position of match)
    results.sort((a, b) => {
      const aScore = getRelevanceScore(a, searchLower);
      const bScore = getRelevanceScore(b, searchLower);
      return bScore - aScore;
    });

    // Apply limit
    const limitNum = parseInt(limit);
    results = results.slice(0, limitNum);

    return c.json({
      success: true,
      results,
      query: q,
      count: results.length,
      filters: { category, author, language }
    });
  } catch (error) {
    console.error('Error searching poems:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Helper function for search relevance scoring
const getRelevanceScore = (poem, searchLower) => {
  let score = 0;
  
  // Higher score for matches in title/first line
  const firstLines = [
    poem.urdu.split('\n')[0],
    poem.hindi.split('\n')[0],
    poem.english.split('\n')[0]
  ];
  
  firstLines.forEach(line => {
    if (line.toLowerCase().includes(searchLower)) {
      score += 10;
    }
  });
  
  // Medium score for author matches
  [poem.author.english, poem.author.hindi, poem.author.urdu].forEach(author => {
    if (author.toLowerCase().includes(searchLower)) {
      score += 5;
    }
  });
  
  // Lower score for content matches
  [poem.urdu, poem.hindi, poem.english].forEach(content => {
    if (content.toLowerCase().includes(searchLower)) {
      score += 1;
    }
  });
  
  // Bonus for exact matches
  if (poem.english.toLowerCase() === searchLower || 
      poem.hindi.toLowerCase() === searchLower || 
      poem.urdu.toLowerCase() === searchLower) {
    score += 20;
  }
  
  return score;
};

// Get available categories
app.get('/make-server-5cd263ef/categories', async (c) => {
  try {
    const poems = await kv.get('poems:collection') || [];
    const categories = new Set();
    
    poems.forEach(poem => {
      if (poem.isActive && poem.category) {
        categories.add(poem.category);
      }
    });
    
    const categoryList = Array.from(categories).sort();
    
    return c.json({
      success: true,
      categories: categoryList,
      count: categoryList.length
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Health check with system info
app.get('/make-server-5cd263ef/health', async (c) => {
  try {
    const poems = await kv.get('poems:collection') || [];
    const totalViews = await kv.get('analytics:total_views') || 0;
    const emailSubscribers = await kv.get('email_subscribers') || [];
    const activeSubscribers = emailSubscribers.filter(sub => sub.isActive);
    
    return c.json({ 
      success: true, 
      message: 'Rozana Shayari backend is running',
      timestamp: new Date().toISOString(),
      system: {
        totalPoems: poems.length,
        activePoems: poems.filter(p => p.isActive).length,
        totalViews: totalViews,
        emailSubscribers: activeSubscribers.length,
        uptime: 'Backend operational',
        version: '2.1.0'
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    return c.json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Start server
Deno.serve(app.fetch);