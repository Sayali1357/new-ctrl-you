import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId, Collection } from "mongodb";

interface Comment {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
}

interface Post {
  _id?: ObjectId;
  username: string;
  message: string;
  likes: number;
  likedBy: string[];
  comments: Comment[];
  userId: string;
  timestamp: Date;
}

// GET all posts
export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("levelup");
    const collection: Collection<Post> = db.collection<Post>("community_posts");

    const posts = await collection
      .find({})
      .sort({ timestamp: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      posts: posts.map(post => ({
        ...post,
        _id: post._id?.toString(),
        // Convert comments dates to strings
        comments: post.comments ? post.comments.map((comment: any) => ({
          ...comment,
          timestamp: comment.timestamp?.toISOString() || new Date().toISOString()
        })) : []
      })),
    });

  } catch (error) {
    console.error("GET Community API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST new post
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, message, userId } = body;

    if (!username || !message || !userId) {
      return NextResponse.json(
        { error: "Missing required fields: username, message, or userId" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("levelup");
    const collection: Collection<Post> = db.collection<Post>("community_posts");

    const newPost = {
      username,
      message,
      likes: 0,
      likedBy: [],
      comments: [],
      userId,
      timestamp: new Date(),
    };

    const result = await collection.insertOne(newPost);
    
    // Fetch the inserted post to return it
    const insertedPost = await collection.findOne({ _id: result.insertedId });

    return NextResponse.json({
      success: true,
      post: {
        ...insertedPost,
        _id: insertedPost?._id.toString(),
        comments: insertedPost?.comments ? insertedPost.comments.map((comment: any) => ({
          ...comment,
          timestamp: comment.timestamp?.toISOString() || new Date().toISOString()
        })) : []
      },
    });

  } catch (error) {
    console.error("POST Community API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH update post (likes/comments)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { postId, action, userId, comment } = body;

    if (!postId || !action) {
      return NextResponse.json(
        { error: "Missing required fields: postId or action" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("levelup");
    const collection: Collection<Post> = db.collection<Post>("community_posts");

    let updateResult;

    if (action === "like") {
      // Check if user already liked the post
      const post = await collection.findOne({ _id: new ObjectId(postId) });
      const hasLiked = post?.likedBy?.includes(userId);

      if (hasLiked) {
        // Unlike the post
        updateResult = await collection.updateOne(
          { _id: new ObjectId(postId) },
          {
            $inc: { likes: -1 },
            $pull: { likedBy: userId }
          }
        );
      } else {
        // Like the post
        updateResult = await collection.updateOne(
          { _id: new ObjectId(postId) },
          {
            $inc: { likes: 1 },
            $push: { likedBy: userId }
          }
        );
      }
    } else if (action === "comment" && comment && userId) {
      // Get user info for the comment - try to get username from user's posts
      let username = "Anonymous";
      try {
        const userPost = await collection.findOne({ userId: userId });
        username = userPost?.username || "Anonymous";
      } catch (error) {
        console.log("Could not fetch username, using default");
      }
      
      const newComment = {
        id: new ObjectId().toString(),
        username: username,
        message: comment,
        timestamp: new Date(),
      };

      // Use $push with the full comment object
      updateResult = await collection.updateOne(
        { _id: new ObjectId(postId) },
        { 
          $push: { 
            comments: newComment
          } 
        }
      );
    } else {
      return NextResponse.json(
        { error: "Invalid action or missing comment/userId" },
        { status: 400 }
      );
    }

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Post not found or no changes made" },
        { status: 404 }
      );
    }

    // Return updated post
    const updatedPost = await collection.findOne({ _id: new ObjectId(postId) });

    return NextResponse.json({
      success: true,
      post: {
        ...updatedPost,
        _id: updatedPost?._id.toString(),
        comments: updatedPost?.comments ? updatedPost.comments.map((comment: any) => ({
          ...comment,
          timestamp: comment.timestamp?.toISOString() || new Date().toISOString()
        })) : []
      },
    });

  } catch (error) {
    console.error("PATCH Community API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE post (optional - for future use)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");
    const userId = searchParams.get("userId");

    if (!postId || !userId) {
      return NextResponse.json(
        { error: "Missing postId or userId" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("levelup");
    const collection = db.collection("community_posts");

    // Only allow users to delete their own posts
    const result = await collection.deleteOne({ 
      _id: new ObjectId(postId), 
      userId: userId 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Post not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Post deleted successfully",
    });

  } catch (error) {
    console.error("DELETE Community API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}