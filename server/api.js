import { getDb, saveDb } from './db.js';
import { broadcast } from './ws.js';

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, data, statusCode = 200) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-id'
  });
  res.end(JSON.stringify(data));
}

export async function handleApiRequest(req, res, next) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  const method = req.method;

  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-id'
    });
    return res.end();
  }

  if (!pathname.startsWith('/api')) {
    return next();
  }

  const db = getDb();
  const currentUserId = req.headers['x-user-id'] || url.searchParams.get('userId') || 'user-aditya';

  try {
    // ------------------------------------------------------------------------
    // USERS
    // ------------------------------------------------------------------------
    if (pathname === '/api/users' && method === 'GET') {
      return sendJson(res, db.users);
    }

    if (pathname.startsWith('/api/users/') && method === 'GET') {
      const id = pathname.replace('/api/users/', '');
      const user = db.users.find(u => u.id === id);
      if (!user) return sendJson(res, { error: 'User not found' }, 404);
      return sendJson(res, user);
    }

    if (pathname.startsWith('/api/users/') && method === 'PUT') {
      const id = pathname.replace('/api/users/', '');
      const body = await parseBody(req);
      const userIndex = db.users.findIndex(u => u.id === id);
      if (userIndex === -1) return sendJson(res, { error: 'User not found' }, 404);

      db.users[userIndex] = { ...db.users[userIndex], ...body, id };
      saveDb(db);
      broadcast({ type: 'USER_UPDATED', user: db.users[userIndex] });
      return sendJson(res, db.users[userIndex]);
    }

    // ------------------------------------------------------------------------
    // CLUBS
    // ------------------------------------------------------------------------
    if (pathname === '/api/clubs' && method === 'GET') {
      const clubsWithDetails = db.clubs.map(c => ({
        ...c,
        memberCount: (c.members || []).length,
        isMember: (c.members || []).includes(currentUserId)
      }));
      return sendJson(res, clubsWithDetails);
    }

    if (pathname.match(/^\/api\/clubs\/[^/]+\/toggle$/) && method === 'POST') {
      const clubId = pathname.split('/')[3];
      const club = db.clubs.find(c => c.id === clubId);
      if (!club) return sendJson(res, { error: 'Club not found' }, 404);

      if (!club.members) club.members = [];
      const user = db.users.find(u => u.id === currentUserId);
      const isMember = club.members.includes(currentUserId);

      if (isMember) {
        club.members = club.members.filter(m => m !== currentUserId);
        if (user && user.clubs) {
          user.clubs = user.clubs.filter(cn => cn !== club.name);
        }
      } else {
        club.members.push(currentUserId);
        if (user) {
          if (!user.clubs) user.clubs = [];
          if (!user.clubs.includes(club.name)) user.clubs.push(club.name);
        }
      }

      saveDb(db);
      broadcast({ type: 'CLUB_UPDATED', clubId, memberCount: club.members.length });
      broadcast({ type: 'USER_UPDATED', user });
      return sendJson(res, { success: true, isMember: !isMember, memberCount: club.members.length, clubs: user ? user.clubs : [] });
    }

    // ------------------------------------------------------------------------
    // ANNOUNCEMENTS
    // ------------------------------------------------------------------------
    if (pathname === '/api/announcements' && method === 'GET') {
      const userBookmarks = (db.bookmarks && db.bookmarks[currentUserId]) || [];
      const userRsvps = (db.rsvps && db.rsvps[currentUserId]) || [];

      // Add dynamic fields
      const notices = db.announcements.map(ann => {
        const apps = (db.applications || []).filter(a => a.itemId === ann.id);
        const myApp = apps.find(a => a.applicantId === currentUserId);
        return {
          ...ann,
          isBookmarked: userBookmarks.includes(ann.id),
          hasRsvpd: userRsvps.includes(ann.id),
          applicantCount: apps.length,
          myApplicationStatus: myApp ? myApp.status : null,
          isMine: ann.authorId === currentUserId
        };
      });

      return sendJson(res, notices);
    }

    if (pathname === '/api/announcements' && method === 'POST') {
      const body = await parseBody(req);
      const user = db.users.find(u => u.id === currentUserId) || db.users[0];

      const newNotice = {
        id: `ann-${Date.now()}`,
        authorId: user.id,
        title: body.title || 'Untitled Notice',
        category: body.category || 'vacancies',
        categoryLabel: body.isClubOnly ? 'Club Exclusive' : (body.category === 'vacancies' ? 'Club Vacancy' : 'Notice'),
        isVacancy: body.category === 'vacancies',
        accentColor: body.isClubOnly ? '#ec4899' : (body.category === 'vacancies' ? '#f59e0b' : '#8b5cf6'),
        icon: body.isClubOnly ? 'lock' : (body.category === 'vacancies' ? 'briefcase' : 'sparkles'),
        compensation: body.compensation || '500 KP Credit',
        bountyKarma: parseInt(body.bountyKarma, 10) || 500,
        clubName: body.clubName || undefined,
        isClubOnly: Boolean(body.isClubOnly && body.clubName),
        openPositions: parseInt(body.openPositions, 10) || (body.category === 'vacancies' ? 3 : undefined),
        claimedPositions: 0,
        organizer: {
          id: user.id,
          name: body.organizer || user.name,
          role: body.clubName ? `${body.clubName} Lead` : (user.role || 'Student Organizer'),
          avatarLetter: (body.organizer || user.name).substring(0, 2).toUpperCase(),
          accent: user.accent || '#6366f1'
        },
        publishedAt: new Date().toISOString(),
        summary: body.summary || '',
        content: body.content || '',
        tags: Array.isArray(body.tags) ? body.tags : (body.tags ? body.tags.split(',').map(t => t.trim()) : ['Campus']),
        rsvps: 0,
        location: body.location || 'Campus Center'
      };

      db.announcements.unshift(newNotice);
      saveDb(db);
      broadcast({ type: 'EVENT_NEW_ANNOUNCEMENT', announcement: newNotice });
      return sendJson(res, newNotice, 201);
    }

    if (pathname.startsWith('/api/announcements/') && method === 'DELETE') {
      const id = pathname.replace('/api/announcements/', '');
      db.announcements = db.announcements.filter(a => a.id !== id);
      saveDb(db);
      broadcast({ type: 'EVENT_ANNOUNCEMENT_DELETED', announcementId: id });
      return sendJson(res, { success: true, id });
    }

    if (pathname.match(/^\/api\/announcements\/[^/]+\/rsvp$/) && method === 'POST') {
      const annId = pathname.split('/')[3];
      const ann = db.announcements.find(a => a.id === annId);
      if (!ann) return sendJson(res, { error: 'Announcement not found' }, 404);

      if (!db.rsvps) db.rsvps = {};
      if (!db.rsvps[currentUserId]) db.rsvps[currentUserId] = [];

      const rsvpList = db.rsvps[currentUserId];
      const hasRsvpd = rsvpList.includes(annId);

      if (hasRsvpd) {
        db.rsvps[currentUserId] = rsvpList.filter(id => id !== annId);
        ann.rsvps = Math.max(0, (ann.rsvps || 1) - 1);
      } else {
        db.rsvps[currentUserId].push(annId);
        ann.rsvps = (ann.rsvps || 0) + 1;
      }

      saveDb(db);
      broadcast({ type: 'EVENT_ANNOUNCEMENT_UPDATED', announcementId: annId, rsvps: ann.rsvps });
      return sendJson(res, { hasRsvpd: !hasRsvpd, rsvps: ann.rsvps });
    }

    if (pathname.match(/^\/api\/announcements\/[^/]+\/bookmark$/) && method === 'POST') {
      const annId = pathname.split('/')[3];
      if (!db.bookmarks) db.bookmarks = {};
      if (!db.bookmarks[currentUserId]) db.bookmarks[currentUserId] = [];

      const list = db.bookmarks[currentUserId];
      const isBookmarked = list.includes(annId);

      if (isBookmarked) {
        db.bookmarks[currentUserId] = list.filter(id => id !== annId);
      } else {
        db.bookmarks[currentUserId].push(annId);
      }

      saveDb(db);
      return sendJson(res, { isBookmarked: !isBookmarked });
    }

    // ------------------------------------------------------------------------
    // REELS / FEELS
    // ------------------------------------------------------------------------
    if (pathname === '/api/reels' && method === 'GET') {
      return sendJson(res, db.reels || []);
    }

    if (pathname === '/api/reels' && method === 'POST') {
      const body = await parseBody(req);
      const user = db.users.find(u => u.id === currentUserId) || db.users[0];

      const newReel = {
        id: `feel-${Date.now()}`,
        authorId: user.id,
        title: body.title,
        clientName: body.clientName || user.name,
        clientRole: user.role || 'Campus Lead',
        avatarLetter: (body.clientName || user.name).substring(0, 2).toUpperCase(),
        problemStatement: body.problemStatement,
        skillsRequired: body.skillsRequired || ['General'],
        bountyKarma: parseInt(body.bountyKarma, 10) || 1200,
        bountyCash: body.bountyCash || '₹3,000',
        deadline: body.deadline || 'Weekend Sprint',
        urgency: body.urgency || 'Open Opportunity',
        slotsAvailable: parseInt(body.slotsAvailable, 10) || 2,
        likesCount: 0,
        claimedBy: []
      };

      if (!db.reels) db.reels = [];
      db.reels.unshift(newReel);
      saveDb(db);
      broadcast({ type: 'EVENT_NEW_REEL', reel: newReel });
      return sendJson(res, newReel, 201);
    }

    // ------------------------------------------------------------------------
    // APPLICATIONS LIFECYCLE
    // ------------------------------------------------------------------------
    if (pathname === '/api/applications' && method === 'GET') {
      const itemId = url.searchParams.get('itemId');
      let apps = db.applications || [];

      if (itemId) {
        apps = apps.filter(a => a.itemId === itemId);
      } else if (url.searchParams.get('role') === 'organizer') {
        // Find all announcements or reels created by current user
        const myNoticeIds = (db.announcements || []).filter(a => a.authorId === currentUserId).map(a => a.id);
        const myReelIds = (db.reels || []).filter(r => r.authorId === currentUserId).map(r => r.id);
        const myItemIds = new Set([...myNoticeIds, ...myReelIds]);
        apps = apps.filter(a => myItemIds.has(a.itemId));
      } else if (url.searchParams.get('role') === 'mine') {
        apps = apps.filter(a => a.applicantId === currentUserId);
      }

      return sendJson(res, apps);
    }

    if (pathname === '/api/applications' && method === 'POST') {
      const body = await parseBody(req);
      const user = db.users.find(u => u.id === currentUserId) || db.users[0];

      // Check if already applied
      const existing = (db.applications || []).find(a => a.itemId === body.itemId && a.applicantId === user.id);
      if (existing) {
        return sendJson(res, { error: 'Already applied', application: existing }, 400);
      }

      // Find item details
      let item = (db.announcements || []).find(a => a.id === body.itemId);
      let itemType = 'announcement';
      if (!item) {
        item = (db.reels || []).find(r => r.id === body.itemId);
        itemType = 'feel';
      }

      const organizerId = item ? (item.authorId || (item.organizer && item.organizer.id)) : null;

      const newApp = {
        id: `app-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        itemId: body.itemId,
        itemTitle: item ? item.title : (body.title || 'Campus Gig'),
        itemType,
        organizerId: organizerId || 'user-kavya',
        organizerName: item && item.organizer ? item.organizer.name : (item ? item.clientName : 'Council Organizer'),
        applicantId: user.id,
        applicantName: user.name,
        applicantHandle: user.handle,
        applicantStudentId: user.studentId,
        applicantDepartment: user.department,
        applicantAvatar: user.avatarLetter,
        pitch: body.pitch || 'Interested in contributing!',
        bountyKarma: item ? (item.bountyKarma || 500) : 500,
        compensation: item ? (item.compensation || (item.bountyKarma ? `+${item.bountyKarma} KP` : 'Karma Credit')) : 'Karma Credit',
        status: 'pending', // 'pending' | 'accepted' | 'rejected' | 'completed'
        appliedAt: new Date().toISOString()
      };

      if (!db.applications) db.applications = [];
      db.applications.unshift(newApp);

      // Increment claimed positions if vacancy
      if (item && item.isVacancy && item.claimedPositions !== undefined) {
        item.claimedPositions = Math.min(item.openPositions || 99, (item.claimedPositions || 0) + 1);
      }

      saveDb(db);

      // Notify organizer and update all clients
      broadcast({
        type: 'EVENT_NEW_APPLICATION',
        application: newApp,
        organizerId: newApp.organizerId
      });

      return sendJson(res, newApp, 201);
    }

    if (pathname.match(/^\/api\/applications\/[^/]+\/status$/) && method === 'PATCH') {
      const appId = pathname.split('/')[3];
      const body = await parseBody(req);
      const appIndex = (db.applications || []).findIndex(a => a.id === appId);

      if (appIndex === -1) {
        return sendJson(res, { error: 'Application not found' }, 404);
      }

      const app = db.applications[appIndex];
      const prevStatus = app.status;
      const newStatus = body.status; // 'accepted' | 'rejected' | 'completed'
      app.status = newStatus;
      app.reviewedAt = new Date().toISOString();

      let karmaAwarded = 0;

      // Handle ACCEPTED
      if (newStatus === 'accepted' && prevStatus !== 'accepted') {
        // Automatically ensure conversation exists between organizer and applicant
        if (!db.conversations) db.conversations = [];
        let conv = db.conversations.find(c =>
          c.participants &&
          c.participants.includes(app.applicantId) &&
          c.participants.includes(app.organizerId)
        );

        if (!conv) {
          const applicant = db.users.find(u => u.id === app.applicantId);
          const organizer = db.users.find(u => u.id === app.organizerId);

          conv = {
            id: `conv-${Date.now()}`,
            participants: [app.applicantId, app.organizerId],
            topicContext: app.itemTitle,
            partnerId: app.applicantId,
            partnerName: applicant ? applicant.name : 'Applicant',
            partnerTitle: applicant ? applicant.role : 'Student',
            avatarLetter: applicant ? applicant.avatarLetter : 'ST',
            accent: applicant ? applicant.accent : '#6366f1',
            isOnline: true,
            lastSeen: 'Online',
            messages: [
              {
                id: `m-${Date.now()}`,
                senderId: app.organizerId,
                senderName: organizer ? organizer.name : 'Organizer',
                text: `Congratulations! Your application for "${app.itemTitle}" has been accepted. Let's coordinate here.`,
                timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
              }
            ]
          };
          db.conversations.unshift(conv);
        }
      }

      // Handle COMPLETED -> Award Karma Points
      if (newStatus === 'completed' && prevStatus !== 'completed') {
        karmaAwarded = app.bountyKarma || 500;
        const applicant = db.users.find(u => u.id === app.applicantId);

        if (applicant) {
          applicant.karmaPoints = (applicant.karmaPoints || 0) + karmaAwarded;

          // Record in Karma ledger
          if (!db.karmaLedger) db.karmaLedger = [];
          db.karmaLedger.unshift({
            id: `tx-${Date.now()}`,
            userId: applicant.id,
            amount: karmaAwarded,
            type: 'credit',
            reason: `Gig Completed: ${app.itemTitle}`,
            relatedItemId: app.itemId,
            timestamp: new Date().toISOString()
          });
        }
      }

      saveDb(db);

      broadcast({
        type: 'EVENT_APPLICATION_UPDATED',
        application: app,
        karmaAwarded,
        applicantId: app.applicantId
      });

      return sendJson(res, { success: true, application: app, karmaAwarded });
    }

    // ------------------------------------------------------------------------
    // CONVERSATIONS & CHAT
    // ------------------------------------------------------------------------
    if (pathname === '/api/conversations' && method === 'GET') {
      const convs = (db.conversations || []).filter(c =>
        c.participants && c.participants.includes(currentUserId)
      );

      // Enhance with partner profile details for the requesting user
      const enhanced = convs.map(c => {
        const partnerId = c.participants.find(p => p !== currentUserId) || currentUserId;
        const partner = db.users.find(u => u.id === partnerId);
        return {
          ...c,
          partnerId,
          partnerName: partner ? partner.name : (c.partnerName || 'Peer Student'),
          partnerTitle: partner ? partner.role : (c.partnerTitle || 'Campus Member'),
          avatarLetter: partner ? partner.avatarLetter : (c.avatarLetter || 'ST'),
          accent: partner ? partner.accent : (c.accent || '#6366f1'),
          unreadCount: (c.messages || []).filter(m => m.senderId !== currentUserId && !m.read).length
        };
      });

      return sendJson(res, enhanced);
    }

    if (pathname === '/api/conversations' && method === 'POST') {
      const body = await parseBody(req);
      const recipientId = body.recipientId;
      const topicContext = body.topicContext || 'Campus Interaction';

      if (!recipientId) return sendJson(res, { error: 'Recipient required' }, 400);

      if (!db.conversations) db.conversations = [];
      let conv = db.conversations.find(c =>
        c.participants &&
        c.participants.includes(currentUserId) &&
        c.participants.includes(recipientId)
      );

      if (!conv) {
        const partner = db.users.find(u => u.id === recipientId);
        conv = {
          id: `conv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          participants: [currentUserId, recipientId],
          topicContext,
          isOnline: true,
          lastSeen: 'Active recently',
          messages: []
        };
        db.conversations.unshift(conv);
        saveDb(db);
        broadcast({ type: 'EVENT_CONVERSATION_CREATED', conversation: conv });
      }

      return sendJson(res, conv);
    }

    if (pathname.match(/^\/api\/conversations\/[^/]+\/messages$/) && method === 'POST') {
      const convId = pathname.split('/')[3];
      const body = await parseBody(req);
      const conv = (db.conversations || []).find(c => c.id === convId);

      if (!conv) return sendJson(res, { error: 'Conversation not found' }, 404);

      const sender = db.users.find(u => u.id === currentUserId) || { name: 'User', avatarLetter: 'U' };
      const newMsg = {
        id: `m-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        senderId: currentUserId,
        senderName: sender.name,
        text: body.text,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        read: false
      };

      if (!conv.messages) conv.messages = [];
      conv.messages.push(newMsg);
      saveDb(db);

      broadcast({
        type: 'EVENT_NEW_MESSAGE',
        conversationId: convId,
        message: newMsg,
        participants: conv.participants
      });

      return sendJson(res, newMsg, 201);
    }

    // ------------------------------------------------------------------------
    // KARMA LEDGER & DYNAMIC TELEMETRY
    // ------------------------------------------------------------------------
    if (pathname === '/api/karma/ledger' && method === 'GET') {
      const txs = (db.karmaLedger || []).filter(tx => tx.userId === currentUserId);
      return sendJson(res, txs);
    }

    if (pathname === '/api/telemetry' && method === 'GET') {
      const user = db.users.find(u => u.id === currentUserId) || db.users[0];
      const userTxs = (db.karmaLedger || []).filter(tx => tx.userId === currentUserId);
      const userApps = (db.applications || []).filter(a => a.applicantId === currentUserId);
      const userJoinedClubs = (db.clubs || []).filter(c => (c.members || []).includes(currentUserId));

      // Calculate 7-day velocity
      const now = Date.now();
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const dailyPoints = [0, 0, 0, 0, 0, 0, 0];

      let weekTotal = 0;
      let peakGain = 0;
      let peakDay = 'Friday';

      userTxs.forEach(tx => {
        const txTime = new Date(tx.timestamp).getTime();
        const diffDays = Math.floor((now - txTime) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays < 7) {
          const idx = 6 - diffDays; // 0 is 6 days ago, 6 is today
          dailyPoints[idx] += tx.amount;
          weekTotal += tx.amount;
          if (tx.amount > peakGain) {
            peakGain = tx.amount;
            peakDay = days[idx] || 'Today';
          }
        }
      });

      // Default baseline curve if brand new
      if (weekTotal === 0) {
        weekTotal = 605;
        peakGain = 180;
        peakDay = 'Friday';
      }

      // Dynamic ranks
      const allUsersSorted = [...db.users].sort((a, b) => (b.karmaPoints || 0) - (a.karmaPoints || 0));
      const rankIdx = allUsersSorted.findIndex(u => u.id === currentUserId);
      const percentile = rankIdx === -1 ? 4 : Math.max(1, Math.round(((rankIdx + 1) / allUsersSorted.length) * 10));

      const activeAppsCount = userApps.filter(a => a.status === 'pending' || a.status === 'accepted').length;
      const completedCount = userApps.filter(a => a.status === 'completed').length;
      const totalContributions = completedCount + userTxs.length;

      return sendJson(res, {
        karmaPoints: user.karmaPoints || 1250,
        weekTotal,
        peakGain,
        peakDay,
        campusRank: `Top ${percentile}%`,
        activeApplications: activeAppsCount,
        totalContributions: totalContributions || 5,
        scores: {
          hackathons: 9.2,
          guilds: 8.8 + Math.min(1.0, userJoinedClubs.length * 0.2),
          bounties: 9.5
        },
        dailyPoints
      });
    }

    return sendJson(res, { error: 'Not found' }, 404);

  } catch (err) {
    console.error('API Error:', err);
    return sendJson(res, { error: err.message }, 500);
  }
}
