import { NextResponse } from 'next/server';

// Types
interface MindfulnessActivity {
  id: number;
  title: string;
  description: string;
  duration: string;
  type: 'breathing' | 'meditation' | 'movement' | 'visualization';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  steps: string[];
  benefits?: string[];
  tags?: string[];
}

interface MeditationSession {
  id: number;
  userId: string;
  activityId: number;
  startTime: string;
  endTime: string;
  duration: number;
  notes?: string;
}

interface UserProgress {
  userId: string;
  activityId: number;
  completed: boolean;
  duration: number;
  date: string;
  rating?: number;
}

// Mock Database
const mindfulnessActivities: MindfulnessActivity[] = [
  {
    id: 1,
    title: "5-Minute Breathing Exercise",
    description: "Guided breathing exercise with visual cues to calm your mind and reduce stress",
    duration: "5 minutes",
    type: "breathing",
    difficulty: "beginner",
    steps: [
      "Find a comfortable sitting position with your back straight",
      "Close your eyes or soften your gaze",
      "Place your hands on your knees or lap",
      "Inhale slowly through your nose for 4 seconds",
      "Hold your breath for 2 seconds",
      "Exhale slowly through your mouth for 4 seconds",
      "Repeat this cycle for 5 minutes"
    ],
    benefits: ["Reduces stress", "Lowers blood pressure", "Improves focus"],
    tags: ["quick", "beginner", "stress-relief"]
  },
  {
    id: 2,
    title: "Body Scan Meditation",
    description: "Progressive relaxation technique that brings awareness to each part of your body",
    duration: "10 minutes",
    type: "meditation",
    difficulty: "beginner",
    steps: [
      "Lie down comfortably on your back with arms at your sides",
      "Close your eyes and take three deep breaths",
      "Bring your attention to the toes of your left foot",
      "Slowly move your attention up through your left leg",
      "Repeat with your right leg",
      "Continue scanning upward through your torso, arms, and head",
      "Notice any sensations without judgment",
      "Take a final deep breath and slowly open your eyes"
    ],
    benefits: ["Reduces tension", "Improves sleep", "Increases body awareness"],
    tags: ["relaxation", "sleep", "body-awareness"]
  },
  {
    id: 3,
    title: "Mindful Walking",
    description: "Walking meditation that helps you connect with your body and surroundings",
    duration: "15 minutes",
    type: "movement",
    difficulty: "beginner",
    steps: [
      "Find a safe, quiet place to walk",
      "Stand still and take a few deep breaths",
      "Start walking slowly, focusing on the sensation of your feet",
      "Notice the lift, move, and place of each step",
      "Pay attention to your breathing as you walk",
      "Observe your surroundings without judgment",
      "If your mind wanders, gently bring it back to walking"
    ],
    benefits: ["Improves circulation", "Reduces anxiety", "Connects mind and body"],
    tags: ["outdoor", "movement", "grounding"]
  },
  {
    id: 4,
    title: "Loving-Kindness Meditation",
    description: "Cultivate compassion for yourself and others through positive intentions",
    duration: "10 minutes",
    type: "meditation",
    difficulty: "intermediate",
    steps: [
      "Sit comfortably and close your eyes",
      "Take a few deep breaths to center yourself",
      "Repeat these phrases for yourself: 'May I be happy, May I be healthy, May I be safe, May I live with ease'",
      "Think of someone you love and repeat the phrases for them",
      "Think of a neutral person and repeat the phrases",
      "Think of someone you have difficulty with and repeat the phrases",
      "Finally, extend these wishes to all beings everywhere"
    ],
    benefits: ["Increases compassion", "Reduces anger", "Improves relationships"],
    tags: ["compassion", "relationships", "emotional-health"]
  }
];

const meditationSessions: MeditationSession[] = [];
const userProgress: UserProgress[] = [];
let sessionIdCounter = 1;

// GET - Get all mindfulness activities with filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Filter parameters
    const type = searchParams.get('type');
    const difficulty = searchParams.get('difficulty');
    const duration = searchParams.get('duration');
    const tags = searchParams.get('tags');
    
    let filteredActivities = mindfulnessActivities;
    
    // Apply filters
    if (type) {
      filteredActivities = filteredActivities.filter(activity => 
        activity.type === type
      );
    }
    
    if (difficulty) {
      filteredActivities = filteredActivities.filter(activity => 
        activity.difficulty === difficulty
      );
    }
    
    if (duration) {
      filteredActivities = filteredActivities.filter(activity => 
        activity.duration.includes(duration)
      );
    }
    
    if (tags) {
      const tagList = tags.split(',');
      filteredActivities = filteredActivities.filter(activity =>
        tagList.some(tag => activity.tags?.includes(tag))
      );
    }
    
    return NextResponse.json({
      success: true,
      data: filteredActivities,
      total: filteredActivities.length
    });
    
  } catch (error) {
    console.error('Error fetching mindfulness activities:', error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch mindfulness activities" },
      { status: 500 }
    );
  }
}

// POST - Handle various mindfulness operations
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, ...data } = body;
    
    switch (action) {
      case 'create_activity':
        return await createActivity(data);
      
      case 'track_session':
        return await trackSession(data);
      
      case 'update_progress':
        return await updateProgress(data);
      
      case 'get_user_stats':
        return await getUserStats(data.userId);
      
      default:
        return NextResponse.json(
          { success: false, error: "Invalid action specified" },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('Error in POST request:', error);
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}

// PUT - Update mindfulness activity
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    const activityIndex = mindfulnessActivities.findIndex(activity => activity.id === id);
    
    if (activityIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Activity not found" },
        { status: 404 }
      );
    }
    
    mindfulnessActivities[activityIndex] = {
      ...mindfulnessActivities[activityIndex],
      ...updates
    };
    
    return NextResponse.json({
      success: true,
      data: mindfulnessActivities[activityIndex]
    });
    
  } catch (error) {
    console.error('Error updating activity:', error);
    return NextResponse.json(
      { success: false, error: "Failed to update activity" },
      { status: 500 }
    );
  }
}

// Helper Functions
async function createActivity(data: Partial<MindfulnessActivity>) {
  const { title, description, duration, type, difficulty, steps, benefits, tags } = data;
  
  // Validation
  if (!title || !description || !duration || !type || !difficulty || !steps) {
    return NextResponse.json(
      { success: false, error: "Missing required fields" },
      { status: 400 }
    );
  }
  
  const newActivity: MindfulnessActivity = {
    id: mindfulnessActivities.length + 1,
    title,
    description,
    duration,
    type: type as MindfulnessActivity['type'],
    difficulty: difficulty as MindfulnessActivity['difficulty'],
    steps,
    benefits: benefits || [],
    tags: tags || []
  };
  
  mindfulnessActivities.push(newActivity);
  
  return NextResponse.json({
    success: true,
    data: newActivity
  }, { status: 201 });
}

async function trackSession(data: any) {
  const { userId, activityId, startTime, endTime, duration, notes } = data;
  
  if (!userId || !activityId || !duration) {
    return NextResponse.json(
      { success: false, error: "Missing required fields for session tracking" },
      { status: 400 }
    );
  }
  
  const newSession: MeditationSession = {
    id: sessionIdCounter++,
    userId,
    activityId,
    startTime: startTime || new Date().toISOString(),
    endTime: endTime || new Date().toISOString(),
    duration,
    notes
  };
  
  meditationSessions.push(newSession);
  
  // Update user progress
  const existingProgress = userProgress.find(
    progress => progress.userId === userId && progress.activityId === activityId
  );
  
  if (existingProgress) {
    existingProgress.completed = true;
    existingProgress.duration += duration;
    existingProgress.date = new Date().toISOString();
  } else {
    userProgress.push({
      userId,
      activityId,
      completed: true,
      duration,
      date: new Date().toISOString()
    });
  }
  
  return NextResponse.json({
    success: true,
    data: newSession
  }, { status: 201 });
}

async function updateProgress(data: any) {
  const { userId, activityId, completed, duration, rating } = data;
  
  if (!userId || !activityId) {
    return NextResponse.json(
      { success: false, error: "User ID and Activity ID are required" },
      { status: 400 }
    );
  }
  
  const existingProgress = userProgress.find(
    progress => progress.userId === userId && progress.activityId === activityId
  );
  
  if (existingProgress) {
    existingProgress.completed = completed ?? existingProgress.completed;
    existingProgress.duration = duration ?? existingProgress.duration;
    existingProgress.rating = rating ?? existingProgress.rating;
    existingProgress.date = new Date().toISOString();
  } else {
    userProgress.push({
      userId,
      activityId,
      completed: completed || false,
      duration: duration || 0,
      rating,
      date: new Date().toISOString()
    });
  }
  
  return NextResponse.json({
    success: true,
    data: userProgress.find(
      progress => progress.userId === userId && progress.activityId === activityId
    )
  });
}

async function getUserStats(userId: string) {
  if (!userId) {
    return NextResponse.json(
      { success: false, error: "User ID is required" },
      { status: 400 }
    );
  }
  
  const userSessions = meditationSessions.filter(session => session.userId === userId);
  const userProgressData = userProgress.filter(progress => progress.userId === userId);
  
  // Calculate stats
  const totalSessions = userSessions.length;
  const totalMinutes = userSessions.reduce((sum, session) => sum + session.duration, 0) / 60;
  const completedActivities = userProgressData.filter(progress => progress.completed).length;
  const streak = calculateStreak(userSessions);
  
  return NextResponse.json({
    success: true,
    data: {
      stats: {
        totalSessions,
        totalMinutes: Math.round(totalMinutes),
        completedActivities,
        streak
      },
      recentSessions: userSessions.slice(-5), // Last 5 sessions
      progress: userProgressData
    }
  });
}

function calculateStreak(sessions: MeditationSession[]): number {
  if (sessions.length === 0) return 0;
  
  const today = new Date();
  const sortedSessions = sessions
    .map(s => new Date(s.startTime))
    .sort((a, b) => b.getTime() - a.getTime());
  
  let streak = 0;
  const currentDate = new Date(today);
  
  // Check if user meditated today
  const hasMeditatedToday = sortedSessions.some(session => 
    session.toDateString() === today.toDateString()
  );
  
  if (!hasMeditatedToday) return 0;
  
  streak = 1;
  currentDate.setDate(currentDate.getDate() - 1);
  
  // Check consecutive previous days
  for (let i = 1; i < sortedSessions.length; i++) {
    const sessionDate = sortedSessions[i];
    if (sessionDate.toDateString() === currentDate.toDateString()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}