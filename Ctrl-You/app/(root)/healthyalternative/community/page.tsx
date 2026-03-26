// app/(root)/healthyalternative/community/page.tsx (Client-side only version)
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ThumbsUp, MessageSquare, Send } from "lucide-react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import app from "@/firebase/firebase";

interface Comment {
  id: string;
  username: string;
  message: string;
  timestamp: string;
}

interface Post {
  _id: string;
  username: string;
  message: string;
  likes: number;
  likedBy: string[];
  comments: Comment[];
  userId: string;
  timestamp: string;
  showComments?: boolean;
  userLiked?: boolean;
}

// Client-side storage (temporary solution)
const CLIENT_STORAGE_KEY = 'community_posts';

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);


  const auth = getAuth(app);

  // Load posts from localStorage
  const loadPostsFromStorage = () => {
    try {
      const stored = localStorage.getItem(CLIENT_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
    
    // Default posts if none exist
    return [
      {
        _id: "1",
        username: "Alex",
        message: "Completed a 10-min meditation! Feeling refreshed 🌱",
        likes: 3,
        likedBy: [],
        comments: [
          {
            id: "1",
            username: "Community",
            message: "Great job!",
            timestamp: new Date().toISOString()
          }
        ],
        userId: "user1",
        timestamp: new Date().toISOString(),
      },
      {
        _id: "2",
        username: "Priya", 
        message: "Tried digital detox today and loved it! 🍃",
        likes: 5,
        likedBy: [],
        comments: [],
        userId: "user2",
        timestamp: new Date().toISOString(),
      }
    ];
  };

  // Save posts to localStorage
  const savePostsToStorage = (posts: Post[]) => {
    try {
      localStorage.setItem(CLIENT_STORAGE_KEY, JSON.stringify(posts));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  };

  // Listen for user authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        // Load posts when user is authenticated
        const loadedPosts = loadPostsFromStorage();
        const transformedPosts = loadedPosts.map((post: Post) => ({
          ...post,
          showComments: false,
          userLiked: user ? post.likedBy.includes(user.uid) : false,
        }));
        setPosts(transformedPosts);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleAddPost = () => {
    if (!newPost.trim() || !user) return;
    
    const newPostObj: Post = {
      _id: Date.now().toString(),
      username: user.displayName || user.email?.split('@')[0] || "Anonymous",
      message: newPost,
      likes: 0,
      likedBy: [],
      comments: [],
      userId: user.uid,
      timestamp: new Date().toISOString(),
    };

    const updatedPosts = [newPostObj, ...posts];
    setPosts(updatedPosts);
    savePostsToStorage(updatedPosts);
    setNewPost("");
  };

  const handleLike = (postId: string) => {
    if (!user) return;

    const updatedPosts = posts.map(post => {
      if (post._id === postId) {
        const hasLiked = post.likedBy.includes(user.uid);
        return {
          ...post,
          likes: hasLiked ? post.likes - 1 : post.likes + 1,
          likedBy: hasLiked 
            ? post.likedBy.filter(id => id !== user.uid)
            : [...post.likedBy, user.uid],
          userLiked: !hasLiked,
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    savePostsToStorage(updatedPosts);
  };

  const handleAddComment = (postId: string) => {
    const comment = commentInputs[postId];
    if (!comment?.trim() || !user) return;

    const updatedPosts = posts.map(post => {
      if (post._id === postId) {
        const newComment: Comment = {
          id: Date.now().toString(),
          username: user.displayName || user.email?.split('@')[0] || "Anonymous",
          message: comment,
          timestamp: new Date().toISOString(),
        };
        return {
          ...post,
          comments: [...post.comments, newComment],
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    savePostsToStorage(updatedPosts);
    setCommentInputs(prev => ({ ...prev, [postId]: "" }));
  };

  const toggleComments = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post._id === postId 
        ? { ...post, showComments: !post.showComments }
        : post
    ));
  };

  const updateCommentInput = (postId: string, value: string) => {
    setCommentInputs(prev => ({ ...prev, [postId]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#A8E6CF] via-[#D0F0C0] to-[#F0FFF4] flex items-center justify-center">
        <p className="text-xl text-green-800">Loading community...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#A8E6CF] via-[#D0F0C0] to-[#F0FFF4] flex items-center justify-center">
        <p className="text-xl text-red-500">Please sign in to access the community</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#A8E6CF] via-[#D0F0C0] to-[#F0FFF4] text-green-900 flex flex-col items-center p-6">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-extrabold mb-4 text-center text-green-800"
      >
        Community Corner 🌿
      </motion.h1>
      <p className="text-lg text-center mb-6 max-w-xl text-green-700">
        Connect with like-minded people and share tips for a healthy lifestyle!
      </p>

      {/* Client-side notice */}
      <div className="w-full max-w-xl mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded text-sm">
        <strong>Note:</strong> Using client-side storage. Posts will persist in your browser.
      </div>

      {/* Post Input */}
      <div className="w-full max-w-xl flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Share something inspiring..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg text-green-800 border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          onKeyDown={(e) => e.key === "Enter" && handleAddPost()}
        />
        <button
          onClick={handleAddPost}
          disabled={!newPost.trim()}
          className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          Post
        </button>
      </div>

      {/* Posts Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl"
      >
        {posts.map((post) => (
          <motion.div
            key={post._id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white text-green-800 rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg">{post.username}</h3>
              <span className="text-xs text-green-600">
                {new Date(post.timestamp).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700 mb-3">{post.message}</p>

            {/* Like & Comment Buttons */}
            <div className="flex gap-4 mb-3">
              <button
                onClick={() => handleLike(post._id)}
                className={`flex items-center gap-1 ${
                  post.userLiked ? "text-green-600 font-bold" : "text-green-700"
                } hover:text-green-900 transition`}
              >
                <ThumbsUp
                  size={18}
                  fill={post.userLiked ? "green" : "none"}
                  strokeWidth={post.userLiked ? 0 : 2}
                />
                {post.likes}
              </button>
              <button
                onClick={() => toggleComments(post._id)}
                className="flex items-center gap-1 text-green-700 hover:text-green-900"
              >
                <MessageSquare size={18} /> {post.comments.length}
              </button>
            </div>

            {/* Comments Section */}
            {post.showComments && (
              <div className="mt-3 border-t border-green-200 pt-3">
                {post.comments.length > 0 ? (
                  <ul className="space-y-2 mb-3">
                    {post.comments.map((comment) => (
                      <li key={comment.id} className="text-gray-600">
                        <div className="flex justify-between">
                          <span className="font-medium text-green-800">{comment.username}</span>
                          <span className="text-xs text-green-600">
                            {new Date(comment.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm">{comment.message}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm mb-3">No comments yet.</p>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentInputs[post._id] || ""}
                    onChange={(e) => updateCommentInput(post._id, e.target.value)}
                    className="flex-1 px-3 py-1 rounded-md border border-green-300 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddComment(post._id);
                      }
                    }}
                  />
                  <button
                    onClick={() => handleAddComment(post._id)}
                    className="p-1 text-green-600 hover:text-green-800 transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Back Button */}
      <Link href="/healthyalternative">
        <button className="mt-8 px-6 py-3 bg-green-600 text-white font-bold rounded-xl shadow hover:bg-green-700 transition-colors">
          ← Back to Hub
        </button>
      </Link>
    </div>
  );
}