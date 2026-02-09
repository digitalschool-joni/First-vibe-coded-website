import { Opportunity, OpportunityType, Category, UserProfile, Application, ApplicationStatus, User, UserRole, Notification } from '../types';

// --- MOCK DATA ---

// Mock Company ID
const COMPANY_USER_ID = 500;

let MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 1,
    title: "Future Coders Scholarship",
    organization: "TechForGood Foundation",
    type: OpportunityType.SCHOLARSHIP,
    category: Category.TECH,
    location: "Remote",
    is_remote: true,
    stipend_amount: 5000,
    deadline: "2024-12-31",
    description: "A scholarship for underrepresented youth interested in software engineering. Includes mentorship.",
    requirements: ["High school student or equivalent", "Interest in CS", "3.0 GPA or higher"],
    posted_at: "2024-01-15",
    logo_color: "bg-blue-500",
    posted_by_user_id: 900 // Admin
  },
  {
    id: 2,
    title: "Junior Graphic Design Intern",
    organization: "Creative Studio X",
    type: OpportunityType.INTERNSHIP,
    category: Category.ARTS,
    location: "New York, NY",
    is_remote: false,
    stipend_amount: 2500,
    deadline: "2024-06-15",
    description: "Paid internship for aspiring designers to work on real client projects. Adobe Suite proficiency required.",
    requirements: ["Portfolio required", "Adobe Illustrator & Photoshop", "Available for 3 months"],
    posted_at: "2024-02-01",
    logo_color: "bg-purple-500",
    logo_url: "https://images.unsplash.com/photo-1626785774573-4b799312c95d?auto=format&fit=crop&q=80&w=200&h=200",
    posted_by_user_id: COMPANY_USER_ID
  },
  {
    id: 3,
    title: "Welding Apprenticeship",
    organization: "IronWorks Union",
    type: OpportunityType.APPRENTICESHIP,
    category: Category.TRADES,
    location: "Chicago, IL",
    is_remote: false,
    stipend_amount: 4000,
    deadline: "2024-08-01",
    description: "Hands-on apprenticeship learning modern welding techniques. Path to full certification.",
    requirements: ["High school diploma/GED", "Physical stamina", "Detail oriented"],
    posted_at: "2024-03-10",
    logo_color: "bg-orange-600",
    posted_by_user_id: 900
  },
  {
    id: 4,
    title: "AI & Ethics Workshop",
    organization: "OpenAI Learning",
    type: OpportunityType.WORKSHOP,
    category: Category.TECH,
    location: "Remote",
    is_remote: true,
    stipend_amount: 0,
    deadline: "2024-05-20",
    description: "Weekend workshop exploring the ethical implications of artificial intelligence.",
    requirements: ["No coding experience needed", "Interest in philosophy or tech"],
    posted_at: "2024-04-05",
    logo_color: "bg-emerald-500",
    logo_url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=200&h=200",
    posted_by_user_id: COMPANY_USER_ID
  },
  {
    id: 5,
    title: "Community Garden Coordinator",
    organization: "Green City",
    type: OpportunityType.JOB,
    category: Category.COMMUNITY,
    location: "Portland, OR",
    is_remote: false,
    stipend_amount: 3200,
    deadline: "2024-05-01",
    description: "Entry level position managing volunteers and garden beds.",
    requirements: ["Experience with gardening", "Leadership skills", "Weekend availability"],
    posted_at: "2024-02-20",
    logo_color: "bg-green-600",
    posted_by_user_id: 900
  },
  {
    id: 6,
    title: "STEM University Grant",
    organization: "National Science Board",
    type: OpportunityType.SCHOLARSHIP,
    category: Category.ACADEMIC,
    location: "Remote",
    is_remote: true,
    stipend_amount: 10000,
    deadline: "2024-11-15",
    description: "Grant for high school seniors pursuing STEM degrees.",
    requirements: ["Accepted to 4-year university", "STEM Major", "Essay required"],
    posted_at: "2023-12-01",
    logo_color: "bg-indigo-600",
    posted_by_user_id: 900
  },
  {
    id: 7,
    title: "Frontend React Bootcamp",
    organization: "Code Academy",
    type: OpportunityType.WORKSHOP,
    category: Category.TECH,
    location: "San Francisco, CA",
    is_remote: false,
    stipend_amount: 0,
    deadline: "2024-07-10",
    description: "Intensive 2-week bootcamp for React and TypeScript. Scholarship available for tuition.",
    requirements: ["Basic HTML/CSS knowledge", "Laptop required"],
    posted_at: "2024-04-01",
    logo_color: "bg-sky-500",
    logo_url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=200&h=200",
    posted_by_user_id: 900
  },
  {
    id: 8,
    title: "Digital Music Production Mentorship",
    organization: "SoundWave",
    type: OpportunityType.MENTORSHIP,
    category: Category.ARTS,
    location: "Remote",
    is_remote: true,
    stipend_amount: 500,
    deadline: "2024-09-01",
    description: "One-on-one mentorship with industry producers. Learn Logic Pro and mixing.",
    requirements: ["Submit 1 demo track", "Passion for music"],
    posted_at: "2024-03-15",
    logo_color: "bg-pink-500",
    posted_by_user_id: 900
  }
];

// --- AUTH MOCK ---

let USERS: User[] = [
  { id: 101, name: "Alex Rivera", email: "alex@example.com", role: 'seeker', hasSeenOnboarding: false },
  { id: 102, name: "Sarah Chen", email: "sarah@example.com", role: 'seeker', hasSeenOnboarding: true },
  { id: 900, name: "Admin User", email: "admin@example.com", role: 'admin', hasSeenOnboarding: true },
  { id: COMPANY_USER_ID, name: "Creative Studio HR", email: "company@example.com", role: 'company', hasSeenOnboarding: true }
];

let currentUserProfile: UserProfile = {
  id: 101,
  user_id: 101,
  name: "Alex Rivera",
  email: "alex@example.com",
  bio: "Passionate learner looking for opportunities in technology and design. I love building things and solving problems.",
  skills: ["HTML", "CSS", "JavaScript", "Communication"],
  experience: [
    { role: "Volunteer", company: "Local Library", duration: "Summer 2023" }
  ]
};

// In-memory store for applications with SEED DATA
let myApplications: Application[] = [
  {
    id: 1,
    opportunity_id: 1,
    opportunity: MOCK_OPPORTUNITIES[0], // Future Coders
    user_id: 101,
    status: ApplicationStatus.APPLIED,
    applied_at: "2024-05-10T10:00:00Z"
  },
  {
    id: 2,
    opportunity_id: 2,
    opportunity: MOCK_OPPORTUNITIES[1], // Design Intern
    user_id: 102, // Sarah
    status: ApplicationStatus.REVIEWING,
    applied_at: "2024-05-12T14:30:00Z"
  }
];

// Mock Notifications (Emails)
let NOTIFICATIONS: Notification[] = [
    {
        id: 1,
        user_id: 101,
        title: "Welcome to OpportunityBridge",
        message: "We're glad to have you here! Complete your profile to get better recommendations.",
        is_read: false,
        created_at: "2024-05-09T09:00:00Z",
        type: 'info'
    },
    {
        id: 2,
        user_id: 101,
        title: "Application Received",
        message: "Your application for 'Future Coders Scholarship' has been received successfully.",
        is_read: true,
        created_at: "2024-05-10T10:05:00Z",
        type: 'success'
    }
];

// --- HELPER: Send Notification ---
export const createNotification = (userId: number, title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const newNotif: Notification = {
        id: Math.floor(Math.random() * 100000),
        user_id: userId,
        title,
        message,
        is_read: false,
        created_at: new Date().toISOString(),
        type
    };
    NOTIFICATIONS = [newNotif, ...NOTIFICATIONS];
    return newNotif;
};

// --- AUTH API ---

export const login = async (email: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (user) {
                resolve(user);
            } else {
                // Auto-signup logic
                if(email.includes('admin')) {
                   reject("Invalid admin credentials");
                } else if (email.includes('company')) {
                    reject("Invalid company credentials. Try company@example.com");
                } else {
                   const newUser: User = { 
                       id: Math.floor(Math.random() * 10000), 
                       name: email.split('@')[0], 
                       email, 
                       role: 'seeker',
                       hasSeenOnboarding: false 
                    };
                   USERS.push(newUser);
                   currentUserProfile = { ...currentUserProfile, id: newUser.id, user_id: newUser.id, name: newUser.name, email: newUser.email, bio: '', skills: [], experience: [] };
                   createNotification(newUser.id, "Welcome to OpportunityBridge!", "Explore thousands of opportunities tailored for you.", 'info');
                   resolve(newUser);
                }
            }
        }, 800);
    });
};

export const completeOnboarding = async (userId: number): Promise<void> => {
    const user = USERS.find(u => u.id === userId);
    if(user) user.hasSeenOnboarding = true;
};

// --- DATA API ---

export const executeMockQuery = async (
  sqlString: string, 
  filterCriteria: Partial<Opportunity> & { minStipend?: number, anyKeyword?: string }
): Promise<Opportunity[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let results = MOCK_OPPORTUNITIES.filter(opp => {
        let match = true;
        if (filterCriteria.type && opp.type !== filterCriteria.type) match = false;
        if (filterCriteria.category && opp.category !== filterCriteria.category) match = false;
        if (filterCriteria.is_remote !== undefined && opp.is_remote !== filterCriteria.is_remote) match = false;
        if (filterCriteria.minStipend !== undefined && opp.stipend_amount < filterCriteria.minStipend) match = false;
        
        // Handle posted_by_user_id for company filtering explicitly
        if (filterCriteria.posted_by_user_id !== undefined && opp.posted_by_user_id !== filterCriteria.posted_by_user_id) match = false;

        if (filterCriteria.anyKeyword) {
          const keyword = filterCriteria.anyKeyword.toLowerCase();
          const content = (opp.title + opp.description + opp.organization).toLowerCase();
          if (!content.includes(keyword)) match = false;
        }
        return match;
      });
      resolve(results);
    }, 600); 
  });
};

export const getAllOpportunities = async (): Promise<Opportunity[]> => {
  return new Promise(resolve => setTimeout(() => resolve([...MOCK_OPPORTUNITIES]), 300));
};

export const getCompanyOpportunities = async (companyUserId: number): Promise<Opportunity[]> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_OPPORTUNITIES.filter(o => o.posted_by_user_id === companyUserId)), 300));
};

export const getOpportunityById = async (id: number): Promise<Opportunity | undefined> => {
  return new Promise(resolve => setTimeout(() => resolve(MOCK_OPPORTUNITIES.find(o => o.id === id)), 200));
}

// User & Profile Methods
export const getUserProfile = async (userId: number): Promise<UserProfile> => {
  return new Promise(resolve => setTimeout(() => resolve({...currentUserProfile}), 300));
};

export const updateUserProfile = async (profile: Partial<UserProfile>): Promise<UserProfile> => {
  return new Promise(resolve => {
    setTimeout(() => {
      currentUserProfile = { ...currentUserProfile, ...profile };
      resolve({...currentUserProfile});
    }, 500);
  });
};

// Application Methods (Seeker)
export const applyForOpportunity = async (opportunityId: number, userId: number): Promise<Application> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const existing = myApplications.find(a => a.opportunity_id === opportunityId && a.user_id === userId);
      if (existing) {
         resolve(existing);
         return;
      }

      const opportunity = MOCK_OPPORTUNITIES.find(o => o.id === opportunityId);
      if (!opportunity) {
        reject("Opportunity not found");
        return;
      }

      const newApp: Application = {
        id: Math.floor(Math.random() * 10000),
        opportunity_id: opportunityId,
        opportunity: opportunity,
        user_id: userId,
        status: ApplicationStatus.APPLIED,
        applied_at: new Date().toISOString()
      };
      
      myApplications = [newApp, ...myApplications];
      
      // Notify User
      createNotification(userId, "Application Submitted", `You successfully applied for ${opportunity.title} at ${opportunity.organization}.`, 'success');
      
      // Notify Company (if real) - we'll just log it here
      if(opportunity.posted_by_user_id) {
          createNotification(opportunity.posted_by_user_id, "New Applicant", `A user just applied for ${opportunity.title}`, 'info');
      }

      resolve(newApp);
    }, 800);
  });
};

export const getMyApplications = async (userId: number): Promise<Application[]> => {
  return new Promise(resolve => setTimeout(() => resolve(myApplications.filter(a => a.user_id === userId)), 400));
};

// --- NOTIFICATION API ---
export const getMyNotifications = async (userId: number): Promise<Notification[]> => {
    return new Promise(resolve => setTimeout(() => resolve(NOTIFICATIONS.filter(n => n.user_id === userId)), 300));
};

export const markNotificationRead = async (id: number): Promise<void> => {
    return new Promise(resolve => {
        const notif = NOTIFICATIONS.find(n => n.id === id);
        if(notif) notif.is_read = true;
        resolve();
    });
};

// --- ADMIN / COMPANY API ---

export const createOpportunity = async (opp: Omit<Opportunity, 'id'>): Promise<Opportunity> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const newOpp = { ...opp, id: Math.floor(Math.random() * 99999), posted_at: new Date().toISOString() };
            MOCK_OPPORTUNITIES = [newOpp, ...MOCK_OPPORTUNITIES];
            resolve(newOpp);
        }, 500);
    });
};

export const deleteOpportunity = async (id: number): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(() => {
            MOCK_OPPORTUNITIES = MOCK_OPPORTUNITIES.filter(o => o.id !== id);
            resolve();
        }, 500);
    });
};

export const getAllApplications = async (): Promise<Application[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const enriched = myApplications.map(app => {
                const user = USERS.find(u => u.id === app.user_id);
                return { ...app, applicant_name: user ? user.name : 'Unknown User' };
            });
            resolve(enriched);
        }, 400);
    });
};

// New: Get applications specific to a company's postings
export const getCompanyApplications = async (companyUserId: number): Promise<Application[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            // 1. Find opportunities posted by this company
            const myOppIds = MOCK_OPPORTUNITIES.filter(o => o.posted_by_user_id === companyUserId).map(o => o.id);
            
            // 2. Filter applications matching those opps
            const companyApps = myApplications.filter(app => myOppIds.includes(app.opportunity_id));

            // 3. Enrich with user data
            const enriched = companyApps.map(app => {
                const user = USERS.find(u => u.id === app.user_id);
                return { ...app, applicant_name: user ? user.name : 'Unknown User' };
            });
            resolve(enriched);
        }, 400);
    });
};

export const updateApplicationStatus = async (id: number, status: ApplicationStatus): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const app = myApplications.find(a => a.id === id);
            if (app) {
                app.status = status;
                // Send email notification to user
                createNotification(
                    app.user_id, 
                    "Application Status Update", 
                    `The status of your application for ${app.opportunity.title} has been updated to: ${status}.`,
                    status === ApplicationStatus.REJECTED ? 'error' : (status === ApplicationStatus.OFFER ? 'success' : 'info')
                );
            }
            resolve();
        }, 400);
    });
};

export const sendMessageToApplicant = async (appId: number, message: string): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const app = myApplications.find(a => a.id === appId);
            if(app) {
                createNotification(app.user_id, `Message from ${app.opportunity.organization}`, message, 'info');
            }
            resolve();
        }, 300);
    });
};

export const getAdminStats = async () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                totalOpportunities: MOCK_OPPORTUNITIES.length,
                totalApplications: myApplications.length,
                activeUsers: USERS.length
            });
        }, 300);
    })
}
